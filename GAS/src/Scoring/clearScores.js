function clearScores() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    const destinationSheet = spreadsheet.getSheetByName("Student Scores");

    const lastRow = destinationSheet.getLastRow();

    if (lastRow > 1) {
        destinationSheet.getRange("2:" + lastRow).clearContent();
    }

}
