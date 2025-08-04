import path from 'path';

export type FileType = 'pdf' | 'image' | 'unsupported';

export function detectFileType(filePath: string): FileType {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return 'pdf';
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'image';
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
    '.png': 'image/png'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}