function calculateScores() {

    // Get Input Data
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    const sourceSheet = spreadsheet.getSheetByName("Judge Scores");
    const destinationSheet = spreadsheet.getSheetByName("Student Scores");

    const lastRow = sourceSheet.getLastRow() - 1
    const numCriteria = 8
    const sourceRange = sourceSheet.getRange(2, 3, lastRow, numCriteria);
    const values = sourceRange.getValues();

    // Summing All scores
    let scores = {}
    for (let i = 0; i < values.length; i++) {

        let row = values[i];
        let temp = []
        for (let j = 0; j < row.length; j++) {
            if (j == 1 | j == 4 | j == 7) { // 1, 4, 7 -> weight of 2 
                temp[j - 1] = row[j][0] * (2)
            } else if (j == 2 | j == 5 | j == 6) { // 2, 5, 6 -> weight of 3 
                temp[j - 1] = row[j][0] * (3)

            } else if (j == 3) { // 3, -> weight of 1 
                temp[j - 1] = row[j][0] * (1)
            }
        }

        if (scores[row[0].toString()] != null) {
            scores[row[0].toString()].push(temp)
        } else {
            scores[row[0].toString()] = []
            scores[row[0].toString()].push(temp)
        }

    }

    for (var key in scores) {
        numOfJudges = scores[key].length
        if(numOfJudges == 3){
          Logger.log(key)
        }
        
        for (let i = 0; i < numOfJudges; i++) {
            var sum = scores[key][i].reduce((a, b) => a + b)
            scores[key][i] = sum 
        }
    }


    // Prepare for output
    // [[Abstract#, SCORE1AVG, SCORE2AVG, SCORE3AVG, TOTALAVG]]
    let outputData = []
    for (let i = 0; i < Object.keys(scores).length; i++) {
        var absScore = []

        let key = Object.keys(scores)[i];
        absScore[0] = key

        let row = scores[key];
        var finalScore = 0
        absScore[1] = row[0]

        if (row[2] != null){
          absScore[2] = row[1]
          absScore[3] = row[2]
          absScore[4] = (row[0] + row[1] + row[2]) / 3
        }else if(row[1] != null){
          absScore[2] = row[1]
          absScore[3] = "No Score"
          absScore[4] = (row[0] + row[1]) / 2
        } else {
          absScore[2] = "No Score"
          absScore[3] = "No Score"
          absScore[4] = row[0]
        }
        
        outputData.push(absScore)
    }
    clearScores();

    const startRow = 2;
    const startColumn = 1;

    destinationSheet.getRange(startRow, startColumn, outputData.length, outputData[0].length).setValues(outputData);
}