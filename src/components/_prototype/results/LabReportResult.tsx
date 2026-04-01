import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, User, Building, Brain } from 'lucide-react';

interface LabTest {
  category?: string;
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'LOW' | 'HIGH' | 'NORMAL';
  critical?: boolean;
}

interface LabReportData {
  documentType: string;
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    patientId?: string;
    reportNo?: string;
    sampleId?: string;
  };
  labInfo: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    accreditation?: string;
    collectionDate?: string;
    reportDate: string;
    referredBy?: string;
    sampleType?: string;
  };
  tests: LabTest[];
  criticalValues: number;
  abnormalValues: number;
  aiInsights?: string[];
  clinicalInterpretation?: {
    title: string;
    findings: string[];
  };
  extractionAccuracy: string;
}

interface LabReportResultProps {
  data: LabReportData;
}

const LabReportResult: React.FC<LabReportResultProps> = ({ data }) => {
  console.log('LabReportResult rendering with data:', data);
  
  if (!data) {
    return <div className="p-4 text-red-600">Error: No lab report data provided</div>;
  }
  
  if (!data.tests || !Array.isArray(data.tests)) {
    return <div className="p-4 text-red-600">Error: Invalid test data format</div>;
  }
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

  // Group tests by category for display
  const groupedTests = data.tests.reduce((acc, test) => {
    const category = test.category || 'Other Tests';
    if (!acc[category]) acc[category] = [];
    acc[category].push(test);
    return acc;
  }, {} as Record<string, LabTest[]>);

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
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{data.patientInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age/Gender</p>
                  <p className="font-medium">{data.patientInfo.age}, {data.patientInfo.gender}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {data.patientInfo.patientId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Patient ID</p>
                    <p className="font-medium text-blue-600">{data.patientInfo.patientId}</p>
                  </div>
                )}
                {data.patientInfo.reportNo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Report No</p>
                    <p className="font-medium text-green-600">{data.patientInfo.reportNo}</p>
                  </div>
                )}
              </div>
              
              {/* Fallback for sampleId if reportNo not available */}
              {!data.patientInfo.reportNo && data.patientInfo.sampleId && (
                <div>
                  <p className="text-sm text-muted-foreground">Sample ID</p>
                  <p className="font-medium text-blue-600">{data.patientInfo.sampleId}</p>
                </div>
              )}
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
              <p className="font-medium text-xs">{data.labInfo.address}</p>
            </div>
            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              {data.labInfo.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-xs">{data.labInfo.phone}</p>
                </div>
              )}
              {data.labInfo.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-xs">{data.labInfo.email}</p>
                </div>
              )}
            </div>
            {/* Accreditation */}
            {data.labInfo.accreditation && (
              <div>
                <p className="text-sm text-muted-foreground">Accreditation</p>
                <p className="font-medium text-xs text-blue-600">{data.labInfo.accreditation}</p>
              </div>
            )}
            {/* Referred By */}
            {data.labInfo.referredBy && (
              <div>
                <p className="text-sm text-muted-foreground">Referred By</p>
                <p className="font-medium">{data.labInfo.referredBy}</p>
              </div>
            )}
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              {data.labInfo.collectionDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Collection Date</p>
                  <p className="font-medium">{data.labInfo.collectionDate}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Report Date</p>
                <p className="font-medium text-green-600">{data.labInfo.reportDate}</p>
              </div>
            </div>
            {/* Sample Type */}
            {data.labInfo.sampleType && (
              <div>
                <p className="text-sm text-muted-foreground">Sample Type</p>
                <p className="font-medium">{data.labInfo.sampleType}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Score Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {healthScore >= 80 ? "🌟" : healthScore >= 60 ? "💪" : healthScore >= 40 ? "⚖️" : "🎯"}
            Your Health Snapshot
          </CardTitle>
          <CardDescription>
            {healthScore >= 80 ? "Great news! Most of your lab values are in the normal range." :
             healthScore >= 60 ? "Good overall health with some areas to monitor." :
             healthScore >= 40 ? "Mixed results - discuss with your doctor for guidance." :
             "Several values need attention - follow up with your healthcare provider."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">Health Score</span>
              <span className={`text-2xl font-bold ${healthScore >= 70 ? 'text-green-600' : healthScore >= 50 ? 'text-yellow-600' : 'text-orange-600'}`}>
                {healthScore}%
              </span>
            </div>
            <Progress value={healthScore} className="h-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Needs Attention</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>{normalTests}</strong> out of <strong>{data.tests.length}</strong> test results are within normal range.
                {data.abnormalValues > 0 && ` ${data.abnormalValues} values may need attention.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results grouped by category */}
      {Object.entries(groupedTests).map(([category, tests]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>{tests.length} parameters analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tests.map((test, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{test.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(test.status, test.critical || false)} flex items-center gap-1`}
                    >
                      {getStatusIcon(test.status, test.critical || false)}
                      {test.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Value</p>
                      <p className="font-bold text-base">{test.value} {test.unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Normal Range</p>
                      <p className="font-medium">{test.normalRange} {test.unit}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      {test.status !== 'NORMAL' && (
                        <div className="text-sm font-medium">
                          {test.status === 'HIGH' ? (
                            <span className="text-orange-700 bg-orange-100 px-2 py-1 rounded-full">📈 Higher than normal</span>
                          ) : (
                            <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">📉 Lower than normal</span>
                          )}
                        </div>
                      )}
                      {test.status === 'NORMAL' && (
                        <div className="text-sm font-medium">
                          <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full">✅ Normal</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Clinical Interpretation */}
      {data.clinicalInterpretation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              Doctor's Analysis
            </CardTitle>
            <CardDescription>Professional medical findings from your lab report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.clinicalInterpretation.findings.map((finding, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    🩺
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-gray-800 leading-relaxed">{finding}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> Discuss these findings with your doctor to understand what they mean for your health and any recommended follow-up actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {data.aiInsights && data.aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Health Summary & Recommendations
            </CardTitle>
            <CardDescription>AI-powered insights to help you understand your results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                    💡
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-gray-800 leading-relaxed">{insight}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> These AI insights are for informational purposes only. Always consult with your healthcare provider for medical advice and treatment decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LabReportResult;