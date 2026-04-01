import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import DocumentProcessor from '../DocumentProcessor';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('DocumentProcessor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders document processor page with correct title', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    expect(screen.getByText('AI Document Processor')).toBeInTheDocument();
    expect(screen.getByText('Upload medical documents for instant AI-powered data extraction')).toBeInTheDocument();
  });

  test('shows upload area with correct text', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    expect(screen.getByText('Drag & drop medical documents here, or click to select')).toBeInTheDocument();
    expect(screen.getByText('Supports prescriptions, lab reports, ECG reports (PNG, JPG, PDF)')).toBeInTheDocument();
  });

  test('shows sample document buttons', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    expect(screen.getByText('Try with Sample Documents:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prescription' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lab Report' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ECG Report' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'X-Ray Report' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ayurvedic Rx' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discharge Summary' })).toBeInTheDocument();
  });

  test('has file input for uploads', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('multiple');
  });

  test('shows upload icon', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    const uploadIcon = document.querySelector('.lucide-upload');
    expect(uploadIcon).toBeInTheDocument();
  });

  // Test detectDocumentType function indirectly through component behavior
  test('component renders without crashing', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    expect(screen.getByText('AI Document Processor')).toBeInTheDocument();
  });

  test('has proper accessibility structure', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    expect(screen.getByRole('heading', { name: 'AI Document Processor' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Try with Sample Documents:' })).toBeInTheDocument();
  });

  test('upload area has proper styling classes', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    const dropzoneArea = screen.getByText('Drag & drop medical documents here, or click to select').closest('div');
    expect(dropzoneArea).toHaveClass('border-2', 'border-dashed', 'rounded-lg');
  });

  test('sample buttons have proper styling', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    const prescriptionButton = screen.getByRole('button', { name: 'Prescription' });
    expect(prescriptionButton).toHaveClass('text-xs');
  });

  test('container has proper max width', () => {
    render(
      <MockWrapper>
        <DocumentProcessor />
      </MockWrapper>
    );
    
    const container = screen.getByText('AI Document Processor').closest('.container');
    expect(container).toHaveClass('max-w-6xl');
  });
});