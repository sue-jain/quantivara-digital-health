import { parsePDF, extractTablesFromText } from '../../src/parser/pdfParser';
import fs from 'fs';
import pdf from 'pdf-parse';

// Mock dependencies
jest.mock('fs');
jest.mock('pdf-parse');
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('pdfParser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parsePDF', () => {
    it('should successfully parse a PDF file', async () => {
      const mockPdfData = {
        text: 'Sample PDF content',
        numpages: 2,
        info: { Title: 'Test PDF' }
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('mock pdf data'));
      (pdf as jest.Mock).mockResolvedValue(mockPdfData);

      const result = await parsePDF('/path/to/test.pdf');

      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/test.pdf');
      expect(pdf).toHaveBeenCalledWith(Buffer.from('mock pdf data'));
      expect(result).toEqual({
        text: 'Sample PDF content',
        pages: 2,
        info: { Title: 'Test PDF' }
      });
    });

    it('should handle file read errors', async () => {
      const error = new Error('File not found');
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(parsePDF('/nonexistent.pdf')).rejects.toThrow('Failed to parse PDF: File not found');
    });

    it('should handle PDF parsing errors', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('mock pdf data'));
      (pdf as jest.Mock).mockRejectedValue(new Error('Invalid PDF'));

      await expect(parsePDF('/corrupt.pdf')).rejects.toThrow('Failed to parse PDF: Invalid PDF');
    });

    it('should handle non-Error exceptions', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('mock pdf data'));
      (pdf as jest.Mock).mockRejectedValue('String error');

      await expect(parsePDF('/test.pdf')).rejects.toThrow('Failed to parse PDF: Unknown error');
    });
  });

  describe('extractTablesFromText', () => {
    it('should extract tables with multiple spaces', () => {
      const text = `
Header1  Header2  Header3
Value1   Value2   Value3
Data1    Data2    Data3
      `;

      const tables = extractTablesFromText(text);
      
      expect(tables).toHaveLength(1);
      expect(tables[0]).toHaveLength(3);
      expect(tables[0][0]).toContain('Header1');
      expect(tables[0][1]).toContain('Value1');
      expect(tables[0][2]).toContain('Data1');
    });

    it('should extract tables with tabs', () => {
      const text = `
Test Name\tValue\tUnit\tNormal Range
Hemoglobin\t12.5\tg/dL\t12-15
Glucose\t95\tmg/dL\t70-100
      `;

      const tables = extractTablesFromText(text);
      
      expect(tables).toHaveLength(1);
      expect(tables[0]).toHaveLength(3);
      expect(tables[0][0]).toContain('Test Name');
    });

    it('should extract multiple tables', () => {
      const text = `
Table 1
Col1  Col2
Val1  Val2

Regular text here

Table 2
ColA\tColB
ValA\tValB
ValC\tValD
      `;

      const tables = extractTablesFromText(text);
      
      expect(tables).toHaveLength(2);
      expect(tables[0]).toHaveLength(2);
      expect(tables[1]).toHaveLength(3);
    });

    it('should handle empty text', () => {
      expect(extractTablesFromText('')).toEqual([]);
    });

    it('should handle text with no tables', () => {
      const text = 'This is just regular text\nWith no tabular data';
      expect(extractTablesFromText(text)).toEqual([]);
    });

    it('should ignore single-line tables', () => {
      const text = 'Header1  Header2  Header3\nRegular text';
      expect(extractTablesFromText(text)).toEqual([]);
    });

    it('should handle tables at the end of text', () => {
      const text = `
Regular text

Table Data
Col1  Col2
Val1  Val2
Val3  Val4`;

      const tables = extractTablesFromText(text);
      expect(tables).toHaveLength(1);
      expect(tables[0]).toHaveLength(3);
    });
  });
});