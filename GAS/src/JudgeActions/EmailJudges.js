function EmailJudges() {
  // Constants
  /* int */ const COL_ABSTRACTNUM = 0;
  /* int */ const COL_JUDGEEMAIL = 1;
  /* int */ const COL_JUDGE2EMAIL = 2;
  /* str */ const RANGE_JUDGEASSIGNING_ABSTRACTASSIGNMENTTABLE = "A2:C";

  const Spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Named Ranges (Settings)
  /* str */ const EMAIL_SUBJECT = Spreadsheet.getSheetByName("Judge Assigning").getRange("JudgeAssignmentEmail_Subject").getValue();
  /* str */ const EMAIL_PRELUDE = Spreadsheet.getSheetByName("Judge Assigning").getRange("JudgeAssignmentEmail_OpeningText").getValue();

  // Setup
  /* str[] */ var sourceEmailList = Spreadsheet.getSheetByName("Judge Assigning").getRange(RANGE_JUDGEASSIGNING_ABSTRACTASSIGNMENTTABLE).getValues();

  // Create dictionary of all judge emails
  /* Judge{} */ var processedJudgesList = {};

  for (var i = 0; i < sourceEmailList.length; i++) {
    /* int */ var abstractNumber = sourceEmailList[i][COL_ABSTRACTNUM];
    /* str */ var firstJudge = sourceEmailList[i][COL_JUDGEEMAIL];
    /* str */ var secondJudge = sourceEmailList[i][COL_JUDGE2EMAIL];

    if (abstractNumber == '' | firstJudge == '' | secondJudge == '') continue;

    // Process First Judge
    if (Object.hasOwn(processedJudgesList, firstJudge)) {
      // Judge has already been added, simply append abstract number
      processedJudgesList[firstJudge].add(abstractNumber);
    } else {
      // Gotta add judge as it does not exist
      processedJudgesList[firstJudge] = new Judge(firstJudge, abstractNumber);
    }

    // Process Second Judge
    if (Object.hasOwn(processedJudgesList, secondJudge)) {
      // Judge has already been added, simply append abstract number
      processedJudgesList[secondJudge].add(abstractNumber);
    } else {
      // Gotta add judge as it does not exist
      processedJudgesList[secondJudge] = new Judge(secondJudge, abstractNumber);
    }
  }

  // Craft and Send Emails (Untested)
  for (var j = 0; i < Object.keys(processedJudgesList).length; j++) {
    /* Judge */ var currentJudge = processedJudgesList[Object.keys(processedJudgesList)[j]]
    /* str */ var body = EMAIL_PRELUDE + "<br/>" + currentJudge.toString()
    sendEmail(currentJudge.email, EMAIL_SUBJECT, body);
  }
}

/*
* Lightweight wrapper for GMail email app
* email {str} - Email(s) to send to (comma seperated)
* subject {str} - Subject of email
* body {str} - HTML formatted body of email
*/
function sendEmail(email, subject, body) {
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body,
  });
}

/*
* Judge object for storing judge data
* void add(str number) - adds Abstract number to object
* string toString - returns Judge abstract numbers as string for email
*/
class Judge {
  constructor(judgeEmail, abstractNumber) {
    /* str */ this.email = judgeEmail;
    /* str[] */ this.abstractNumbers = [abstractNumber];
  }

  AbstractNumberText(numbers) {
    return `Assigned Abstract Numbers: ${numbers}`
  }

  add(number) {
    this.abstractNumbers.push(number);
  }

  toString() {
    return this.AbstractNumberText(this.abstractNumbers.join(", "))
  }
}
