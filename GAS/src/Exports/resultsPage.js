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
    const studentFirstNameIndex = applicationsHeaders.indexOf('Student First Name');
    const studentLastNameIndex = applicationsHeaders.indexOf('Student Last Name');
    const graduateCategoryIndex = applicationsHeaders.indexOf("Graduate Presentations: Please select one of the following categories that best fit your research. *For more information about being a presenter at the Symposium and for a helpful guide on the below categories, visit: https://umaine.edu/umss/list-of-majors-categories/");
    const undergraduateCategoryIndex = applicationsHeaders.indexOf("Undergraduate Presentations: Please select one of the following categories that best fits your research. *For more information about being a presenter at the Symposium, and for a helpful guide on the categories below, visit: https://umaine.edu/umss/list-of-majors-categories/");

    let classAndAbstractMap = {};  // Abstract num mapped to undergrad or grad

    for (let i = 1; i < numRowsInApplications; i++) {
        classAndAbstractMap[applicationsData[i][abstractNumberIndex]] = applicationsData[i][undergradOrGradIndex];
    };

    let nameAndAbstractMap = {};  // Abstract num mapped to first and last name

    for (let i = 1; i < numRowsInApplications; i++) {
        let studentFirstName = applicationsData[i][studentFirstNameIndex];
        let studentLastName = applicationsData[i][studentLastNameIndex];
        let firstAndLast = studentFirstName.concat(" ", studentLastName);
        nameAndAbstractMap[applicationsData[i][abstractNumberIndex]] = firstAndLast;
    }

    let categoryAndAbstractMap = {}; // Abstractt num mapped to category
    for (let i = 1; i < numRowsInApplications; i++) {
        if (applicationsData[i][undergraduateCategoryIndex] == "" || applicationsData[i][undergraduateCategoryIndex] == null) {
            categoryAndAbstractMap[applicationsData[i][abstractNumberIndex]] = applicationsData[i][graduateCategoryIndex];
        }
        else {
            categoryAndAbstractMap[applicationsData[i][abstractNumberIndex]] = applicationsData[i][undergraduateCategoryIndex];
        }
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


    for (let i = 1; i < numRowsInScores; i++) { // results!
        let abstractNumber = scoresData[i][abstractNumberIndexScores]; // Abstract number location in Student Scores sheet

        let topicAndPurpose = Number(scoresData[i][topicAndPurposeIndex].match(/\d/g).join(""));
        let method = Number(scoresData[i][methodIndex].match(/\d/g).join(""));
        let results = Number(scoresData[i][resultsIndex].match(/\d/g).join(""));
        let conclusions = Number(scoresData[i][conclusionsIndex].match(/\d/g).join(""));
        let presentation = Number(scoresData[i][presentationIndex].match(/\d/g).join(""));
        let depthOfKnowledge = Number(scoresData[i][depthOfKnowledgeIndex].match(/\d/g).join(""));
        let overallScore = Number(scoresData[i][overallScoreIndex].match(/\d/g).join(""));

        // Now do math to get weighted score according to the rubric (Capstone Project > Documents from Client > UMSS-Judging-Rubric-24.pdf)
        let weightedScore = ((topicAndPurpose * 2) + (method * 3) + results + (conclusions * 2) + (presentation * 3) + (depthOfKnowledge * 3) + (overallScore * 2))
        let undergradOrGrad = classAndAbstractMap[abstractNumber]; // Undergraduate or grad student, determined by classMap
        let category = categoryAndAbstractMap[abstractNumber]; // Abstract category, determined by categoryMap

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
                    name: nameAndAbstractMap[abstractNumber], // First and last name in results arry
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

    // The undergraduateResults and graduateResults are now sorted by category in descending order (i.e.
    // undergraduateResults[0].weightedScore will be the highest weighted score in that category)
    // Now, for every category, we need to enter the top three into the sheet.
    ////// Create results sheet
    let resultsSheet = spreadsheet.getSheetByName("Final Results");
    if (!resultsSheet) {
        resultsSheet = spreadsheet.insertSheet("Final Results");
        // Add a clear results sheet button so that it is accurate each time it adds data (below)
    }
    else {
        resultsSheet.clear();
    }

    resultsSheet.appendRow(['Abstract Number', 'Category', 'Student Name', 'Degree Level', 'Overall Score']);

    Object.keys(undergraduateResults).forEach(function (category) {
        let categoryResults = undergraduateResults[category];

        let topThreeUndergraduates = categoryResults.slice(0, 3);

        topThreeUndergraduates.forEach(function (student) {
            resultsSheet.appendRow([student.abstractNumber, category, student.name, 'Undergraduate', student.weightedScore]);
        });
    });

    Object.keys(graduateResults).forEach(function (category) {
        let categoryResults = graduateResults[category];

        let topThreeGraduates = categoryResults.slice(0, 3);

        topThreeGraduates.forEach(function (student) {
            resultsSheet.appendRow([student.abstractNumber, category, student.name, 'Graduate', student.weightedScore]);
        });
    });
}
