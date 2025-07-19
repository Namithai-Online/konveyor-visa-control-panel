import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Play } from 'lucide-react';

interface WizardStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  action: string;
}

const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: 'Authentication',
    description: 'Obtain access token using client credentials',
    status: 'completed',
    action: 'POST /token'
  },
  {
    id: 2,
    title: 'Create Order',
    description: 'Submit new visa application order',
    status: 'completed',
    action: 'POST /orders'
  },
  {
    id: 3,
    title: 'Upload Documents',
    description: 'Upload required documents for the application',
    status: 'in_progress',
    action: 'POST /documents/bulk-upload'
  },
  {
    id: 4,
    title: 'Review Status',
    description: 'Check application and document status',
    status: 'pending',
    action: 'GET /orders/documents-overview'
  }
];

const Wizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'in_progress';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in_progress': return 'bg-info text-info-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleNextStep = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (currentStep < wizardSteps.length) {
      setCurrentStep(currentStep + 1);
    }
    setIsProcessing(false);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep - 1) / (wizardSteps.length - 1)) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wizard Flow</h1>
        <p className="text-muted-foreground">Step-by-step visa application processing workflow</p>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Complete workflow progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {wizardSteps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Steps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wizardSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isActive = step.id === currentStep;
          
          return (
            <Card key={step.id} className={`${isActive ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status === 'completed' ? 'bg-success text-success-foreground' :
                    status === 'in_progress' ? 'bg-info text-info-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <Badge className={getStatusColor(status)} variant="outline">
                      {status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <Badge variant="outline" className="text-xs">
                  {step.action}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Step Details */}
      <Card>
        <CardHeader>
          <CardTitle>Current Step: {wizardSteps[currentStep - 1]?.title}</CardTitle>
          <CardDescription>{wizardSteps[currentStep - 1]?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="p-6 bg-muted/50 rounded-lg">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Authentication Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Authenticate with the SMV Konveyor API using OAuth2 client credentials flow.
                </p>
                <div className="bg-background p-4 rounded border">
                  <code className="text-sm">
                    POST /token<br/>
                    {JSON.stringify({
                      grant_type: "client_credentials",
                      client_id: "your_client_id",
                      client_secret: "your_client_secret"
                    }, null, 2)}
                  </code>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Create New Order</h4>
                <p className="text-sm text-muted-foreground">
                  Submit a new visa application order with applicant details.
                </p>
                <div className="bg-background p-4 rounded border">
                  <code className="text-sm">
                    POST /orders<br/>
                    {JSON.stringify({
                      applicant: {
                        first_name: "John",
                        last_name: "Doe",
                        email: "john@example.com",
                        dob: "1990-01-01",
                        passport_number: "X123456",
                        nationality: "RO"
                      },
                      visa_type_id: "T1",
                      travel_date: "2025-12-01"
                    }, null, 2)}
                  </code>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Upload Documents</h4>
                <p className="text-sm text-muted-foreground">
                  Upload all required documents for the visa application.
                </p>
                <div className="bg-background p-4 rounded border">
                  <code className="text-sm">
                    POST /documents/bulk-upload<br/>
                    {JSON.stringify({
                      order_id: "O123",
                      documents: [
                        {
                          doc_type: "passport",
                          file_name: "passport.pdf",
                          file_content_base64: "base64_content"
                        }
                      ]
                    }, null, 2)}
                  </code>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Review Application Status</h4>
                <p className="text-sm text-muted-foreground">
                  Check the status of the application and uploaded documents.
                </p>
                <div className="bg-background p-4 rounded border">
                  <code className="text-sm">
                    GET /orders/documents-overview?order_id=O123
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < wizardSteps.length ? (
                <Button
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button className="flex items-center gap-2" disabled>
                  <CheckCircle className="h-4 w-4" />
                  Workflow Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common workflow operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start New Workflow
            </Button>
            <Button variant="outline">
              View All Orders
            </Button>
            <Button variant="outline">
              API Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wizard;