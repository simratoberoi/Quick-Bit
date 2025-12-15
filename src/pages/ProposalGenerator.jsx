import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProposalGenerator = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* ...existing code... */}
      <button 
        onClick={() => navigate('/view-proposal-generator')}
        className="btn-primary"
      >
        View Proposal
      </button>
      {/* ...existing code... */}
    </div>
  );
};

export default ProposalGenerator;