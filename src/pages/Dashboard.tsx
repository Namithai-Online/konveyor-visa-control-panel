import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { mockOrders, mockSystemHealth, mockCountries, mockVisaTypes } from '@/data/mockData';
import { FileText, Users, Clock, CheckCircle, XCircle, Activity, TrendingUp, Globe, CreditCard, AlertTriangle, Plus, Eye, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
  const completedOrders = mockOrders.filter(order => order.status === 'completed').length;
  const rejectedOrders = mockOrders.filter(order => order.status === 'rejected').length;
  const inProgressOrders = mockOrders.filter(order => order.status === 'in_progress').length;
  
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  const processingEfficiency = totalOrders > 0 ? ((completedOrders + inProgressOrders) / totalOrders) * 100 : 0;
  
  const getDestinationCountry = (visaTypeId?: string) => {
    if (!visaTypeId) return 'Unknown';
    const visaType = mockVisaTypes.find(vt => vt.id === visaTypeId);
    if (!visaType) return 'Unknown';
    const country = mockCountries.find(c => c.id === visaType.country_id);
    return country?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'in_progress': return 'bg-info text-info-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Recent Applications DataTable Component
  const RecentApplicationsTable = () => {
    const recentOrders = mockOrders.slice(0, 5);

    const recentColumns: DataTableColumn<typeof mockOrders[0]>[] = [
      {
        key: 'order_id',
        header: 'Order ID',
        cell: (order) => <span className="font-medium font-mono text-sm">{order.order_id}</span>
      },
      {
        key: 'applicant',
        header: 'Applicant',
        cell: (order) => (
          <div>
            <div className="font-medium text-sm">
              {order.applicant?.first_name} {order.applicant?.last_name}
            </div>
            <div className="text-xs text-muted-foreground">{getDestinationCountry(order.visa_type_id)}</div>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Status',
        cell: (order) => (
          <Badge className={getStatusColor(order.status)} variant="outline">
            {order.status.replace('_', ' ')}
          </Badge>
        )
      },
      {
        key: 'created_at',
        header: 'Created',
        cell: (order) => (
          <span className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        )
      }
    ];

    const recentActions: DataTableAction<typeof mockOrders[0]>[] = [
      {
        label: 'View Details',
        icon: <Eye className="h-4 w-4" />,
        onClick: (order) => navigate(`/orders/${order.order_id}`),
        variant: 'ghost'
      }
    ];

    return (
      <div className="p-6">
        <DataTable
          data={recentOrders}
          columns={recentColumns}
          title=""
          searchKeys={[]}
          actions={recentActions}
          emptyMessage="No recent applications"
          emptyDescription="No applications have been submitted recently."
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">SMV Konveyor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your visa processing overview</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/orders/create')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Application
          </Button>
          <Button variant="outline" onClick={() => navigate('/orders')} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View All Orders
          </Button>
        </div>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-success rounded-full animate-pulse"></div>
                <span className="font-medium">All Systems Operational</span>
              </div>
              <Badge variant="outline" className="bg-success/10">
                99.9% Uptime
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing Efficiency</span>
                  <span>{processingEfficiency.toFixed(1)}%</span>
                </div>
                <Progress value={processingEfficiency} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span>{completionRate.toFixed(1)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/wizard')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Start Visa Wizard
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/documents')}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/countries')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Country Requirements
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              +12.5% from last month
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-warning/20 to-warning"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressOrders}</div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-info/20 to-info"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-success/20 to-success"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedOrders}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-destructive/20 to-destructive"></div>
        </Card>
      </div>

      {/* Recent Activity & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest visa application submissions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <RecentApplicationsTable />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <p className="text-lg font-bold text-success">$12,450</p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Pending Payments</p>
                  <p className="text-xs text-muted-foreground">Awaiting</p>
                </div>
                <p className="text-lg font-bold text-warning">$2,340</p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-info/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Processing Fees</p>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
                <p className="text-lg font-bold text-info">$89</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => navigate('/settings')}>
              View Financial Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;