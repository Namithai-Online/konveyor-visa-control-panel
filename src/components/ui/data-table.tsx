import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Eye, Edit, Trash2, MoreHorizontal, Plus } from 'lucide-react';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataTableAction<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  show?: (item: T) => boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: {
    key: keyof T;
    label: string;
    options: { value: string; label: string }[];
  }[];
  actions?: DataTableAction<T>[];
  onAdd?: () => void;
  addButtonLabel?: string;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  description,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  actions = [],
  onAdd,
  addButtonLabel = "Add New",
  emptyMessage = "No data found",
  emptyDescription = "No items match your current criteria."
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Default actions if none provided
  const defaultActions: DataTableAction<T>[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (item) => console.log('View:', item),
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (item) => console.log('Edit:', item),
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item) => console.log('Delete:', item),
      variant: 'destructive'
    }
  ];

  const finalActions = actions.length > 0 ? actions : defaultActions;

  const filteredData = data.filter(item => {
    // Search filter
    if (searchTerm && searchKeys.length > 0) {
      const matchesSearch = searchKeys.some(key => {
        const value = item[key];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (!matchesSearch) return false;
    }

    // Column filters
    for (const filter of filters) {
      const filterValue = filterValues[filter.key as string];
      if (filterValue && filterValue !== 'all') {
        if (item[filter.key] !== filterValue) return false;
      }
    }

    return true;
  });

  const getCellValue = (item: T, column: DataTableColumn<T>) => {
    if (column.cell) {
      return column.cell(item);
    }
    
    const value = item[column.key as keyof T];
    
    // Handle common data types
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }
    
    if (value && typeof value === 'object' && 'toLocaleDateString' in value) {
      return (value as Date).toLocaleDateString();
    }
    
    return value?.toString() || '-';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      {(searchKeys.length > 0 || filters.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              {searchKeys.length > 0 && (
                <div className="flex-1 min-w-64 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              
              {filters.map((filter) => (
                <Select
                  key={filter.key as string}
                  value={filterValues[filter.key as string] || 'all'}
                  onValueChange={(value) => setFilterValues(prev => ({ ...prev, [filter.key as string]: value }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>{title} ({filteredData.length})</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key as string}>
                      {column.header}
                    </TableHead>
                  ))}
                  {finalActions.length > 0 && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key as string}>
                        {getCellValue(item, column)}
                      </TableCell>
                    ))}
                    {finalActions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {finalActions.map((action, actionIndex) => {
                              if (action.show && !action.show(item)) return null;
                              
                              return (
                                <DropdownMenuItem
                                  key={actionIndex}
                                  onClick={() => action.onClick(item)}
                                  className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
                                >
                                  {action.icon}
                                  <span className="ml-2">{action.label}</span>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 opacity-50">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
              <p className="text-muted-foreground mb-4">{emptyDescription}</p>
              {onAdd && (
                <Button onClick={onAdd} className="flex items-center gap-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  {addButtonLabel}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}