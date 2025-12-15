import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewProposal from "./pages/ViewProposal";
import ProposalSubmitted from "./pages/ProposalSubmitted";
import EditProposal from "./pages/EditProposal";
import ProposalSuccess from "./pages/ProposalSuccess";
import ViewProposalGenerator from "./pages/ViewProposalGenerator";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* ...existing routes... */}
        <Route path="/view-proposal" element={<ViewProposal />} />
        <Route path="/edit-proposal" element={<EditProposal />} />
        <Route path="/proposal-submitted" element={<ProposalSubmitted />} />
        <Route path="/proposal-success" element={<ProposalSuccess />} />
        <Route path="/view-proposal-generator" element={<ViewProposalGenerator />} />
      </Routes>
    </div>
  );
}

export default App;