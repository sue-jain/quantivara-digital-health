import { db } from '../config/sqlite';
import { logger } from '../utils/logger';

interface ExtractedMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface ExtractedLabTest {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: string;
  critical?: boolean;
}

interface ExtractedVitalSign {
  type: string;
  value: string;
  unit: string;
}

export class ProfilePopulationService {
  
  /**
   * Populate user profile with AI-extracted data
   * This is called AFTER successful document processing
   */
  async populateUserProfile(
    abhaId: string, 
    extractedData: any, 
    documentId: string,
    documentType: string
  ): Promise<void> {
    try {
      logger.info(`🔗 Populating profile for ABHA ID: ${abhaId}`);
      
      // Get user_id from ABHA ID
      const user = db.prepare('SELECT id FROM users WHERE abha_id = ?').get(abhaId) as any;
      if (!user) {
        logger.warn(`⚠️ User not found for ABHA ID: ${abhaId}`);
        return;
      }

      const userId = user.id;

      // Verify document exists before populating profile (data integrity)
      if (documentId) {
        const documentExists = db.prepare('SELECT id FROM medical_documents WHERE id = ?').get(documentId) as any;
        if (!documentExists) {
          logger.warn(`⚠️ Document ${documentId} not found, skipping profile population for data integrity`);
          return;
        }
      }

      // Populate based on document type
      switch (documentType) {
        case 'prescription':
        case 'handwritten_prescription':
          await this.populateMedications(userId, abhaId, extractedData, documentId);
          await this.populateDiagnoses(userId, abhaId, extractedData, documentId);
          break;
          
        case 'lab_report':
          await this.populateLabResults(userId, abhaId, extractedData, documentId);
          break;
          
        case 'ecg_report':
          await this.populateVitalSigns(userId, abhaId, extractedData, documentId);
          break;
          
        default:
          logger.info(`📄 Document type ${documentType} - no specific profile population needed`);
      }

      // Check for critical alerts (for all document types)
      await this.checkCriticalAlerts(userId, abhaId, extractedData, documentId);
      
      logger.info(`✅ Profile population completed for document: ${documentId}`);
      
    } catch (error) {
      logger.error(`❌ Error populating profile for ABHA ID ${abhaId}:`, error);
      // Don't throw - profile population failure shouldn't break document processing
    }
  }

  /**
   * Populate medications from prescription data
   */
  private async populateMedications(
    userId: string, 
    abhaId: string, 
    extractedData: any, 
    documentId: string
  ): Promise<void> {
    try {
      const medications = extractedData.medications || [];
      
      for (const med of medications) {
        // Check if medication already exists (avoid duplicates)
        const existing = db.prepare(`
          SELECT id FROM user_medications 
          WHERE abha_id = ? AND medication_name = ? AND is_active = 1
        `).get(abhaId, med.name) as any;

        if (!existing) {
          // Insert new medication
          db.prepare(`
            INSERT INTO user_medications (
              user_id, abha_id, medication_name, dosage, frequency, 
              duration, instructions, prescribed_date, source_document_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            userId,
            abhaId,
            med.name,
            med.dosage || '',
            med.frequency || '',
            med.duration || '',
            med.instructions || '',
            extractedData.prescriptionDate || new Date().toISOString().split('T')[0],
            documentId || null
          );
          
          logger.info(`💊 Added medication: ${med.name} for ABHA ID: ${abhaId}`);
        }
      }
      
    } catch (error) {
      logger.error(`❌ Error populating medications for ABHA ID ${abhaId}:`, error);
    }
  }

  /**
   * Populate diagnoses from prescription data
   */
  private async populateDiagnoses(
    userId: string, 
    abhaId: string, 
    extractedData: any, 
    documentId: string
  ): Promise<void> {
    try {
      // Safely extract diagnoses array - handle various data structures
      let diagnoses: string[] = [];
      
      if (extractedData.diagnosis) {
        if (Array.isArray(extractedData.diagnosis)) {
          diagnoses = extractedData.diagnosis;
        } else if (typeof extractedData.diagnosis === 'string') {
          // If diagnosis is a single string, convert to array
          diagnoses = [extractedData.diagnosis];
        }
      }
      
      // If no diagnoses found, log and return gracefully
      if (!diagnoses || diagnoses.length === 0) {
        logger.info(`📄 No diagnoses found in prescription for ABHA ID: ${abhaId} - this is normal for some prescriptions`);
        return;
      }
      
      const diagnosisDate = extractedData.prescriptionDate || extractedData.date || new Date().toISOString().split('T')[0];
      const doctorName = extractedData.doctorInfo?.name || '';
      
      for (const diagnosis of diagnoses) {
        try {
          // Safely handle diagnosis text
          if (!diagnosis || typeof diagnosis !== 'string') {
            logger.warn(`⚠️ Invalid diagnosis format for ABHA ID ${abhaId}, skipping: ${diagnosis}`);
            continue;
          }
          
          // Clean up diagnosis text (remove leading dashes and trim)
          const cleanDiagnosis = diagnosis.replace(/^[-\s•*]+/, '').trim();
          
          // Skip empty or very short diagnoses
          if (cleanDiagnosis.length < 3) {
            logger.debug(`📝 Skipping short/empty diagnosis for ABHA ID ${abhaId}: "${cleanDiagnosis}"`);
            continue;
          }
          
          // Check if diagnosis already exists for this patient
          const existing = db.prepare(`
            SELECT id FROM user_diagnoses 
            WHERE abha_id = ? AND diagnosis_name = ?
          `).get(abhaId, cleanDiagnosis) as any;

          if (!existing) {
            // Insert new diagnosis
            db.prepare(`
              INSERT INTO user_diagnoses (
                user_id, abha_id, diagnosis_name, diagnosis_date, doctor_name, 
                status, source_document_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
              userId,
              abhaId,
              cleanDiagnosis,
              diagnosisDate,
              doctorName,
              'ACTIVE',
              documentId || null
            );
            
            logger.info(`🩺 Added diagnosis: ${cleanDiagnosis} for ABHA ID: ${abhaId}`);
          } else {
            logger.debug(`📋 Diagnosis already exists for ABHA ID ${abhaId}: ${cleanDiagnosis}`);
          }
        } catch (diagnosisError) {
          logger.error(`❌ Error processing individual diagnosis for ABHA ID ${abhaId}:`, diagnosisError);
          // Continue with next diagnosis instead of failing completely
          continue;
        }
      }
      
      logger.info(`✅ Processed ${diagnoses.length} diagnoses for ABHA ID: ${abhaId}`);
      
    } catch (error) {
      logger.error(`❌ Error populating diagnoses for ABHA ID ${abhaId}:`, error);
      // Don't throw - allow document processing to continue even if diagnosis population fails
    }
  }

  /**
   * Populate lab results from lab report data
   */
  private async populateLabResults(
    userId: string, 
    abhaId: string, 
    extractedData: any, 
    documentId: string
  ): Promise<void> {
    try {
      const tests = extractedData.tests || [];
      
      for (const test of tests) {
        // Check if test result already exists for this date
        const existing = db.prepare(`
          SELECT id FROM user_lab_results 
          WHERE abha_id = ? AND test_name = ? AND test_date = ?
        `).get(abhaId, test.name, extractedData.labInfo?.reportDate || new Date().toISOString().split('T')[0]) as any;

        if (!existing) {
          // Insert new lab result
          db.prepare(`
            INSERT INTO user_lab_results (
              user_id, abha_id, test_name, value, unit, normal_range, 
              status, test_date, lab_name, source_document_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            userId,
            abhaId,
            test.name,
            test.value || '',
            test.unit || '',
            test.normalRange || '',
            test.status || 'NORMAL',
            extractedData.labInfo?.reportDate || new Date().toISOString().split('T')[0],
            extractedData.labInfo?.name || '',
            documentId || null
          );
          
          logger.info(`🧪 Added lab result: ${test.name} for ABHA ID: ${abhaId}`);
        }
      }
      
    } catch (error) {
      logger.error(`❌ Error populating lab results for ABHA ID ${abhaId}:`, error);
    }
  }

  /**
   * Populate vital signs from ECG/medical data
   */
  private async populateVitalSigns(
    userId: string, 
    abhaId: string, 
    extractedData: any, 
    documentId: string
  ): Promise<void> {
    try {
      const findings = extractedData.findings || {};
      
      // Extract heart rate from ECG findings
      if (findings.heartRate) {
        const heartRate = findings.heartRate.replace(' bpm', '');
        
        db.prepare(`
          INSERT INTO user_vital_signs (
            user_id, abha_id, vital_type, value, unit, 
            measurement_date, source_document_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          userId,
          abhaId,
          'HEART_RATE',
          heartRate,
          'bpm',
          new Date().toISOString().split('T')[0],
          documentId
        );
        
        logger.info(`🫀 Added heart rate: ${heartRate} bpm for ABHA ID: ${abhaId}`);
      }

      // Extract other vital signs if available
      if (findings.prInterval) {
        db.prepare(`
          INSERT INTO user_vital_signs (
            user_id, abha_id, vital_type, value, unit, 
            measurement_date, source_document_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          userId,
          abhaId,
          'PR_INTERVAL',
          findings.prInterval.replace(' ms', ''),
          'ms',
          new Date().toISOString().split('T')[0],
          documentId
        );
      }
      
    } catch (error) {
      logger.error(`❌ Error populating vital signs for ABHA ID ${abhaId}:`, error);
    }
  }

  /**
   * Check for critical alerts in extracted data
   */
  private async checkCriticalAlerts(
    userId: string, 
    abhaId: string, 
    extractedData: any, 
    documentId: string
  ): Promise<void> {
    try {
      const alerts = [];

      // Check lab results for critical values
      if (extractedData.tests) {
        const criticalTests = extractedData.tests.filter((test: any) => 
          test.status === 'CRITICAL' || test.critical === true
        );
        
        for (const test of criticalTests) {
          alerts.push({
            type: 'CRITICAL_LAB_RESULT',
            severity: 'HIGH',
            message: `Critical lab value: ${test.name} = ${test.value} ${test.unit}`
          });
        }
      }

      // Check for abnormal values
      if (extractedData.tests) {
        const abnormalTests = extractedData.tests.filter((test: any) => 
          test.status === 'HIGH' || test.status === 'LOW'
        );
        
        for (const test of abnormalTests) {
          alerts.push({
            type: 'ABNORMAL_LAB_RESULT',
            severity: 'MEDIUM',
            message: `${test.status} lab value: ${test.name} = ${test.value} ${test.unit}`
          });
        }
      }

      // Insert alerts
      for (const alert of alerts) {
        db.prepare(`
          INSERT INTO user_critical_alerts (
            user_id, abha_id, alert_type, severity, message, source_document_id
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          userId,
          abhaId,
          alert.type,
          alert.severity,
          alert.message,
          documentId
        );
        
        logger.info(`🚨 Added critical alert: ${alert.message} for ABHA ID: ${abhaId}`);
      }
      
    } catch (error) {
      logger.error(`❌ Error checking critical alerts for ABHA ID ${abhaId}:`, error);
    }
  }

  /**
   * Get active medications for a user
   */
  async getActiveMedications(abhaId: string): Promise<any[]> {
    try {
      const medications = db.prepare(`
        SELECT * FROM user_medications 
        WHERE abha_id = ? AND is_active = 1
        ORDER BY created_at DESC
      `).all(abhaId) as any[];
      
      return medications;
    } catch (error) {
      logger.error(`❌ Error fetching active medications for ABHA ID ${abhaId}:`, error);
      return [];
    }
  }

  /**
   * Get lab results for a user
   */
  async getLabResults(abhaId: string): Promise<any[]> {
    try {
      const results = db.prepare(`
        SELECT * FROM user_lab_results 
        WHERE abha_id = ?
        ORDER BY test_date DESC, created_at DESC
      `).all(abhaId) as any[];
      
      return results;
    } catch (error) {
      logger.error(`❌ Error fetching lab results for ABHA ID ${abhaId}:`, error);
      return [];
    }
  }

  /**
   * Get vital signs for a user
   */
  async getVitalSigns(abhaId: string): Promise<any[]> {
    try {
      const vitals = db.prepare(`
        SELECT * FROM user_vital_signs 
        WHERE abha_id = ?
        ORDER BY measurement_date DESC, created_at DESC
      `).all(abhaId) as any[];
      
      return vitals;
    } catch (error) {
      logger.error(`❌ Error fetching vital signs for ABHA ID ${abhaId}:`, error);
      return [];
    }
  }

  /**
   * Get critical alerts for a user
   */
  async getCriticalAlerts(abhaId: string): Promise<any[]> {
    try {
      const alerts = db.prepare(`
        SELECT * FROM user_critical_alerts 
        WHERE abha_id = ? AND is_resolved = 0
        ORDER BY created_at DESC
      `).all(abhaId) as any[];
      
      return alerts;
    } catch (error) {
      logger.error(`❌ Error fetching critical alerts for ABHA ID ${abhaId}:`, error);
      return [];
    }
  }
}

// Create singleton instance
export const profilePopulationService = new ProfilePopulationService(); 