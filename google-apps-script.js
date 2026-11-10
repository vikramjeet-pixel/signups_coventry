/**
 * ============================================================================
 * STAR SUPER MARKET COVENTRY — GOOGLE SHEETS FORM RECEIVER
 * ============================================================================
 * HOW TO CONNECT YOUR GOOGLE SHEET (2 MINUTES):
 *
 * 1. Open Google Drive (https://drive.google.com) -> New -> Google Sheets.
 *    Name it: "Star Super Market Coventry - Launch Signups"
 *
 * 2. In your Google Sheet top menu, click:
 *    Extensions -> Apps Script
 *
 * 3. Delete any code in the editor and paste THIS ENTIRE FILE.
 *    Click the Save icon (Ctrl+S).
 *
 * 4. Click "Deploy" (top right) -> "New deployment":
 *    - Click the gear icon next to "Select type" -> choose "Web app"
 *    - Description: "Star Super Market Signup Form"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (IMPORTANT so website visitors can submit)
 *    - Click "Deploy" -> Authorize access when prompted -> Copy the "Web app URL"
 *
 * 5. Open `script.js` in your website folder and paste that URL into:
 *    const GOOGLE_SHEET_WEB_APP_URL = "YOUR_COPIED_WEB_APP_URL_HERE";
 * ============================================================================
 */

const SHEET_NAME = 'Signups';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);

    // If "Signups" tab doesn't exist yet, use the first tab or create it
    if (!sheet) {
      sheet = doc.getSheets()[0];
      sheet.setName(SHEET_NAME);
    }

    // Create formatted header row automatically if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp (UK)',
        'Guest Pass No.',
        'Full Name',
        'Email Address',
        'Mobile Number',
        'Postcode',
        'Launch Updates Opt-In'
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#0e6b31')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Parse incoming form data (supports both JSON/text payload and FormData/URLSearchParams)
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const ukTimestamp = Utilities.formatDate(
      new Date(),
      'Europe/London',
      'dd/MM/yyyy HH:mm:ss'
    );

    sheet.appendRow([
      ukTimestamp,
      data.passCode || '',
      data.fullName || '',
      data.email || '',
      data.phone ? "'" + data.phone : '',
      data.postcode || '',
      data.voucherOptIn === true || data.voucherOptIn === 'true' || data.voucherOptIn === 'Yes' ? 'Yes' : 'No'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', passCode: data.passCode }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

