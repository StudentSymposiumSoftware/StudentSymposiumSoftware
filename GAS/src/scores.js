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
  for (let i = 0; i < values.length; i++){

    let row = values[i];
    let temp = []
    for (let j = 0; j < row.length; j++){
      if (j == 1 | j == 4 | j == 7 ){ // 1, 4, 7 -> weight of 2 
        temp[j-1] = row[j][0] * (2)
      } else if (j == 2 | j == 5  | j == 6) { // 2, 5, 6 -> weight of 3 
        temp[j-1] = row[j][0] * (3)

      } else if (j == 3) { // 3, -> weight of 1 
        temp[j-1] = row[j][0] * (1)
      }
    }

    if (scores[row[0].toString()] != null){
      scores[row[0].toString()].push(temp)
    } else {
      scores[row[0].toString()] = []
      scores[row[0].toString()].push(temp)
      // Logger.log(scores[row[0].toString()])
    }

  }
  Logger.log(scores)

  for (var key in scores){
    for(let i = 0; i < 2; i++){
      var sum = scores[key][i].reduce((a,b) => a + b)
      scores[key][i] = sum/16 
    }
  }


  // Prepare for output
  // [[KEYS, SCORE1AVG, SCORE2AVG]]
  let outputData = []
  for (let i = 0; i < Object.keys(scores).length; i++){
    var absScore = []

    let key = Object.keys(scores)[i];
    absScore[0] = key
    
    let row = scores[key];
    absScore[1] = row[0]
    absScore[2] = row[1] 

    var finalScore = (row[0] + row[1])/2
    absScore[3] = finalScore
    outputData.push(absScore)
  }
  clearScores();

  const startRow = 2; 
  const startColumn = 1; 
  
  destinationSheet.getRange(startRow, startColumn, outputData.length, outputData[0].length).setValues(outputData);
}


function clearScores() { 
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  const destinationSheet = spreadsheet.getSheetByName("Student Scores"); 
  
  const lastRow = destinationSheet.getLastRow();
  
  if (lastRow > 1) {
    destinationSheet.getRange("2:" + lastRow).clearContent(); 
  }

}