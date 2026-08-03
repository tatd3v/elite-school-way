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
const ADMINS_SHEET_NAME = 'Admins';
const STAFF_SHEET_NAME = 'Staff';

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
    
    // Add default staff members
    sheet.appendRow([
      'DJ Fierce',
      'Official DJ',
      'Spinning ballroom culture beats since 2015',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtIgOIiZRxVtCbD81LtdX53nJZtkD6S05KtTyulzJ9nxdqb6Wcew5on-4tcCqfeanwjKF045jePxaI-uO7K_5N3NR2s-OTIT8GnPl84EigaiEsVoEHrV2YO3MXvQKE2h4iSZAybLv7xjDxukhUvMytF2Fc6V5DYYRUAQYal1iD50WXGdqxpKfycVepBsOx07vTNg8U1ibY9JGA0bP61xjR6tCOyVHpSJGjNTaStiTFALfOi8_kSOXQ',
      'instagram.com/djfierce',
      1,
      'TRUE'
    ]);
    sheet.appendRow([
      'Prof. Enrique Madrigal',
      'Director de Gala',
      'Leading Elite Way School ballroom events with elegance and precision',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWU46qmVq2SfRzbea-dALxTLfoMkNgmRegWMbf1oaVPMBIyob3RCWE-woPgneMTgPAN2n4CQjMf79lc-5aUlZfHkJLKW6YvwZaY7w9bTFRcb7mBjMag7EhS7P8-cygo6VGf_eb95Dgm4mXxm2yUYkk2KJhuVuvF1KKlEymRWnr8eKVCP-Z2xERa42u9qCY8ghVrePJMy1ffwozuuyspSbqEzvEzrkFde0VRhpKs6m62VuJOeN_sM11',
      'instagram.com/prof.madrigal',
      2,
      'TRUE'
    ]);
    sheet.appendRow([
      'Sebastian de la Fuente',
      'Maestro de Ceremonia',
      'Your charismatic host bringing energy to every ballroom moment',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoU21leSPDgDVRJ4FiTRFmmuLPg0pwlm4bxsQAH3LlkzkrFqqjb1pEY7inOEV617_m0CwxV1vjFDXKEqqbkb0SaoOtlArSlkjAieiAiV79QSBRz799AXM2iHdgl61vwKZtw8UtZJLx2raMm9JCF3N1Fr6DoNTB-NvEbex8Iv4b8eGrO9dJW93EN17DHlt6w0retsHc6VOxBB_t-he4-s_sZRoDyj4hmYyLcOpO5P_LSIOFGG9tsWV7',
      'instagram.com/sebastianmc',
      3,
      'TRUE'
    ]);
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
      'Comentarios'
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
    
    // Handle admin login request
    if (data.action === 'login') {
      const result = verifyAdmin(data.email, data.password);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
      data.comments
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Registration received successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
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
 * Get all staff members from the sheet
 */
function getStaff() {
  try {
    const sheet = initializeStaffSheet();
    const data = sheet.getDataRange().getValues();
    const staff = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Check if visible (column index 6)
      if (row[6] === 'TRUE' || row[6] === true) {
        staff.push({
          name: row[0],
          role: row[1],
          bio: row[2],
          photo: row[3],
          socialLinks: row[4],
          displayOrder: row[5],
          isVisible: row[6]
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
 * Handle GET requests
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getRegistrations') {
      const result = getRegistrations();
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'getStaff') {
      const result = getStaff();
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'online',
        message: 'Elite Way School Registration API is running',
        availableActions: ['getRegistrations', 'getStaff']
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
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
