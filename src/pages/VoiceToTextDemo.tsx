import React from 'react';
import VoiceToText from '@/components/VoiceToText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VoiceToTextDemo: React.FC = () => {
  const handleTextReady = (text: string) => {
    console.log('Voice transcription received:', text);
    alert(`Voice transcription received:\n\n${text}`);
  };

  const handleProcessing = () => {
    console.log('Processing started...');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              🎤 Voice-to-Text Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              Test the voice-to-text functionality for medical document processing
            </p>
          </CardContent>
        </Card>

        <VoiceToText 
          onTextReady={handleTextReady}
          onProcessing={handleProcessing}
        />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Step 1:</strong> Click "Start Recording" and allow microphone access</p>
            <p><strong>Step 2:</strong> Speak a medical prescription, for example:</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              "Patient: John Doe, Age: 45 years, Male. Diagnosis: Hypertension. 
              Prescription: Amlodipine 5mg once daily, Lisinopril 10mg once daily. 
              Duration: 30 days. Take with food."
            </div>
            <p><strong>Step 3:</strong> Click "Stop Recording" when finished</p>
            <p><strong>Step 4:</strong> Review the transcribed text and click "Process Medical Data"</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceToTextDemo;
