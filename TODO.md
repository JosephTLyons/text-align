# TODO:

- Respect indentations on the beginning of a paragraph?
- Use indentations on the beginning of a paragraph as an alternative indicator
  of a new paragraph when skipping the last line in the previous paragraph for
  justification.
- I would like to write the justification algorithm to insert the leftover
  spaces in a binary fashion: insert in the middle, then splitting the
  difference between the middle and either end of the row, and so on, as this
  would be the most visually aesthetic way to deal with them (IMHO)
- Any extra micro-optimizations.  I'm not too familiar with the Atom API or
  JavaScript, so I'm sure there are places where improvements can be made to
  speed up the code.  I absolutely welcome any pull requests that might lead to
  more efficient solutions.
