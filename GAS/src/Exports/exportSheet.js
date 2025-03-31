/*
 * Simplifies the process of exporting a Google Sheet to a XLSX file.
*/
function exportSheetXLSX() {
    /* String */ var ssID = SpreadsheetApp.getActive().getId();
    /* String */ var URL = 'https://docs.google.com/spreadsheets/d/' + ssID + '/export?format=xlsx';

    /* HTMLService */ var htmlOutput = HtmlService
        .createHtmlOutput('<a href="' + URL + '">Click to download</a>')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setWidth(80)
        .setHeight(60);

    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Download XLSX File');
}

/*
 * Uploads the current Google Sheet to Firebase Storage for the Website
*/
function exportToFirebase() {
    /* Ui */ var ui = SpreadsheetApp.getUi();
    /* String */ var year = ui.prompt('Enter the year of the symposium:').getResponseText();
    uploadToFirebaseStorage(year);
}

// Shamelessly adapted from https://stackoverflow.com/questions/50666355/how-to-upload-files-to-firebase-storage-from-google-drive-using-apps-script
// Credit where credit is due
function uploadToFirebaseStorage(year) {
    try {
        /* String */ var ssID = SpreadsheetApp.getActive().getId();
        /* String */ var spreadsheet_url = 'https://docs.google.com/spreadsheets/d/' + ssID + '/export?format=xlsx';
        /* JSON */ var params = {
            method      : "get",
            headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
            muteHttpExceptions: true
          };
        /* String */ var bucketName = "symposiumrecap.firebasestorage.app";
        /* String */ var pathAndName = `symposium/${year}/symposium.xlsx`;
        /* String */ var upload_url = 'https://www.googleapis.com/upload/storage/v1/b/' + bucketName + '/o?uploadType=media&name=' + pathAndName;
        /* blob */ var blob = UrlFetchApp.fetch(spreadsheet_url, params).getBlob();
        /* String */ var oA_Tkn = ScriptApp.getOAuthToken();
        /* JSON */ var options = {
                method: "POST",//curl -X POST
                muteHttpExceptions: true,
                contentLength: blob.getBytes().length,
                contentType: blob.getContentType(),//curlv-H "Content-Type: [OBJECT_CONTENT_TYPE]"
                payload: blob.getBytes(),
                headers: {//curl -H "Authorization: Bearer [OAUTH2_TOKEN]"
                    Authorization: 'Bearer ' + oA_Tkn
                }
              }       
        /* String (DISCARD) */ var _ = UrlFetchApp.fetch(upload_url, options);
    } catch (e) {
        Logger.log(e.message + "\n\n" + e.stack)
    }
}