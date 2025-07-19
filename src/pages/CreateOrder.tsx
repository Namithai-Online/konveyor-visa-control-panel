import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap, FileText, Upload, User, CreditCard, CheckCircle } from 'lucide-react';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();

  const wizardSteps = [
    { icon: FileText, title: 'Country & Visa Selection', description: 'Choose destination and visa type' },
    { icon: Upload, title: 'Document Upload', description: 'Upload required documents' },
    { icon: User, title: 'Applicant Details', description: 'Personal information' },
    { icon: CreditCard, title: 'Payment & Review', description: 'Complete payment and submit' }
  ];

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
          <h1 className="text-3xl font-bold">Create New Visa Application</h1>
          <p className="text-muted-foreground">Start the complete visa application process</p>
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Use Our Guided Wizard</CardTitle>
          <CardDescription className="text-lg">
            For the best experience, we recommend using our step-by-step wizard that guides you through the complete visa application process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wizardSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-background rounded-lg border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <step.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              The wizard includes document requirements, upload functionality, payment processing, and real-time validation.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => navigate('/wizard')}
                className="flex items-center gap-2"
                size="lg"
              >
                <ArrowRight className="h-4 w-4" />
                Apply Now - Start Wizard
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/orders')}
                size="lg"
              >
                Cancel
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Click "Apply Now" to begin your visa application process
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Why Use the Wizard?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h4 className="font-semibold">Step-by-Step Guidance</h4>
              <p className="text-sm text-muted-foreground">
                Clear progression through each stage of the application process
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-info" />
              </div>
              <h4 className="font-semibold">Dynamic Requirements</h4>
              <p className="text-sm text-muted-foreground">
                Shows specific document requirements based on your destination and visa type
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
                <Upload className="h-6 w-6 text-warning" />
              </div>
              <h4 className="font-semibold">Integrated Upload</h4>
              <p className="text-sm text-muted-foreground">
                Upload documents directly within the application flow
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrder;