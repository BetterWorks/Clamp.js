/*!
 * Clamp.js 0.6.2-bw
 *
 * Copyright 2011-2013, Joseph Schmitt http://joe.sh
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 */

(function(){
    /**
     * Clamps a text node.
     * @param {HTMLElement} element. Element containing the text node to clamp.
     * @param {Object} options. Options to pass to the clamper.
     */
    function clamp(element, options) {
        options = options || {};

        var self = this,
            win = window,
            opt = {
                clamp:              options.clamp || 2,
                useNativeClamp:     typeof(options.useNativeClamp) != 'undefined' ? options.useNativeClamp : true,
                truncationChar:     options.truncationChar || '…',
                removeTrailingChars: options.removeTrailingChars || ',.;:!?-'
            },

            sty = element.style,
            originalText = element.innerHTML,

            supportsNativeClamp = typeof(element.style.webkitLineClamp) != 'undefined',
            clampValue = opt.clamp,
            isCSSValue = clampValue.indexOf && (clampValue.indexOf('px') > -1 || clampValue.indexOf('em') > -1);

// UTILITY FUNCTIONS __________________________________________________________

        /**
         * Return the current style for an element.
         * @param {HTMLElement} elem The element to compute.
         * @param {string} prop The style property.
         * @returns {number}
         */
        function computeStyle(elem, prop) {
            var getComputedStyle;
            if (win.getComputedStyle) {
                getComputedStyle = win.getComputedStyle;
            } else {
                getComputedStyle = function (el, pseudo) {
                    this.el = el;
                    this.getPropertyValue = function (prop) {
                        var re = /(\-([a-z]){1})/g;
                        if (prop == 'float') prop = 'styleFloat';
                        if (re.test(prop)) {
                            prop = prop.replace(re, function () {
                                return arguments[2].toUpperCase();
                            });
                        }
                        return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
                    };
                    return this;
                };
            }

            return getComputedStyle(elem, null).getPropertyValue(prop);
        }

        /**
         * Returns the maximum number of lines of text that should be rendered based
         * on the current height of the element and the line-height of the text.
         */
        function getMaxLines(height) {
            var availHeight = height || getElemHeight(element),
                lineHeight = getLineHeight(element);

            return Math.max(Math.floor(availHeight/lineHeight), 0);
        }

        /**
         * Returns the maximum height a given element should have based on the line-
         * height of the text and the given clamp value.
         */
        function getMaxHeight(clmp) {
            var lineHeight = getLineHeight(element);
            return lineHeight * clmp;
        }

        /**
         * Returns the line-height of an element as an integer.
         */
        function getLineHeight(elem) {
            var lh = computeStyle(elem, 'line-height');
            if (lh == 'normal') {
                // Normal line heights vary from browser to browser. The spec recommends
                // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
                lh = parseInt(computeStyle(elem, 'font-size'), 10) * 1.2;
            }
            return parseInt(lh, 10);
        }

        /**
         * Returns the height of an element as an integer (max of scroll/offset/client).
         * Note: inline elements return 0 for scrollHeight and clientHeight
         */
        function getElemHeight(elem) {
            return Math.max(elem.scrollHeight, elem.offsetHeight, elem.clientHeight);
        }

        /**
         * Gets an element's last text node. This will remove empty elements from the end.
         */
        function getLastTextNode(elem) {
            // if we have children, search inside the last one
            if (elem.lastChild) {
                return getLastTextNode(elem.lastChild);
            }

            //we don't have children, and this is the root => we can't find anything here
            if (elem == element) {
                return null;
            }

            // we don't have children, but this is not a text node, or it is empty => remove it and try again
            if (elem.nodeType !== 3 || !elem.nodeValue.trim() || elem.nodeValue == opt.truncationChar) {
                var parent = elem.parentNode;
                parent.removeChild(elem);
                return getLastTextNode(parent);
            }

            //we found a child of type text with actual content
            return elem;
        }



// MEAT AND POTATOES (MMMM, POTATOES...) ______________________________________


        /**
         * Does a binary search over the words in the elements text until it finds the last one that fits in the maximum height
         */
        function truncate(target, maxHeight) {
            if (!target || !maxHeight) {return;}

            var original = target.nodeValue.replace(opt.truncationChar, '');

            var words = original.split(' ');

            var start=0, end = words.length-1, mid=-1, m;

            while (start <= end && end > 0) {
                m = Math.floor((start+end)/2);
                if (m == mid) {
                    break;
                }
                mid= m;

                applyEllipsis(target, words.slice(0, mid+1).join(' '));

                height = getElemHeight(element);


                if (height <= maxHeight) {
                    start = mid;
                } else {
                    end = mid;
                }
            }

            if (height > maxHeight) {
                target.parentNode.removeChild(target);
                truncate(getLastTextNode(element), maxHeight);
            }
        }

        function applyEllipsis(elem, str) {
            while (str.length && opt.removeTrailingChars.indexOf(str[str.length-1]) != -1) {
                str = str.substring(0, str.length -1);
            }

            elem.nodeValue = str + opt.truncationChar;
        }


// CONSTRUCTOR ________________________________________________________________

        if (clampValue == 'auto') {
            clampValue = getMaxLines();
        }
        else if (isCSSValue) {
            clampValue = getMaxLines(parseInt(clampValue, 10));
        }

        var clampedText;
        if (supportsNativeClamp && opt.useNativeClamp) {
            sty.overflow = 'hidden';
            sty.textOverflow = 'ellipsis';
            sty.webkitBoxOrient = 'vertical';
            sty.display = '-webkit-box';
            sty.webkitLineClamp = clampValue;

            if (isCSSValue) {
                sty.height = opt.clamp + 'px';
            }
        }
        else {
            var height = getMaxHeight(clampValue);
            if (height < getElemHeight(element)) {
                truncate(getLastTextNode(element), height);
                clampedText = element.innerHTML;
            }
        }

        return {
            'original': originalText,
            'clamped': clampedText
        };
    }

    window.$clamp = clamp;
})();
