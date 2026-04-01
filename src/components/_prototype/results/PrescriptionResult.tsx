import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Stethoscope, Pill, CalendarDays, AlertTriangle } from 'lucide-react';

interface PrescriptionData {
  documentType: string;
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    patientId: string;
  };
  doctorInfo: {
    name: string;
    registration: string;
    clinic: string;
  };
  diagnosis: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  advice: string[];
  followUp: string;
  extractionAccuracy: string;
}

interface PrescriptionResultProps {
  data: PrescriptionData;
}

const PrescriptionResult: React.FC<PrescriptionResultProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Header with Accuracy */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Prescription Analysis</h3>
        </div>
        <Badge variant="success" className="text-sm">
          {data.extractionAccuracy} Accuracy
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{data.patientInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{data.patientInfo.age}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{data.patientInfo.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <p className="font-medium text-blue-600">{data.patientInfo.patientId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Doctor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-medium">{data.doctorInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration</p>
              <p className="font-medium text-green-600">{data.doctorInfo.registration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clinic</p>
              <p className="font-medium">{data.doctorInfo.clinic}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.diagnosis.map((condition, index) => (
              <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {condition}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescribed Medications
          </CardTitle>
          <CardDescription>AI extracted {data.medications.length} medications with dosage details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.medications.map((med, index) => (
              <div key={index} className="border rounded-lg p-4 bg-blue-50/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Medicine</p>
                    <p className="font-semibold text-blue-700">{med.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dosage</p>
                    <p className="font-medium">{med.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="font-medium">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{med.duration}</p>
                  </div>
                </div>
                {med.instructions && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-sm text-muted-foreground">Instructions</p>
                    <p className="text-sm">{med.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advice & Follow-up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Medical Advice</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.advice.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-medium text-yellow-800">{data.followUp}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionResult;