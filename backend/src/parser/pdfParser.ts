import fs from 'fs';
import pdf from 'pdf-parse';
import { logger } from '../utils/logger';

export interface PDFParseResult {
  text: string;
  pages: number;
  info: any;
}

export async function parsePDF(filePath: string): Promise<PDFParseResult> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    logger.info(`PDF parsed successfully: ${data.numpages} pages, ${data.text.length} characters`);
    
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (error) {
    logger.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Extract tables from PDF text (basic implementation)
export function extractTablesFromText(text: string): string[][] {
  const lines = text.split('\n').filter(line => line.trim());
  const tables: string[][] = [];
  let currentTable: string[] = [];
  let inTable = false;
  
  for (const line of lines) {
    // Simple heuristic: if line has multiple spaces or tabs, it might be tabular data
    if (line.includes('  ') || line.includes('\t')) {
      inTable = true;
      currentTable.push(line);
    } else if (inTable && currentTable.length > 0) {
      if (currentTable.length > 1) {
        tables.push([...currentTable]);
      }
      currentTable = [];
      inTable = false;
    }
  }
  
  // Don't forget the last table
  if (currentTable.length > 1) {
    tables.push(currentTable);
  }
  
  return tables;
}