// ICICI Bank statement parser
import Papa from 'papaparse';

export const parseICICIStatement = (fileContent, fileType) => {
  // For CSV files
  if (fileType === 'csv') {
    return parseICICICSV(fileContent);
  } 
  // For Excel files, we would parse them differently
  // This would need the xlsx library
  return [];
};

const parseICICICSV = (csvContent) => {
  const results = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });
  
  if (results.errors.length > 0) {
    console.error('Error parsing CSV:', results.errors);
    return [];
  }
  
  // Map the parsed data to our transaction format
  return results.data
    .filter(row => row.Date && (row['Withdrawal Amt.'] || row['Deposit Amt.']))
    .map(row => {
      const amount = row['Withdrawal Amt.'] 
        ? parseFloat(row['Withdrawal Amt.'].replace(/,/g, ''))
        : parseFloat(row['Deposit Amt.'].replace(/,/g, ''));
      
      return {
        date: formatDate(row.Date),
        description: row['Transaction Remarks'] || row['Particulars'] || '',
        amount: Math.abs(amount),
        type: row['Withdrawal Amt.'] ? 'debit' : 'credit',
        balance: parseFloat(row['Balance'].replace(/,/g, '')),
        category: guessCategory(row['Transaction Remarks'] || row['Particulars'] || ''),
      };
    });
};

// Helper function to format date
const formatDate = (dateString) => {
  // ICICI format is typically DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
  }
  return dateString;
};

// Simple category guessing logic
const guessCategory = (description) => {
  description = description.toLowerCase();
  
  if (description.includes('salary') || description.includes('credit interest')) {
    return 'Income';
  } else if (description.includes('swiggy') || description.includes('zomato') || 
             description.includes('restaurant') || description.includes('cafe')) {
    return 'Food';
  } else if (description.includes('grocery') || description.includes('supermarket') || 
             description.includes('bigbasket') || description.includes('blinkit')) {
    return 'Grocery';
  } else if (description.includes('uber') || description.includes('ola') || 
             description.includes('metro') || description.includes('petrol')) {
    return 'Transportation';
  } else if (description.includes('amazon') || description.includes('flipkart') || 
             description.includes('myntra')) {
    return 'Shopping';
  } else if (description.includes('netflix') || description.includes('hotstar') || 
             description.includes('prime') || description.includes('theater')) {
    return 'Entertainment';
  } else if (description.includes('electricity') || description.includes('water') || 
             description.includes('gas') || description.includes('broadband')) {
    return 'Utilities';
  } else if (description.includes('rent')) {
    return 'Housing';
  } else if (description.includes('hospital') || description.includes('doctor') || 
             description.includes('medical') || description.includes('pharmacy')) {
    return 'Healthcare';
  }
  
  return 'Miscellaneous';
};

export default parseICICIStatement;