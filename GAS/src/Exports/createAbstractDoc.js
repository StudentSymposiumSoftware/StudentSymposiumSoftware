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
