import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';

interface DemoSummaryProps {
  totalDocuments: number;
  avgAccuracy: number;
  processingTime: number;
}

const DemoSummary: React.FC<DemoSummaryProps> = ({ totalDocuments, avgAccuracy, processingTime }) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          AI Processing Summary
        </CardTitle>
        <CardDescription>
          Quantivara's AI-powered medical document analysis results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/50 rounded-lg border border-purple-100">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{totalDocuments}</div>
            <div className="text-sm text-purple-600">Documents Processed</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg border border-purple-100">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{avgAccuracy}%</div>
            <div className="text-sm text-green-600">Avg Accuracy</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg border border-purple-100">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{processingTime}s</div>
            <div className="text-sm text-blue-600">Avg Processing Time</div>
          </div>
          
          <div className="text-center p-4 bg-white/50 rounded-lg border border-purple-100">
            <Brain className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">AI</div>
            <div className="text-sm text-orange-600">Powered Analysis</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white/70 rounded-lg border border-purple-100">
          <h4 className="font-semibold mb-2 text-purple-900">Key Capabilities Demonstrated:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              🔍 Medical Entity Extraction
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              📊 Clinical Data Analysis
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              ⚡ Real-time Processing
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              🏥 Multi-format Support
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoSummary;