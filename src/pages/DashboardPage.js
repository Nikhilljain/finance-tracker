import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import BankStatementUploader from '../components/BankStatements/BankStatementUploader';

const DashboardPage = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {currentUser ? currentUser.name : 'User'}!</h1>
      <p>This is your financial dashboard</p>
      
      <div className="dashboard-section">
        <BankStatementUploader />
      </div>
    </div>
  );
};

export default DashboardPage;