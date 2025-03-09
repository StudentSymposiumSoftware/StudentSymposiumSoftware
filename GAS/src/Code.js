function doGet() {
  return HtmlService.createHtmlOutputFromFile('src/Index');
}

function onOpen() {
  var ui = SpreadsheetApp.getUi() 
    ui.createMenu('Symposium Actions')
      .addItem('Email Judges', 'EmailJudges')
      .addSubMenu(
        ui.createMenu('Scoring')
        .addItem('Get Scores', 'getScoreInfo')
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

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('src/Index')
      .setTitle('Student Symposium Software')
      .setWidth(1000);
  SpreadsheetApp.getUi().showSidebar(html);
}


function clearScores() { 
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  const destinationSheet = spreadsheet.getSheetByName("Student Scores"); 
  
  const lastRow = destinationSheet.getLastRow();
  
  if (lastRow > 1) {
    destinationSheet.getRange("2:" + lastRow).clearContent(); 
  }

}

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
  for (let i = 0; i < progOfStudy.length; i++){
    if (progOfStudy[i][0] === "Graduate Student"){
      gradStudent.push(true);
  
    } else {
      gradStudent.push(false);
    }
  }

  //seperate faculty judges and grad student judges
  const judgeProgOfStudy = judgeSheet.getRange("F2:F").getValues().filter(String);
  const gradJudges = [];
  const facultyJudges = [];
  for (let i = 0; i < judgeProgOfStudy.length; i++){
    if (judgeProgOfStudy[i][0] === "Yes, I am a graduate student"){
      gradJudges.push(judges[i]);
      
    } else {
      facultyJudges.push(judges[i]);
    }
  }
  
  // clear previous assignments
  assigningSheet.getRange("A2:C").clearContent();

  let firstJudge = "";
  let secondJudge = "";

  for (let i = 0; i < abstractRange.length; i++){

    do {
      if(gradStudent[i]){
        firstJudge = facultyJudges[Math.floor(Math.random() * facultyJudges.length)];
      } else {
        firstJudge = judges[Math.floor(Math.random() * judges.length)];
      }
    } while (firstJudge === advisorRange[i][0]); //check for judge conflict, pick new judge if true

    do {
      if(gradStudent[i]){
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


const startingIndexes = {
    "Allied Health": 400,
    "Arts": 600,
    "Biomedical Sciences": 1000,
    "Business": 200,
    "Education": 300,
    "Engineering and Information Sciences (including Biomedical Engineering)": 500,
    "Natural Sciences": 800,
    "Physical and Mathematical Sciences": 100,
    "Social Sciences and Humanities": 700,
    "Interdisciplinary Research (research across 3 or more different departments or colleges)": 900
  };

// Book of Abstracts has to save every x pages (<300) to avoid crashing
const batchSize = 220;

function createAbstractDoc() {
  /*

    Creates the Book of Abstracts from the data in the Student Applications Sheet. 

  */

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Student Applications Linked"); 
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Get all data from the sheet
  const numberIndex = headers.indexOf("Abstract Numbers");
  const titleIndex = headers.indexOf("Project Title");
  const abstractIndex = headers.indexOf("Project Abstract");
  const mentorNameIndex = headers.indexOf("Faculty Mentor Name");
  const mentorEmailIndex = headers.indexOf("Faculty Mentor University Email");
  const studentFirstNameIndex = headers.indexOf("Student First Name");
  const studentLastNameIndex = headers.indexOf("Student Last Name");
  const presentationStyle = headers.indexOf("Presentation Style");

  data.sort((a, b) => a[numberIndex] - b[numberIndex])

  const coAuthorIndexes = [];
  ["1st", "2nd", "3rd", "4th", "5th"].forEach((ordinal) => {
    const coAuthorNameIndex = headers.indexOf(`${ordinal} Co-author's Full Name`);
    if (coAuthorNameIndex !== -1) {
      coAuthorIndexes.push(coAuthorNameIndex);
    }
  });


  let doc = DocumentApp.create("Abstracts Summary");
  let body = doc.getBody();

  
  // Title page
  const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT7hP05h2__V1ZSXyqOElRIReSlu1Voar_oQ&s';
  const image = UrlFetchApp.fetch(imageUrl).getBlob();
  let paragraph = body.appendParagraph('');
  let insertedImage = paragraph.appendInlineImage(image);
  paragraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  

  // Book of Abstracts Title
  const titleParagraph = body.appendParagraph("UMaine Student Symposium Book of Abstracts");
  titleParagraph.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  titleParagraph.setFontSize(36);
  titleParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  titleParagraph.setBold(true);

  body.appendPageBreak(); 
  const abstractListTitleParagraph = body.appendParagraph(`UMSS24 Book of Abstracts\n\nPresentation List by Category\n\n`)
  abstractListTitleParagraph.setBold(true)
  abstractListTitleParagraph.setFontSize(11);
  abstractListTitleParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER)
  abstractListTitleParagraph.setFontFamily(DocumentApp.FontFamily.TIMES_NEW_ROMAN)

  let currentCategoryName = null;

  // List of abstracts titles with authors names
  for (let i = 1; i < data.length; i++) {
    const abstractNumber = data[i][numberIndex];
    const title = data[i][titleIndex];
    const studentFirstName = data[i][studentFirstNameIndex];
    const studentLastName = data[i][studentLastNameIndex];
    const facultyMentor = data[i][mentorNameIndex];

    let coAuthors = [];
    coAuthorIndexes.forEach((index) => {
      const coAuthorName = data[i][index];
      if (coAuthorName && coAuthorName.trim()) {
        coAuthors.push(coAuthorName.trim());
      }
    });
    // Category name changing
    let categoryName = getCategoryName(abstractNumber, startingIndexes);
    if (categoryName !== currentCategoryName) {
      currentCategoryName = categoryName;

      const categoryParagraph = body.appendParagraph(`${currentCategoryName} - Pgs.\n`)
      categoryParagraph.setBold(true)
      categoryParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    }

    // Append each abstract with its title, authors, mentor, and abstract text
    let paragraph = body.appendParagraph("");
    paragraph.appendText(`${abstractNumber}.`).setBold(true);
    paragraph.appendText(` ${title}`).setBold(false);
    
    body.appendListItem(`${studentFirstName} ${studentLastName}`).setGlyphType(DocumentApp.GlyphType.BULLET).setBold(false);
    coAuthors.forEach((author) => {
      body.appendListItem(`${author}`).setGlyphType(DocumentApp.GlyphType.BULLET);
    });
    body.appendListItem(`${facultyMentor}`).setGlyphType(DocumentApp.GlyphType.BULLET);

    body.appendParagraph(""); 
  }

  // List of abstracts with more details
  body.appendPageBreak();
  body.appendParagraph("All Abstracts").setHeading(DocumentApp.ParagraphHeading.HEADING1);

  doc.saveAndClose();
  doc = DocumentApp.openById(doc.getId()); 
  body = doc.getBody();

  for (let i = 1; i < data.length; i++) {
      const abstractNumber = data[i][numberIndex];
      const title = data[i][titleIndex];
      const abstract = data[i][abstractIndex];
      const studentFirstName = data[i][studentFirstNameIndex];
      const studentLastName = data[i][studentLastNameIndex];
      const facultyMentor = data[i][mentorNameIndex];
      const facultyEmail = data[i][mentorEmailIndex];
      const presentationStyles = data[i][presentationStyle];

      // Get the list of coauthors
      let coAuthors = [];
      coAuthorIndexes.forEach((index) => {
          const coAuthorName = data[i][index];
          if (coAuthorName && coAuthorName.trim()) {
              coAuthors.push(coAuthorName.trim());
          }
      });

      let allAuthors = `${studentFirstName} ${studentLastName}, ${coAuthors.join(", ")}, and Faculty Mentor: ${facultyMentor}`;
      let categoryName = getCategoryName(abstractNumber, startingIndexes);

      body.appendParagraph(`Abstract #${abstractNumber}`).setBold(true);
      body.appendParagraph(`Title: ${title}`).setBold(false)
      body.appendParagraph("");

      body.appendParagraph(`Submission Type:`).setBold(true);
      body.appendParagraph(`${presentationStyles}`).setBold(false);
      body.appendParagraph("");

  
      body.appendParagraph(`Submission Category:`).setBold(true);
      body.appendParagraph(`${categoryName}`).setBold(false);
      body.appendParagraph("");


      body.appendParagraph(`Author(s):`).setBold(true);
      body.appendParagraph(`${allAuthors}`).setBold(false);
      body.appendParagraph("");

      body.appendParagraph(`Faculty Mentor:`).setBold(true);
      body.appendParagraph(`${facultyMentor}`).setBold(false);
      body.appendParagraph("");


      body.appendParagraph(`Abstract:`).setBold(true);
      body.appendParagraph(`${abstract}`).setBold(false);

      body.appendParagraph("");
      body.appendPageBreak();

      // Saving every x abstracts so we dont hit page edit limit (~300 pages before it throws error)
      if (i % batchSize === 0 || i === data.length - 1) {
        doc.saveAndClose();
        doc = DocumentApp.openById(doc.getId());
        body = doc.getBody();
      }
  }

  doc.saveAndClose();

  const pdfBlob = doc.getAs('application/pdf');
  const pdfFile = DriveApp.createFile(pdfBlob).setName("Abstracts_Summary.pdf");
  pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const pdfUrl = pdfFile.getUrl();
  Logger.log(`Public download link: ${pdfUrl}`);
  showDownloadLink(pdfUrl);
}

function getCategoryName(abstractNumber, startingIndexes) {
  for (const category in startingIndexes) {
    if (abstractNumber >= startingIndexes[category] && abstractNumber < startingIndexes[category] + 100) {
      return category;
    }
  }
  return "Uncategorized";
}

function showDownloadLink(url) {
  const html = `
    <p>View the generated Book of Abstracts here: </p>
    <a href="${url}" target="_blank" onclick="google.script.host.close()">View PDF</a>
  `;
  const userInterface = HtmlService.createHtmlOutput(html)
    .setWidth(300)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(userInterface, "Download PDF");
}

///////
// Abstract number generation
///////
 var categoryDict = {};
  categoryDict['Physical and Mathematical Sciences'] = 101;
  categoryDict['Business'] = 201;
  categoryDict['Education'] = 301;
  categoryDict['Allied Health'] = 401;
  categoryDict['Engineering and Information Sciences (including Biomedical Engineering)'] = 501;
  categoryDict['Arts'] = 601;
  categoryDict['Social Sciences and Humanities'] = 701;
  categoryDict['Natural Sciences'] = 801;
  categoryDict['Interdisciplinary Research (research across 3 or more different departments or colleges)'] = 901;
  categoryDict['Biomedical Sciences'] = 1001;



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

function assignAbstractNumber(){
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  const sourceSheet = spreadsheet.getSheetByName("Student Applications Linked"); 
  const data = sourceSheet.getDataRange().getValues();
  let numRows = data.length;
  const headers = data[0]

   for (let i = 0; i < numRows; i++) {
    let columnBAindex = headers.indexOf('Abstract Numbers');
    let columnBA = sourceSheet.getRange(i + 1, columnBAindex+1); 
    let undergradOrGradindex = headers.indexOf("Are you entering this abstract for Graduate Exposition or Undergraduate Showcase?");
    let undergradOrGrad = data[i][undergradOrGradindex];
    let category = "";
    let category_num = 0;
    let new_category_num = 0;
    // If the value in column BA is blank
    if (columnBA.getValue() === "" || columnBA.getValue() == null) {
        if (undergradOrGrad === "Graduate Exposition") { // leaving category assignment as data[i][x] because the headers are long.
          category = data[i][17]; // column R, which is the category selection for grad students
        } else if(undergradOrGrad === "Undergraduate Showcase") {
          category = data[i][20]; // column U, which is the category selection for undergrads
        };
        console.log(category)
        category_num = categoryDict[category];
        console.log("The category number without entries is ",category_num);
        new_category_num = searchColumnForAbstractNumber(category_num);
        columnBA.setValue(new_category_num);
        console.log("The new entry's abstract number is: ", new_category_num);
    }
}
}
assignAbstractNumber();


function resultsPage(){

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

  for (let i = 1; i < numRowsInApplications; i++){
    let studentFirstName = applicationsData[i][studentFirstNameIndex];
    let studentLastName = applicationsData[i][studentLastNameIndex];
    let firstAndLast = studentFirstName.concat(" ",studentLastName);
    nameAndAbstractMap[applicationsData[i][abstractNumberIndex]] = firstAndLast;
  }

  let categoryAndAbstractMap = {}; // Abstractt num mapped to category
  for (let i = 1; i < numRowsInApplications; i++){
    if (applicationsData[i][undergraduateCategoryIndex] == "" || applicationsData[i][undergraduateCategoryIndex] == null){
      categoryAndAbstractMap[applicationsData[i][abstractNumberIndex]] = applicationsData[i][graduateCategoryIndex]; 
    }
    else{
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
    let weightedScore = ((topicAndPurpose*2)+(method*3)+results+(conclusions*2)+(presentation*3)+(depthOfKnowledge*3)+(overallScore*2))
    let undergradOrGrad = classAndAbstractMap[abstractNumber]; // Undergraduate or grad student, determined by classMap
    let category = categoryAndAbstractMap[abstractNumber]; // Abstract category, determined by categoryMap

  if (undergradOrGrad == 'Undergraduate Showcase' || undergradOrGrad == 'Graduate Exposition'){
    if (!resultsObj[undergradOrGrad][category]) {
        resultsObj[undergradOrGrad][category] = [];
      } 

    let existingResult = resultsObj[undergradOrGrad][category].find(result => result.abstractNumber === abstractNumber);

    if (existingResult) {
      existingResult.weightedScore = (existingResult.weightedScore + weightedScore) / 2; // Average the two scores
      }
    else{
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

  Object.keys(undergraduateResults).forEach(function(category) {
      undergraduateResults[category].sort(function(a, b) {
        return b.weightedScore - a.weightedScore; 
      })
      });
  Object.keys(graduateResults).forEach(function(category) {
      graduateResults[category].sort(function(a, b) {
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
   else{
    resultsSheet.clear();
   }

  resultsSheet.appendRow(['Abstract Number', 'Category', 'Student Name', 'Degree Level', 'Overall Score']);

  Object.keys(undergraduateResults).forEach(function(category) {
    let categoryResults = undergraduateResults[category];

    let topThreeUndergraduates = categoryResults.slice(0, 3); 

    topThreeUndergraduates.forEach(function(student) {
      resultsSheet.appendRow([ student.abstractNumber, category, student.name,'Undergraduate',student.weightedScore ]);
    });
  });

  Object.keys(graduateResults).forEach(function(category) {
    let categoryResults = graduateResults[category];

    let topThreeGraduates = categoryResults.slice(0, 3);  

    topThreeGraduates.forEach(function(student) {
      resultsSheet.appendRow([student.abstractNumber, category,student.name,'Graduate',  student.weightedScore]);
    });
  });
}


