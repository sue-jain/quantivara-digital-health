import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, User, Stethoscope, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface ExtractedDataProps {
  data: any;
  documentType: string;
  accuracy?: string;
}

export const ExtractedDataDisplay: React.FC<ExtractedDataProps> = ({ data, documentType, accuracy }) => {
  if (!data) return null;

  // Use documentType from data if not provided
  const actualDocumentType = documentType || data.documentType || 'Medical Document';
  
  // Handle different document types (case insensitive and flexible matching)
  const docTypeLower = actualDocumentType.toLowerCase();
  
  if (docTypeLower.includes('prescription')) {
    return <PrescriptionDisplay data={data} accuracy={accuracy || data.extractionAccuracy} isHandwritten={docTypeLower.includes('handwritten')} />;
  }
  
  if (docTypeLower.includes('lab') && docTypeLower.includes('report')) {
    return <LabReportDisplay data={data} accuracy={accuracy || data.extractionAccuracy} />;
  }
  
  if (docTypeLower.includes('ecg') || docTypeLower.includes('ekg')) {
    return <ECGDisplay data={data} accuracy={accuracy || data.extractionAccuracy} />;
  }

  if (docTypeLower.includes('xray') || docTypeLower.includes('x-ray')) {
    return <XRayDisplay data={data} accuracy={accuracy || data.extractionAccuracy} />;
  }
  
  if (docTypeLower.includes('discharge')) {
    return <DischargeSummaryDisplay data={data} accuracy={accuracy || data.extractionAccuracy} />;
  }
  
  if (docTypeLower.includes('ayurveda') || docTypeLower.includes('ayush')) {
    return <AyurvedaDisplay data={data} accuracy={accuracy || data.extractionAccuracy} />;
  }
  
  // For generic medical documents, try to display in a user-friendly way
  if (data.status && data.confidence) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              {actualDocumentType}
            </CardTitle>
            <Badge variant="secondary" className="bg-gray-100">
              {data.confidence || data.extractionAccuracy || accuracy} Confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{data.status}</span>
          </div>
          
          {data.suggestedCategory && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Suggested Category:</span> {data.suggestedCategory}
              </p>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              This appears to be a generic medical document. For better extraction results, 
              please ensure the document is properly categorized as a prescription, lab report, or ECG report.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Last resort - display data in a clean, non-JSON format
  return <GenericDocumentDisplay data={data} documentType={actualDocumentType} accuracy={accuracy || data.extractionAccuracy} />;
};

const PrescriptionDisplay: React.FC<{ data: any; accuracy?: string; isHandwritten: boolean }> = ({ 
  data, 
  accuracy, 
  isHandwritten 
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">
              {isHandwritten ? 'Handwritten Prescription' : 'Prescription'} Analysis
            </CardTitle>
          </div>
          <div className="flex gap-2">
            {accuracy && (
              <Badge variant="success" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                {accuracy} Accuracy
              </Badge>
            )}
            {isHandwritten && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                AI Extracted
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Patient Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            Patient Information
          </div>
          <div className="grid grid-cols-3 gap-4 pl-6">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">{data.patientInfo?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-medium">{data.patientInfo?.age || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="font-medium">{data.patientInfo?.gender || 'N/A'}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Doctor Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
            Doctor Information
          </div>
          <div className="pl-6">
            <p className="font-medium">{data.doctorInfo?.name || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">
              {data.doctorInfo?.registration} • {data.doctorInfo?.clinic}
            </p>
          </div>
        </div>

        <Separator />

        {/* Diagnosis */}
        {data.diagnosis && data.diagnosis.length > 0 && (
          <>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
              <div className="pl-6 space-y-1">
                {data.diagnosis.map((diag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="mr-2">
                    {diag}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Medications */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Prescribed Medications</p>
          <div className="space-y-3">
            {data.medications?.map((med: Medication, idx: number) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{med.name}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>💊 {med.dosage}</span>
                      <span>⏰ {med.frequency}</span>
                      <span>📅 {med.duration}</span>
                    </div>
                    <p className="text-sm text-blue-600">{med.instructions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advice */}
        {data.advice && data.advice.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Medical Advice</p>
              <ul className="pl-6 space-y-1">
                {data.advice.map((adv: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Follow Up */}
        {data.followUp && (
          <>
            <Separator />
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Follow-up:</span> {data.followUp}
              </span>
            </div>
          </>
        )}

        {/* AI Notes for Handwritten */}
        {isHandwritten && data.aiNotes && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              AI Note: {data.aiNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LabReportDisplay: React.FC<{ data: any; accuracy?: string }> = ({ data, accuracy }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Lab Report Analysis
          </CardTitle>
          {accuracy && (
            <Badge variant="success" className="bg-green-100 text-green-800">
              {accuracy} Accuracy
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Patient Info */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Patient</p>
            <p className="font-medium">{data.patientInfo?.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Age/Gender</p>
            <p className="font-medium">{data.patientInfo?.age}, {data.patientInfo?.gender}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sample ID</p>
            <p className="font-medium">{data.patientInfo?.sampleId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Report Date</p>
            <p className="font-medium">{data.labInfo?.reportDate}</p>
          </div>
        </div>

        <Separator />

        {/* Test Results */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Test Results</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Test</th>
                  <th className="text-left py-2">Value</th>
                  <th className="text-left py-2">Normal Range</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.tests?.map((test: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{test.name}</td>
                    <td className="py-2">{test.value} {test.unit}</td>
                    <td className="py-2 text-muted-foreground">{test.normalRange}</td>
                    <td className="py-2">
                      <Badge 
                        variant={test.status === 'NORMAL' ? 'success' : 'destructive'}
                        className={test.critical ? 'animate-pulse' : ''}
                      >
                        {test.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="flex gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Critical Values</p>
            <p className="text-lg font-bold text-red-600">{data.criticalValues || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Abnormal Values</p>
            <p className="text-lg font-bold text-orange-600">{data.abnormalValues || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ECGDisplay: React.FC<{ data: any; accuracy?: string }> = ({ data, accuracy }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">ECG Report Analysis</CardTitle>
          {accuracy && <Badge variant="secondary">{accuracy} Accuracy</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Findings</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(data.findings || {}).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-muted-foreground">{key}</p>
                  <p className="font-medium">{value as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Interpretation</p>
            <p className="mt-1">{data.interpretation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const XRayDisplay: React.FC<{ data: any; accuracy?: string }> = ({ data, accuracy }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            X-Ray Report Analysis
          </CardTitle>
          {accuracy && (
            <Badge variant="success" className="bg-green-100 text-green-800">
              {accuracy} Accuracy
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Patient Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            Patient Information
          </div>
          <div className="grid grid-cols-3 gap-4 pl-6">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">{data.patientInfo?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age/Gender</p>
              <p className="font-medium">{data.patientInfo?.age}, {data.patientInfo?.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Study ID</p>
              <p className="font-medium">{data.patientInfo?.studyId || 'N/A'}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Study Details */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Study Details</p>
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <p className="text-xs text-muted-foreground">Exam Type</p>
              <p className="font-medium">{data.studyDetails?.examType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{data.studyDetails?.date}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Findings */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Radiological Findings</p>
          <ul className="pl-6 space-y-2">
            {data.findings?.map((finding: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Impression */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">Impression</p>
          <p className="text-sm text-blue-800">{data.impression}</p>
        </div>

        {/* Recommendation */}
        {data.recommendation && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Recommendation:</span> {data.recommendation}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DischargeSummaryDisplay: React.FC<{ data: any; accuracy?: string }> = ({ data, accuracy }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Discharge Summary Analysis
          </CardTitle>
          {accuracy && (
            <Badge variant="success" className="bg-green-100 text-green-800">
              {accuracy} Accuracy
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Patient & Admission Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Patient Details</p>
            <div className="pl-4 space-y-1">
              <p className="font-medium">{data.patientInfo?.name}</p>
              <p className="text-sm text-muted-foreground">{data.patientInfo?.age}, {data.patientInfo?.gender}</p>
              <p className="text-xs text-muted-foreground">IP: {data.patientInfo?.ipNumber}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Admission Details</p>
            <div className="pl-4 space-y-1">
              <p className="text-sm">Admitted: {data.admissionDetails?.admissionDate}</p>
              <p className="text-sm">Discharged: {data.admissionDetails?.dischargeDate}</p>
              <p className="text-sm font-medium text-blue-600">Stay: {data.admissionDetails?.totalStay}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Diagnosis */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
          <div className="pl-6">
            <div className="mb-2">
              <Badge variant="default" className="mb-1">Primary</Badge>
              <p className="font-medium">{data.diagnosis?.primary}</p>
            </div>
            {data.diagnosis?.secondary && data.diagnosis.secondary.length > 0 && (
              <div>
                <Badge variant="outline" className="mb-1">Secondary</Badge>
                <ul className="space-y-1 mt-1">
                  {data.diagnosis.secondary.map((diag: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {diag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Procedures */}
        {data.procedures && data.procedures.length > 0 && (
          <>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Procedures Performed</p>
              <ul className="pl-6 space-y-1">
                {data.procedures.map((proc: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Stethoscope className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">{proc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
          </>
        )}

        {/* Discharge Medications */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Discharge Medications</p>
          <div className="grid grid-cols-2 gap-3">
            {data.dischargeMedications?.map((med: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-sm">💊 {med}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-900 mb-2">Follow-up Instructions</p>
          <ul className="space-y-1">
            {data.followUp?.map((instruction: string, idx: number) => (
              <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                <Calendar className="h-3 w-3 mt-0.5" />
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const AyurvedaDisplay: React.FC<{ data: any; accuracy?: string }> = ({ data, accuracy }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Ayurvedic Prescription Analysis
          </CardTitle>
          {accuracy && (
            <Badge variant="success" className="bg-green-100 text-green-800">
              {accuracy} Accuracy
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Patient Info with Constitution */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            Patient Information
          </div>
          <div className="grid grid-cols-3 gap-4 pl-6">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">{data.patientInfo?.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age/Gender</p>
              <p className="font-medium">{data.patientInfo?.age}, {data.patientInfo?.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Prakriti</p>
              <p className="font-medium text-green-700">{data.patientInfo?.constitution}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Doctor Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
            Vaidya Information
          </div>
          <div className="pl-6">
            <p className="font-medium">{data.doctorInfo?.name}</p>
            <p className="text-sm text-muted-foreground">
              {data.doctorInfo?.registration} • {data.doctorInfo?.clinic}
            </p>
          </div>
        </div>

        <Separator />

        {/* Diagnosis */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Roga Nidan (Diagnosis)</p>
          <div className="pl-6">
            <Badge variant="outline" className="bg-green-50">
              {data.diagnosis}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Medicines */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Aushadhi (Medicines)</p>
          <div className="space-y-3">
            {data.medicines?.map((med: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4 bg-green-50/50">
                <p className="font-medium text-green-900">{med.name}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Matra:</span> {med.dosage}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kala:</span> {med.frequency}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Anupana:</span> {med.anupana}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avadhi:</span> {med.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Advice */}
        {data.dietaryAdvice && data.dietaryAdvice.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Pathya (Dietary Guidelines)</p>
              <ul className="pl-6 space-y-1">
                {data.dietaryAdvice.map((advice: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-green-600">🌿</span>
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Lifestyle */}
        {data.lifestyle && data.lifestyle.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Vihara (Lifestyle)</p>
              <ul className="pl-6 space-y-1">
                {data.lifestyle.map((item: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-teal-600">☯</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const GenericDocumentDisplay: React.FC<{ data: any; documentType: string; accuracy?: string }> = ({ 
  data, 
  documentType, 
  accuracy 
}) => {
  // Helper function to format keys
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to render value
  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return 'N/A';
    
    if (typeof value === 'boolean') {
      return value ? (
        <Badge variant="success">Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <ul className="space-y-1">
          {value.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{typeof item === 'object' ? renderValue(item) : item}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    if (typeof value === 'object') {
      return (
        <div className="space-y-2 pl-4 border-l-2 border-gray-200">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs text-muted-foreground">{formatKey(k)}</p>
              <div className="text-sm">{renderValue(v)}</div>
            </div>
          ))}
        </div>
      );
    }
    
    return String(value);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            {documentType} Analysis
          </CardTitle>
          {accuracy && (
            <Badge variant="secondary" className="bg-gray-100">
              {accuracy} Accuracy
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {Object.entries(data)
            .filter(([key]) => !['documentType', 'extractionAccuracy'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {formatKey(key)}
                </p>
                <div className="pl-2">{renderValue(value)}</div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtractedDataDisplay;