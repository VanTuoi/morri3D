/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT CHO HỆ THỐNG QUẢN LÝ MORRI 3D PRINTING
 * ==============================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT:
 * 1. Mở file Google Sheet của bạn.
 * 2. Tạo 3 Sheet (Tab):
 *    - Tab 1: "Orders" (Đơn hàng)
 *    - Tab 2: "Filaments" (Kho nhựa in)
 *    - Tab 3: "Users" (Danh sách email được phép truy cập)
 * 
 * 3. Ở Tab "Users":
 *    - Dòng 1 (Tiêu đề): Cột A ghi "Email", Cột B ghi "Tên" (tùy chọn)
 *    - Từ dòng 2 trở đi: Điền các email Google được phép truy cập. Ví dụ:
 *      A2: admin@gmail.com
 *      A3: nhanvien1@gmail.com
 * 
 * 4. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 5. Dán toàn bộ mã nguồn bên dưới vào file Code.gs.
 * 6. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment)
 *    - Loại: Ứng dụng web (Web App)
 *    - Thực thi dưới dạng: Tôi (Me)
 *    - Ai có quyền truy cập: Bất kỳ ai (Anyone)
 * 7. Copy URL web app dán vào phần Cài đặt trong ứng dụng.
 * ==============================================================================
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'getAll';
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === 'getAll') {
      var orders = getSheetData(ss, 'Orders');
      var filaments = getSheetData(ss, 'Filaments');
      var allowedEmails = getAllowedUsers(ss);

      return createJsonResponse({
        success: true,
        data: {
          orders: orders,
          filaments: filaments,
          allowedEmails: allowedEmails
        }
      });
    }

    if (action === 'checkEmail') {
      var emailToCheck = ((e.parameter.email || '')).toLowerCase().trim();
      var allowedEmails = getAllowedUsers(ss);
      var isAllowed = allowedEmails.length === 0 || allowedEmails.indexOf(emailToCheck) !== -1;

      return createJsonResponse({
        success: true,
        allowed: isAllowed,
        email: emailToCheck
      });
    }

    return createJsonResponse({ success: false, error: 'Hành động không hợp lệ' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
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
      return createJsonResponse({ success: true, message: 'Đã lưu thành công' });
    }

    return createJsonResponse({ success: false, error: 'Hành động POST không hợp lệ' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

/** Lấy danh sách email được cấp phép từ Sheet "Users" */
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

/** Lấy dữ liệu từ Sheet dạng mảng Object */
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

/** Lưu mảng dữ liệu vào Sheet */
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

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
