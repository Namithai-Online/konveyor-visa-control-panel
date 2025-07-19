import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Key, Bell, Database, Shield, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [apiEndpoint, setApiEndpoint] = useState('https://api.smv-konveyor.com');
  const [useMockData, setUseMockData] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
    setIsSaving(false);
  };

  const handleResetSettings = () => {
    setApiEndpoint('https://api.smv-konveyor.com');
    setUseMockData(true);
    setEnableNotifications(true);
    setAutoRefresh(false);
    setRefreshInterval(30);
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your admin panel preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>Configure API endpoints and data sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Base URL</Label>
              <Input
                id="api-endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.smv-konveyor.com"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Use Mock Data</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between mock data and real API
                </p>
              </div>
              <Switch
                checked={useMockData}
                onCheckedChange={setUseMockData}
              />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={useMockData ? "destructive" : "default"} className={useMockData ? "" : "bg-success text-success-foreground"}>
                {useMockData ? "Mock Mode" : "Live API"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {useMockData ? "Using local mock data" : "Connected to live API"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>Current session and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Token</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={user?.token ? `${user.token.substring(0, 20)}...` : 'No token'}
                  readOnly
                  className="font-mono text-sm"
                />
                <Badge variant="outline">
                  {user?.isAuthenticated ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Token Expires</Label>
              <Input
                value={user?.expiresAt ? new Date(user.expiresAt).toLocaleString() : 'Unknown'}
                readOnly
                className="text-sm"
              />
            </div>

            <Button variant="destructive" onClick={logout} className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for order updates
                </p>
              </div>
              <Switch
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh data
                </p>
              </div>
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>

            {autoRefresh && (
              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 30)}
                  min={10}
                  max={300}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>Application and system details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Version</Label>
                <p className="font-mono">v1.0.0</p>
              </div>
              <div>
                <Label>Environment</Label>
                <p>Development</p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Build</Label>
                <p className="font-mono">#12345</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Order Management</Badge>
                <Badge variant="outline">Document Upload</Badge>
                <Badge variant="outline">Wizard Flow</Badge>
                <Badge variant="outline">Real-time Updates</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Save or reset your settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResetSettings}
            >
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;