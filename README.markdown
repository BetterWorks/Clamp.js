Clamps (ie. cuts off) an HTML element's content by adding ellipsis to it if the 
content inside is too long.


# Sample Usage

<pre>
//Single line
$clamp(myHeader, {clamp: 1});

//Multi-line
$clamp(myHeader, {clamp: 3});

//Auto-clamp based on available height
$clamp(myParagraph, {clamp: 'auto'});

//Auto-clamp based on a fixed element height
$clamp(myParagraph, {clamp: '35px'});
</pre>

The $clamp method is the primary way of interacting with Clamp.js, and it takes two
arguments. The first is the element which should be clamped, and the second is an
Object with options in JSON notation.

The algorithms splits the text into words (separated by spaces), and searches using binary search for the best split index. All words after this are removed and replaced with a truncationChar. For the last word, the characters set in removeTrainingChars will be trimmed from the end.


# Options

**clamp** _(Number | String | 'auto')_. This controls where and when to clamp the 
text of an element. Submitting a number controls the number of lines that should
be displayed. Second, you can submit a CSS value (in px or em) that controls the
height of the element as a String. Finally, you can submit the word 'auto' as a string.
Auto will try to fill up the available space with the content and then automatically
clamp once content no longer fits. This last option should only be set if a static 
height is being set on the element elsewhere (such as through CSS) otherwise no 
clamping will be done.

**useNativeClamp** _(Boolean)_. Enables or disables using the native -webkit-line-clamp
in a supported browser (ie. Webkit). It defaults to true if you're using Webkit,
but it can behave wonky sometimes so you can set it to false to use the JavaScript-
based solution.

**truncationChar** _(String)_. The character to insert at the end of the HTML element
after truncation is performed. This defaults to an ellipsis (…).

**removeTrailingChars** _(String)_. The characters that will get removed from the last word. This defaults to ',.;:!?-'



#Deprecated Options


**truncationHTML** _(String)_.

**splitOnChars** _(Array)_. 

**animate** _(Boolean)_. 
