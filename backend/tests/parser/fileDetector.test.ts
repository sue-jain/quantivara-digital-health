import { detectFileType, getMimeType } from '../../src/parser/fileDetector';

describe('fileDetector', () => {
  describe('detectFileType', () => {
    it('should detect PDF files correctly', () => {
      expect(detectFileType('document.pdf')).toBe('pdf');
      expect(detectFileType('Document.PDF')).toBe('pdf');
      expect(detectFileType('/path/to/file.pdf')).toBe('pdf');
    });

    it('should detect image files correctly', () => {
      expect(detectFileType('image.jpg')).toBe('image');
      expect(detectFileType('image.jpeg')).toBe('image');
      expect(detectFileType('image.JPG')).toBe('image');
      expect(detectFileType('image.JPEG')).toBe('image');
      expect(detectFileType('image.png')).toBe('image');
      expect(detectFileType('image.PNG')).toBe('image');
      expect(detectFileType('/path/to/image.jpg')).toBe('image');
    });

    it('should return unsupported for unknown file types', () => {
      expect(detectFileType('document.txt')).toBe('unsupported');
      expect(detectFileType('file.doc')).toBe('unsupported');
      expect(detectFileType('spreadsheet.xlsx')).toBe('unsupported');
      expect(detectFileType('noextension')).toBe('unsupported');
      expect(detectFileType('')).toBe('unsupported');
    });

    it('should handle edge cases', () => {
      expect(detectFileType('file.pdf.txt')).toBe('unsupported');
      expect(detectFileType('.pdf')).toBe('unsupported'); // Fixed: files starting with . have empty extension
      expect(detectFileType('multiple.dots.in.name.png')).toBe('image');
    });
  });

  describe('getMimeType', () => {
    it('should return correct mime type for PDF', () => {
      expect(getMimeType('document.pdf')).toBe('application/pdf');
      expect(getMimeType('Document.PDF')).toBe('application/pdf');
    });

    it('should return correct mime type for JPEG images', () => {
      expect(getMimeType('image.jpg')).toBe('image/jpeg');
      expect(getMimeType('image.jpeg')).toBe('image/jpeg');
      expect(getMimeType('IMAGE.JPG')).toBe('image/jpeg');
      expect(getMimeType('IMAGE.JPEG')).toBe('image/jpeg');
    });

    it('should return correct mime type for PNG images', () => {
      expect(getMimeType('image.png')).toBe('image/png');
      expect(getMimeType('IMAGE.PNG')).toBe('image/png');
    });

    it('should return default mime type for unknown extensions', () => {
      expect(getMimeType('file.txt')).toBe('application/octet-stream');
      expect(getMimeType('file.doc')).toBe('application/octet-stream');
      expect(getMimeType('noextension')).toBe('application/octet-stream');
      expect(getMimeType('')).toBe('application/octet-stream');
    });

    it('should handle edge cases', () => {
      expect(getMimeType('.pdf')).toBe('application/octet-stream'); // Fixed: files starting with . have empty extension
      expect(getMimeType('file.pdf.txt')).toBe('application/octet-stream');
      expect(getMimeType('multiple.dots.png')).toBe('image/png');
    });
  });
});