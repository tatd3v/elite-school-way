/**
 * Google Apps Script for Elite Way School Registration Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click "Deploy" and copy the Web App URL
 * 9. Add the URL to your .env file as VITE_GOOGLE_SCRIPT_URL
 */

// Name of the sheets
const SHEET_NAME = 'Registrations';
const ADMINS_SHEET_NAME = 'Users';
const STAFF_SHEET_NAME = 'Staff';

const STAFF_ACTIONS = {
  UPDATE: 'updateStaff',
  DELETE: 'deleteStaff',
  TOGGLE_VISIBILITY: 'toggleStaffVisibility',
};

/**
 * Helper to return JSON responses.
 * Note: Apps Script's ContentService cannot set custom response headers
 * (no setHeader/addHeader API), so CORS is handled by avoiding preflight
 * requests entirely on the client (see formSubmit.js / authService.js,
 * which send requests with a 'text/plain' Content-Type instead of
 * 'application/json' so the browser treats them as simple requests).
 */
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function createJsonpResponse(callback, obj) {
  return ContentService
    .createTextOutput(`${callback}(${JSON.stringify(obj)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/**
 * Handle CORS preflight requests (kept for completeness; should no longer
 * be triggered once the client sends 'text/plain' requests instead of
 * 'application/json', which avoids the preflight altogether).
 */
function doOptions(e) {
  return createJsonResponse({ status: 'ok' });
}

/**
 * Initialize the Admins sheet with headers if it doesn't exist
 */
function initializeAdminsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(ADMINS_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(ADMINS_SHEET_NAME);
    const headers = ['Email', 'Password Hash', 'Role', 'Name'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Add sample admin (password: 'admin123')
    const sampleHash = Utilities.base64Encode(
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        'admin123'
      )
    );
    sheet.appendRow(['admin@elite.com', sampleHash, 'admin', 'Admin User']);
  }
  
  return sheet;
}

/**
 * Initialize the Staff sheet with headers if it doesn't exist
 */
function initializeStaffSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(STAFF_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(STAFF_SHEET_NAME);
    const headers = ['Name', 'Role', 'Bio', 'Photo URL', 'Social Links', 'Display Order', 'Is Visible'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Staff sheet starts empty except for headers; members are managed through the admin panel
  }
  
  return sheet;
}

/**
 * Initialize the registrations sheet with headers if it doesn't exist
 */
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'Timestamp',
      'Nombre Artístico',
      'Email',
      'Teléfono',
      'House/007',
      'Categorías',
      'Edad',
      'Screenshot'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Always force the House/007 column (column E) to TEXT format so values
  // like "007" are preserved instead of being converted to the number 7.
  sheet.getRange('E:E').setNumberFormat('@');
  
  return sheet;
}

/**
 * Hash a password using SHA-256
 */
function hashPassword(password) {
  return Utilities.base64Encode(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      password
    )
  );
}

/**
 * Get or create a subfolder by name. The parent is searched by name at the Drive root.
 */
function getOrCreateSubFolder(parentName, childName) {
  const parents = DriveApp.getFoldersByName(parentName);
  const parent = parents.hasNext() ? parents.next() : DriveApp.createFolder(parentName);
  const children = parent.getFoldersByName(childName);
  return children.hasNext() ? children.next() : parent.createFolder(childName);
}

/**
 * Save a base64 data-URL screenshot to the PAGOS_QR Drive folder and return a shareable URL
 */
function saveScreenshotToDrive(dataUrl, artistName) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return '';
  }

  const match = dataUrl.match(/^data:([^/]+)\/([^;]+);base64,(.+)$/);
  if (!match) {
    return '';
  }

  const mimeType = match[1] + '/' + match[2];
  const extension = match[2];
  const base64 = match[3];
  const bytes = Utilities.base64Decode(base64);
  const fileName = (artistName || 'anonymous') + '-payment-' + Date.now() + '.' + extension;

  const folder = getOrCreateSubFolder('elite-way-school-data', 'PAGOS_QR');
  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

/**
 * Verify admin credentials
 */
function verifyAdmin(email, password) {
  try {
    const sheet = initializeAdminsSheet();
    const data = sheet.getDataRange().getValues();
    
    // Skip header row, iterate through admin records
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === email) {
        const storedHash = data[i][1];
        const inputHash = hashPassword(password);
        
        if (storedHash === inputHash) {
          return {
            success: true,
            role: data[i][2],
            name: data[i][3],
            email: email
          };
        }
      }
    }
    
    return { success: false, message: 'Invalid credentials' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * Handle POST requests from the form
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    let result;

    // Handle admin login request
    if (data.action === 'login') {
      result = verifyAdmin(data.email, data.password);
    } else if (data.action === STAFF_ACTIONS.UPDATE) {
      result = updateStaff(data);
    } else if (data.action === STAFF_ACTIONS.DELETE) {
      result = deleteStaff(data);
    } else if (data.action === STAFF_ACTIONS.TOGGLE_VISIBILITY) {
      result = toggleStaffVisibility(data);
    } else {
      // Handle registration submission
      const sheet = initializeSheet();

      // Prepare row data
      // House/007 is prefixed with an apostrophe so Google Sheets treats it as text
      // and preserves leading zeros (e.g., 007 instead of 7).
      const rowData = [
        new Date(data.timestamp),
        data.artistName,
        data.email,
        data.phone,
        data.house ? "'" + data.house : 'N/A',
        data.categories,
        data.age,
        saveScreenshotToDrive(data.paymentScreenshot, data.artistName)
      ];

      // Append the data to the sheet
      sheet.appendRow(rowData);

      result = {
        status: 'success',
        message: 'Registration received successfully'
      };
    }

    return createJsonResponse(result);

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Get all registrations from the sheet
 */
function getRegistrations() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return { registrations: [] };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const registrations = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      registrations.push({
        id: i,
        timestamp: row[0],
        name: row[1],
        email: row[2],
        phone: row[3],
        house: row[4],
        categories: row[5],
        age: row[6],
        comments: row[7],
        status: 'confirmed' // Default status, can be customized
      });
    }
    
    return { registrations };
  } catch (error) {
    return { registrations: [], error: error.toString() };
  }
}

/**
 * Get staff members from the sheet
 * @param {boolean} includeHidden - If true, returns all members including hidden ones
 */
function getStaff(includeHidden = false) {
  try {
    const sheet = initializeStaffSheet();
    const data = sheet.getDataRange().getValues();
    const staff = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const isVisible = row[6] === 'TRUE' || row[6] === true;

      if (includeHidden || isVisible) {
        staff.push({
          rowIndex: i + 1,
          name: row[0],
          role: row[1],
          bio: row[2],
          photo: row[3],
          socialLinks: row[4],
          displayOrder: row[5],
          isVisible: isVisible,
        });
      }
    }

    // Sort by display order
    staff.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

    return { staff };
  } catch (error) {
    return { staff: [], error: error.toString() };
  }
}

/**
 * Update an existing staff member row
 */
function updateStaff(data) {
  const sheet = initializeStaffSheet();
  const rowIndex = parseInt(data.rowIndex, 10);

  if (isNaN(rowIndex) || rowIndex < 2) {
    throw new Error('Invalid row index');
  }

  const row = [
    data.name || '',
    data.role || '',
    data.bio || '',
    data.photo || '',
    data.socialLinks || '',
    Number(data.displayOrder) || 0,
    data.isVisible ? 'TRUE' : 'FALSE',
  ];

  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);

  return { status: 'success', message: 'Staff member updated' };
}

/**
 * Delete a staff member row
 */
function deleteStaff(data) {
  const sheet = initializeStaffSheet();
  const rowIndex = parseInt(data.rowIndex, 10);

  if (isNaN(rowIndex) || rowIndex < 2) {
    throw new Error('Invalid row index');
  }

  sheet.deleteRow(rowIndex);

  return { status: 'success', message: 'Staff member deleted' };
}

/**
 * Toggle the visibility of a staff member
 */
function toggleStaffVisibility(data) {
  const sheet = initializeStaffSheet();
  const rowIndex = parseInt(data.rowIndex, 10);

  if (isNaN(rowIndex) || rowIndex < 2) {
    throw new Error('Invalid row index');
  }

  const isVisible = data.isVisible === true || data.isVisible === 'true' ? 'TRUE' : 'FALSE';
  sheet.getRange(rowIndex, 7).setValue(isVisible);

  return { status: 'success', isVisible: isVisible === 'TRUE' };
}

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;

  try {
    let result;

    if (action === 'getRegistrations') {
      result = getRegistrations();
    } else if (action === 'getStaff') {
      const includeHidden = e.parameter.includeHidden === 'true';
      result = getStaff(includeHidden);
    } else if (action === 'login') {
      result = verifyAdmin(e.parameter.email, e.parameter.password);
    } else {
      // Default response
      result = {
        status: 'online',
        message: 'Elite Way School Registration API is running',
        availableActions: [
          'getRegistrations',
          'getStaff',
          'login',
          'updateStaff',
          'deleteStaff',
          'toggleStaffVisibility',
        ]
      };
    }

    if (callback) {
      return createJsonpResponse(callback, result);
    }
    return createJsonResponse(result);

  } catch (error) {
    const errorResult = { status: 'error', message: error.toString() };
    if (callback) {
      return createJsonpResponse(callback, errorResult);
    }
    return createJsonResponse(errorResult);
  }
}

/**
 * Test function to verify the script works
 * Run this from the Apps Script editor to test
 */
function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        artistName: 'Test Artist',
        email: 'test@example.com',
        phone: '3001234567',
        house: 'House of Testing',
        categories: 'Realness, Face',
        age: '25',
        comments: 'This is a test submission'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
