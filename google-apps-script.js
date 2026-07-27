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

// Name of the sheet where data will be stored
const SHEET_NAME = 'Registrations';

/**
 * Initialize the sheet with headers if it doesn't exist
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
  
  return sheet;
}

/**
 * Handle POST requests from the form
 */
function doPost(e) {
  try {
    const sheet = initializeSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Prepare row data
    const rowData = [
      new Date(data.timestamp),
      data.artistName,
      data.email,
      data.phone,
      data.house,
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
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'online',
      message: 'Elite Way School Registration API is running' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
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
