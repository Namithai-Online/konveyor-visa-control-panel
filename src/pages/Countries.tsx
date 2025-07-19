import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { mockCountries, mockVisaTypes } from '@/data/mockData';
import { Globe, Search, Eye, Edit, Trash2, Clock, DollarSign, FileText, Plane, Star, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Countries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState('tourism');
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredCountries = mockCountries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.iso_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVisaTypesForCountry = (countryId: string) => {
    return mockVisaTypes.filter(visa => visa.country_id === countryId);
  };

  const getVisaRequirements = (countryId: string, visaType: string) => {
    const baseRequirements = [
      { name: 'Valid passport (minimum 6 months validity)', required: true },
      { name: 'Passport-size photographs (2 copies)', required: true },
      { name: 'Completed visa application form', required: true },
      { name: 'Travel itinerary or booking confirmation', required: true },
      { name: 'Bank statements (last 3 months)', required: true },
      { name: 'Travel insurance coverage', required: false },
    ];
    
    if (visaType === 'Business Visa') {
      baseRequirements.push(
        { name: 'Invitation letter from business partner', required: true },
        { name: 'Company registration certificate', required: true }
      );
    }
    
    return baseRequirements;
  };

  // Countries DataTable Configuration
  const countryColumns: DataTableColumn<typeof mockCountries[0]>[] = [
    {
      key: 'emoji_flag',
      header: 'Flag',
      cell: (country) => <span className="text-2xl">{country.emoji_flag}</span>
    },
    {
      key: 'name',
      header: 'Country Name',
      cell: (country) => <span className="font-medium">{country.name}</span>
    },
    {
      key: 'iso_code',
      header: 'ISO Code',
      cell: (country) => <Badge variant="outline">{country.iso_code}</Badge>
    },
    {
      key: 'visa_types',
      header: 'Visa Types',
      cell: (country) => {
        const visaCount = getVisaTypesForCountry(country.id).length;
        return <Badge>{visaCount} types</Badge>;
      }
    },
    {
      key: 'processing_time',
      header: 'Processing Time',
      cell: () => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          5-10 days
        </div>
      )
    },
    {
      key: 'fee_range',
      header: 'Fee Range',
      cell: () => (
        <div className="flex items-center gap-1 text-sm">
          <DollarSign className="h-3 w-3" />
          $50-120
        </div>
      )
    }
  ];

  const countryActions: DataTableAction<typeof mockCountries[0]>[] = [
    {
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (country) => setSelectedCountry(country.id),
      variant: 'ghost'
    },
    {
      label: 'Apply for Visa',
      icon: <Plus className="h-4 w-4" />,
      onClick: () => navigate('/wizard'),
      variant: 'default'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (country) => {
        toast({
          title: "Edit Country",
          description: `Edit functionality for ${country.name} would be implemented here.`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (country) => {
        toast({
          title: "Delete Country",
          description: `Delete functionality for ${country.name} would be implemented here.`,
          variant: "destructive",
        });
      },
      variant: 'destructive'
    }
  ];

  // Visa Types DataTable Configuration
  const visaTypeColumns: DataTableColumn<typeof mockVisaTypes[0]>[] = [
    {
      key: 'name',
      header: 'Visa Type',
      cell: (visa) => <span className="font-medium">{visa.name}</span>
    },
    {
      key: 'country_id',
      header: 'Country',
      cell: (visa) => {
        const country = mockCountries.find(c => c.id === visa.country_id);
        return (
          <div className="flex items-center gap-2">
            <span>{country?.emoji_flag}</span>
            <span>{country?.name}</span>
          </div>
        );
      }
    },
    {
      key: 'id',
      header: 'Type ID',
      cell: (visa) => <Badge variant="outline">{visa.id}</Badge>
    },
    {
      key: 'processing_time',
      header: 'Processing Time',
      cell: () => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          5-10 business days
        </div>
      )
    },
    {
      key: 'fee',
      header: 'Fee',
      cell: (visa) => {
        const fees: { [key: string]: number } = {
          'Tourist Visa': 85,
          'Business Visa': 120,
          'Student Visa': 150,
        };
        return (
          <div className="flex items-center gap-1 text-primary font-medium">
            <DollarSign className="h-3 w-3" />
            {fees[visa.name] || 85}
          </div>
        );
      }
    }
  ];

  const visaTypeActions: DataTableAction<typeof mockVisaTypes[0]>[] = [
    {
      label: 'View Requirements',
      icon: <FileText className="h-4 w-4" />,
      onClick: (visa) => {
        const country = mockCountries.find(c => c.id === visa.country_id);
        toast({
          title: "Visa Requirements",
          description: `View requirements for ${visa.name} in ${country?.name}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Apply Now',
      icon: <Plus className="h-4 w-4" />,
      onClick: () => navigate('/wizard'),
      variant: 'default'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (visa) => {
        toast({
          title: "Edit Visa Type",
          description: `Edit functionality for ${visa.name} would be implemented here.`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (visa) => {
        toast({
          title: "Delete Visa Type",
          description: `Delete functionality for ${visa.name} would be implemented here.`,
          variant: "destructive",
        });
      },
      variant: 'destructive'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Countries & Visa Requirements</h1>
          <p className="text-muted-foreground">Manage countries, visa types, and requirements</p>
        </div>
        <Button onClick={() => navigate('/wizard')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Apply for Visa
        </Button>
      </div>

      <Tabs defaultValue="countries" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="visa-types">Visa Types</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="countries" className="space-y-6">
          <DataTable
            data={mockCountries}
            columns={countryColumns}
            title="Countries"
            description="Manage supported countries and their visa information"
            searchPlaceholder="Search countries by name or ISO code..."
            searchKeys={['name', 'iso_code']}
            actions={countryActions}
            onAdd={() => {
              toast({
                title: "Add Country",
                description: "Add new country functionality would be implemented here.",
              });
            }}
            addButtonLabel="Add Country"
            emptyMessage="No countries found"
            emptyDescription="No countries match your search criteria."
          />
        </TabsContent>

        <TabsContent value="visa-types" className="space-y-6">
          <DataTable
            data={mockVisaTypes}
            columns={visaTypeColumns}
            title="Visa Types"
            description="Manage visa types available for different countries"
            searchPlaceholder="Search visa types..."
            searchKeys={['name']}
            filters={[
              {
                key: 'country_id',
                label: 'Country',
                options: mockCountries.map(country => ({
                  value: country.id,
                  label: `${country.emoji_flag} ${country.name}`
                }))
              }
            ]}
            actions={visaTypeActions}
            onAdd={() => {
              toast({
                title: "Add Visa Type",
                description: "Add new visa type functionality would be implemented here.",
              });
            }}
            addButtonLabel="Add Visa Type"
            emptyMessage="No visa types found"
            emptyDescription="No visa types match your search criteria."
          />
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visa Requirements Management</CardTitle>
              <CardDescription>Select a country and visa type to view detailed requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Select value={selectedCountry || ''} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCountries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.emoji_flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                  <SelectTrigger>
                    <SelectValue placeholder="Purpose of travel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourism">Tourism</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCountry && (
                <div className="space-y-6">
                  {getVisaTypesForCountry(selectedCountry).map((visaType) => (
                    <Card key={visaType.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          {visaType.name} - {mockCountries.find(c => c.id === selectedCountry)?.name}
                        </CardTitle>
                        <CardDescription>Complete requirements checklist</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Required Documents
                            </h4>
                            <div className="space-y-3">
                              {getVisaRequirements(selectedCountry, visaType.name).map((req, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                  <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${req.required ? 'text-destructive' : 'text-success'}`} />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{req.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {req.required ? 'Required' : 'Optional'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <h4 className="font-semibold mb-2">Processing Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Processing Time:</span>
                                  <span className="font-medium">5-10 business days</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Visa Validity:</span>
                                  <span className="font-medium">90 days</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Maximum Stay:</span>
                                  <span className="font-medium">30 days</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Entry Type:</span>
                                  <span className="font-medium">Single/Multiple</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-primary/10 rounded-lg">
                              <h4 className="font-semibold mb-2 text-primary">Pricing</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Government Fee:</span>
                                  <span className="font-medium">$60</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Service Fee:</span>
                                  <span className="font-medium">$25</span>
                                </div>
                                <div className="flex justify-between font-semibold pt-2 border-t border-primary/20">
                                  <span>Total:</span>
                                  <span>$85</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button className="w-full" onClick={() => navigate('/wizard')}>
                              Apply for {visaType.name}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Countries;