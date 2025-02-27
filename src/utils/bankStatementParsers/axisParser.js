// Axis Bank statement parser
import Papa from 'papaparse';

export const parseAxisStatement = (fileContent, fileType) => {
  // For CSV files
  if (fileType === 'csv') {
    return parseAxisCSV(fileContent);
  }
  // For Excel files, we would parse them differently
  return [];
};

const parseAxisCSV = (csvContent) => {
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
    .filter(row => row['Tran Date'] && (row['Debit'] || row['Credit']))
    .map(row => {
      const amount = row['Debit'] 
        ? parseFloat(row['Debit'].replace(/,/g, ''))
        : parseFloat(row['Credit'].replace(/,/g, ''));
      
      return {
        date: formatDate(row['Tran Date']),
        description: row['Particulars'] || '',
        amount: Math.abs(amount),
        type: row['Debit'] ? 'debit' : 'credit',
        balance: parseFloat(row['Balance'].replace(/,/g, '')),
        category: guessCategory(row['Particulars'] || ''),
      };
    });
};

// Helper function to format date
const formatDate = (dateString) => {
  // Axis format is typically DD-MM-YYYY
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
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

export default parseAxisStatement;