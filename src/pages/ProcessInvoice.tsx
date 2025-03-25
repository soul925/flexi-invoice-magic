
import { useState } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/invoice/file-upload';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import DataReviewForm, { InvoiceData } from '@/components/invoice/DataReviewForm';
import InvoiceResults from '@/components/invoice/InvoiceResults';
import { processInvoiceImage } from '@/utils/ocr';
import { processImageForOCR } from '@/utils/imageProcessing';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

enum ProcessStep {
  Upload,
  Review,
  Results
}

const ProcessInvoice = () => {
  const [currentStep, setCurrentStep] = useState<ProcessStep>(ProcessStep.Upload);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<InvoiceData> | null>(null);
  const [finalData, setFinalData] = useState<InvoiceData | null>(null);
  
  const handleFileSelect = async (file: File) => {
    // Clear previous data when a new file is uploaded
    setSelectedFile(null);
    setExtractedData(null);
    setFinalData(null);
    
    // Set the new file
    setSelectedFile(file);
    setIsProcessing(true);
    
    try {
      // In a real app, these would actually process the image
      // For demo purposes, they just simulate processing time
      if (file.type.startsWith('image/')) {
        await processImageForOCR(file);
      }
      
      // Process the file with OCR
      const result = await processInvoiceImage(file);
      
      if (result.success && result.data) {
        setExtractedData(result.data);
        setIsProcessing(false);
        setCurrentStep(ProcessStep.Review);
      } else {
        toast.error(result.error || 'Failed to process the invoice');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing invoice:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };
  
  const handleFormSubmit = (data: InvoiceData) => {
    setFinalData(data);
    setCurrentStep(ProcessStep.Results);
  };
  
  const handleReset = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setFinalData(null);
    setCurrentStep(ProcessStep.Upload);
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case ProcessStep.Upload:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-3">Process Your Invoice</h1>
                <p className="text-muted-foreground">
                  Upload your invoice to extract data and convert it to structured format.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6 space-y-3 border">
                <h3 className="font-medium">Supported Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Upload PDF, JPEG, PNG, or TIFF files</li>
                  <li>• Extract invoice details automatically</li>
                  <li>• Support for handwritten invoices</li>
                  <li>• Export as structured JSON data</li>
                  <li>• Generate professionally formatted PDF</li>
                  <li>• Create QR code for invoice tracking</li>
                </ul>
              </div>
              
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
            
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-medium mb-4">Preview</h2>
              <InvoicePreview file={selectedFile} isProcessing={isProcessing} />
            </div>
          </div>
        );
        
      case ProcessStep.Review:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <h2 className="text-xl font-medium mb-4">Invoice Image</h2>
                <InvoicePreview file={selectedFile} />
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(ProcessStep.Upload)}
                    className="w-full rounded-lg focus-ring"
                  >
                    Upload Different File
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <h2 className="text-xl font-medium mb-4">Extracted Information</h2>
              <DataReviewForm 
                initialData={extractedData || undefined}
                onSubmit={handleFormSubmit}
                onBack={() => setCurrentStep(ProcessStep.Upload)}
              />
            </div>
          </div>
        );
        
      case ProcessStep.Results:
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-medium mb-4">Invoice Results</h2>
            {finalData && (
              <InvoiceResults 
                data={finalData}
                onReset={handleReset}
              />
            )}
          </div>
        );
    }
  };
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= ProcessStep.Upload ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className={`w-20 h-1 ${
              currentStep > ProcessStep.Upload ? 'bg-primary' : 'bg-muted'
            }`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= ProcessStep.Review ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <div className={`w-20 h-1 ${
              currentStep > ProcessStep.Review ? 'bg-primary' : 'bg-muted'
            }`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= ProcessStep.Results ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}>
              3
            </div>
          </div>
        </div>
        
        <div className="flex justify-center text-sm font-medium mb-8">
          <div className="grid grid-cols-3 w-full max-w-md">
            <div className="text-center">
              <span className={currentStep === ProcessStep.Upload ? 'text-primary' : ''}>Upload</span>
            </div>
            <div className="text-center">
              <span className={currentStep === ProcessStep.Review ? 'text-primary' : ''}>Review</span>
            </div>
            <div className="text-center">
              <span className={currentStep === ProcessStep.Results ? 'text-primary' : ''}>Result</span>
            </div>
          </div>
        </div>
      </div>
      
      {renderStepContent()}
    </Layout>
  );
};

export default ProcessInvoice;
