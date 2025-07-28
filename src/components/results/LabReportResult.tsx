import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, User, Building, Brain } from 'lucide-react';

interface LabTest {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'LOW' | 'HIGH' | 'NORMAL';
  critical: boolean;
}

interface LabReportData {
  documentType: string;
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    sampleId: string;
  };
  labInfo: {
    name: string;
    address: string;
    reportDate: string;
  };
  tests: LabTest[];
  criticalValues: number;
  abnormalValues: number;
  aiInsights: string[];
  extractionAccuracy: string;
}

interface LabReportResultProps {
  data: LabReportData;
}

const LabReportResult: React.FC<LabReportResultProps> = ({ data }) => {
  const getStatusColor = (status: string, critical: boolean) => {
    if (critical) return 'bg-red-100 text-red-800 border-red-200';
    if (status === 'HIGH') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (status === 'LOW') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusIcon = (status: string, critical: boolean) => {
    if (critical) return <AlertTriangle className="h-4 w-4" />;
    if (status === 'NORMAL') return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const normalTests = data.tests.filter(t => t.status === 'NORMAL').length;
  const healthScore = Math.round((normalTests / data.tests.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Accuracy */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold">Lab Report Analysis</h3>
        </div>
        <Badge variant="success" className="text-sm">
          {data.extractionAccuracy} Accuracy
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{data.tests.length}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{data.criticalValues}</div>
            <div className="text-sm text-muted-foreground">Critical Values</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{data.abnormalValues}</div>
            <div className="text-sm text-muted-foreground">Abnormal Values</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{healthScore}%</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Patient & Lab Info */}
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
                <p className="text-sm text-muted-foreground">Sample ID</p>
                <p className="font-medium text-blue-600">{data.patientInfo.sampleId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Laboratory Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Laboratory</p>
              <p className="font-medium">{data.labInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{data.labInfo.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Report Date</p>
              <p className="font-medium text-green-600">{data.labInfo.reportDate}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Score Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Health Assessment</CardTitle>
          <CardDescription>Based on {data.tests.length} laboratory parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Health Score</span>
              <span className="text-lg font-bold text-green-600">{healthScore}%</span>
            </div>
            <Progress value={healthScore} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Test Results</CardTitle>
          <CardDescription>AI extracted and analyzed {data.tests.length} laboratory parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.tests.map((test, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{test.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(test.status, test.critical)} flex items-center gap-1`}
                    >
                      {getStatusIcon(test.status, test.critical)}
                      {test.status}
                      {test.critical && " (Critical)"}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Result</p>
                    <p className="font-medium text-lg">{test.value} {test.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Normal Range</p>
                    <p className="font-medium">{test.normalRange} {test.unit}</p>
                  </div>
                  <div className="flex items-center">
                    {test.status !== 'NORMAL' && (
                      <div className="text-xs text-muted-foreground">
                        {test.status === 'HIGH' ? '↗️ Above normal' : '↙️ Below normal'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Clinical Insights
          </CardTitle>
          <CardDescription>Automated analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabReportResult;