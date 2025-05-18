const { google } = require('googleapis');

// Initialize the Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const formData = JSON.parse(event.body);
    
    // Get the spreadsheet ID from environment variable
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // Prepare the row data
    const row = [
      new Date().toISOString(), // Timestamp
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.service || '',
      formData.message || '',
    ];

    // Append the row to the spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F', // Adjust based on your sheet's columns
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully added to spreadsheet' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add to spreadsheet' }),
    };
  }
}; 