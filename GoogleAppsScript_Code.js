function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getAll';
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === 'getAll') {
      var orders = getSheetData(ss, 'Orders');
      var filaments = getSheetData(ss, 'Filaments');
      var allowedEmails = getAllowedUsers(ss);

      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          data: {
            orders: orders,
            filaments: filaments,
            allowedEmails: allowedEmails
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'checkEmail') {
      var emailToCheck = (e.parameter.email || '').toLowerCase().trim();
      var allowedEmails = getAllowedUsers(ss);
      var isAllowed = allowedEmails.length > 0 && allowedEmails.indexOf(emailToCheck) !== -1;

      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          allowed: isAllowed,
          email: emailToCheck
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Hành động không hợp lệ' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'syncAll' && contents.data) {
      if (contents.data.orders) {
        saveSheetData(ss, 'Orders', contents.data.orders);
      }
      if (contents.data.filaments) {
        saveSheetData(ss, 'Filaments', contents.data.filaments);
      }
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Đã lưu thành công' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Hành động POST không hợp lệ' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getAllowedUsers(ss) {
  var sheet = ss.getSheetByName('Users');
  if (!sheet) {
    sheet = ss.insertSheet('Users');
    sheet.appendRow(['Email', 'Tên', 'Vai trò']);
    return [];
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var emails = [];
  for (var i = 1; i < data.length; i++) {
    var email = (data[i][0] || '').toString().trim().toLowerCase();
    if (email && email.indexOf('@') !== -1) {
      emails.push(email);
    }
  }
  return emails;
}

function getSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = row[j];
      var key = headers[j];
      if (key === 'materials') {
        try {
          val = typeof val === 'string' && val.trim() ? JSON.parse(val) : [];
        } catch (e) {
          val = [];
        }
      }
      obj[key] = val;
    }
    if (obj.id) {
      result.push(obj);
    }
  }
  return result;
}

function saveSheetData(ss, sheetName, items) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  if (!items || items.length === 0) return;

  var headers = Object.keys(items[0]);
  var rows = [headers];

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var row = [];
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      var val = item[key];
      if (key === 'materials') {
        val = JSON.stringify(val || []);
      }
      row.push(val !== undefined ? val : '');
    }
    rows.push(row);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
}
