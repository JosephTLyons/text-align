const alignment = {
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
    JUSTIFY: "justify",
    DEJUSTIFY: "dejustify"
}

module.exports = {
    activate() {
        this.commandsDisposable = atom.commands.add('atom-text-editor:not([mini])', {
            'left-align:toggle'() {
                // console.time("Left Time");
                main(alignment.LEFT);
                // console.timeEnd("Left Time");
            },

            'center-align:toggle'() {
                // console.time("Center Time");
                main(alignment.CENTER);
                // console.timeEnd("Center Time");
            },

            'right-align:toggle'() {
                // console.time("Right Time");
                main(alignment.RIGHT);
                // console.timeEnd("Right Time");
            },

            'justify:toggle'() {
                // console.time("Justify Time");
                main(alignment.JUSTIFY);
                // console.timeEnd("Justify Time");
            },

            'dejustify:toggle'() {
                // console.time("Dejustify Time");
                main(alignment.DEJUSTIFY);
                // console.timeEnd("Dejustify Time");
            },
        })
    },

    deactivate() {
        this.commandsDisposable.dispose()
    }
}

function main(alignmentType) {
    const editor = atom.workspace.getActiveTextEditor();
    const initialStatePtr = editor.createCheckpoint();
    const selectionRange = editor.getSelectedBufferRange();

    if (adjustSelectedText(editor, selectionRange, alignmentType))
        setSelectionToCoverAllMovedText(editor, selectionRange);

    editor.groupChangesSinceCheckpoint(initialStatePtr);
}

function adjustSelectedText(editor, selectionRange, alignmentType) {
    let textWasAdjusted = false;

    for (let rowNum = selectionRange.start.row; rowNum <= selectionRange.end.row; rowNum++) {
        let rowString = editor.lineTextForBufferRow(rowNum).trim();

        if (0 < rowString.length) {
            if ((rowString.length < editor.preferredLineLength)
                || (alignmentType == alignment.DEJUSTIFY)) {
                textWasAdjusted = true;

                switch (alignmentType) {
                    case alignment.LEFT:
                        break;
                    case alignment.CENTER:
                        rowString = " ".repeat((editor.preferredLineLength - rowString.length) / 2)
                            + rowString;
                        break;
                    case alignment.RIGHT:
                        rowString = " ".repeat(editor.preferredLineLength - rowString.length)
                            + rowString;
                        break;
                    case alignment.JUSTIFY:
                        // Bug: This doesn't consider a new paragraph without a space between it and
                        // the previous one
                        if (! editor.getBuffer().isRowBlank(rowNum + 1) )
                            rowString = getJustifiedRow(editor.preferredLineLength, rowString);
                        if (editor.getBuffer().ro)
                        break;
                    case alignment.DEJUSTIFY:
                        rowString = rowString.replace(/ +/g, " ");
                        break;
                }

                editor.setTextInBufferRange([[rowNum, 0], [rowNum, editor.preferredLineLength]],
                    rowString);
            }
        }
    }

    return textWasAdjusted;
}

function getJustifiedRow(preferredLineLength, rowString) {
    // Normalize all spaces between words to one space
    rowString = rowString.replace(/ +/g, " ");

    let spacesToDivvy = preferredLineLength - rowString.length;
    let numOfLocationsToAddSpaces = (rowString.match(/ /g) || []).length;

    // The +1 occurs to compensate for the loss of a space per word during the split() method below
    let spacesBetweenWords = " ".repeat(parseInt(spacesToDivvy / numOfLocationsToAddSpaces) + 1);

    let rowWordsArray = rowString.split(" ");

    for (let i = 0; i < rowWordsArray.length - 1; i++)
        rowWordsArray[i] += spacesBetweenWords;

    let leftoverSpacesToDistribute = spacesToDivvy % numOfLocationsToAddSpaces;

    if (leftoverSpacesToDistribute <= 0)
        return rowWordsArray.join("");

    let interval = parseInt(numOfLocationsToAddSpaces / leftoverSpacesToDistribute);

    for (let i = 0; leftoverSpacesToDistribute > 0 && i < rowWordsArray.length - 1; i++) {
        // Add extra space to strings starting on left side
        if (leftoverSpacesToDistribute-- > 0) {
            rowWordsArray[i * interval] += " ";

            // Add extra space to strings starting on right side (subtracting 2 becauase we don't
            // want to add spaces on the right side of the right string in the array)
            if (leftoverSpacesToDistribute-- > 0)
                rowWordsArray[rowWordsArray.length - (i * interval) - 2] += " ";
        }
    }

    return rowWordsArray.join("");
}

function setSelectionToCoverAllMovedText(editor, selectionRange) {
    selectionRange.start.column = 0;
    selectionRange.end.column = editor.preferredLineLength;
    editor.setSelectedBufferRange(selectionRange);
}
