import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockDocuments, mockOrders } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

const Documents: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [docType, setDocType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(files);
  };

  const handleSingleUpload = async () => {
    if (!selectedOrder || !uploadFiles.length || !docType) {
      toast({
        title: "Missing information",
        description: "Please select an order, document type, and file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Mock upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Document uploaded successfully",
        description: `${uploadFiles[0].name} has been uploaded for order ${selectedOrder}.`,
      });
      
      setUploadFiles([]);
      setDocType('');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the document.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedOrder || !uploadFiles.length) {
      toast({
        title: "Missing information",
        description: "Please select an order and files to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Mock bulk upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Bulk upload completed",
        description: `${uploadFiles.length} documents uploaded for order ${selectedOrder}.`,
      });
      
      setUploadFiles([]);
    } catch (error) {
      toast({
        title: "Bulk upload failed",
        description: "There was an error with the bulk upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground">Manage document uploads and status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Single Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Single Document Upload
              </CardTitle>
              <CardDescription>Upload a single document for an order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="order-select">Select Order</Label>
                <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockOrders.map((order) => (
                      <SelectItem key={order.order_id} value={order.order_id}>
                        {order.order_id} - {order.applicant?.first_name} {order.applicant?.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="doc-type">Document Type</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport Copy</SelectItem>
                    <SelectItem value="photo">Passport Photo</SelectItem>
                    <SelectItem value="financial">Financial Documents</SelectItem>
                    <SelectItem value="insurance">Travel Insurance</SelectItem>
                    <SelectItem value="itinerary">Travel Itinerary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>

              <Button 
                onClick={handleSingleUpload}
                disabled={isUploading || !selectedOrder || !uploadFiles.length || !docType}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </CardContent>
          </Card>

          {/* Bulk Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Bulk Document Upload
              </CardTitle>
              <CardDescription>Upload multiple documents at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bulk-order-select">Select Order</Label>
                <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockOrders.map((order) => (
                      <SelectItem key={order.order_id} value={order.order_id}>
                        {order.order_id} - {order.applicant?.first_name} {order.applicant?.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bulk-file-upload">Select Multiple Files</Label>
                <Input
                  id="bulk-file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {uploadFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {uploadFiles.length} file(s) selected
                  </p>
                )}
              </div>

              <Button 
                onClick={handleBulkUpload}
                disabled={isUploading || !selectedOrder || !uploadFiles.length}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : `Upload ${uploadFiles.length} Documents`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Status
            </CardTitle>
            <CardDescription>Overview of all uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDocuments.map((doc) => (
                <div key={doc.document_id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {doc.document_id}</p>
                      {doc.doc_type && (
                        <p className="text-xs text-muted-foreground capitalize">{doc.doc_type}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;