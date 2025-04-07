function resultsPage() {

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const scoresSheet = spreadsheet.getSheetByName("Judge Scores");
    const applicationsSheet = spreadsheet.getSheetByName("Student Applications Linked");

    const scoresData = scoresSheet.getDataRange().getValues();
    const scoresHeaders = scoresData[0];
    let numRowsInScores = scoresData.length;

    const applicationsData = applicationsSheet.getDataRange().getValues();
    const applicationsHeaders = applicationsData[0];
    let numRowsInApplications = applicationsData.length;

    let undergradOrGradIndex = applicationsHeaders.indexOf("Are you entering this abstract for Graduate Exposition or Undergraduate Showcase?");
    let abstractNumberIndex = applicationsHeaders.indexOf("Abstract Numbers");
    let studentFirstNameIndex = applicationsHeaders.indexOf('Student First Name');
    let studentLastNameIndex = applicationsHeaders.indexOf('Student Last Name');
    let graduateCategoryIndex = applicationsHeaders.indexOf("Graduate Presentations: Please select one of the following categories that best fit your research. *For more information about being a presenter at the Symposium and for a helpful guide on the below categories, visit: https://umaine.edu/umss/list-of-majors-categories/");
    let undergraduateCategoryIndex = applicationsHeaders.indexOf("Undergraduate Presentations: Please select one of the following categories that best fits your research. *For more information about being a presenter at the Symposium, and for a helpful guide on the categories below, visit: https://umaine.edu/umss/list-of-majors-categories/");
    let projectTitleIndex = applicationsHeaders.indexOf("Project Title");
    let firstCoAuthorIndex = applicationsHeaders.indexOf("1st Co-author's Full Name");
    let secondCoAuthorIndex = applicationsHeaders.indexOf("2nd Co-author's Full Name");
    let thirdCoAuthorIndex = applicationsHeaders.indexOf("3rd Co-author's Full Name");
    let fourthCoAuthorIndex = applicationsHeaders.indexOf("4th Co-author's Full Name");
    let fifthCoAuthorIndex = applicationsHeaders.indexOf("5th Co-author's Full Name");
    let extraCoAuthorIndex = applicationsHeaders.indexOf("If you have more than 5 co-authors, please list their names and emails below, and whether they are an undergraduate student, graduate student, faculty, or external author. Please see the example.");
    // For extra co-authors, it ends up adding their email and class as well, but I figured the user can just erase extra informaton as needed

    let classAndAbstractMap = {};  

    for (let i = 1; i < numRowsInApplications; i++) {
        classAndAbstractMap[applicationsData[i][abstractNumberIndex]] = applicationsData[i][undergradOrGradIndex];
    };

    let nameAndAbstractMap = {};

    for (let i = 1; i < numRowsInApplications; i++) {
        let studentFirstName = applicationsData[i][studentFirstNameIndex];
        let studentLastName = applicationsData[i][studentLastNameIndex];
        let firstAndLast = studentFirstName.concat(" ", studentLastName);
        nameAndAbstractMap[applicationsData[i][abstractNumberIndex]] = firstAndLast;
    }

    let categoryAndAbstractMap = {}; 
    for (let i = 1; i < numRowsInApplications; i++) {
        if (applicationsData[i][undergraduateCategoryIndex] == "" || applicationsData[i][undergraduateCategoryIndex] == null) {
            categoryAndAbstractMap[applicationsData[i][abstractNumberIndex]] = applicationsData[i][graduateCategoryIndex];
        }
        else {
            categoryAndAbstractMap[applicationsData[i][abstractNumberIndex]] = applicationsData[i][undergraduateCategoryIndex];
        }
    }

    let titleAndAbstractMap = {};
    for (let i = 1; i < numRowsInApplications; i++) {
        titleAndAbstractMap[applicationsData[i][abstractNumberIndex]] = applicationsData[i][projectTitleIndex];
    };

    let authorsAndAbstractMap = {};
    for (let i = 1; i< numRowsInApplications; i++){
        let authors = [applicationsData[i][firstCoAuthorIndex], applicationsData[i][secondCoAuthorIndex], applicationsData[i][thirdCoAuthorIndex], applicationsData[i][fourthCoAuthorIndex], applicationsData[i][fifthCoAuthorIndex], applicationsData[i][extraCoAuthorIndex]];

        authorsAndAbstractMap[applicationsData[i][abstractNumberIndex]] = authors;
    }

    let resultsObj = {
        'Undergraduate Showcase': {},
        'Graduate Exposition': {}
    };

    let overallScoreIndex = scoresHeaders.indexOf("Overall Rating");
    let abstractNumberIndexScores = scoresHeaders.indexOf("Abstract Number");
    let topicAndPurposeIndex = scoresHeaders.indexOf("Topic & Purpose");
    let methodIndex = scoresHeaders.indexOf("Method");
    let resultsIndex = scoresHeaders.indexOf("Results");
    let conclusionsIndex = scoresHeaders.indexOf("Conclusions");
    let presentationIndex = scoresHeaders.indexOf("Presentation");
    let depthOfKnowledgeIndex = scoresHeaders.indexOf("Depth of Knowledge");


    for (let i = 1; i < numRowsInScores; i++) { 
        let abstractNumber = scoresData[i][abstractNumberIndexScores]; 

        let topicAndPurpose = Number(scoresData[i][topicAndPurposeIndex].match(/\d/g).join(""));
        let method = Number(scoresData[i][methodIndex].match(/\d/g).join(""));
        let results = Number(scoresData[i][resultsIndex].match(/\d/g).join(""));
        let conclusions = Number(scoresData[i][conclusionsIndex].match(/\d/g).join(""));
        let presentation = Number(scoresData[i][presentationIndex].match(/\d/g).join(""));
        let depthOfKnowledge = Number(scoresData[i][depthOfKnowledgeIndex].match(/\d/g).join(""));
        let overallScore = Number(scoresData[i][overallScoreIndex].match(/\d/g).join(""));

        // math to get weighted score according to the rubric (Capstone Project > Documents from Client > UMSS-Judging-Rubric-24.pdf)
        let weightedScore = ((topicAndPurpose * 2) + (method * 3) + results + (conclusions * 2) + (presentation * 3) + (depthOfKnowledge * 3) + (overallScore * 2))
        let undergradOrGrad = classAndAbstractMap[abstractNumber]; 
        let category = categoryAndAbstractMap[abstractNumber]; 

        if (undergradOrGrad == 'Undergraduate Showcase' || undergradOrGrad == 'Graduate Exposition') {
            if (!resultsObj[undergradOrGrad][category]) {
                resultsObj[undergradOrGrad][category] = [];
            }

            let existingResult = resultsObj[undergradOrGrad][category].find(result => result.abstractNumber === abstractNumber);

            if (existingResult) {
                existingResult.weightedScore = (existingResult.weightedScore + weightedScore) / 2; // Average the two scores
            }
            else {
                resultsObj[undergradOrGrad][category].push({
                    name: nameAndAbstractMap[abstractNumber], 
                    abstractNumber: abstractNumber,
                    weightedScore: weightedScore,
                    category: categoryAndAbstractMap[abstractNumber]
                });
            }
        };
    }

    let undergraduateResults = resultsObj['Undergraduate Showcase'];
    let graduateResults = resultsObj['Graduate Exposition'];

    Object.keys(undergraduateResults).forEach(function (category) {
        undergraduateResults[category].sort(function (a, b) {
            return b.weightedScore - a.weightedScore;
        })
    });
    Object.keys(graduateResults).forEach(function (category) {
        graduateResults[category].sort(function (a, b) {
            return b.weightedScore - a.weightedScore;
        })
    });


    let resultsSheet = spreadsheet.getSheetByName("Final Results");
    if (!resultsSheet) {
        resultsSheet = spreadsheet.insertSheet("Final Results");
    }
    else {
        resultsSheet.clear();
    }

    resultsSheet.appendRow(['Abstract Number', 'Category', 'Student Name', 'Degree Level', 'Overall Score', 'Project Title',	'First Co-Author',	'Second Co-Author',	'Third Co-Author',	'Fourth Co-Author',	'Fifth Co-Author',	'Extra Co-Authors']);

    Object.keys(undergraduateResults).forEach(function (category) {
        let categoryResults = undergraduateResults[category];

        let topThreeUndergraduates = categoryResults.slice(0, 3);

        topThreeUndergraduates.forEach(function (student) {
            resultsSheet.appendRow([student.abstractNumber, category, student.name, 'Undergraduate', student.weightedScore/16,titleAndAbstractMap[student.abstractNumber], authorsAndAbstractMap[student.abstractNumber][0], authorsAndAbstractMap[student.abstractNumber][1], authorsAndAbstractMap[student.abstractNumber][2], authorsAndAbstractMap[student.abstractNumber][3], authorsAndAbstractMap[student.abstractNumber][4], authorsAndAbstractMap[student.abstractNumber][5] ]);
        });
    });

    Object.keys(graduateResults).forEach(function (category) {
        let categoryResults = graduateResults[category];

        let topThreeGraduates = categoryResults.slice(0, 3);

        topThreeGraduates.forEach(function (student) {
            resultsSheet.appendRow([student.abstractNumber, category, student.name, 'Graduate', student.weightedScore/16, titleAndAbstractMap[student.abstractNumber], authorsAndAbstractMap[student.abstractNumber][0], authorsAndAbstractMap[student.abstractNumber][1], authorsAndAbstractMap[student.abstractNumber][2], authorsAndAbstractMap[student.abstractNumber][3], authorsAndAbstractMap[student.abstractNumber][4], authorsAndAbstractMap[student.abstractNumber][5]]);
        });
    });
}
