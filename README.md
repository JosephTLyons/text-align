# Text Align

[![apm install text-align](https://apm-badges.herokuapp.com/apm/text-align.svg)](https://atom.io/packages/text-align)

An [Atom](https://atom.io) text editor package that supports left aligning,
centering, right aligning, and justification of text between the left side of
the editor and the Preferred Line Length setting.

## `text-align` in Action:

![Action](./misc/text-align.gif)

## Intended Use:

* This package aims to be useful when aligning items in documentation or
  any other text files, but you may find other uses for it.

## Rules

* If no selection is made, text on the line of the cursor is aligned.  
* If a selection is made, all lines of text containing the selection
  will be aligned.
* Any line exceeding the Preferred Line Length setting will be ignored as well
  as blank lines.

## TODO:

- Improvements have been made to the justification algorithm to make it
  distribute spaces more evenly, but I would like to make it even visually
  symmetric.  Currently, we insert spaces as equally as possible, but there are
  cases where there are leftover spaces.  Its these cases that may need a little
  work.  Currently, we are just adding them to the left and right side, working
  our way in, but it would be better to start off in the center, then add them
  to the left and right sides, radiating outward.  That is the goal for the next
  release.
* Add a de-justify command (possibly).  Currently, left/center/right aligning
  is easy to fix, since spacing is only added around the text and the user can
  simply just toggle another alignment command.  However, justify can't be fixed
  without using undo, which means that it will be stuck that way if undoing
  isn't possible or if the undo is too far back in the undo history.  This means
  it might make sense to add a de-justify algorithm, although I'll need to think
  about this for a bit.
* Any extra micro-optimizations.  I'm not too familiar with the Atom API or
  JavaScript, so I'm sure there are places where improvements can be made to
  speed up the code.  I absolutely welcome any pull requests that might lead to
  more efficient solutions.
- Don't select text if it wasn't adjusted (too long or 0 length)

## Bugs:

* Not working with certain elements in code files (like ending brackets and
  braces), however, I cannot imagine anyone using this package to manipulate
  code.  At any rate, I will try to fix this.
