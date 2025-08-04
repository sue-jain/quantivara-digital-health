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

  // Handle different document types
  if (documentType === 'Prescription' || documentType === 'Handwritten Prescription') {
    return <PrescriptionDisplay data={data} accuracy={accuracy} isHandwritten={documentType.includes('Handwritten')} />;
  }
  
  if (documentType === 'Lab Report') {
    return <LabReportDisplay data={data} accuracy={accuracy} />;
  }
  
  if (documentType === 'ECG Report') {
    return <ECGDisplay data={data} accuracy={accuracy} />;
  }

  // Default JSON display for unknown types
  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Data</CardTitle>
        {accuracy && <Badge variant="secondary">Accuracy: {accuracy}</Badge>}
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-auto p-4 bg-muted rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
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

export default ExtractedDataDisplay;