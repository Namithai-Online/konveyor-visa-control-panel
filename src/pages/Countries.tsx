import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockCountries, mockVisaTypes } from '@/data/mockData';
import { Globe, Search, Eye, Plus, Clock, DollarSign, FileText, Plane, Star, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Countries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState('tourism');
  const navigate = useNavigate();

  const filteredCountries = mockCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.iso_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVisaTypesForCountry = (countryId: string) => {
    return mockVisaTypes.filter(visa => visa.country_id === countryId);
  };

  const selectedCountryData = selectedCountry 
    ? mockCountries.find(c => c.id === selectedCountry)
    : null;

  const selectedCountryVisaTypes = selectedCountry 
    ? getVisaTypesForCountry(selectedCountry)
    : [];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Countries & Visa Requirements</h1>
          <p className="text-muted-foreground">Discover requirements for all travel destinations</p>
        </div>
        <Button onClick={() => navigate('/orders/create')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Apply for Visa
        </Button>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Countries</TabsTrigger>
          <TabsTrigger value="requirements">Detailed Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Search Countries</CardTitle>
              <CardDescription>Find your travel destination and visa requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Purpose of travel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourism">Tourism</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map((country) => {
              const visaTypes = getVisaTypesForCountry(country.id);
              return (
                <Card key={country.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50" onClick={() => setSelectedCountry(country.id)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{country.emoji_flag}</span>
                        <div>
                          <h3 className="text-lg font-bold">{country.name}</h3>
                          <p className="text-sm text-muted-foreground">ISO: {country.iso_code}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-primary/10">
                        {visaTypes.length} visa types
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>5-10 days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>$50-120</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Available Visa Types:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {visaTypes.slice(0, 2).map((visa) => (
                            <Badge key={visa.id} variant="secondary" className="text-xs">
                              {visa.name}
                            </Badge>
                          ))}
                          {visaTypes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{visaTypes.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        navigate('/orders/create');
                      }}>
                        Apply for Visa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Country Selection</CardTitle>
              <CardDescription>Select a country to view detailed visa requirements</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

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
                        
                        <Button className="w-full" onClick={() => navigate('/orders/create')}>
                          Apply for {visaType.name}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Countries;