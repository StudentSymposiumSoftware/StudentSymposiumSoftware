/*
 * Simplies the process of exporting a Google Sheet to a XLSX file.
*/
function exportSheetXLSX() {
    /* String */ var ssID = SpreadsheetApp.getActive().getId();
    /* String */ var URL = 'https://docs.google.com/spreadsheets/d/'+ssID+'/export?format=xlsx';

    /* HTMLService */ var htmlOutput = HtmlService
                    .createHtmlOutput('<a href="'+URL+'">Click to download</a>')
                    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                    .setWidth(80)
                    .setHeight(60);
    
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Download XLSX File (For Export to Website)');
}