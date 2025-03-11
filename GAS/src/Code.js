function onOpen() {
  var ui = SpreadsheetApp.getUi()
  ui.createMenu('Symposium Actions')
    .addSubMenu(
      ui.createMenu('Judge Actions')
      .addItem('Email Judges', 'EmailJudges')
      .addItem('Assign Judges', 'assignJudges')
    )
    .addSubMenu(
      ui.createMenu('Scoring')
        .addItem('Calculate Scores', 'calculateScores')
        .addItem('Clear Scores', 'clearScores')
    )
    .addSubMenu(
      ui.createMenu('Exports')
        .addItem('Generate Book of Abstracts', 'createAbstractDoc')
        .addItem('Generate Results Page', 'resultsPage')
    )
    .addToUi();
}

// Abstract number generation (Autorun)
function searchColumnForAbstractNumber(category_num) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var columnToSearch = 52;
  var data = sheet.getRange(1, columnToSearch + 1, sheet.getLastRow(), 1).getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === category_num) {
      console.log("Value found in row: " + (i + 1));
      category_num += 1;
    }
  }
  return category_num
}

function assignAbstractNumber() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const sourceSheet = spreadsheet.getSheetByName("Student Applications Linked");
  const data = sourceSheet.getDataRange().getValues();
  let numRows = data.length;
  const headers = data[0]

  for (let i = 0; i < numRows; i++) {
    let columnBAindex = headers.indexOf('Abstract Numbers');
    let columnBA = sourceSheet.getRange(i + 1, columnBAindex + 1);
    let undergradOrGradindex = headers.indexOf("Are you entering this abstract for Graduate Exposition or Undergraduate Showcase?");
    let undergradOrGrad = data[i][undergradOrGradindex];
    let category = "";
    let category_num = 0;
    let new_category_num = 0;
    // If the value in column BA is blank
    if (columnBA.getValue() === "" || columnBA.getValue() == null) {
      if (undergradOrGrad === "Graduate Exposition") { // leaving category assignment as data[i][x] because the headers are long.
        category = data[i][17]; // column R, which is the category selection for grad students
      } else if (undergradOrGrad === "Undergraduate Showcase") {
        category = data[i][20]; // column U, which is the category selection for undergrads
      };
      console.log(category)
      category_num = startingIndexes[category];
      console.log("The category number without entries is ", category_num);
      new_category_num = searchColumnForAbstractNumber(category_num);
      columnBA.setValue(new_category_num);
      console.log("The new entry's abstract number is: ", new_category_num);
    }
  }
}

assignAbstractNumber();
