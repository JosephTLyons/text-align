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

## Commands Available:

- `left-align`    
- `center-align`
- `right-align`
- `justify`
- `dejustify`

## Rules:

* If no selection is made, text on the line of the cursor is aligned.  
* If a selection is made, all lines of text containing the selection
  will be aligned.
- Any blank lines will be ignored.
* Any lines exceeding the Preferred Line Length setting will be ignored when
  running any of the following commands:`left-align`, `center-align`,
  `right-align`, or `justify:`.  

## TODO:

- Fix up all bullet points in the CHANGELOG.md
- Fix current bugs
- Give the option to insert one or two spaces between punctuation and the next
  word, when running the dejustify algorithm (?)
- I would like to write the justification algorithm to insert the leftover
  spaces in a binary fashion: insert in the middle, then splitting the
  difference between the middle and either end of the row, and so on.
* Any extra micro-optimizations.  I'm not too familiar with the Atom API or
  JavaScript, so I'm sure there are places where improvements can be made to
  speed up the code.  I absolutely welcome any pull requests that might lead to
  more efficient solutions.

## Bugs:

* Not working with certain elements in code files (like ending brackets and
  braces), however, I cannot imagine anyone using this package to manipulate
  code.  At any rate, I will try to fix this.
    - NOTE: This may be fixed, more testing is required to know for sure.
