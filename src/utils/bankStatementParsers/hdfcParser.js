// HDFC Bank statement parser
import Papa from 'papaparse';

export const parseHDFCStatement = (fileContent, fileType) => {
  // For CSV files
  if (fileType === 'csv') {
    return parseHDFCCSV(fileContent);
  }
  // For Excel files, we would parse them differently
  return [];
};

const parseHDFCCSV = (csvContent) => {
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
    .filter(row => row.Date && (row['Withdrawal Amt(INR)'] || row['Deposit Amt(INR)']))
    .map(row => {
      const amount = row['Withdrawal Amt(INR)'] 
        ? parseFloat(row['Withdrawal Amt(INR)'].replace(/,/g, ''))
        : parseFloat(row['Deposit Amt(INR)'].replace(/,/g, ''));
      
      return {
        date: formatDate(row.Date),
        description: row['Narration'] || '',
        amount: Math.abs(amount),
        type: row['Withdrawal Amt(INR)'] ? 'debit' : 'credit',
        balance: parseFloat(row['Closing Balance(INR)'].replace(/,/g, '')),
        category: guessCategory(row['Narration'] || ''),
      };
    });
};

// Helper function to format date
const formatDate = (dateString) => {
  // HDFC format could be DD/MM/YY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    let year = parts[2];
    // Add prefix for 2-digit years
    if (year.length === 2) {
      year = '20' + year;
    }
    return `${year}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
  }
  return dateString;
};

// Reuse the same category guessing logic
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

export default parseHDFCStatement;