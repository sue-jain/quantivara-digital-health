import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, Users, IndianRupee, FileText, Server, Zap, Network, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import analyticsService, { LiveAnalyticsUpdate } from '@/services/analytics';
import webSocketService from '@/services/websocket';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, description, trend = 'neutral' }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {change !== undefined && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-4 w-4 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
            <span className={`text-xs ml-1 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveAnalyticsUpdate | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [networkEffects, setNetworkEffects] = useState<any>(null);
  const [revenueStream, setRevenueStream] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  useEffect(() => {
    // Connect to WebSocket
    if (!webSocketService.isConnected()) {
      webSocketService.connect({
        onOpen: () => {
          setWsConnected(true);
          // Start analytics subscription
          analyticsService.startLiveAnalytics((data) => {
            setLiveData(data);
            setLastUpdate(new Date());
          });
          
          // Subscribe to network effects
          analyticsService.subscribeToNetworkUpdates((data) => {
            setNetworkEffects(data);
          });
          
          // Subscribe to revenue updates
          analyticsService.subscribeToRevenueUpdates((data) => {
            setRevenueStream(data);
          });
        },
        onClose: () => {
          setWsConnected(false);
        }
      });
    } else {
      // Already connected, start subscriptions
      analyticsService.startLiveAnalytics((data) => {
        setLiveData(data);
        setLastUpdate(new Date());
      });
    }
    
    // Fallback to demo data if no WebSocket
    if (!liveData) {
      setLiveData(analyticsService.generateDemoAnalytics());
    }
    
    return () => {
      analyticsService.stopLiveUpdates();
    };
  }, []);
  
  const refreshData = () => {
    if (wsConnected) {
      webSocketService.send('get_live_analytics', {});
    } else {
      setLiveData(analyticsService.generateDemoAnalytics());
      setLastUpdate(new Date());
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Real-time Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor platform performance, revenue, and network effects in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={wsConnected ? "success" : "secondary"} className="gap-1">
              <Activity className="h-3 w-3" />
              {wsConnected ? 'Live' : 'Demo Mode'}
            </Badge>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Last Update Time */}
        <div className="mt-4 text-sm text-muted-foreground">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Documents Processing"
          value={liveData?.currentlyProcessing || 0}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description="Real-time processing queue"
        />
        
        <MetricCard
          title="Completed Today"
          value={liveData?.completedToday || 0}
          change={12}
          trend="up"
          icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          description="Documents processed"
        />
        
        <MetricCard
          title="Average Accuracy"
          value={liveData?.averageAccuracy || '94%'}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          description="AI extraction accuracy"
        />
        
        <MetricCard
          title="Daily Revenue"
          value={liveData?.dailyRevenue || '₹45,000'}
          change={8}
          trend="up"
          icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />}
          description="Revenue generated today"
        />
      </div>
      
      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="network">Network Effects</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Stream</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Processing Status */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
                <CardDescription>Real-time document processing metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Queue Length</span>
                    <span className="text-sm text-muted-foreground">
                      {liveData?.processingQueue || 0} documents
                    </span>
                  </div>
                  <Progress value={((liveData?.processingQueue || 0) / 10) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Server Load</span>
                    <span className="text-sm text-muted-foreground">
                      {((liveData?.serverLoad || 0.2) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={(liveData?.serverLoad || 0.2) * 100} className="h-2" />
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Providers</span>
                    <Badge variant="secondary">{liveData?.activeProviders || 25}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Document Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Document Types Processed</CardTitle>
                <CardDescription>Distribution of document types today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Prescriptions', count: 89, percentage: 35 },
                    { type: 'Lab Reports', count: 76, percentage: 30 },
                    { type: 'Discharge Summaries', count: 51, percentage: 20 },
                    { type: 'ECG Reports', count: 25, percentage: 10 },
                    { type: 'Other', count: 13, percentage: 5 },
                  ].map((doc) => (
                    <div key={doc.type}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{doc.type}</span>
                        <span className="text-sm text-muted-foreground">{doc.count}</span>
                      </div>
                      <Progress value={doc.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Effects Visualization</CardTitle>
              <CardDescription>Real-time connections between labs and hospitals</CardDescription>
            </CardHeader>
            <CardContent>
              {networkEffects ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{networkEffects.totalConnections}</p>
                      <p className="text-sm text-muted-foreground">Total Connections</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{networkEffects.activeTransfers}</p>
                      <p className="text-sm text-muted-foreground">Active Transfers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2.3x</p>
                      <p className="text-sm text-muted-foreground">Network Effect</p>
                    </div>
                  </div>
                  
                  {networkEffects.recentConnection && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Latest Connection</p>
                      <p className="text-sm text-muted-foreground">
                        {networkEffects.recentConnection.lab} → {networkEffects.recentConnection.hospital}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(networkEffects.recentConnection.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Network className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-muted-foreground">Network visualization loading...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Stream</CardTitle>
                <CardDescription>Live revenue tracking</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueStream ? (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-3xl font-bold text-green-600">
                        {revenueStream.realtimeRevenue}
                      </p>
                      <p className="text-sm text-muted-foreground">Current Session Revenue</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Recent Transaction</p>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-medium">{revenueStream.recentTransaction.type}</p>
                        <p className="text-lg text-green-600">{revenueStream.recentTransaction.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(revenueStream.recentTransaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium">Monthly Projection</p>
                      <p className="text-2xl font-bold">{revenueStream.monthlyProjection}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-3xl font-bold text-green-600">₹2,850</p>
                      <p className="text-sm text-muted-foreground">Current Session Revenue</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue sources distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'Lab Monthly Fees', amount: '₹175,000', percentage: 35 },
                    { source: 'Hospital Network Fees', amount: '₹200,000', percentage: 40 },
                    { source: 'Per-Report Processing', amount: '₹125,000', percentage: 25 },
                  ].map((item) => (
                    <div key={item.source}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.source}</span>
                        <span className="text-sm font-medium">{item.amount}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Monthly Revenue</span>
                      <span className="font-bold text-lg">₹500,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Real-time system health and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">API Response Time</span>
                      <Badge variant="success">Excellent</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={95} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground">45ms</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Database Performance</span>
                      <Badge variant="success">Optimal</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={88} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground">12ms</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">AI Processing Speed</span>
                      <Badge variant="secondary">Good</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground">2.1s/doc</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Infrastructure Status
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Uptime</span>
                        <span className="font-medium">99.98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Error Rate</span>
                        <span className="font-medium">0.02%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Sessions</span>
                        <span className="font-medium">342</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm font-medium mb-1">System Health</p>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">All systems operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;