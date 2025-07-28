import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DocumentProcessor from './DocumentProcessor';

const DocumentProcessorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <DocumentProcessor />
      </main>
      <Footer />
    </div>
  );
};

export default DocumentProcessorPage;