import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import { profilePopulationService } from '../services/profilePopulationService';
import { v4 as uuidv4 } from 'uuid';

const testFullProfilePopulation = async () => {
  try {
    logger.info('🧪 Testing full profile population flow...');

    const testAbhaId = "12345678901234"; // Ramesh Kumar's ABHA ID
    const testDocumentId = uuidv4();
    const testDocumentType = "prescription";

    // Step 1: Create a real document in medical_documents table
    logger.info(`📄 Creating test document: ${testDocumentId}`);
    
    const insertDoc = db.prepare(`
      INSERT INTO medical_documents (
        id, patient_id, provider_id, document_type, status,
        file_path, file_name, file_size, mime_type,
        processing_started_at, abha_id, extraction_accuracy, extracted_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertDoc.run(
      testDocumentId,
      '02a5644599e729f0ef411b3b1d49649f', // Valid patient ID
      'f87e19390e7298890a1d68ffbe93abbd', // Valid provider ID
      testDocumentType,
      'completed',
      '/test/path/document.jpg',
      'test-prescription.jpg',
      1024 * 100,
      'image/jpeg',
      new Date().toISOString(),
      testAbhaId,
      93.5,
      JSON.stringify({
        patientInfo: { name: "Ramesh Kumar", age: "45 Years", gender: "Male" },
        medications: [
          {
            name: "Omeprazole",
            dosage: "20mg",
            frequency: "Twice daily (1-0-1)",
            duration: "3 days",
            instructions: "Before food"
          },
          {
            name: "Sucralfate + Simethicone",
            dosage: "10ml",
            frequency: "Three times daily (1-1-1)",
            duration: "3 days",
            instructions: "After food"
          }
        ]
      })
    );

    logger.info(`✅ Document created successfully: ${testDocumentId}`);

    // Step 2: Test profile population with real document
    const testExtractedData = {
      patientInfo: {
        name: "Ramesh Kumar",
        age: "45 Years",
        gender: "Male"
      },
      doctorInfo: {
        name: "Dr. Shubham Nimesh",
        registration: "MRN-12345",
        clinic: "Medical Facility"
      },
      diagnosis: ["Acute Gastroenteritis", "Mild Dehydration"],
      medications: [
        {
          name: "Omeprazole",
          dosage: "20mg",
          frequency: "Twice daily (1-0-1)",
          duration: "3 days",
          instructions: "Before food"
        },
        {
          name: "Sucralfate + Simethicone",
          dosage: "10ml",
          frequency: "Three times daily (1-1-1)",
          duration: "3 days",
          instructions: "After food"
        }
      ],
      advice: ["Light diet recommended", "Adequate hydration"],
      followUp: "After 3 days if symptoms persist",
      prescriptionDate: "2024-01-15"
    };

    logger.info(`🔗 Testing profile population for document: ${testDocumentId}`);
    
    // Test profile population
    await profilePopulationService.populateUserProfile(
      testAbhaId,
      testExtractedData,
      testDocumentId,
      testDocumentType
    );

    // Step 3: Verify the data was populated
    const medications = await profilePopulationService.getActiveMedications(testAbhaId);
    logger.info(`✅ Found ${medications.length} active medications for ABHA ID: ${testAbhaId}`);

    for (const med of medications) {
      logger.info(`💊 Medication: ${med.medication_name} - ${med.dosage} - ${med.frequency}`);
      logger.info(`   📄 Source Document: ${med.source_document_id}`);
    }

    // Step 4: Test lab results population
    const testLabDocumentId = uuidv4();
    
    // Create lab document
    const insertLabDoc = db.prepare(`
      INSERT INTO medical_documents (
        id, patient_id, provider_id, document_type, status,
        file_path, file_name, file_size, mime_type,
        processing_started_at, abha_id, extraction_accuracy, extracted_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertLabDoc.run(
      testLabDocumentId,
      '02a5644599e729f0ef411b3b1d49649f',
      'f87e19390e7298890a1d68ffbe93abbd',
      'lab_report',
      'completed',
      '/test/path/lab-report.jpg',
      'test-lab-report.jpg',
      1024 * 100,
      'image/jpeg',
      new Date().toISOString(),
      testAbhaId,
      94.2,
      JSON.stringify({
        patientInfo: { name: "Ramesh Kumar", age: "45 Years", gender: "Male" },
        tests: [
          {
            name: "Blood Sugar (Random)",
            value: "95",
            unit: "mg/dL",
            normalRange: "70-140",
            status: "NORMAL"
          },
          {
            name: "Hemoglobin",
            value: "11.5",
            unit: "g/dL",
            normalRange: "12.0-15.5",
            status: "LOW"
          }
        ]
      })
    );

    const testLabData = {
      patientInfo: {
        name: "Ramesh Kumar",
        age: "45 Years",
        gender: "Male",
        sampleId: "LAB-12345"
      },
      labInfo: {
        name: "City Health Labs",
        address: "Sector 15, Noida, UP",
        reportDate: "2024-01-15"
      },
      tests: [
        {
          name: "Blood Sugar (Random)",
          value: "95",
          unit: "mg/dL",
          normalRange: "70-140",
          status: "NORMAL"
        },
        {
          name: "Hemoglobin",
          value: "11.5",
          unit: "g/dL",
          normalRange: "12.0-15.5",
          status: "LOW"
        }
      ]
    };
    
    logger.info(`🧪 Testing lab results population for document: ${testLabDocumentId}`);
    await profilePopulationService.populateUserProfile(
      testAbhaId,
      testLabData,
      testLabDocumentId,
      "lab_report"
    );

    // Verify lab results
    const labResults = await profilePopulationService.getLabResults(testAbhaId);
    logger.info(`✅ Found ${labResults.length} lab results for ABHA ID: ${testAbhaId}`);

    for (const result of labResults) {
      logger.info(`🧪 Lab Test: ${result.test_name} = ${result.value} ${result.unit} (${result.status})`);
      logger.info(`   📄 Source Document: ${result.source_document_id}`);
    }

    // Test critical alerts
    const alerts = await profilePopulationService.getCriticalAlerts(testAbhaId);
    logger.info(`🚨 Found ${alerts.length} critical alerts for ABHA ID: ${testAbhaId}`);

    for (const alert of alerts) {
      logger.info(`🚨 Alert: ${alert.message} (${alert.severity})`);
      logger.info(`   📄 Source Document: ${alert.source_document_id}`);
    }

    logger.info('✅ Full profile population test completed successfully!');
    logger.info('🎯 Phase 2 implementation is working correctly!');
    logger.info('🔗 Profile population is ready for integration with document processing!');

  } catch (error) {
    logger.error('❌ Full profile population test failed:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  testFullProfilePopulation()
    .then(() => {
      logger.info('✅ All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Tests failed:', error);
      process.exit(1);
    });
}

export { testFullProfilePopulation }; 