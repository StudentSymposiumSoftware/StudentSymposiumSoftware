function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Custom Menu')
      .addItem('Show sidebar', 'showSidebar')
      .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Student Symposium Software')
      .setWidth(1000);
  SpreadsheetApp.getUi().showSidebar(html);
}

function calculateScores() {

  // Get Input Data
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  const sourceSheet = spreadsheet.getSheetByName("Judge Scores"); 
  const destinationSheet = spreadsheet.getSheetByName("Student Scores"); 
  
  const sourceRange = sourceSheet.getRange("C2:J201");
  
  const values = sourceRange.getValues();

  // Summing All scores
  let scores = {}
  for (let i = 0; i < values.length; i++){
    let row = values[i];
    if (Object.keys(scores).includes(row[0].toString())){
      for (let j = 0; j < row.length - 1; j++){
        scores[row[0].toString()][j] += row[1 + j]
      }
    }else{
      scores[row[0]] = row.slice(1)
    }
  }

  
  // Prepare for output
  let outputData = []
  for (let i = 0; i < Object.keys(scores).length; i++){
    let key = Object.keys(scores)[i];
    let row = [key].concat(scores[key]);

    let totalScore = scores[key].reduce((a, b) => a + b, 0);
    row.push(totalScore);  

    outputData.push(row);
  }
  
  outputData.sort((a, b) => b[b.length - 1] - a[a.length - 1]);
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

function emailJudges(){

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  const sourceSheet = spreadsheet.getSheetByName("Judge Assigning"); 
  const sourceRange = sourceSheet.getRange("B3:C10");
  
  const values = sourceRange.getValues();

  for (let i = 0; i < values.length; i++){
    if (values[i][0] == "") continue;
    let subject = "Student Sympsoium: Abstract Assignment"
    let message = `<p>You have been assigned to judging abstract <b>#${values[i][0]}</b></p>`;
    sendEmail(values[i][1], subject, message)
  }
}

function sendEmail(email, subject, body){
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body,
  });
}