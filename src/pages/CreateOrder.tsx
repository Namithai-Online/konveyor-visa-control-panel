import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { mockCountries, mockVisaTypes } from '@/data/mockData';
import { ArrowLeft, Plus, User, Globe, Calendar } from 'lucide-react';
import { CreateOrderRequest } from '@/types/api';

const CreateOrder: React.FC = () => {
  const [formData, setFormData] = useState<CreateOrderRequest>({
    applicant: {
      first_name: '',
      last_name: '',
      email: '',
      dob: '',
      passport_number: '',
      nationality: ''
    },
    visa_type_id: '',
    travel_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('applicant.')) {
      const applicantField = field.replace('applicant.', '');
      setFormData(prev => ({
        ...prev,
        applicant: {
          ...prev.applicant,
          [applicantField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrderId = 'O' + Date.now();
      
      toast({
        title: "Order created successfully",
        description: `Order ${newOrderId} has been created and is pending processing.`,
      });
      
      navigate(`/orders/${newOrderId}`);
    } catch (error) {
      toast({
        title: "Error creating order",
        description: "There was a problem creating the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVisaTypes = mockVisaTypes.filter(visa => 
    formData.applicant.nationality ? visa.country_id === formData.applicant.nationality : true
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Order</h1>
          <p className="text-muted-foreground">Submit a new visa application order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applicant Information
            </CardTitle>
            <CardDescription>Personal details of the visa applicant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.applicant.first_name}
                  onChange={(e) => handleInputChange('applicant.first_name', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.applicant.last_name}
                  onChange={(e) => handleInputChange('applicant.last_name', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.applicant.email}
                  onChange={(e) => handleInputChange('applicant.email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.applicant.dob}
                  onChange={(e) => handleInputChange('applicant.dob', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="passport_number">Passport Number *</Label>
                <Input
                  id="passport_number"
                  value={formData.applicant.passport_number}
                  onChange={(e) => handleInputChange('applicant.passport_number', e.target.value)}
                  placeholder="Enter passport number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Select
                  value={formData.applicant.nationality}
                  onValueChange={(value) => handleInputChange('applicant.nationality', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCountries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.emoji_flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visa Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Visa Information
            </CardTitle>
            <CardDescription>Details about the requested visa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="visa_type_id">Visa Type *</Label>
                <Select
                  value={formData.visa_type_id}
                  onValueChange={(value) => handleInputChange('visa_type_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredVisaTypes.map((visa) => (
                      <SelectItem key={visa.id} value={visa.id}>
                        {visa.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="travel_date">Planned Travel Date</Label>
                <Input
                  id="travel_date"
                  type="date"
                  value={formData.travel_date}
                  onChange={(e) => handleInputChange('travel_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/orders')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isLoading ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;