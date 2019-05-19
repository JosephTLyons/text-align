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
                manipulateText(atom.workspace.getActiveTextEditor(), alignment.LEFT);
            },

            'center-align:toggle'() {
                manipulateText(atom.workspace.getActiveTextEditor(), alignment.CENTER);
            },

            'right-align:toggle'() {
                manipulateText(atom.workspace.getActiveTextEditor(), alignment.RIGHT);
            },

            'justify:toggle'() {
                manipulateText(atom.workspace.getActiveTextEditor(), alignment.JUSTIFY);
            },
        })
    },

    deactivate() {
        this.commandsDisposable.dispose()
    }
}

function manipulateText(editor, alignmentType) {
    const initialStatePtr = editor.createCheckpoint();
    const selectionRange = editor.getSelectedBufferRange();

    adjustSelectedLinesOfText(editor, selectionRange, alignmentType);
    setSelectionToCoverAllMovedText(editor, selectionRange);

    editor.groupChangesSinceCheckpoint(initialStatePtr);
}

function adjustSelectedLinesOfText(editor, selectionRange, alignmentType) {
    let currentRow = selectionRange.start.row;

    for (; currentRow <= selectionRange.end.row; currentRow++) {
        // Get whitespace-trimmed version of current line's text
        let currentRowString = editor.lineTextForBufferRow(currentRow).trim();

        if (lineIsAcceptableToAdjust(editor.preferredLineLength, currentRowString.length)) {
            // Replace current line with new text
            editor.setTextInBufferRange([[currentRow, 0], [currentRow, editor.preferredLineLength]],
                                        getAdjustedLine(editor.preferredLineLength,
                                                        currentRowString,
                                                        alignmentType));
        }
    }
}

function lineIsAcceptableToAdjust(preferredLineLength, currentRowStringLength) {
    return (currentRowStringLength > 0 && (currentRowStringLength < preferredLineLength));
}

function getAdjustedLine(preferredLineLength, currentRowString, alignmentType) {
    switch (alignmentType) {
        case alignment.LEFT:
            return currentRowString;
        case alignment.CENTER:
            return " ".repeat((preferredLineLength - currentRowString.length) / 2) + currentRowString;
        case alignment.RIGHT:
            return " ".repeat(preferredLineLength - currentRowString.length) + currentRowString;
        case alignment.JUSTIFY:
            return getJustifiedRow(preferredLineLength, currentRowString);
    }
}

// https://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
// https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
function getJustifiedRow(preferredLineLength, currentRowString) {
    let spacesToDivvy = preferredLineLength - currentRowString.length;
    let locationsToAddSpaces = (currentRowString.match(/ /g) || []).length;

    let spacesToInsertBetweenWords = parseInt(spacesToDivvy / locationsToAddSpaces);
    let leftoverSpacesToInsert = spacesToDivvy % locationsToAddSpaces;

    // The + 1 accounts for the fact that the string will lose 1 space during regex split()
    let paddingString = " ".repeat(spacesToInsertBetweenWords + 1);
    currentRowString = currentRowString.split(' ').join(paddingString);

    // Insert leftover spaces into string, this is a left-biased insertion and doesn't symmetrically
    // insert these spaces over the line.
    for (let i = 1; (i < currentRowString.length) && (leftoverSpacesToInsert > 0); i++) {
        if (currentRowString[i - 1] == " " && currentRowString[i] != " ") {
            currentRowString = currentRowString.substring(0, i - 1)
                + " "
                + currentRowString.substring(i - 1, currentRowString.length);

            // Increment i to account for new space being added from last statement
            i++;

            leftoverSpacesToInsert--;
        }
    }

    return currentRowString;
}

function setSelectionToCoverAllMovedText(editor, selectionRange) {
    selectionRange.start.column = 0;
    selectionRange.end.column = editor.preferredLineLength;
    editor.setSelectedBufferRange(selectionRange);
}
