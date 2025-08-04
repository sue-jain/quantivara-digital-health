import { parseImage, cleanOCRText } from '../../src/parser/imageParser';
import Tesseract from 'tesseract.js';

// Mock dependencies
jest.mock('tesseract.js');
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('imageParser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseImage', () => {
    it('should successfully perform OCR on an image', async () => {
      const mockResult = {
        data: {
          text: 'Extracted text from image',
          confidence: 92.5
        }
      };

      (Tesseract.recognize as jest.Mock).mockResolvedValue(mockResult);

      const result = await parseImage('/path/to/image.jpg');

      expect(Tesseract.recognize).toHaveBeenCalledWith(
        '/path/to/image.jpg',
        'eng',
        expect.any(Object)
      );
      expect(result).toEqual({
        text: 'Extracted text from image',
        confidence: 92.5
      });
    });

    it('should handle OCR progress logging', async () => {
      const mockResult = {
        data: {
          text: 'Test text',
          confidence: 85
        }
      };

      let progressCallback: any;
      (Tesseract.recognize as jest.Mock).mockImplementation((file, lang, options) => {
        progressCallback = options.logger;
        // Simulate progress updates
        progressCallback({ status: 'recognizing text', progress: 0.5 });
        progressCallback({ status: 'other status', progress: 0.8 });
        return Promise.resolve(mockResult);
      });

      await parseImage('/path/to/image.png');

      expect(Tesseract.recognize).toHaveBeenCalled();
    });

    it('should handle OCR errors', async () => {
      const error = new Error('OCR failed');
      (Tesseract.recognize as jest.Mock).mockRejectedValue(error);

      await expect(parseImage('/path/to/corrupt.jpg')).rejects.toThrow('Failed to perform OCR: OCR failed');
    });

    it('should handle non-Error exceptions', async () => {
      (Tesseract.recognize as jest.Mock).mockRejectedValue('String error');

      await expect(parseImage('/path/to/image.jpg')).rejects.toThrow('Failed to perform OCR: Unknown error');
    });

    it('should handle low confidence results', async () => {
      const mockResult = {
        data: {
          text: 'Poorly recognized text',
          confidence: 45.2
        }
      };

      (Tesseract.recognize as jest.Mock).mockResolvedValue(mockResult);

      const result = await parseImage('/path/to/blurry.jpg');

      expect(result.confidence).toBe(45.2);
      expect(result.text).toBe('Poorly recognized text');
    });
  });

  describe('cleanOCRText', () => {
    it('should replace pipe characters with I', () => {
      expect(cleanOCRText('He||o Wor|d')).toBe('HeIIo WorId');
    });

    it('should replace zeros with O when appropriate', () => {
      expect(cleanOCRText('Hell0 W0rld')).toBe('HellO WOrld');
    });

    it('should normalize whitespace', () => {
      expect(cleanOCRText('Hello   World\n\nTest  \t  Text')).toBe('Hello World Test Text');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(cleanOCRText('  Hello World  ')).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      expect(cleanOCRText('')).toBe('');
    });

    it('should handle strings with only whitespace', () => {
      expect(cleanOCRText('   \n\t  ')).toBe('');
    });

    it('should apply all transformations together', () => {
      expect(cleanOCRText('  He||0   W0r|d\n\nTest  ')).toBe('HeIIO WOrId Test');
    });

    it('should handle text with special characters', () => {
      expect(cleanOCRText('Dr. |ohn D0e - Patient')).toBe('Dr. Iohn DOe - Patient');
    });
  });
});