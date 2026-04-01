import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, FileText, Users, BarChart3, Settings, ArrowRight, Zap, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DemoControlPanel from '@/components/demo/DemoControlPanel';

const DemoHub: React.FC = () => {
  const navigate = useNavigate();
  const demoFeatures = [
    {
      title: 'ABHA ID Lookup',
      description: 'Lightning-fast 3-second emergency patient profile retrieval',
      icon: <Users className="h-6 w-6" />,
      link: '/demo/abha-lookup',
      badge: 'Live Demo',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Patient Lookup',
      description: 'Find patient ABHA ID using name and date of birth',
      icon: <Users className="h-6 w-6" />,
      link: '/demo/patient-lookup',
      badge: 'Interactive',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Document Processing',
      description: 'AI-powered medical document extraction with 94%+ accuracy',
      icon: <FileText className="h-6 w-6" />,
      link: '/processor',
      badge: 'Interactive',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Voice Patient Lookup',
      description: 'Voice-activated patient search and profile opening',
      icon: <Users className="h-6 w-6" />,
      link: '/demo/voice-lookup',
      badge: 'New Feature',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time metrics, network effects, and revenue tracking',
      icon: <BarChart3 className="h-6 w-6" />,
      link: '/demo/analytics',
      badge: 'Real-time',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-4">Quantivara Demo Hub</h1>
            <p className="text-lg text-muted-foreground">
              Experience the future of Indian healthcare digitization
            </p>
          </div>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Demo Alert */}
      <Alert className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <Zap className="h-4 w-4" />
        <AlertTitle className="text-lg">Investor Demo Mode Active</AlertTitle>
        <AlertDescription className="mt-2">
          This demo showcases our platform's capabilities with realistic data. All features are fully functional 
          and demonstrate real-world scenarios. Use the control panel below to enhance your demo experience.
        </AlertDescription>
      </Alert>

      {/* Demo Features Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {demoFeatures.map((feature, index) => (
          <Card key={index} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <Link to={feature.link}>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <Badge variant="secondary">{feature.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Launch Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Platform Impact Metrics</CardTitle>
          <CardDescription>Real-world projections based on current network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">3 sec</p>
              <p className="text-sm text-muted-foreground">Emergency Lookup</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">94%+</p>
              <p className="text-sm text-muted-foreground">AI Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">₹5L+</p>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">50K+</p>
              <p className="text-sm text-muted-foreground">Patients Served</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Demo Control Panel
          </CardTitle>
          <CardDescription>
            Manage demo settings and simulate real-world scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemoControlPanel />
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Demo Script</CardTitle>
          <CardDescription>Follow this sequence for the best demo experience</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div>
                <p className="font-medium">Start with ABHA ID Lookup</p>
                <p className="text-sm text-muted-foreground">
                  Use ID: 1234-5678-9012-34 to demonstrate 3-second emergency retrieval
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <p className="font-medium">Show Document Processing</p>
                <p className="text-sm text-muted-foreground">
                  Click "Handwritten Rx" to showcase AI accuracy on challenging documents
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <div>
                <p className="font-medium">Open Analytics Dashboard</p>
                <p className="text-sm text-muted-foreground">
                  Demonstrate real-time metrics and network effects visualization
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <div>
                <p className="font-medium">Simulate Network Connection</p>
                <p className="text-sm text-muted-foreground">
                  Use control panel to create new lab-hospital connection and show revenue impact
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoHub;