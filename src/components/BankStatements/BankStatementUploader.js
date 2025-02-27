import React, { useState } from 'react';
import './BankStatementStyles.css';

const BankStatementUploader = () => {
  const [files, setFiles] = useState([]);
  const [bankType, setBankType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    if (!bankType) {
      setError('Please select a bank type');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    // In a real app, we would process the files here
    setTimeout(() => {
      alert('File upload feature will be implemented in the next phase.');
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="bank-statement-uploader">
      <h2>Upload Bank Statement</h2>
      
      {error && <div className="upload-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="bankType">Select Bank</label>
          <select
            id="bankType"
            value={bankType}
            onChange={(e) => setBankType(e.target.value)}
            required
          >
            <option value="">-- Select Bank --</option>
            <option value="icici">ICICI Bank</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="axis">Axis Bank</option>
            <option value="sbi">State Bank of India</option>
            <option value="kotak">Kotak Mahindra Bank</option>
            <option value="yes">Yes Bank</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="files">Upload Statement Files</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="files"
              multiple
              onChange={handleFileChange}
              accept=".csv,.xls,.xlsx,.pdf"
              className="file-input"
            />
            <div className="file-upload-box">
              <p>Drag & drop files here or click to browse</p>
              <span className="file-types">Supported formats: CSV, XLS, XLSX, PDF</span>
            </div>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="selected-files">
            <p>Selected files:</p>
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          type="submit" 
          className="upload-button"
          disabled={isUploading}
        >
          {isUploading ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>
    </div>
  );
};

export default BankStatementUploader;