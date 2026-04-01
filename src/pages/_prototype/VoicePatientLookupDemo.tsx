import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import VoiceToText from '@/components/VoiceToText';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Grid3X3 } from 'lucide-react';

// Demo medications store - persists across page navigation
export const demoMedicationsStore = new Map<string, Array<{
  name: string;
  dosage: string;
  frequency: string;
  addedAt: string;
  addedBy: string;
}>>();

// Store starts empty - only medications added via voice commands will appear

const VoicePatientLookupDemo: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [aiExtractionResults, setAiExtractionResults] = useState<{
    patientName: string;
    medications: Array<{ name: string; dosage: string; frequency: string }>;
    accuracy: string;
    extractionTime: string;
  } | null>(null);
  const [showAiResults, setShowAiResults] = useState(false);
  const [prescriptionResults, setPrescriptionResults] = useState<{
    text: string;
    medicationCount: number;
    dosageCount: number;
    lineCount: number;
    timestamp: string;
  } | null>(null);
  const [recentlyAddedMedications, setRecentlyAddedMedications] = useState<Array<{
    patientName: string;
    patientAbhaId: string;
    patientDepartment: string;
    medication: {
      name: string;
      dosage: string;
      frequency: string;
    };
    timestamp: string;
  }>>([]);

  const handlePatientLookup = async (patientName: string) => {
    console.log('🔍 Patient lookup requested for:', patientName);
    
    // Check if this is an AI extraction command
    if (patientName.startsWith('AI_EXTRACTION:')) {
      const [command, type, targetPatient] = patientName.split(':');
      console.log('🤖 AI extraction command received:', { command, type, targetPatient });
      
      if (type === 'ai_extraction' && targetPatient) {
        console.log('🎯 Processing AI extraction for:', targetPatient);
        
        // Set AI extraction results
        const results = {
          patientName: targetPatient,
          medications: [
            { name: 'Metformin', dosage: '500mg', frequency: 'twice daily' },
            { name: 'Glimepiride', dosage: '1mg', frequency: 'once daily' },
            { name: 'Vitamin D3', dosage: '1000 IU', frequency: 'once daily' }
          ],
          accuracy: '94%',
          extractionTime: '2.3 seconds'
        };
        
        setAiExtractionResults(results);
        setShowAiResults(true);
        
        toast({
          title: "🤖 AI Extraction Complete",
          description: `${targetPatient}'s prescription processed with ${results.accuracy} accuracy`,
        });
        
        return;
      }
    }
    
    try {
      // Simulate patient search
      const mockPatients = [
        { name: 'Priya Sharma', abhaId: '98765432109876', age: 28, gender: 'Female', department: 'Cardiology' },
        { name: 'Ramesh Kumar', abhaId: '12345678901234', age: 45, gender: 'Male', department: 'Endocrinology' },
        { name: 'Suresh Patel', abhaId: '45678901234567', age: 52, gender: 'Male', department: 'Cardiology' },
        { name: 'Ashok Gupta', abhaId: '11112222333344', age: 38, gender: 'Male', department: 'Internal Medicine' },
        { name: 'Meera Singh', abhaId: '55556666777788', age: 35, gender: 'Female', department: 'Endocrinology' }
      ];
      
      const patient = mockPatients.find(p => 
        p.name.toLowerCase().includes(patientName.toLowerCase()) ||
        patientName.toLowerCase().includes(p.name.toLowerCase())
      );
      
      if (patient) {
        console.log('✅ Patient found:', patient);
        toast({
          title: "Patient found! 🎉",
          description: `Navigating to ${patient.name}'s profile...`,
        });
        
        setTimeout(() => {
          navigate(`/demo/abha-lookup?abhaId=${patient.abhaId}`);
        }, 1500);
        
      } else {
        console.log('❌ Patient not found:', patientName);
        toast({
          title: "Patient not found",
          description: `No patient found with name: ${patientName}`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ Error in patient lookup:', error);
      toast({
        title: "Lookup error",
        description: "Failed to search for patient",
        variant: "destructive"
      });
    }
  };

  const handleTextReady = (text: string) => {
    console.log('Voice transcription received:', text);
    
    // Check if this looks like a medical prescription
    const prescriptionKeywords = [
      'mg', 'milligram', 'tablet', 'capsule', 'syrup', 'injection', 'dose', 'dosage',
      'twice daily', 'once daily', 'three times daily', 'before meals', 'after meals',
      'morning', 'evening', 'night', 'bedtime', 'as needed', 'prn', 'stat'
    ];
    
    const isPrescription = prescriptionKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (isPrescription) {
      // Process as prescription dictation
      const prescriptionData = {
        text: text,
        medicationCount: 0, // Will be calculated by the improved logic
        dosageCount: 0, // Will be calculated by the improved logic
        lineCount: text.split('\n').filter(line => line.trim()).length,
        timestamp: new Date().toLocaleTimeString()
      };
      
      // Improved medication detection - look for actual medication names and dosages
      const medicationPatterns = [
        /(\w+)\s+\d+\s*mg/i,           // "metformin 500mg"
        /(\w+)\s+\d+\s*mg\s+\w+/i,     // "metformin 500mg tablet"
        /(\w+)\s+\d+\s*mg\s+\w+\s+\w+/i, // "metformin 500mg tablet twice"
        /(\w+)\s+\d+\s*mg\s+\w+\s+\w+\s+\w+/i, // "metformin 500mg tablet twice daily"
      ];
      
      // Count unique medications by looking for medication name patterns
      const uniqueMedications = new Set<string>();
      medicationPatterns.forEach(pattern => {
        const matches = text.match(new RegExp(pattern, 'gi'));
        if (matches) {
          matches.forEach(match => {
            // Extract the medication name (first word before dosage)
            const medicationName = match.split(/\s+/)[0].toLowerCase();
            if (medicationName && medicationName.length > 2) { // Filter out very short words
              uniqueMedications.add(medicationName);
            }
          });
        }
      });
      
      // Fallback: if no patterns match, try to count by looking for dosage indicators
      if (uniqueMedications.size === 0) {
        const dosageMatches = text.match(/\d+\s*mg/gi);
        if (dosageMatches) {
          uniqueMedications.add('medication'); // Generic count
        }
      }
      
      // Improved dosage frequency detection
      const dosagePatterns = [
        /twice daily|daily twice/i,
        /once daily|daily once/i,
        /three times daily|thrice daily/i,
        /before meals|after meals|with meals/i,
        /morning|evening|night|bedtime/i,
        /as needed|prn|stat/i,
        /daily|weekly|monthly/i
      ];
      
      let dosageCount = 0;
      dosagePatterns.forEach(pattern => {
        if (text.match(pattern)) {
          dosageCount++;
        }
      });
      
      prescriptionData.medicationCount = uniqueMedications.size;
      prescriptionData.dosageCount = dosageCount;
      
      setPrescriptionResults(prescriptionData);
      
      toast({
        title: "💊 Prescription Dictation Captured!",
        description: `Successfully processed prescription with ${prescriptionData.medicationCount} medication${prescriptionData.medicationCount !== 1 ? 's' : ''} and ${prescriptionData.dosageCount} dosage instruction${prescriptionData.dosageCount !== 1 ? 's' : ''}`,
      });
    } else {
      // Regular voice input
      toast({
        title: "Voice transcription ready",
        description: "Regular voice input received and ready for processing",
      });
    }
  };

  const handleProcessing = () => {
    console.log('Processing started...');
  };

  const handleAddMedication = async (patientName: string, medicationText: string) => {
    console.log('💊 Adding medication for patient:', patientName, 'Medication:', medicationText);
    
    try {
      // Find the patient by name
      const mockPatients = [
        { name: 'Priya Sharma', abhaId: '98765432109876', age: 28, gender: 'Female', department: 'Cardiology' },
        { name: 'Ramesh Kumar', abhaId: '12345678901234', age: 45, gender: 'Male', department: 'Endocrinology' },
        { name: 'Suresh Patel', abhaId: '45678901234567', age: 52, gender: 'Male', department: 'Cardiology' },
        { name: 'Ashok Gupta', abhaId: '11112222333344', age: 38, gender: 'Male', department: 'Internal Medicine' },
        { name: 'Meera Singh', abhaId: '55556666777788', age: 35, gender: 'Female', department: 'Endocrinology' }
      ];
      
      const patient = mockPatients.find(p => 
        p.name.toLowerCase().includes(patientName.toLowerCase()) ||
        patientName.toLowerCase().includes(p.name.toLowerCase())
      );
      
      if (patient) {
        // Parse medication text to extract structured data
        const medicationData = parseMedicationText(medicationText);
        
        // Add medication to the demo store for persistence
        const newMedication = {
          name: medicationData.name,
          dosage: medicationData.dosage,
          frequency: medicationData.frequency,
          addedAt: new Date().toISOString().split('T')[0], // Today's date
          addedBy: 'Voice Command'
        };
        
        // Get existing medications for this patient
        const existingMedications = demoMedicationsStore.get(patient.abhaId) || [];
        
        // Add new medication
        demoMedicationsStore.set(patient.abhaId, [...existingMedications, newMedication]);
        
        console.log('✅ Medication added to demo store for patient:', patient.name, 'Store now contains:', demoMedicationsStore.get(patient.abhaId));
        
        // Store the recently added medication for display
        const newMedicationDisplay = {
          patientName: patient.name,
          patientAbhaId: patient.abhaId,
          patientDepartment: patient.department,
          medication: medicationData,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setRecentlyAddedMedications(prev => [newMedicationDisplay, ...prev.slice(0, 4)]); // Keep last 5
        
        toast({
          title: "💊 Medication Added Successfully!",
          description: `Added ${medicationData.name} ${medicationData.dosage} ${medicationData.frequency} to ${patient.name}'s profile`,
        });
        
        // Show success message with patient details and navigation option
        setTimeout(() => {
          toast({
            title: "Patient Profile Updated",
            description: `${patient.name} (${patient.department}) now has the new medication in their profile`,
            action: (
              <Button 
                size="sm" 
                onClick={() => navigate(`/demo/abha-lookup?abhaId=${patient.abhaId}`)}
                className="mt-2"
              >
                View Patient Profile
              </Button>
            )
          });
        }, 2000);
        
      } else {
        toast({
          title: "Patient Not Found",
          description: `No patient found with name: ${patientName}`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ Error adding medication:', error);
      toast({
        title: "Medication Addition Failed",
        description: "Failed to add medication to patient profile",
        variant: "destructive"
      });
    }
  };

  // Parse medication text to extract structured data
  const parseMedicationText = (medicationText: string) => {
    const text = medicationText.toLowerCase();
    console.log('🔍 Parsing medication text:', medicationText);
    
    // Extract medication name (first word before dosage)
    const nameMatch = text.match(/^(\w+)/);
    const name = nameMatch ? nameMatch[1] : 'Unknown Medication';
    
    // Extract dosage - more flexible patterns
    let dosage = 'Standard dosage';
    const dosagePatterns = [
      /(\d+\s*(?:mg|ml|g|mcg|units?))/i,  // "500mg", "10 units"
      /(\d+\s*(?:mg|ml|g|mcg|units?)\s+\w+)/i,  // "500 mg tablet"
      /(\d+\s+\w+)/i,  // "500 tablet" (fallback)
    ];
    
    for (const pattern of dosagePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        dosage = match[1].trim();
        break;
      }
    }
    
    // Extract frequency - more comprehensive patterns
    let frequency = 'As prescribed';
    const frequencyPatterns = [
      /(twice daily|daily twice)/i,
      /(once daily|daily once)/i,
      /(three times daily|thrice daily)/i,
      /(before meals|after meals|with meals)/i,
      /(morning|evening|night|bedtime)/i,
      /(as needed|prn|stat)/i,
      /(daily|weekly|monthly)/i,
      /(\w+\s+\w+)/i,  // "daily twice", "twice daily" variations
    ];
    
    for (const pattern of frequencyPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        frequency = match[1].trim();
        break;
      }
    }
    
    console.log('🔍 Parsed medication data:', { name, dosage, frequency });
    
    return { name, dosage, frequency };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/demo')}
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
          >
            <Grid3X3 className="h-4 w-4" />
            Back to Demo Hub
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              🎤 Voice-Activated Patient Lookup Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              Test voice commands to find and open patient profiles automatically
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Input Section */}
          <div>
            <VoiceToText 
              onTextReady={handleTextReady}
              onProcessing={handleProcessing}
              onPatientLookup={handlePatientLookup}
              onAddMedication={handleAddMedication}
            />
          </div>

          {/* Available Patients Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👥 Available Patients for Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-4">
                    Try these voice commands to find patients:
                  </div>
                  
                  {[
                    { name: 'Priya Sharma', abhaId: '9876-5432-1098-76', age: 28, gender: 'Female', department: 'Cardiology' },
                    { name: 'Ramesh Kumar', abhaId: '1234-5678-9012-34', age: 45, gender: 'Male', department: 'Endocrinology' },
                    { name: 'Suresh Patel', abhaId: '4567-8901-2345-67', age: 52, gender: 'Male', department: 'Cardiology' },
                    { name: 'Ashok Gupta', abhaId: '1111-2222-3333-44', age: 38, gender: 'Male', department: 'Internal Medicine' },
                    { name: 'Meera Singh', abhaId: '5555-6666-7777-88', age: 35, gender: 'Female', department: 'Endocrinology' }
                  ].map((patient, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-600">{patient.name}</h4>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{patient.department}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Age: {patient.age} years | Gender: {patient.gender}</p>
                        <p className="font-mono text-xs mt-1">ABHA: {patient.abhaId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Voice Commands Guide */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>💡 Voice Commands to Try</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <strong>🎯 Patient Lookup:</strong>
                    <ul className="list-disc list-inside mt-1 ml-2">
                      <li>"Open patient Priya Sharma user profile"</li>
                      <li>"Find patient Ramesh Kumar profile"</li>
                      <li>"Show patient Suresh Patel details"</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <strong>🤖 AI Extraction Commands:</strong>
                    <ul className="list-disc list-inside mt-1 ml-2">
                      <li>"Show me how AI extracted Priya's prescription"</li>
                      <li>"Show AI extraction for all patients"</li>
                      <li>"Demonstrate AI extraction workflow"</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <strong>💊 Medication Addition Commands:</strong>
                    <ul className="list-disc list-inside mt-1 ml-2">
                      <li>"Add medication metformin 500mg twice daily for Priya Sharma"</li>
                      <li>"Add medicine glimepiride 1mg once daily for patient Ramesh Kumar"</li>
                      <li>"Add drug vitamin D3 1000 IU daily for Meera Singh"</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <strong>📝 Regular Dictation:</strong>
                    <ul className="list-disc list-inside mt-1 ml-2">
                      <li>Speak medical prescriptions</li>
                      <li>Dictate patient notes</li>
                      <li>Record diagnosis information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Extraction Results */}
        {showAiResults && aiExtractionResults && (
          <Card className="mt-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-purple-800">
                🤖 AI Extraction Results for {aiExtractionResults.patientName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-purple-800">💊 Extracted Medications</h4>
                  <div className="space-y-3">
                    {aiExtractionResults.medications.map((med: { name: string; dosage: string; frequency: string }, index: number) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-purple-900">{med.name}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{med.dosage}</span>
                        </div>
                        <div className="text-sm text-purple-700">
                          <p><strong>Frequency:</strong> {med.frequency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-purple-800">🧠 AI Insights</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">Accuracy</span>
                        <span className="text-xs bg-green-200 px-2 py-1 rounded text-green-800">
                          {aiExtractionResults.accuracy}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">Extraction Time</span>
                        <span className="text-xs bg-blue-200 px-2 py-1 rounded text-blue-800">
                          {aiExtractionResults.extractionTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowAiResults(false)}
                  className="px-4 py-2 border border-purple-300 text-purple-700 rounded hover:bg-purple-50"
                >
                  Close AI Results
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prescription Dictation Results */}
        {prescriptionResults && (
          <Card className="mt-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-green-800">
                💊 Prescription Dictation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-800">📝 Captured Prescription</h4>
                  <div className="bg-white p-4 rounded-lg border border-green-200 max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-green-900 font-mono">
                      {prescriptionResults.text}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-green-800">📊 Analysis Summary</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Medications Detected</span>
                        <span className="text-xs bg-green-200 px-2 py-1 rounded text-green-800">
                          {prescriptionResults.medicationCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Dosage Instructions</span>
                        <span className="text-xs bg-blue-200 px-2 py-1 rounded text-blue-800">
                          {prescriptionResults.dosageCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Lines of Text</span>
                        <span className="text-xs bg-purple-200 px-2 py-1 rounded text-purple-800">
                          {prescriptionResults.lineCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Captured At</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-800">
                          {prescriptionResults.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setPrescriptionResults(null)}
                  className="px-4 py-2 border border-green-300 text-green-700 rounded hover:bg-green-50"
                >
                  Close Prescription Results
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recently Added Medications */}
        {recentlyAddedMedications.length > 0 && (
          <Card className="mt-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="text-blue-800">
                💊 Recently Added Medications
              </CardTitle>
              <CardDescription>
                Click "View Profile" to verify medications were added to patient profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyAddedMedications.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900">{item.patientName}</h4>
                        <p className="text-sm text-blue-700">{item.patientDepartment}</p>
                        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm font-medium text-blue-900">
                            {item.medication.name} {item.medication.dosage}
                          </p>
                          <p className="text-xs text-blue-700">{item.medication.frequency}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/demo/abha-lookup?abhaId=${item.patientAbhaId}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setRecentlyAddedMedications([])}
                  className="px-4 py-2 border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
                >
                  Clear History
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VoicePatientLookupDemo;
