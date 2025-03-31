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
    .addSubMenu(
      ui.createMenu('Testing')
        .addItem('Test Email', 'sendTestEmail')
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
      category_num += 1;
    }
  }
  return category_num
}

function assignAbstractNumber() {

  let startingIndexes = {};
  startingIndexes["Physical and Mathematical Sciences"] = 101;
  startingIndexes["Business"] = 201;
  startingIndexes["Education"] = 301;
  startingIndexes["Allied Health"] = 401;
  startingIndexes["Engineering and Information Sciences (including Biomedical Engineering)"] = 501;
  startingIndexes["Arts"] = 601;
  startingIndexes["Social Sciences and Humanities"] = 701;
  startingIndexes["Natural Sciences"] = 801;
  startingIndexes["Interdisciplinary Research (research across 3 or more different departments or colleges)"] = 901;
  startingIndexes["Biomedical Sciences"] = 1001;

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
      if (undergradOrGrad === "Graduate Exposition") { 
        category = data[i][headers.indexOf("Graduate Presentations: Please select one of the following categories that best fit your research. *For more information about being a presenter at the Symposium and for a helpful guide on the below categories, visit: https://umaine.edu/umss/list-of-majors-categories/")]; //category selection for grad students
      } else if (undergradOrGrad === "Undergraduate Showcase") {
        category = data[i][headers.indexOf("Undergraduate Presentations: Please select one of the following categories that best fits your research. *For more information about being a presenter at the Symposium, and for a helpful guide on the categories below, visit: https://umaine.edu/umss/list-of-majors-categories/")]; //category selection for undergrads
      };
      category_num = startingIndexes[category];
      new_category_num = searchColumnForAbstractNumber(category_num);
      columnBA.setValue(new_category_num);
    }
  }
}

assignAbstractNumber();