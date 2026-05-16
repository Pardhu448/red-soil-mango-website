/**
 * Red Soil Mango — Order form backend (Google Apps Script)
 *
 * Receives order submissions from the website, appends them to a Google Sheet,
 * and sends a WhatsApp notification to the owner's number via CallMeBot.
 *
 * Setup: see apps-script/README.md
 */

// ---- Configuration -------------------------------------------------------
// Set these in Apps Script: Project Settings > Script Properties, OR edit here.
//   OWNER_PHONE      e.g. "919346502175"  (country code, no + or spaces)
//   CALLMEBOT_APIKEY the API key CallMeBot sends you on activation
// -------------------------------------------------------------------------

function getConfig_() {
  var props = PropertiesService.getScriptProperties();
  return {
    ownerPhone: props.getProperty('OWNER_PHONE') || '',
    apiKey: props.getProperty('CALLMEBOT_APIKEY') || '',
  };
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Ignore bot submissions caught by the honeypot field.
    if (data.website) {
      return jsonResponse_({ result: 'success' });
    }

    appendToSheet_(data);
    sendWhatsApp_(data);

    return jsonResponse_({ result: 'success' });
  } catch (err) {
    return jsonResponse_({ result: 'error', message: String(err) });
  }
}

function appendToSheet_(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');
    sheet.appendRow([
      'Timestamp', 'Name', 'Phone', 'Pack size', 'Quantity',
      'Fulfilment', 'Address', 'Location link', 'Notes', 'Price/kg',
    ]);
  }
  sheet.appendRow([
    new Date(),
    data.name || '',
    '', // Phone is written separately below as plain text.
    data.packSize || '',
    data.quantity || '',
    data.fulfilment || '',
    data.address || '',
    data.locationLink || '',
    data.notes || '',
    data.pricePerKg || '',
  ]);

  // A phone like "+91 ..." starts with "+", which Sheets would treat as a
  // formula ("Formula parse error"). Force the cell to plain-text format.
  var phoneCell = sheet.getRange(sheet.getLastRow(), 3);
  phoneCell.setNumberFormat('@');
  phoneCell.setValue(String(data.phone || ''));
}

function sendWhatsApp_(data) {
  var config = getConfig_();
  if (!config.ownerPhone || !config.apiKey) {
    return; // Not configured — skip silently; the sheet row is still saved.
  }

  var message =
    'New mango order!\n' +
    'Name: ' + (data.name || '-') + '\n' +
    'Phone: ' + (data.phone || '-') + '\n' +
    'Pack: ' + (data.packSize || '-') + ' x ' + (data.quantity || '-') + '\n' +
    (data.pricePerKg ? 'Price/kg: ₹' + data.pricePerKg + '\n' : '') +
    'Fulfilment: ' + (data.fulfilment || '-') + '\n' +
    (data.address ? 'Address: ' + data.address + '\n' : '') +
    (data.locationLink ? 'Location: ' + data.locationLink + '\n' : '') +
    (data.notes ? 'Notes: ' + data.notes : '');

  var url =
    'https://api.callmebot.com/whatsapp.php' +
    '?phone=' + encodeURIComponent(config.ownerPhone) +
    '&text=' + encodeURIComponent(message) +
    '&apikey=' + encodeURIComponent(config.apiKey);

  UrlFetchApp.fetch(url, { muteHttpExceptions: true });
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
