const alignment = {
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
    JUSTIFY: "justify"
}

module.exports = {
    activate() {
        this.commandsDisposable = atom.commands.add('atom-text-editor:not([mini])', {
            'left-align:toggle'() {
                // console.time("Left Time");
                main(atom.workspace.getActiveTextEditor(), alignment.LEFT);
                // console.timeEnd("Left Time");
            },

            'center-align:toggle'() {
                // console.time("Center Time");
                main(atom.workspace.getActiveTextEditor(), alignment.CENTER);
                // console.timeEnd("Center Time");
            },

            'right-align:toggle'() {
                // console.time("Right Time");
                main(atom.workspace.getActiveTextEditor(), alignment.RIGHT);
                // console.timeEnd("Right Time");
            },

            'justify:toggle'() {
                // console.time("Justify Time");
                main(atom.workspace.getActiveTextEditor(), alignment.JUSTIFY);
                // console.timeEnd("Justify Time");
            },
        })
    },

    deactivate() {
        this.commandsDisposable.dispose()
    }
}

function main(editor, alignmentType) {
    const initialStatePtr = editor.createCheckpoint();
    const selectionRange = editor.getSelectedBufferRange();

    if (adjustSelectedText(editor, selectionRange, alignmentType))
        setSelectionToCoverAllMovedText(editor, selectionRange);

    editor.groupChangesSinceCheckpoint(initialStatePtr);
}

function adjustSelectedText(editor, selectionRange, alignmentType) {
    let textWasAdjusted = false;

    for (let rowNum = selectionRange.start.row; rowNum <= selectionRange.end.row; rowNum++) {
        // Get whitespace-trimmed version of current line's text
        let rowString = editor.lineTextForBufferRow(rowNum).trim();

        if ((0 < rowString.length) && (rowString.length < editor.preferredLineLength)) {
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
                    rowString = getJustifiedRow(editor.preferredLineLength, rowString);
                    break;
            }

            editor.setTextInBufferRange([[rowNum, 0], [rowNum, editor.preferredLineLength]],
                rowString);
        }
    }

    return textWasAdjusted;
}

function getJustifiedRow(preferredLineLength, rowString) {
    // Normalize all spaces between words to one space
    rowString = rowString.replace(/( )+/g, " ");

    let spacesToDivvy = preferredLineLength - rowString.length;
    let locationsToAddSpaces = (rowString.match(/ /g) || []).length;

    let spacesToInsertBetweenWords = parseInt(spacesToDivvy / locationsToAddSpaces);
    let leftoverSpacesToInsert = spacesToDivvy % locationsToAddSpaces;

    // The + 1 accounts for the fact that the string will lose 1 space during split()
    let paddingString = " ".repeat(spacesToInsertBetweenWords + 1);

    // Split string on spaces
    let rowWordsArray = rowString.split(" ");

    for (let i = 0; i < rowWordsArray.length - 1; i++) {
        rowWordsArray[i] += paddingString;

        // Add extra space to strings starting on left side
        if (leftoverSpacesToInsert-- > 0) {
            rowWordsArray[i] += " ";

            // Add extra space to strings starting on right side (subtracting 2 becauase we don't
            // want to add spaces on the right side of the right string in the array)
            if (leftoverSpacesToInsert-- > 0)
                rowWordsArray[rowWordsArray.length - i - 2] += " ";
        }
    }

    return rowWordsArray.join("");
}

function setSelectionToCoverAllMovedText(editor, selectionRange) {
    selectionRange.start.column = 0;
    selectionRange.end.column = editor.preferredLineLength;
    editor.setSelectedBufferRange(selectionRange);
}
