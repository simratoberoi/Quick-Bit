import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProposalSuccess() {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    // PDF download logic - integrate with html2pdf or jsPDF
    console.log('Downloading PDF...');
  };

  const handleBackHome = () => {
    navigate('/new-rfps');
  };

  return (
    <div className="success-container">
      <div className="success-message">
        <h1>Proposal Submitted</h1>
        <p>Your proposal has been successfully submitted.</p>
      </div>
      <div className="success-actions">
        <button onClick={handleDownloadPDF} className="btn-primary">
          Download PDF
        </button>
        <button onClick={handleBackHome} className="btn-secondary">
          Back to New RFPs
        </button>
      </div>
    </div>
  );
}

