import parseICICIStatement from './iciciParser';
import parseHDFCStatement from './hdfcParser';
import parseAxisStatement from './axisParser';
import { read, utils } from 'xlsx';

// For Excel files
const parseExcelFile = (fileData, parser) => {
  // Convert array buffer to binary string
  const workbook = read(fileData, { type: 'array' });
  
  // Get first worksheet
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  
  // Convert to JSON
  const jsonData = utils.sheet_to_json(worksheet);
  
  // Convert to CSV format
  const csvData = utils.sheet_to_csv(worksheet);
  
  // Use the appropriate parser based on detected headers
  return parser(csvData, 'csv');
};

// Main parser function that detects file type and bank
export const parseStatement = (file, fileContent, bankType) => {
  const fileType = file.name.split('.').pop().toLowerCase();
  
  if (fileType === 'csv') {
    // For CSV files
    switch (bankType) {
      case 'icici':
        return parseICICIStatement(fileContent, 'csv');
      case 'hdfc':
        return parseHDFCStatement(fileContent, 'csv');
      case 'axis':
        return parseAxisStatement(fileContent, 'csv');
      default:
        console.error('Unsupported bank type:', bankType);
        return [];
    }
  } else if (fileType === 'xlsx' || fileType === 'xls') {
    // For Excel files
    switch (bankType) {
      case 'icici':
        return parseExcelFile(fileContent, parseICICIStatement);
      case 'hdfc':
        return parseExcelFile(fileContent, parseHDFCStatement);
      case 'axis':
        return parseExcelFile(fileContent, parseAxisStatement);
      default:
        console.error('Unsupported bank type:', bankType);
        return [];
    }
  } else {
    console.error('Unsupported file type:', fileType);
    return [];
  }
};

export { parseICICIStatement, parseHDFCStatement, parseAxisStatement };