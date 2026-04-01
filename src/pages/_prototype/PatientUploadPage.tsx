import React from 'react';
import DocumentProcessor from './DocumentProcessor';

// Renders the upload UI inside the patient shell without replacing the sidebar
const PatientUploadPage: React.FC = () => {
  return <DocumentProcessor />;
};

export default PatientUploadPage;


