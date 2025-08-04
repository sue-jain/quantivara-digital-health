import { db } from '../config/sqlite';
import { logger } from '../utils/logger';

const viewRecentUploads = () => {
  try {
    // Get most recent uploads
    const recentDocs = db.prepare(`
      SELECT 
        id,
        document_type,
        file_name,
        status,
        extraction_accuracy,
        datetime(created_at, 'localtime') as upload_time,
        SUBSTR(extracted_data, 1, 100) as data_preview
      FROM medical_documents 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all() as any[];
    
    console.log('\n=== Recent Document Uploads ===\n');
    
    recentDocs.forEach((doc, index) => {
      console.log(`${index + 1}. Document ID: ${doc.id}`);
      console.log(`   Type: ${doc.document_type}`);
      console.log(`   File: ${doc.file_name}`);
      console.log(`   Status: ${doc.status}`);
      console.log(`   Accuracy: ${doc.extraction_accuracy}%`);
      console.log(`   Uploaded: ${doc.upload_time}`);
      console.log(`   Data Preview: ${doc.data_preview}...`);
      console.log('   ---');
    });
    
    // Get the most recent handwritten prescription
    const handwrittenDoc = db.prepare(`
      SELECT * FROM medical_documents 
      WHERE document_type = 'handwritten_prescription' 
      OR file_name LIKE '%handwritten%'
      ORDER BY created_at DESC 
      LIMIT 1
    `).get() as any;
    
    if (handwrittenDoc) {
      console.log('\n=== Latest Handwritten Prescription ===\n');
      console.log('Document ID:', handwrittenDoc.id);
      console.log('File Name:', handwrittenDoc.file_name);
      console.log('Status:', handwrittenDoc.status);
      console.log('Accuracy:', handwrittenDoc.extraction_accuracy + '%');
      
      if (handwrittenDoc.extracted_data) {
        console.log('\nExtracted Data:');
        const data = JSON.parse(handwrittenDoc.extracted_data);
        console.log(JSON.stringify(data, null, 2));
      }
      
      // Check if prescription details were saved
      const prescriptionDetails = db.prepare(`
        SELECT * FROM prescriptions WHERE document_id = ?
      `).get(handwrittenDoc.id) as any;
      
      if (prescriptionDetails) {
        console.log('\n=== Saved Prescription Details ===\n');
        console.log('Patient:', prescriptionDetails.patient_name);
        console.log('Age/Gender:', prescriptionDetails.patient_age, prescriptionDetails.patient_gender);
        console.log('Doctor:', prescriptionDetails.doctor_name);
        console.log('Diagnosis:', prescriptionDetails.diagnosis);
        console.log('Medications:', prescriptionDetails.medications);
      }
    }
    
    // Summary statistics
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_documents,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN document_type = 'handwritten_prescription' THEN 1 END) as handwritten,
        AVG(extraction_accuracy) as avg_accuracy
      FROM medical_documents
    `).get() as any;
    
    console.log('\n=== Database Statistics ===\n');
    console.log('Total Documents:', stats.total_documents);
    console.log('Completed:', stats.completed);
    console.log('Handwritten Prescriptions:', stats.handwritten);
    console.log('Average Accuracy:', stats.avg_accuracy?.toFixed(1) + '%');
    
  } catch (error) {
    logger.error('Error viewing uploads:', error);
  } finally {
    db.close();
  }
};

// Run if called directly
if (require.main === module) {
  viewRecentUploads();
}

export default viewRecentUploads;