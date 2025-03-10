import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Step,
  Stepper,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import { CloudUpload, Check } from '@mui/icons-material';
import { useFinance } from '../contexts/FinanceContext';
import { formatCurrency } from '../utils/helpers';

// Rules for automatic categorization
const CATEGORIZATION_RULES = {
  // Investment & Trading
  'zerodha': 'Investments',
  'groww': 'Investments',
  'upstox': 'Investments',
  'mutual fund': 'Investments',
  'mf': 'Investments',
  'stocks': 'Investments',
  'demat': 'Investments',
  'trading': 'Investments',
  'coin': 'Investments',
  'bse': 'Investments',
  'nse': 'Investments',

  // Housing related
  'rent': 'Housing',
  'mortgage': 'Housing',
  'apartment': 'Housing',
  'property': 'Housing',
  'maintenance': 'Housing',
  'society': 'Housing',
  'electricity': 'Housing',
  'power': 'Housing',
  'water': 'Housing',
  'gas': 'Housing',

  // Transportation
  'uber': 'Transportation',
  'ola': 'Transportation',
  'rapido': 'Transportation',
  'metro': 'Transportation',
  'train': 'Transportation',
  'irctc': 'Transportation',
  'railway': 'Transportation',
  'parking': 'Transportation',
  'petrol': 'Transportation',
  'diesel': 'Transportation',
  'fuel': 'Transportation',
  'fastag': 'Transportation',

  // Food & Dining
  'swiggy': 'Food & Dining',
  'zomato': 'Food & Dining',
  'restaurant': 'Food & Dining',
  'cafe': 'Food & Dining',
  'coffee': 'Food & Dining',
  'hotel': 'Food & Dining',
  'food': 'Food & Dining',
  'grocery': 'Food & Dining',
  'bigbasket': 'Food & Dining',
  'blinkit': 'Food & Dining',
  'zepto': 'Food & Dining',
  'dunzo': 'Food & Dining',
  'instamart': 'Food & Dining',
  'dmart': 'Food & Dining',
  'nature basket': 'Food & Dining',

  // Shopping
  'amazon': 'Shopping',
  'flipkart': 'Shopping',
  'myntra': 'Shopping',
  'ajio': 'Shopping',
  'meesho': 'Shopping',
  'mall': 'Shopping',
  'retail': 'Shopping',
  'store': 'Shopping',
  'market': 'Shopping',
  'shop': 'Shopping',

  // Bills & Utilities
  'airtel': 'Bills & Utilities',
  'jio': 'Bills & Utilities',
  'vi': 'Bills & Utilities',
  'vodafone': 'Bills & Utilities',
  'idea': 'Bills & Utilities',
  'mobile': 'Bills & Utilities',
  'broadband': 'Bills & Utilities',
  'wifi': 'Bills & Utilities',
  'internet': 'Bills & Utilities',
  'dth': 'Bills & Utilities',
  'tata sky': 'Bills & Utilities',
  'dish tv': 'Bills & Utilities',

  // Insurance
  'insurance': 'Insurance',
  'lic': 'Insurance',
  'policy': 'Insurance',
  'premium': 'Insurance',
  'health insurance': 'Insurance',
  'car insurance': 'Insurance',
  'bike insurance': 'Insurance',
  'term': 'Insurance',

  // Healthcare
  'medical': 'Healthcare',
  'doctor': 'Healthcare',
  'hospital': 'Healthcare',
  'clinic': 'Healthcare',
  'pharmacy': 'Healthcare',
  'medicine': 'Healthcare',
  'apollo': 'Healthcare',
  'medplus': 'Healthcare',
  'diagnostic': 'Healthcare',
  'lab': 'Healthcare',

  // Entertainment
  'netflix': 'Entertainment',
  'prime': 'Entertainment',
  'hotstar': 'Entertainment',
  'disney': 'Entertainment',
  'spotify': 'Entertainment',
  'movie': 'Entertainment',
  'cinema': 'Entertainment',
  'pvr': 'Entertainment',
  'inox': 'Entertainment',
  'bookmyshow': 'Entertainment',
  'game': 'Entertainment',
  'gaming': 'Entertainment',

  // Education
  'school': 'Education',
  'college': 'Education',
  'university': 'Education',
  'course': 'Education',
  'tuition': 'Education',
  'class': 'Education',
  'training': 'Education',
  'udemy': 'Education',
  'coursera': 'Education',
  'upgrad': 'Education',
  'byju': 'Education',
  'unacademy': 'Education',

  // Income indicators
  'salary': 'Income',
  'deposit': 'Income',
  'credit': 'Income',
  'payment received': 'Income',
  'interest': 'Income',
  'dividend': 'Income',
  'refund': 'Income',
  'cashback': 'Income',
  'reimbursement': 'Income',
};

function categorizeTransaction(description) {
  description = description.toLowerCase();
  
  // Handle UPI transactions
  if (description.includes('upi')) {
    // Extract the merchant/recipient name from UPI ID
    const upiMatch = description.match(/@([^-]+)/);
    if (upiMatch) {
      const merchant = upiMatch[1].toLowerCase();
      // Check merchant name against rules
      for (const [keyword, category] of Object.entries(CATEGORIZATION_RULES)) {
        if (merchant.includes(keyword.toLowerCase())) {
          return category;
        }
      }
    }
  }

  // Check full description against rules
  for (const [keyword, category] of Object.entries(CATEGORIZATION_RULES)) {
    if (description.includes(keyword.toLowerCase())) {
      return category;
    }
  }

  // Additional patterns for common Indian transaction descriptions
  if (description.match(/(?:credited|cr|credit)/i) && !description.match(/card|loan|emi/i)) {
    return 'Income';
  }
  
  if (description.match(/(?:debited|dr|debit)/i)) {
    // Look for common payment patterns
    if (description.match(/(?:bill payment|bill pay)/i)) return 'Bills & Utilities';
    if (description.match(/(?:recharge|prepaid)/i)) return 'Bills & Utilities';
    if (description.match(/(?:emi|loan)/i)) return 'Loan Payment';
    if (description.match(/(?:investment|trading|share|stock)/i)) return 'Investments';
  }

  return 'Other';
}

const steps = ['Upload Statement', 'Review Transactions', 'Import Complete'];

export default function ImportTransactions({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [parsedTransactions, setParsedTransactions] = useState([]);
  const [importing, setImporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addTransaction } = useFinance();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          console.log('Raw file content:', text);
          
          // Parse CSV data and clean up any BOM characters
          const cleanText = text.replace(/^\uFEFF/, '');
          const lines = cleanText.split(/\r?\n/)
            .filter(line => line.trim())
            .map(line => line.trim()); // Clean up each line
          
          console.log('All lines:', lines);
          
          if (lines.length < 2) {
            throw new Error('File appears to be empty or invalid');
          }

          // For HDFC Bank statements, find the actual transaction data start
          let headerRowIndex = -1;
          let transactionStartIndex = -1;

          // First look for the transaction header row
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            console.log(`Checking line ${i} for transaction headers:`, lines[i]);
            
            // Look for common HDFC transaction header patterns
            if (line.includes('date') && 
               (line.includes('narration') || line.includes('description') || line.includes('particulars')) && 
               (line.includes('debit') || line.includes('credit') || line.includes('amount') || line.includes('chq'))) {
              headerRowIndex = i;
              transactionStartIndex = i + 1;
              console.log('Found transaction header at line:', i);
              break;
            }
          }

          // If no header found, look for date patterns that typically indicate start of transactions
          if (headerRowIndex === -1) {
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              // Look for date in DD/MM/YY or DD/MM/YYYY format
              if (line.match(/\d{2}\/\d{2}\/(\d{2}|\d{4})/)) {
                // Found a line with a date - this is likely where transactions start
                headerRowIndex = i - 1; // Header is typically the line before
                transactionStartIndex = i;
                console.log('Found first transaction at line:', i);
                break;
              }
            }
          }

          if (headerRowIndex === -1) {
            throw new Error('Could not find the transaction header row in the CSV file');
          }

          // Get the header line and split it into columns
          const headerLine = lines[headerRowIndex];
          console.log('Transaction header line:', headerLine);
          
          // Split the header line and clean up the column names
          const headers = headerLine.split(',')
            .map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
          
          console.log('Processed headers:', headers);

          // Find column indices with more flexible matching for HDFC format
          const findColumnIndex = (patterns) => {
            const index = headers.findIndex(h => patterns.some(p => h.includes(p)));
            console.log(`Looking for patterns ${patterns.join(', ')}, found at index:`, index);
            return index;
          };

          const dateIndex = findColumnIndex(['date', 'dt']);
          const descriptionIndex = findColumnIndex(['narration', 'description', 'particulars']);
          const debitIndex = findColumnIndex(['debit', 'withdrawal', 'dr']);
          const creditIndex = findColumnIndex(['credit', 'deposit', 'cr']);

          console.log('Column indices:', { dateIndex, descriptionIndex, debitIndex, creditIndex });

          if (dateIndex === -1) {
            throw new Error('Could not find Date column');
          }
          if (descriptionIndex === -1) {
            throw new Error('Could not find Description/Narration column');
          }
          if (debitIndex === -1 && creditIndex === -1) {
            throw new Error('Could not find Debit/Credit columns');
          }

          // Process transactions
          const transactions = lines.slice(transactionStartIndex)
            .map((line, lineIndex) => {
              try {
                const values = line.split(',').map(v => v.trim());
                
                if (values.length < Math.max(dateIndex, descriptionIndex, debitIndex || 0, creditIndex || 0) + 1) {
                  return null;
                }

                const date = values[dateIndex];
                const description = values[descriptionIndex];
                const debitAmount = debitIndex !== -1 ? values[debitIndex].replace(/[^\d.-]/g, '') : '0';
                const creditAmount = creditIndex !== -1 ? values[creditIndex].replace(/[^\d.-]/g, '') : '0';
                
                // Skip if this doesn't look like a transaction line
                if (!date.match(/\d{2}\/\d{2}\/(\d{2}|\d{4})/)) {
                  return null;
                }

                const amount = parseFloat(debitAmount) || parseFloat(creditAmount);
                const isCredit = Boolean(parseFloat(creditAmount));

                if (!date || !description || isNaN(amount)) {
                  return null;
                }

                // Parse date (DD/MM/YY or DD/MM/YYYY format)
                const [day, month, yearPart] = date.split('/');
                const year = yearPart.length === 2 ? '20' + yearPart : yearPart;
                const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                const category = categorizeTransaction(description);
                
                return {
                  date: formattedDate,
                  description: description,
                  amount: Math.abs(amount),
                  type: isCredit ? 'income' : 'expense',
                  category: isCredit ? 'Income' : category,
                };
              } catch (error) {
                console.warn(`Error processing line ${lineIndex + transactionStartIndex + 1}:`, error);
                return null;
              }
            })
            .filter(Boolean);

          if (transactions.length === 0) {
            throw new Error('No valid transactions found in file');
          }

          console.log('Successfully parsed transactions:', transactions.length);
          setParsedTransactions(transactions);
          setActiveStep(1);
        } catch (error) {
          console.error('Error parsing file:', error);
          alert(`Error parsing file: ${error.message}`);
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
        setUploading(false);
      };

      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      // Import transactions in batches
      for (const transaction of parsedTransactions) {
        await addTransaction(transaction);
      }
      setActiveStep(2);
    } catch (error) {
      console.error('Import failed:', error);
    }
    setImporting(false);
  };

  const handleClose = () => {
    setActiveStep(0);
    setParsedTransactions([]);
    setUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Bank Statement</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ py: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                size="large"
                startIcon={<CloudUpload />}
                disabled={uploading}
              >
                {uploading ? 'Processing...' : 'Upload Bank Statement'}
              </Button>
            </label>
            {uploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Processing your file...
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Supported format: CSV
            </Typography>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Found {parsedTransactions.length} transactions
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsedTransactions.slice(0, 5).map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.category}
                          size="small"
                          color={transaction.type === 'income' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.type}
                          size="small"
                          color={transaction.type === 'income' ? 'success' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {parsedTransactions.length > 5 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Showing 5 of {parsedTransactions.length} transactions
              </Typography>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Check color="success" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Import Complete!
            </Typography>
            <Typography color="text.secondary">
              Successfully imported {parsedTransactions.length} transactions
            </Typography>
          </Box>
        )}

        {importing && <LinearProgress sx={{ mt: 2 }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {activeStep === 2 ? 'Close' : 'Cancel'}
        </Button>
        {activeStep === 1 && (
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={importing}
          >
            Import Transactions
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
} 