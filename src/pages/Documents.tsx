import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { mockDocuments, mockOrders } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FileText, Search, Eye, Download, CheckCircle, Clock, XCircle, Plus, Edit, Trash2 } from 'lucide-react';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <Clock className="h-4 w-4 text-warning" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-warning text-warning-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDocumentStats = () => {
    const total = mockDocuments.length;
    const approved = mockDocuments.filter(doc => doc.status === 'approved').length;
    const pending = mockDocuments.filter(doc => doc.status === 'uploaded').length;
    const rejected = mockDocuments.filter(doc => doc.status === 'rejected').length;
    
    return { total, approved, pending, rejected };
  };

  const stats = getDocumentStats();

  const documentColumns: DataTableColumn<typeof mockDocuments[0]>[] = [
    {
      key: 'document_id',
      header: 'Document ID',
      cell: (doc) => <span className="font-mono text-sm">{doc.document_id}</span>
    },
    {
      key: 'name',
      header: 'Document Name',
      cell: (doc) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{doc.name}</span>
        </div>
      )
    },
    {
      key: 'doc_type',
      header: 'Type',
      cell: (doc) => (
        <Badge variant="outline" className="capitalize">
          {doc.doc_type?.replace('_', ' ') || 'General'}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (doc) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(doc.status)}
          <Badge className={getStatusColor(doc.status)}>
            {doc.status}
          </Badge>
        </div>
      )
    },
    {
      key: 'upload_date',
      header: 'Upload Date',
      cell: () => (
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString()}
        </span>
      )
    }
  ];

  const documentActions: DataTableAction<typeof mockDocuments[0]>[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (doc) => {
        toast({
          title: "View Document",
          description: `Opening document: ${doc.name}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Download',
      icon: <Download className="h-4 w-4" />,
      onClick: (doc) => {
        toast({
          title: "Download Started",
          description: `Downloading ${doc.name}...`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (doc) => {
        toast({
          title: "Edit Document",
          description: `Edit functionality for ${doc.name} would be implemented here.`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (doc) => {
        toast({
          title: "Delete Document",
          description: `Delete functionality for ${doc.name} would be implemented here.`,
          variant: "destructive",
        });
      },
      variant: 'destructive'
    }
  ];

  const statusOptions = [
    { value: 'uploaded', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const typeOptions = [
    { value: 'passport', label: 'Passport' },
    { value: 'photo', label: 'Photo' },
    { value: 'financial', label: 'Financial' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'itinerary', label: 'Itinerary' }
  ];

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All uploaded documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Require resubmission</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <DataTable
        data={mockDocuments}
        columns={documentColumns}
        title="Document Management"
        description="View and manage documents from visa applications"
        searchPlaceholder="Search by document name or ID..."
        searchKeys={['name', 'document_id']}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: statusOptions
          },
          {
            key: 'doc_type',
            label: 'Type',
            options: typeOptions
          }
        ]}
        actions={documentActions}
        onAdd={() => navigate('/wizard')}
        addButtonLabel="New Application"
        emptyMessage="No documents found"
        emptyDescription="No documents match your current criteria."
      />

      {/* Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle>How Document Management Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-primary">Upload Documents</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Documents are uploaded during the visa application wizard process.
              </p>
            </div>
            
            <div className="p-4 bg-warning/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-warning" />
                <h4 className="font-semibold text-warning">Review Process</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Uploaded documents are reviewed by our verification team.
              </p>
            </div>
            
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <h4 className="font-semibold text-success">Approval & Processing</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Approved documents proceed to visa processing stage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;