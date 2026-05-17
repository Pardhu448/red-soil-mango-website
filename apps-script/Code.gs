/**
 * Red Soil Mango — Order form backend (Google Apps Script)
 *
 * Receives order submissions from the website, appends them to a Google Sheet,
 * and emails an order notification to the owner via Resend. Also lets the
 * owner email individual customers from the sheet.
 *
 * Setup: see apps-script/README.md
 */

// ---- Configuration -------------------------------------------------------
// Set these in Apps Script: Project Settings > Script Properties.
//   RESEND_API_KEY  your Resend API key (starts with "re_")
//   FROM_EMAIL      verified sender address — e.g.
//                   "Red Soil Mango <orders@yourdomain.com>"
//   OWNER_EMAIL     where new-order alerts are sent
//   ORDER_TOKEN     shared secret the website must send with each order.
//                   When set, requests without a matching token are rejected.
//                   Must equal the website's REACT_APP_ORDER_TOKEN.
// -------------------------------------------------------------------------

function getConfig_() {
  var props = PropertiesService.getScriptProperties();
  return {
    resendApiKey: props.getProperty('RESEND_API_KEY') || '',
    fromEmail: props.getProperty('FROM_EMAIL') || '',
    ownerEmail: props.getProperty('OWNER_EMAIL') || '',
    orderToken: props.getProperty('ORDER_TOKEN') || '',
  };
}

function isConfigured_(config) {
  return !!(config.resendApiKey && config.fromEmail && config.ownerEmail);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Ignore bot submissions caught by the honeypot field.
    if (data.website) {
      return jsonResponse_({ result: 'success' });
    }

    // Reject requests that lack the shared-secret token. Only enforced when
    // ORDER_TOKEN is configured, so existing deployments keep working until
    // the property is set on both the script and the website.
    var orderToken = getConfig_().orderToken;
    if (orderToken && String(data.token || '') !== orderToken) {
      return jsonResponse_({ result: 'error', message: 'unauthorized' });
    }

    appendToSheet_(data);
    sendOwnerNotification_(data);

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
      'Timestamp', 'Name', 'Phone', 'Email', 'Variety', 'Pack size',
      'Quantity', 'Fulfilment', 'Address', 'Location link', 'Notes',
      'Price/kg', FLAG_HEADER, MESSAGES_HEADER,
    ]);
  }
  // Make sure the customer-messaging columns ("Send?", "Messages") exist even
  // on a sheet created before this feature, so every order row shows them.
  getColumnMap_(sheet);

  var row = [
    new Date(),
    data.name || '',
    String(data.phone || ''),
    data.email || '',
    data.variety || '',
    data.packSize || '',
    data.quantity || '',
    data.fulfilment || '',
    data.address || '',
    data.locationLink || '',
    data.notes || '',
    data.pricePerKg || '',
  ];

  var targetRow = sheet.getLastRow() + 1;

  // Force every text column (Name..Price/kg) to plain-text format BEFORE the
  // values are written. This neutralises spreadsheet formula injection: a
  // submitted value such as "=IMPORTRANGE(...)" or "=HYPERLINK(...)" is stored
  // as literal text and never evaluated when the owner opens the sheet, so it
  // cannot exfiltrate other customers' data. It also stops phone numbers
  // ("+91 ...") triggering a "Formula parse error".
  // Column 1 (Timestamp) is left as-is so it stays a real date value.
  sheet.getRange(targetRow, 2, 1, row.length - 1).setNumberFormat('@');
  sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
  // The "Send?" and "Messages" columns stay blank for a new order, ready for
  // the owner to fill in.
}

function sendOwnerNotification_(data) {
  var config = getConfig_();
  if (!isConfigured_(config)) {
    return; // Not configured — skip silently; the sheet row is still saved.
  }

  var subject = 'New mango order — ' + (data.name || 'Unknown');
  var body =
    'New mango order!\n\n' +
    'Name: ' + (data.name || '-') + '\n' +
    'Phone: ' + (data.phone || '-') + '\n' +
    'Email: ' + (data.email || '-') + '\n' +
    'Variety: ' + (data.variety || '-') + '\n' +
    'Pack: ' + (data.packSize || '-') + ' x ' + (data.quantity || '-') + '\n' +
    (data.pricePerKg ? 'Price/kg: ₹' + data.pricePerKg + '\n' : '') +
    'Fulfilment: ' + (data.fulfilment || '-') + '\n' +
    (data.address ? 'Address: ' + data.address + '\n' : '') +
    (data.locationLink ? 'Location: ' + data.locationLink + '\n' : '') +
    (data.notes ? 'Notes: ' + data.notes : '');

  sendEmail_(config, config.ownerEmail, subject, body);
}

/**
 * Sends a single email via the Resend API.
 * `to` is one address or an array. `html` is optional — when given it is sent
 * alongside `text` (the plain-text fallback). Returned object reports whether
 * Resend accepted it (HTTP 2xx).
 */
function sendEmail_(config, to, subject, text, html) {
  var payload = {
    from: config.fromEmail,
    to: to,
    subject: subject,
    text: text,
  };
  if (html) {
    payload.html = html;
  }

  var response = UrlFetchApp.fetch('https://api.resend.com/emails', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + config.resendApiKey,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var code = response.getResponseCode();
  return { ok: code >= 200 && code < 300, code: code,
           body: response.getContentText() };
}

/**
 * Wraps a plain-text customer message in a clean, legible HTML email.
 * The message text is HTML-escaped; line breaks become <br>.
 */
function customerEmailHtml_(message) {
  var safe = String(message)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  return '' +
    '<div style="margin:0;padding:24px;background:#f4f1ea;' +
      'font-family:Arial,Helvetica,sans-serif;">' +
      '<div style="max-width:520px;margin:0 auto;background:#ffffff;' +
        'border-radius:8px;overflow:hidden;' +
        'box-shadow:0 1px 3px rgba(0,0,0,0.12);">' +
        '<div style="background:#c0392b;padding:18px 28px;">' +
          '<h1 style="margin:0;color:#ffffff;font-size:18px;' +
            'font-weight:bold;">Order Details</h1>' +
        '</div>' +
        '<div style="padding:28px;color:#2b2b2b;font-size:16px;' +
          'line-height:1.65;">' + safe + '</div>' +
        '<div style="padding:16px 28px;background:#faf8f3;color:#999999;' +
          'font-size:12px;line-height:1.5;border-top:1px solid #eeeae0;">' +
          'RedSoilMango Farm · Naturally ripened mangoes' +
        '</div>' +
      '</div>' +
    '</div>';
}

// ---- Customer messaging --------------------------------------------------
// Lets the owner email individual customers from the Orders sheet.
//
// Two extra columns drive this (auto-created if missing):
//   "Messages"  pipe-separated history, NEWEST FIRST. To send a new message,
//               type it at the front:  new text | older text | oldest text
//   "Send?"     set this to "send" (or tick it if it is a checkbox) on the
//               rows you want emailed. After a successful send the cell is
//               stamped "Sent <date>" so the same message is not re-sent.
//
// The customer's address comes from the "Email" column.
// Trigger via the Sheet menu: Mango Tools > Send pending customer emails.

var FLAG_HEADER = 'Send?';
var MESSAGES_HEADER = 'Messages';
var CUSTOMER_EMAIL_SUBJECT = 'Update from RedSoilMango';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Mango Tools')
    .addItem('Send pending customer emails', 'sendPendingEmails')
    .addToUi();
}

/**
 * Returns a map of header name -> 1-based column index for the Orders sheet,
 * creating the "Send?" and "Messages" columns if they do not exist yet.
 */
function getColumnMap_(sheet) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] !== '') {
      map[headers[i]] = i + 1;
    }
  }
  [MESSAGES_HEADER, FLAG_HEADER].forEach(function (name) {
    if (!map[name]) {
      lastCol++;
      sheet.getRange(1, lastCol).setValue(name);
      map[name] = lastCol;
    }
  });
  return map;
}

// A row is "pending" when its flag cell is set but not already a "Sent ..."
// stamp. Checkbox cells arrive as the boolean true.
function isFlagSet_(value) {
  if (value === true) {
    return true;
  }
  var v = String(value).trim().toLowerCase();
  return v === 'send' || v === 'yes' || v === 'y' || v === 'true' || v === '1';
}

function sendPendingEmails() {
  var ui = SpreadsheetApp.getUi();
  var config = getConfig_();
  if (!isConfigured_(config)) {
    ui.alert('Resend is not configured. Set the script properties first ' +
             '(see apps-script/README.md).');
    return;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet || sheet.getLastRow() < 2) {
    ui.alert('No orders found in the "Orders" sheet.');
    return;
  }

  var cols = getColumnMap_(sheet);
  if (!cols['Email']) {
    ui.alert('No "Email" column found in the Orders sheet. Add one (with ' +
             'customer email addresses) before sending customer emails.');
    return;
  }
  var emailCol = cols['Email'];
  var flagCol = cols[FLAG_HEADER];
  var msgCol = cols[MESSAGES_HEADER];

  var firstRow = 2;
  var numRows = sheet.getLastRow() - 1;
  var data = sheet.getRange(firstRow, 1, numRows, sheet.getLastColumn())
    .getValues();

  var sent = 0;
  var skipped = [];
  var failed = [];

  for (var i = 0; i < numRows; i++) {
    var row = firstRow + i;
    if (!isFlagSet_(data[i][flagCol - 1])) {
      continue;
    }

    var email = String(data[i][emailCol - 1]).trim();
    // Newest message is the first pipe-separated entry.
    var message = String(data[i][msgCol - 1]).split('|')[0].trim();

    if (!email || !message) {
      skipped.push('Row ' + row + (email ? ' (no message)' : ' (no email)'));
      continue;
    }

    var result = sendEmail_(config, email, CUSTOMER_EMAIL_SUBJECT, message,
                            customerEmailHtml_(message));
    if (result.ok) {
      sent++;
      sheet.getRange(row, flagCol)
        .setValue('Sent ' + Utilities.formatDate(
          new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm'));
    } else {
      failed.push('Row ' + row + ' (HTTP ' + result.code + ')');
    }
    Utilities.sleep(300); // Stay within Resend's per-second rate limits.
  }

  var summary = 'Done.\nSent: ' + sent;
  if (skipped.length) {
    summary += '\nSkipped:\n' + skipped.join('\n');
  }
  if (failed.length) {
    summary += '\nFailed:\n' + failed.join('\n');
  }
  ui.alert(summary);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
