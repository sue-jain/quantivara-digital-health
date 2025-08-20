import path from 'path';

export type FileType = 'pdf' | 'image' | 'text' | 'unsupported';

export function detectFileType(filePath: string): FileType {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return 'pdf';
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'image';
    case '.txt':
      return 'text';
    default:
      return 'unsupported';
  }
}

export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.txt': 'text/plain'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}