import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewRFPs = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* ...existing code... */}
      <button 
        onClick={() => navigate('/view-proposal')}
        className="btn-primary"
      >
        View Proposal
      </button>
      {/* ...existing code... */}
    </div>
  );
};

export default NewRFPs;