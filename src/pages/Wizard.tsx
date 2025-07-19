import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { mockCountries, mockVisaTypes } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  FileText, 
  UploadCloud, 
  User, 
  CreditCard, 
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  DollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';

interface OrderData {
  country: string;
  visaType: string;
  applicantDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: string;
  };
  travelDate: string;
  documents: File[];
  paymentMethod: string;
}

const Wizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    country: '',
    visaType: '',
    applicantDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
    },
    travelDate: '',
    documents: [],
    paymentMethod: '',
  });
  const { toast } = useToast();

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: 'Country Selection', icon: MapPin },
    { number: 2, title: 'Visa Type', icon: FileText },
    { number: 3, title: 'Requirements Review', icon: AlertCircle },
    { number: 4, title: 'Document Upload', icon: UploadCloud },
    { number: 5, title: 'Applicant Details', icon: User },
    { number: 6, title: 'Payment & Review', icon: CreditCard },
  ];

  const getRequiredDocuments = (country: string, visaType: string) => {
    // Mock document requirements based on visa type
    const baseRequirements = [
      { name: 'Passport Copy', required: true, uploaded: false },
      { name: 'Passport Photos (2x)', required: true, uploaded: false },
      { name: 'Bank Statements (3 months)', required: true, uploaded: false },
      { name: 'Travel Insurance', required: true, uploaded: false },
    ];

    if (visaType === 'Business Visa') {
      baseRequirements.push(
        { name: 'Business Invitation Letter', required: true, uploaded: false },
        { name: 'Company Registration', required: true, uploaded: false }
      );
    }

    if (visaType === 'Student Visa') {
      baseRequirements.push(
        { name: 'University Acceptance Letter', required: true, uploaded: false },
        { name: 'Academic Transcripts', required: true, uploaded: false }
      );
    }

    return baseRequirements;
  };

  const getVisaFee = (visaType: string) => {
    const fees: { [key: string]: number } = {
      'Tourist Visa': 85,
      'Business Visa': 120,
      'Student Visa': 150,
    };
    return fees[visaType] || 85;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setOrderData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  const handleSubmitOrder = async () => {
    // Mock API call - replace with your Java backend endpoint
    try {
      const orderPayload = {
        ...orderData,
        orderId: `ORD-${Date.now()}`,
        status: 'submitted',
        totalAmount: getVisaFee(orderData.visaType),
        submittedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order Submitted Successfully!",
        description: `Order ${orderPayload.orderId} has been submitted for processing.`,
      });

      // Reset wizard or redirect to orders page
      setCurrentStep(1);
      setOrderData({
        country: '',
        visaType: '',
        applicantDetails: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          nationality: '',
          passportNumber: '',
          passportExpiry: '',
        },
        travelDate: '',
        documents: [],
        paymentMethod: '',
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Select Destination Country</h2>
              <p className="text-muted-foreground">Choose the country you plan to visit</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Destination Country</CardTitle>
                <CardDescription>
                  Select your travel destination from the list of available countries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="country-select">Country *</Label>
                  <Select 
                    value={orderData.country}
                    onValueChange={(value) => setOrderData(prev => ({ ...prev, country: value, visaType: '' }))}
                  >
                    <SelectTrigger id="country-select">
                      <SelectValue placeholder="Select a destination country" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCountries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          <div className="flex items-center gap-2">
                            <span>{country.emoji_flag}</span>
                            <span>{country.name}</span>
                            <span className="text-muted-foreground text-xs">({country.iso_code})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {orderData.country && (
                  <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {mockCountries.find(c => c.id === orderData.country)?.emoji_flag}
                      </span>
                      <div>
                        <p className="font-semibold">
                          {mockCountries.find(c => c.id === orderData.country)?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Selected destination country
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        const selectedCountry = mockCountries.find(c => c.id === orderData.country);
        const availableVisaTypes = mockVisaTypes.filter(v => v.country_id === orderData.country);
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Select Visa Type</h2>
              <p className="text-muted-foreground">
                Choose the appropriate visa for {selectedCountry?.name}
              </p>
            </div>

            <div className="space-y-4">
              {availableVisaTypes.map((visa) => (
                <Card 
                  key={visa.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    orderData.visaType === visa.name ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setOrderData(prev => ({ ...prev, visaType: visa.name }))}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{visa.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Processing time: 5-10 business days
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <DollarSign className="h-4 w-4" />
                          {getVisaFee(visa.name)}
                        </div>
                        <p className="text-xs text-muted-foreground">Total fee</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        const requirements = getRequiredDocuments(orderData.country, orderData.visaType);
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Document Requirements</h2>
              <p className="text-muted-foreground">
                Review the required documents for your {orderData.visaType}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Required Documents Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requirements.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        doc.required ? 'border-destructive bg-destructive/10' : 'border-success bg-success/10'
                      }`} />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.required ? 'Required' : 'Optional'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={doc.required ? "destructive" : "secondary"}>
                      {doc.required ? 'Required' : 'Optional'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-info mt-0.5" />
                <div>
                  <h4 className="font-semibold text-info">Processing Information</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ensure all documents are clear, colored scans or high-quality photos. 
                    Processing typically takes 5-10 business days after document submission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <UploadCloud className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
              <p className="text-muted-foreground">
                Upload all required documents for your visa application
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <UploadCloud className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Click to upload files</p>
                      <p className="text-xs text-muted-foreground">
                        or drag and drop your documents here
                      </p>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </Label>
                </div>

                {orderData.documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Uploaded Documents ({orderData.documents.length})</h4>
                    {orderData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Applicant Details</h2>
              <p className="text-muted-foreground">
                Provide your personal information for the visa application
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Please ensure all information matches your passport exactly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={orderData.applicantDetails.firstName}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        applicantDetails: { ...prev.applicantDetails, firstName: e.target.value }
                      }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={orderData.applicantDetails.lastName}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        applicantDetails: { ...prev.applicantDetails, lastName: e.target.value }
                      }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={orderData.applicantDetails.email}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, email: e.target.value }
                        }))}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        value={orderData.applicantDetails.phone}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, phone: e.target.value }
                        }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        className="pl-10"
                        value={orderData.applicantDetails.dateOfBirth}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, dateOfBirth: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Select 
                      value={orderData.applicantDetails.nationality}
                      onValueChange={(value) => setOrderData(prev => ({
                        ...prev,
                        applicantDetails: { ...prev.applicantDetails, nationality: value }
                      }))}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passportNumber">Passport Number *</Label>
                    <Input
                      id="passportNumber"
                      value={orderData.applicantDetails.passportNumber}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        applicantDetails: { ...prev.applicantDetails, passportNumber: e.target.value }
                      }))}
                      placeholder="Enter passport number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passportExpiry">Passport Expiry Date *</Label>
                    <Input
                      id="passportExpiry"
                      type="date"
                      value={orderData.applicantDetails.passportExpiry}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        applicantDetails: { ...prev.applicantDetails, passportExpiry: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="travelDate">Intended Travel Date *</Label>
                  <Input
                    id="travelDate"
                    type="date"
                    value={orderData.travelDate}
                    onChange={(e) => setOrderData(prev => ({ ...prev, travelDate: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        const selectedCountryData = mockCountries.find(c => c.id === orderData.country);
        const visaFee = getVisaFee(orderData.visaType);
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Review & Payment</h2>
              <p className="text-muted-foreground">
                Review your application details and proceed with payment
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="font-medium">
                        {selectedCountryData?.emoji_flag} {selectedCountryData?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Visa Type:</span>
                      <span className="font-medium">{orderData.visaType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applicant:</span>
                      <span className="font-medium">
                        {orderData.applicantDetails.firstName} {orderData.applicantDetails.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Travel Date:</span>
                      <span className="font-medium">{orderData.travelDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Documents:</span>
                      <span className="font-medium">{orderData.documents.length} uploaded</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Visa Processing Fee:</span>
                      <span>${visaFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount:</span>
                      <span>${visaFee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Select Payment Method</Label>
                    <div className="space-y-2">
                      <Card 
                        className={`cursor-pointer p-4 ${
                          orderData.paymentMethod === 'card' ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setOrderData(prev => ({ ...prev, paymentMethod: 'card' }))}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Credit/Debit Card</p>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {orderData.paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return orderData.country !== '';
      case 2: return orderData.visaType !== '';
      case 3: return true; // Review step
      case 4: return orderData.documents.length > 0;
      case 5: return (
        orderData.applicantDetails.firstName &&
        orderData.applicantDetails.lastName &&
        orderData.applicantDetails.email &&
        orderData.applicantDetails.phone &&
        orderData.applicantDetails.dateOfBirth &&
        orderData.applicantDetails.nationality &&
        orderData.applicantDetails.passportNumber &&
        orderData.applicantDetails.passportExpiry &&
        orderData.travelDate
      );
      case 6: return orderData.paymentMethod !== '';
      default: return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Visa Application WorkFlow</h1>
        <p className="text-muted-foreground">Complete your visa application step by step</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  step.number <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step.number < currentStep 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : step.number === currentStep
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  }`}>
                    {step.number < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden md:inline">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    step.number < currentStep ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitOrder}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Submit Application
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wizard;