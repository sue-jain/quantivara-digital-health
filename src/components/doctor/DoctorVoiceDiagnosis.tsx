import React, { useState } from 'react';
import VoiceToText from '@/components/VoiceToText';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import doctorService from '@/services/doctor';

interface Props {
  doctorId: string;
  patientId: string | null;
}

const DoctorVoiceDiagnosis: React.FC<Props> = ({ doctorId, patientId }) => {
  const [transcript, setTranscript] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTextReady = (text: string) => {
    setTranscript(text);
  };

  const handleProcessing = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!patientId) {
      setError('Select a patient first');
      return;
    }
    if (!transcript.trim()) {
      setError('Speak or enter a diagnosis first');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await doctorService.saveVoiceDiagnosis(doctorId, { patientId, transcript: transcript.trim() });
      setSuccess('Voice diagnosis saved');
      setTranscript('');
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🎤 Voice Diagnosis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <VoiceToText 
          onTextReady={handleTextReady}
          onProcessing={handleProcessing}
        />

        <textarea
          className="w-full border border-gray-300 rounded-md p-2 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Dictation transcript or brief notes..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving || !patientId} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>
            {saving ? 'Saving...' : 'Save Diagnosis'}
          </Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
          {success && <span className="text-sm text-green-600">{success}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorVoiceDiagnosis;



