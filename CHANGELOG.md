## v0.6.0
- There is now a setting in the package settings that allows a user to decide
  between inserting one or two space characters after punctuation, when running
  the `dejustify` command.  Example:

  ```text
  Sentence one. Sentence two.
  Sentence one.  Sentence two.
  ```
- Fixed a bug that caused any line to grow in length, when the line's length
  exceeded the preferred line length and the `dejustify` command was ran.

## v0.5.2
- Removed an accidental line of code that broke the justification algorithm.
- Added a new rule to the justification algorithm.  In v0.5.1, it was added to
  not justify the last line of a paragraph.  The algorithm knows it is the end
  of a paragraph by checking to see if there is a blank line after itself. This
  works, but for the very last paragraph in a file, there might not be a blank
  line after it to indicate the end of itself.  A rule has been added to address
  this.

## v0.5.1
- When justifying text, normal text editors do not justify the last line of a
  paragraph, as it can look unnatural, especially with shorter lines.  The
  `dejustify` command no longer justifies the last line of a paragraph
    - Note: the end of a paragraph is determined by checking if the line after
      itself is blank.

## v0.5.0
- `dejustify` command added.  For any two words, this command simply replaces
  any amount of spaces between them, with one space, using RegEx.
- Justify is a bit more even in its distribution of leftover spaces to insert.
- As of v0.4.0, since we are now using the text buffer, the alignment algorithms
  seem to be working with code files as well, but this isn't entirely verified.

## v0.4.0
- Massive efficiency improvements.  All alignments run 5x - 8x faster than the
  previous release, this is more obvious on larger files.
    - Line deletions and insertions are no longer based on cursor movements,
      instead, we are dealing with the text buffer.  
    - Many trivial functions have been removed and the code inside of them has
      been moved to the calling functions, to reduce trivially passing items
      around.
    - Much of the custom code in the justify algorithm has been removed and is
      now relying mostly on methods found in the JavaScript standard library.
- The justify algorithm now more evenly inserts spaces, resulting in a more
  symmetric justification.  It will never be quite perfect, as we are dealing in
  fixed-width space characters, but there may be a tiny bit more room for
  improvements in the future.
- Major code cleanup
- Fixed a bug where justification could be incorrect if original text contained
  words that were spaced apart with varying amounts of space characters.

## v0.3.0

- Now supports `justify`.  Text will be spaced out as evenly as possible so that
  the text spans from the left side of the editor to the preferredLineLength.
- Massive refactoring of the code, but this may have come at the cost of
  efficiency.  I absolutely welcome any pull requests that might lead to more
  efficient solutions.

## v0.2.2

- After algorithm runs, selection now covers all of the text moved.  Prior, the
  selection might not cover the moved text, as the selection was being reset
  back to its original place and not the new location, however, this didn't
  cause any bugs, as the algorithm doesn't care if the selection covers the
  whole line or not, it adjusts all text on any line even being touched by the
  selection.  So this is not a bug fix, but more of an aesthetic fix.

## v0.2.1 (Skipped - publishing errors)

## v0.2.0

- `center-align` package converted to `text-align`.  Adds left and right align
  options to center align.

## v0.1.0

- Initial release of `center-align` (no longer available)
