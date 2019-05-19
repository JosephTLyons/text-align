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

    adjustSelectedLinesOfText(editor, selectionRange, alignmentType);
    setSelectionToCoverAllMovedText(editor, selectionRange);

    editor.groupChangesSinceCheckpoint(initialStatePtr);
}

function adjustSelectedLinesOfText(editor, selectionRange, alignmentType) {
    for (let rowNum = selectionRange.start.row; rowNum <= selectionRange.end.row; rowNum++) {
        // Get whitespace-trimmed version of current line's text
        let rowString = editor.lineTextForBufferRow(rowNum).trim();

        if ((0 < rowString.length) && (rowString.length < editor.preferredLineLength)) {
            switch (alignmentType) {
                case alignment.LEFT:
                    break;
                case alignment.CENTER:
                    rowString = " ".repeat((editor.preferredLineLength - rowString.length) / 2) + rowString;
                    break;
                case alignment.RIGHT:
                    rowString = " ".repeat(editor.preferredLineLength - rowString.length) + rowString;
                    break;
                case alignment.JUSTIFY:
                    rowString = getJustifiedRow(editor.preferredLineLength, rowString);
                    break;
            }

            editor.setTextInBufferRange([[rowNum, 0], [rowNum, editor.preferredLineLength]],
                                        rowString);
        }
    }
}

// https://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
// https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
function getJustifiedRow(preferredLineLength, rowString) {
    let spacesToDivvy = preferredLineLength - rowString.length;
    let locationsToAddSpaces = (rowString.match(/ /g) || []).length;

    let spacesToInsertBetweenWords = parseInt(spacesToDivvy / locationsToAddSpaces);
    let leftoverSpacesToInsert = spacesToDivvy % locationsToAddSpaces;

    // The + 1 accounts for the fact that the string will lose 1 space during regex split()
    let paddingString = " ".repeat(spacesToInsertBetweenWords + 1);
    rowString = rowString.split(' ').join(paddingString);

    // Insert leftover spaces into string, this is a left-biased insertion and doesn't symmetrically
    // insert these spaces over the line.
    for (let i = 1; (i < rowString.length) && (leftoverSpacesToInsert > 0); i++) {
        if (rowString[i - 1] == " " && rowString[i] != " ") {
            rowString = rowString.substring(0, i - 1)
                + " "
                + rowString.substring(i - 1, rowString.length);

            // Increment i to account for new space being added from last statement
            i++;

            leftoverSpacesToInsert--;
        }
    }

    return rowString;
}

function setSelectionToCoverAllMovedText(editor, selectionRange) {
    selectionRange.start.column = 0;
    selectionRange.end.column = editor.preferredLineLength;
    editor.setSelectedBufferRange(selectionRange);
}
