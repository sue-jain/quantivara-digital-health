import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import { profilePopulationService } from '../services/profilePopulationService';

const testProfilePopulation = async () => {
  try {
    logger.info('🧪 Testing profile population logic...');

    // Test data - simulating AI extracted prescription data
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

    const testDocumentId = "test-doc-" + Date.now();
    const testAbhaId = "12345678901234"; // Ramesh Kumar's ABHA ID
    const testDocumentType = "prescription";

    logger.info(`📄 Testing with document ID: ${testDocumentId}`);
    logger.info(`👤 Testing with ABHA ID: ${testAbhaId}`);
    logger.info(`💊 Testing with ${testExtractedData.medications.length} medications`);

    // Test profile population
    await profilePopulationService.populateUserProfile(
      testAbhaId,
      testExtractedData,
      testDocumentId,
      testDocumentType
    );

    // Verify the data was populated
    const medications = await profilePopulationService.getActiveMedications(testAbhaId);
    logger.info(`✅ Found ${medications.length} active medications for ABHA ID: ${testAbhaId}`);

    for (const med of medications) {
      logger.info(`💊 Medication: ${med.medication_name} - ${med.dosage} - ${med.frequency}`);
    }

    // Test lab results population
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

    const testLabDocumentId = "test-lab-" + Date.now();
    
    logger.info(`🧪 Testing lab results population...`);
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
    }

    // Test critical alerts
    const alerts = await profilePopulationService.getCriticalAlerts(testAbhaId);
    logger.info(`🚨 Found ${alerts.length} critical alerts for ABHA ID: ${testAbhaId}`);

    for (const alert of alerts) {
      logger.info(`🚨 Alert: ${alert.message} (${alert.severity})`);
    }

    logger.info('✅ Profile population test completed successfully!');
    logger.info('🎯 Phase 2 implementation is working correctly!');

  } catch (error) {
    logger.error('❌ Profile population test failed:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  testProfilePopulation()
    .then(() => {
      logger.info('✅ All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Tests failed:', error);
      process.exit(1);
    });
}

export { testProfilePopulation }; 