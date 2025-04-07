function assignJudges() {
    // get all necessary data
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const studentSheet = spreadsheet.getSheetByName("Student Applications Linked");
    const judgeSheet = spreadsheet.getSheetByName("Judge Application");
    const assigningSheet = spreadsheet.getSheetByName("Judge Assigning");

    // get abstract #s and advisors and judges
    const abstractRange = studentSheet.getRange("BA2:BA").getValues().filter(String);
    const advisorRange = studentSheet.getRange("F2:F").getValues().filter(String);
    const judges = judgeSheet.getRange("B2:B").getValues().filter(String);

    //check each abstract to see if its a grad student or not
    const progOfStudy = studentSheet.getRange("K2:K").getValues().filter(String);
    const gradStudent = [];
    for (let i = 0; i < progOfStudy.length; i++) {
        if (progOfStudy[i][0] === "Graduate Student") {
            gradStudent.push(true);

        } else {
            gradStudent.push(false);
        }
    }

    //seperate faculty judges and grad student judges
    const judgeProgOfStudy = judgeSheet.getRange("F2:F").getValues().filter(String);
    const gradJudges = [];
    const facultyJudges = [];
    for (let i = 0; i < judgeProgOfStudy.length; i++) {
        if (judgeProgOfStudy[i][0] === "Yes, I am a graduate student") {
            gradJudges.push(judges[i]);

        } else {
            facultyJudges.push(judges[i]);
        }
    }

    // clear previous assignments
    assigningSheet.getRange("A2:C").clearContent();

    let firstJudge = "";
    let secondJudge = "";

    for (let i = 0; i < abstractRange.length; i++) {

        do {
            if (gradStudent[i]) {
                firstJudge = facultyJudges[Math.floor(Math.random() * facultyJudges.length)];
            } else {
                firstJudge = judges[Math.floor(Math.random() * judges.length)];
            }
        } while (firstJudge === advisorRange[i][0]); //check for judge conflict, pick new judge if true

        do {
            if (gradStudent[i]) {
                secondJudge = facultyJudges[Math.floor(Math.random() * facultyJudges.length)];
            } else {
                secondJudge = judges[Math.floor(Math.random() * judges.length)];
            }
        } while (secondJudge === advisorRange[i][0] || secondJudge == firstJudge); //check for judge conflict, pick new judge if true

        assigningSheet.getRange(i + 2, 1).setValue(abstractRange[i]);
        assigningSheet.getRange(i + 2, 2).setValue(firstJudge);
        assigningSheet.getRange(i + 2, 3).setValue(secondJudge);
    }


}