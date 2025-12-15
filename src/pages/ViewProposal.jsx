import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ViewProposal() {
  const navigate = useNavigate();
  const [proposal, setProposal] = useState({
    title: 'Proposal Title',
    content: 'Full proposal content here',
  });

  const handleSubmitProposal = () => {
    navigate('/proposal-submitted');
  };

  const handleEditProposal = () => {
    navigate('/edit-proposal', { state: { proposal } });
  };

  return (
    <div className="view-proposal-container">
      <h1>Your Proposal</h1>
      <div className="proposal-content">
        <div className="proposal-details">
          <h2>{proposal.title}</h2>
          <p>{proposal.content}</p>
        </div>
      </div>
      <div className="proposal-actions">
        <button onClick={handleEditProposal} className="btn-secondary">
          Edit
        </button>
        <button onClick={handleSubmitProposal} className="btn-primary">
          Submit Proposal
        </button>
      </div>
    </div>
  );
}
