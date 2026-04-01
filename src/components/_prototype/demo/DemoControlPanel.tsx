import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, Play, Users, TrendingUp, Network, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import apiClient, { getApiUrl } from '@/config/api';

interface DemoStatus {
  demoMode: boolean;
  environment: string;
  version: string;
  metrics: {
    activeHospitals: number;
    activeLabs: number;
    dailyDocuments: number;
    averageAccuracy: number;
    networkConnections: number;
    monthlyRevenue: number;
    growthRate: string;
    systemUptime: string;
    processingSpeed: string;
    patientReach: string;
  };
  features: {
    abhaLookup: boolean;
    documentProcessing: boolean;
    realtimeAnalytics: boolean;
    networkEffects: boolean;
    revenueTracking: boolean;
  };
  lastUpdated: string;
}

const DemoControlPanel: React.FC = () => {
  const [demoStatus, setDemoStatus] = useState<DemoStatus | null>(null);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDemoStatus();
    fetchLiveStats();
    
    // Refresh live stats every 10 seconds
    const interval = setInterval(() => {
      fetchLiveStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDemoStatus = async () => {
    try {
      const response = await apiClient<DemoStatus>('/demo/status');
      setDemoStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch demo status:', error);
    }
  };

  const fetchLiveStats = async () => {
    try {
      const response = await apiClient<any>('/demo/live-stats');
      setLiveStats(response.data);
    } catch (error) {
      console.error('Failed to fetch live stats:', error);
    }
  };

  const resetDemoData = async () => {
    setLoading(true);
    try {
      await apiClient('/demo/reset', { method: 'POST' });
      toast({
        title: "Demo Reset",
        description: "Demo data has been reset successfully",
      });
      fetchDemoStatus();
      fetchLiveStats();
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset demo data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateConnection = async () => {
    setLoading(true);
    try {
      const response = await apiClient('/demo/simulate-connection', {
        method: 'POST',
        body: JSON.stringify({
          labId: Math.floor(Math.random() * 157) + 1,
          hospitalId: Math.floor(Math.random() * 12) + 1,
        }),
      });
      
      toast({
        title: "Connection Simulated",
        description: `New network connection created. Revenue: ${response.data.revenueGenerated}`,
      });
      
      fetchLiveStats();
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "Failed to simulate connection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!demoStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Demo Control Panel</h2>
          <p className="text-muted-foreground">Manage demo features and simulate events</p>
        </div>
        <Badge variant={demoStatus.demoMode ? "success" : "secondary"}>
          {demoStatus.demoMode ? 'Demo Mode Active' : 'Production Mode'}
        </Badge>
      </div>

      {/* Demo Alert */}
      <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <Settings className="h-4 w-4" />
        <AlertTitle>Investor Demo Controls</AlertTitle>
        <AlertDescription>
          Use these controls to enhance the demo experience. All changes are temporary and won't affect production data.
        </AlertDescription>
      </Alert>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Network Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStatus.metrics.activeHospitals + demoStatus.metrics.activeLabs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {demoStatus.metrics.activeHospitals} hospitals, {demoStatus.metrics.activeLabs} labs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Daily Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStatus.metrics.dailyDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {demoStatus.metrics.processingSpeed}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStatus.metrics.averageAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">AI extraction accuracy</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(demoStatus.metrics.monthlyRevenue / 100).toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">Growth: {demoStatus.metrics.growthRate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Control Tabs */}
      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actions">Demo Actions</TabsTrigger>
          <TabsTrigger value="stats">Live Statistics</TabsTrigger>
          <TabsTrigger value="features">Feature Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Simulate events and control demo behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={simulateConnection} disabled={loading}>
                  <Network className="mr-2 h-4 w-4" />
                  Simulate Lab-Hospital Connection
                </Button>
                
                <Button onClick={resetDemoData} variant="outline" disabled={loading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Demo Data
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Demo Scenarios</h4>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full justify-start">
                    <Play className="mr-2 h-4 w-4" />
                    Run Emergency Lookup Scenario
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <Play className="mr-2 h-4 w-4" />
                    Simulate High-Volume Processing
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <Play className="mr-2 h-4 w-4" />
                    Generate Revenue Spike
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Statistics</CardTitle>
              <CardDescription>Real-time demo metrics (updates every 10 seconds)</CardDescription>
            </CardHeader>
            <CardContent>
              {liveStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Documents Today</p>
                      <p className="text-2xl font-bold">{liveStats.documentsToday}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Currently Processing</p>
                      <p className="text-2xl font-bold">{liveStats.currentlyProcessing}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Today's Revenue</p>
                      <p className="text-2xl font-bold">{liveStats.todayRevenue}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Connections</p>
                      <p className="text-2xl font-bold">{liveStats.newConnections}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(liveStats.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading live statistics...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Status</CardTitle>
              <CardDescription>Current demo feature availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(demoStatus.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Badge variant={enabled ? "success" : "secondary"}>
                      {enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="space-y-1 text-sm">
                  <p><strong>Version:</strong> {demoStatus.version}</p>
                  <p><strong>Environment:</strong> {demoStatus.environment}</p>
                  <p><strong>System Uptime:</strong> {demoStatus.metrics.systemUptime}</p>
                  <p><strong>Patient Reach:</strong> {demoStatus.metrics.patientReach}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemoControlPanel;