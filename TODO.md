# TODO:

- Update Atom Poem gif with most recent version
- Give option to justify last line in a paragraph or not
- Give the option to insert one or two spaces between punctuation and the next
  word, when running the dejustify algorithm (?)
- I would like to write the justification algorithm to insert the leftover
  spaces in a binary fashion: insert in the middle, then splitting the
  difference between the middle and either end of the row, and so on, as this
  would be the most visually aesthetic way to deal with them (IMHO)
- Any extra micro-optimizations.  I'm not too familiar with the Atom API or
  JavaScript, so I'm sure there are places where improvements can be made to
  speed up the code.  I absolutely welcome any pull requests that might lead to
  more efficient solutions.
