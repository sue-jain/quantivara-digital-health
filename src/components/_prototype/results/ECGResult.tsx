import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, User, Calendar, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface ECGData {
  documentType: string;
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    recordId: string;
  };
  testDetails: {
    date: string;
    time: string;
    technician: string;
    machine: string;
  };
  measurements: {
    heartRate: string;
    prInterval: string;
    qrsDuration: string;
    qtInterval: string;
    axis: string;
  };
  rhythm: string;
  findings: string[];
  interpretation: string;
  urgency: string;
  extractionAccuracy: string;
}

interface ECGResultProps {
  data: ECGData;
}

const ECGResult: React.FC<ECGResultProps> = ({ data }) => {
  const getUrgencyColor = (urgency: string) => {
    if (urgency.toLowerCase().includes('urgent') || urgency.toLowerCase().includes('immediate')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (urgency.toLowerCase().includes('routine')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getInterpretationIcon = (interpretation: string) => {
    if (interpretation.toLowerCase().includes('normal')) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <AlertTriangle className="h-5 w-5 text-orange-600" />;
  };

  const isAbnormal = !data.interpretation.toLowerCase().includes('normal');

  return (
    <div className="space-y-6">
      {/* Header with Accuracy */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-600" />
          <h3 className="text-xl font-semibold">ECG Analysis</h3>
        </div>
        <Badge variant="success" className="text-sm">
          {data.extractionAccuracy} Accuracy
        </Badge>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{data.measurements.heartRate}</div>
            <div className="text-sm text-muted-foreground">Heart Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{data.measurements.prInterval}</div>
            <div className="text-sm text-muted-foreground">PR Interval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{data.measurements.qrsDuration}</div>
            <div className="text-sm text-muted-foreground">QRS Duration</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{data.measurements.qtInterval}</div>
            <div className="text-sm text-muted-foreground">QT Interval</div>
          </CardContent>
        </Card>
      </div>

      {/* Patient & Test Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-sm text-muted-foreground">Record ID</p>
                <p className="font-medium text-blue-600">{data.patientInfo.recordId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Test Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{data.testDetails.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{data.testDetails.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Technician</p>
                <p className="font-medium">{data.testDetails.technician}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Machine</p>
                <p className="font-medium">{data.testDetails.machine}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rhythm Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Rhythm Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Heart className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Detected Rhythm</p>
              <p className="text-lg font-semibold text-blue-900">{data.rhythm}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Measurements Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Measurements</CardTitle>
          <CardDescription>AI extracted cardiac intervals and parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Heart Rate</span>
                <span className="text-lg font-bold text-red-600">{data.measurements.heartRate}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">PR Interval</span>
                <span className="text-lg font-bold text-blue-600">{data.measurements.prInterval}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">QRS Duration</span>
                <span className="text-lg font-bold text-green-600">{data.measurements.qrsDuration}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">QT Interval</span>
                <span className="text-lg font-bold text-purple-600">{data.measurements.qtInterval}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Axis</span>
                <span className="text-lg font-bold text-gray-700">{data.measurements.axis}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getInterpretationIcon(data.interpretation)}
            Clinical Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.findings.map((finding, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{finding}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interpretation & Urgency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getInterpretationIcon(data.interpretation)}
              Clinical Interpretation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border ${isAbnormal ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
              <p className={`font-medium ${isAbnormal ? 'text-orange-800' : 'text-green-800'}`}>
                {data.interpretation}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Priority Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={`${getUrgencyColor(data.urgency)} text-lg px-4 py-2`}>
              {data.urgency}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Based on AI analysis of cardiac parameters
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ECGResult;