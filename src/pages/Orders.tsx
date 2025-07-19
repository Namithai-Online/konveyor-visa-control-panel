import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { mockOrders } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Trash2, Plus, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'in_progress': return 'bg-info text-info-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'in_progress': return <Activity className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const orderColumns: DataTableColumn<typeof mockOrders[0]>[] = [
    {
      key: 'order_id',
      header: 'Order ID',
      cell: (order) => <span className="font-medium font-mono">{order.order_id}</span>
    },
    {
      key: 'applicant',
      header: 'Applicant',
      cell: (order) => (
        <div>
          <div className="font-medium">
            {order.applicant?.first_name} {order.applicant?.last_name}
          </div>
          <div className="text-sm text-muted-foreground">{order.applicant?.email}</div>
        </div>
      )
    },
    {
      key: 'visa_type_id',
      header: 'Visa Type',
      cell: (order) => (
        <Badge variant="outline">{order.visa_type_id || 'N/A'}</Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (order) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(order.status)}
          <Badge className={getStatusColor(order.status)}>
            {order.status.replace('_', ' ')}
          </Badge>
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Created',
      cell: (order) => (
        <div className="text-sm">
          {new Date(order.created_at).toLocaleDateString()}
          <div className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      key: 'travel_date',
      header: 'Travel Date',
      cell: (order) => (
        <span className="text-sm">
          {order.travel_date ? new Date(order.travel_date).toLocaleDateString() : '-'}
        </span>
      )
    }
  ];

  const orderActions: DataTableAction<typeof mockOrders[0]>[] = [
    {
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (order) => navigate(`/orders/${order.order_id}`),
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (order) => {
        toast({
          title: "Edit Order",
          description: `Edit functionality for order ${order.order_id} would be implemented here.`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (order) => {
        toast({
          title: "Delete Order",
          description: `Delete functionality for order ${order.order_id} would be implemented here.`,
          variant: "destructive",
        });
      },
      variant: 'destructive'
    }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <DataTable
      data={mockOrders}
      columns={orderColumns}
      title="Visa Orders"
      description="Manage visa application orders and track their progress"
      searchPlaceholder="Search by order ID, name, or email..."
      searchKeys={['order_id', 'applicant']}
      filters={[
        {
          key: 'status',
          label: 'Status',
          options: statusOptions
        }
      ]}
      actions={orderActions}
      onAdd={() => navigate('/orders/create')}
      addButtonLabel="Create Order"
      emptyMessage="No orders found"
      emptyDescription="No orders match your current criteria."
    />
  );
};

export default Orders;