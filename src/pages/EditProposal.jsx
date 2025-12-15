import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function EditProposal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [proposal, setProposal] = useState(location.state?.proposal || {});

  const handleSave = () => {
    navigate('/view-proposal', { state: { proposal } });
  };

  const handleCancel = () => {
    navigate('/view-proposal');
  };

  return (
    <div className="edit-proposal-container">
      <h1>Edit Proposal</h1>
      <div className="edit-form">
        <input 
          type="text" 
          placeholder="Proposal Title"
          value={proposal.title || ''}
          onChange={(e) => setProposal({...proposal, title: e.target.value})}
        />
        <textarea 
          placeholder="Proposal Content"
          value={proposal.content || ''}
          onChange={(e) => setProposal({...proposal, content: e.target.value})}
        />
      </div>
      <div className="edit-actions">
        <button onClick={handleCancel} className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleSave} className="btn-primary">
          Save Changes
        </button>
      </div>
    </div>
  );
}
