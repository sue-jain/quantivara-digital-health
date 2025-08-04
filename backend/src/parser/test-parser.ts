import { parseDocument } from './documentParser';
import path from 'path';

async function testParser() {
  // Test with a sample file
  const testFile = path.join(__dirname, '../../../sample-data/user-uploads/54d882c7-5030-479c-9a66-d0dfce2d57c4.JPG');
  
  console.log('Testing parser with:', testFile);
  const result = await parseDocument(testFile);
  
  console.log('Parse Result:', JSON.stringify(result, null, 2));
}

// Run test if called directly
if (require.main === module) {
  testParser().catch(console.error);
}