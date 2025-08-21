import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Play, Square, Save, Loader2, Search, User, Command } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceToTextProps {
  onTextReady: (text: string) => void;
  onProcessing?: () => void;
  onPatientLookup?: (patientName: string) => void;
  onProfileOpen?: (abhaId: string) => void;
  onAddMedication?: (patientName: string, medication: string) => void;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ 
  onTextReady, 
  onProcessing, 
  onPatientLookup,
  onProfileOpen,
  onAddMedication
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [commandMode, setCommandMode] = useState(false);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    console.log('🔍 Checking browser support for speech recognition...');
    
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('❌ Speech recognition not supported in this browser');
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ Speech recognition supported, creating instance...');
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    // Configure recognition settings
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    console.log('🔧 Speech recognition configured:', {
      continuous: recognitionInstance.continuous,
      interimResults: recognitionInstance.interimResults,
      lang: recognitionInstance.lang
    });

    // Set up event handlers
    recognitionInstance.onstart = () => {
      console.log('🎤 Recording started!');
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    };

    recognitionInstance.onresult = (event) => {
      console.log('📝 Speech recognition result received:', event);
      console.log('📊 Results length:', event.results.length);
      console.log('🔍 Result index:', event.resultIndex);
      
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        
        console.log(`📝 Result ${i}: "${transcript}" (Final: ${isFinal})`);
        
        if (isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      console.log('✅ Final transcript:', finalTranscript);
      console.log('⏳ Interim transcript:', interimTranscript);
      
      if (finalTranscript) {
        setTranscript(prev => {
          const newTranscript = prev + finalTranscript;
          console.log('🔄 Updated transcript:', newTranscript);
          return newTranscript;
        });
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('OCR error:', event);
      setIsRecording(false);
      toast({
        title: "Recording error",
        description: `Error: ${event.error}`,
        variant: "destructive"
      });
    };

    recognitionInstance.onend = () => {
      console.log('🎤 Recording stopped!');
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Voice recognition ended",
      });
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [toast]);

  const startRecording = () => {
    console.log('🚀 Start recording clicked');
    if (recognition) {
      console.log('✅ Recognition instance found, starting...');
      setTranscript(''); // Clear previous transcript
      try {
        recognition.start();
        console.log('🎤 Recognition.start() called successfully');
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        toast({
          title: "Recording error",
          description: `Failed to start recording: ${error}`,
          variant: "destructive"
        });
      }
    } else {
      console.error('❌ No recognition instance available');
      toast({
        title: "Recording error",
        description: "Speech recognition not initialized",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    console.log('🛑 Stop recording clicked');
    if (recognition) {
      console.log('✅ Recognition instance found, stopping...');
      try {
        recognition.stop();
        console.log('🎤 Recognition.stop() called successfully');
      } catch (error) {
        console.error('❌ Error stopping recognition:', error);
      }
    } else {
      console.error('❌ No recognition instance available');
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  // Enhanced command processing
  const processVoiceCommand = async () => {
    if (!transcript.trim()) {
      toast({
        title: "No text to process",
        description: "Please record some voice input first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    onProcessing?.();

    try {
      const text = transcript.toLowerCase();
      console.log('🔍 Processing voice command:', text);

      // Check for AI extraction commands first
      const aiCommand = extractAICommand(text);
      console.log('🔍 Checking for AI commands. Text:', text, 'AI Command:', aiCommand);
      
      if (aiCommand) {
        console.log('🤖 AI extraction command detected:', aiCommand);
        setCommandMode(true);
        
        if (onPatientLookup) {
          // Pass the AI command info to the parent component
          const commandString = `AI_EXTRACTION:${aiCommand.type}:${aiCommand.patientName || 'ALL'}`;
          console.log('📤 Sending AI command to parent:', commandString);
          onPatientLookup(commandString);
          toast({
            title: "AI extraction command recognized",
            description: `Processing: ${aiCommand.type}${aiCommand.patientName ? ` for ${aiCommand.patientName}` : ''}`,
          });
        } else {
          toast({
            title: "AI extraction command",
            description: `Would process: ${aiCommand.type}${aiCommand.patientName ? ` for ${aiCommand.patientName}` : ''}`,
          });
        }
        return;
      }
      
      // Check for add medication commands BEFORE prescription detection
      if (isAddMedicationCommand(text)) {
        console.log('💊 Add medication command detected in text:', text);
        // Handle add medication command
        const medicationData = extractMedicationData(text);
        console.log('💊 Extracted medication data:', medicationData);
        if (medicationData && medicationData.patientName && medicationData.medication) {
          console.log('💊 Add medication command detected:', medicationData);
          setCommandMode(true);
          
          if (onAddMedication) {
            onAddMedication(medicationData.patientName, medicationData.medication);
            toast({
              title: "Medication addition initiated",
              description: `Adding medication for patient: ${medicationData.patientName}`,
            });
          } else {
            toast({
              title: "Medication addition",
              description: `Would add medication for: ${medicationData.patientName}`,
            });
          }
        } else {
          toast({
            title: "Command not recognized",
            description: "Please specify patient name and medication clearly",
            variant: "destructive"
          });
        }
        return;
      }
      
      // Check for patient lookup commands
      if (text.includes('open patient') || text.includes('find patient') || text.includes('show patient')) {
        const patientName = extractPatientName(text);
        if (patientName) {
          console.log('👤 Patient lookup requested for:', patientName);
          setCommandMode(true);
          
          if (onPatientLookup) {
            onPatientLookup(patientName);
            toast({
              title: "Patient lookup initiated",
              description: `Searching for patient: ${patientName}`,
            });
          } else {
            toast({
              title: "Patient lookup",
              description: `Would search for: ${patientName}`,
            });
          }
        } else {
          toast({
            title: "Command not recognized",
            description: "Please specify a patient name clearly",
            variant: "destructive"
          });
        }
      } else if (isMedicalPrescription(text)) {
        // Handle medical prescription dictation
        console.log('💊 Medical prescription dictation detected');
        setCommandMode(true);
        
        // Process the prescription text
        const prescriptionData = processPrescriptionText(transcript);
        
        toast({
          title: "Prescription Dictation Processed",
          description: `Captured prescription: ${prescriptionData.medicationCount} medications, ${prescriptionData.dosageCount} dosages`,
        });
        
        // Send the prescription text for processing
        onTextReady(transcript);
      } else {
        // Regular text processing
        console.log('📝 Regular text processing');
        onTextReady(transcript);
        
        toast({
          title: "Text processed successfully",
          description: "Voice input has been converted and sent for medical data extraction",
        });
      }
    } catch (error) {
      toast({
        title: "Processing error",
        description: "Failed to process the voice command",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Extract patient name from voice command
  const extractPatientName = (text: string): string | null => {
    // Patterns for patient lookup commands
    const patterns = [
      /open patient (.+?) (?:user profile|profile|details)/i,
      /find patient (.+?) (?:user profile|profile|details)/i,
      /show patient (.+?) (?:user profile|profile|details)/i,
      /open (.+?) (?:user profile|profile|details)/i,
      /find (.+?) (?:user profile|profile|details)/i,
      /show (.+?) (?:user profile|profile|details)/i,
      /patient (.+?) (?:user profile|profile|details)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  };

  // Extract AI extraction commands
  const extractAICommand = (text: string): { type: string; patientName?: string } | null => {
    const textLower = text.toLowerCase();
    
    // AI extraction commands - multiple patterns for better recognition
    if (textLower.includes('show me how ai extracted') || textLower.includes('show ai extraction')) {
      // Pattern 1: "Show me how AI extracted Priya's prescription"
      let patientMatch = text.match(/(?:show me how ai extracted|show ai extraction) (.+?)'s (prescription|medication|prescriptions|medications)/i);
      if (patientMatch) {
        return { type: 'ai_extraction', patientName: patientMatch[1].trim() };
      }
      
      // Pattern 2: "Show AI extraction for Priya"
      patientMatch = text.match(/(?:show ai extraction for|ai extraction for) (.+)/i);
      if (patientMatch) {
        return { type: 'ai_extraction', patientName: patientMatch[1].trim() };
      }
      
      // Pattern 3: "Show Priya's AI extraction"
      patientMatch = text.match(/(?:show|display) (.+?)'s ai extraction/i);
      if (patientMatch) {
        return { type: 'ai_extraction', patientName: patientMatch[1].trim() };
      }
    }
    
    // Show all patients AI extraction
    if (textLower.includes('show ai extraction for all') || textLower.includes('show all patients ai extraction') || 
        textLower.includes('show all ai extractions') || textLower.includes('ai extraction for all patients')) {
      return { type: 'ai_extraction_all' };
    }
    
    // Show AI extraction workflow
    if (textLower.includes('show ai extraction workflow') || textLower.includes('demonstrate ai extraction') ||
        textLower.includes('ai extraction workflow') || textLower.includes('show ai workflow')) {
      return { type: 'ai_workflow' };
    }
    
    return null;
  };

  // Check if the text contains medical prescription content
  const isMedicalPrescription = (text: string): boolean => {
    // If it's a command, don't treat as prescription
    if (isAddMedicationCommand(text) || text.toLowerCase().includes('add ')) {
      return false;
    }
    
    const prescriptionKeywords = [
      'mg', 'milligram', 'tablet', 'capsule', 'syrup', 'injection', 'dose', 'dosage',
      'twice daily', 'once daily', 'three times daily', 'before meals', 'after meals',
      'morning', 'evening', 'night', 'bedtime', 'as needed', 'prn', 'stat',
      'prescription', 'medication', 'medicine', 'drug', 'treatment', 'therapy'
    ];
    
    const isPrescription = prescriptionKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    
    console.log('🔍 Checking if text is medical prescription:', { text, isPrescription, matchedKeywords: prescriptionKeywords.filter(keyword => text.toLowerCase().includes(keyword.toLowerCase())) });
    
    return isPrescription;
  };

  // Process prescription text to extract key information
  const processPrescriptionText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    
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
    
    const medicationCount = uniqueMedications.size;
    const dosageCount = (text.match(/twice daily|once daily|three times daily|before meals|after meals|with meals/gi) || []).length;
    
    return {
      medicationCount,
      dosageCount,
      lineCount: lines.length,
      text: text,
      medications: Array.from(uniqueMedications)
    };
  };

  // Check if the text contains an "add medication" command
  const isAddMedicationCommand = (text: string): boolean => {
    const textLower = text.toLowerCase();
    const isCommand = textLower.includes('add medication') || textLower.includes('add medicine') || textLower.includes('add drug');
    console.log('🔍 Checking if text is add medication command:', { text, textLower, isCommand });
    return isCommand;
  };

  // Extract medication data from voice command
  const extractMedicationData = (text: string): { patientName: string; medication: string } | null => {
    const textLower = text.toLowerCase();
    
    // Pattern 1: "ADD medication [medication details] for [patient name]"
    let match = text.match(/add (?:medication|medicine|drug) (.+?) for (.+)/i);
    if (match && match[1] && match[2]) {
      return { 
        medication: match[1].trim(), 
        patientName: match[2].trim() 
      };
    }
    
    // Pattern 2: "ADD [medication details] for patient [patient name]"
    match = text.match(/add (.+?) for patient (.+)/i);
    if (match && match[1] && match[2]) {
      return { 
        medication: match[1].trim(), 
        patientName: match[2].trim() 
      };
    }
    
    // Pattern 3: "ADD medication for [patient name]: [medication details]"
    match = text.match(/add (?:medication|medicine|drug) for (.+?): (.+)/i);
    if (match && match[1] && match[2]) {
      return { 
        patientName: match[1].trim(), 
        medication: match[2].trim() 
      };
    }
    
    // Pattern 4: Handle "ADD medication" at the beginning (case insensitive)
    match = text.match(/add (?:medication|medicine|drug) (.+?) for (.+)/i);
    if (match && match[1] && match[2]) {
      return { 
        medication: match[1].trim(), 
        patientName: match[2].trim() 
      };
    }
    
    console.log('🔍 No medication pattern matched for text:', text);
    return null;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    toast({
      title: "Copied to clipboard",
      description: "Transcribed text has been copied",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {onPatientLookup ? '🎤 Voice Commands & Text Processing' : '🎤 Voice-to-Text for Medical Documents'}
          </CardTitle>
        </CardHeader>
      <CardContent className="space-y-4">
        {/* Command Mode Indicator - Only show when patient lookup is enabled */}
        {commandMode && onPatientLookup && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700">
              <Command className="w-4 h-4" />
              <span className="font-medium">Command Mode Active</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Voice commands are being processed for patient lookup and profile opening
            </p>
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={startRecording}
            disabled={isRecording}
            className="bg-green-600 hover:bg-green-700"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
          
          <Button
            onClick={stopRecording}
            disabled={!isRecording}
            variant="destructive"
          >
            <MicOff className="w-4 h-4 mr-2" />
            Stop Recording
          </Button>
          
          <Button
            onClick={clearTranscript}
            variant="outline"
            disabled={!transcript}
          >
            <Square className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            Status: {recognition ? 'Ready' : 'Initializing...'}
          </div>
          
          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              Recording... Speak now!
            </div>
          )}
          
          {!recognition && (
            <div className="text-red-600 text-sm">
              ⚠️ Speech recognition not available
            </div>
          )}
        </div>

        {/* Transcript Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Transcribed Text:</label>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={onPatientLookup 
              ? "Your voice will appear here as you speak... Try: 'Show me how AI extracted Priya's prescription'"
              : "Your voice will appear here as you speak... Dictate medical notes or prescriptions"
            }
            className="min-h-[200px] resize-none"
            disabled={isRecording}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={processVoiceCommand}
            disabled={!transcript.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isProcessing ? 'Processing...' : 'Process Voice Command'}
          </Button>
          
          <Button
            onClick={copyToClipboard}
            disabled={!transcript}
            variant="outline"
          >
            📋 Copy Text
          </Button>
          
          <Button
            onClick={() => {
              console.log('🧪 Test button clicked');
              console.log('Current state:', { isRecording, transcript, recognition: !!recognition, commandMode });
              toast({
                title: "Debug Info",
                description: `Recording: ${isRecording}, Has Recognition: ${!!recognition}, Transcript Length: ${transcript.length}, Command Mode: ${commandMode}`,
              });
            }}
            variant="outline"
            size="sm"
          >
            🧪 Debug
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium mb-2">💡 Voice Commands You Can Try:</h4>
          <ul className="list-disc list-inside space-y-1">
            {onPatientLookup && (
              <>
                <li><strong>Patient Lookup:</strong> "Open patient Priya Sharma user profile"</li>
                <li><strong>Patient Search:</strong> "Find patient John Doe profile"</li>
                <li><strong>Show Patient:</strong> "Show patient Sarah Wilson details"</li>
              </>
            )}
            <li><strong>Regular Dictation:</strong> Speak medical prescriptions or notes</li>
          </ul>
        </div>

        {/* Browser Support Note */}
        <div className="text-xs text-gray-500 text-center">
          💻 Works best in Chrome, Edge, and Safari. Requires microphone permission.
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceToText;
