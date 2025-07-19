import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockCountries, mockVisaTypes } from '@/data/mockData';
import { Globe, Search, Eye, Plus } from 'lucide-react';

const Countries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Countries & Visa Types</h1>
        <p className="text-muted-foreground">Manage supported countries and their visa types</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Countries
            </CardTitle>
            <CardDescription>List of supported countries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Countries Table */}
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Visa Types</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCountries.map((country) => {
                    const visaCount = getVisaTypesForCountry(country.id).length;
                    return (
                      <TableRow key={country.id}>
                        <TableCell className="flex items-center gap-2">
                          <span className="text-lg">{country.emoji_flag}</span>
                          <span className="font-medium">{country.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{country.iso_code}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{visaCount} types</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCountry(country.id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredCountries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No countries found matching your search.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Country Details */}
        <Card>
          <CardHeader>
            <CardTitle>Country Details</CardTitle>
            <CardDescription>
              {selectedCountryData 
                ? `Details for ${selectedCountryData.name}`
                : 'Select a country to view details'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCountryData ? (
              <div className="space-y-6">
                {/* Country Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{selectedCountryData.emoji_flag}</span>
                    <div>
                      <h3 className="text-xl font-bold">{selectedCountryData.name}</h3>
                      <p className="text-muted-foreground">ISO Code: {selectedCountryData.iso_code}</p>
                    </div>
                  </div>
                </div>

                {/* Visa Types */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Available Visa Types</h4>
                    <Button size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add Visa Type
                    </Button>
                  </div>

                  {selectedCountryVisaTypes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCountryVisaTypes.map((visa) => (
                        <div key={visa.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{visa.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {visa.id}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No visa types configured for this country.
                    </div>
                  )}
                </div>

                {/* Requirements */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Visa Requirements</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">Passport Copy</p>
                      <p className="text-sm text-muted-foreground">Required for all visa types</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">Passport Photo</p>
                      <p className="text-sm text-muted-foreground">Required for all visa types</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">Financial Documents</p>
                      <p className="text-sm text-muted-foreground">Required for tourist visas</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a country from the list to view its details and visa types.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Countries;