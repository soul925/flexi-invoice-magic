
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle } from 'lucide-react';
import { InvoiceData } from '../DataReviewForm';
import PDFPreview from './PDFPreview';
import JSONData from './JSONData';
import QRCodeDisplay from './QRCodeDisplay';
import ActionButtons from './ActionButtons';

interface InvoiceResultsProps {
  data: InvoiceData;
  onReset: () => void;
}

const InvoiceResults = ({ data, onReset }: InvoiceResultsProps) => {
  const [activeTab, setActiveTab] = useState('preview');
  
  return (
    <div className="border rounded-lg bg-card shadow-sm animate-fade-in">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Processing Complete</h3>
          <p className="text-sm text-muted-foreground">
            Your invoice has been successfully processed
          </p>
        </div>
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="preview">
              PDF Preview
            </TabsTrigger>
            <TabsTrigger value="json">
              JSON Data
            </TabsTrigger>
            <TabsTrigger value="qr">
              QR Code
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-6">
          <TabsContent value="preview" className="mt-0 animate-fade-in">
            <PDFPreview data={data} />
          </TabsContent>
          
          <TabsContent value="json" className="mt-0 animate-fade-in">
            <JSONData data={data} />
          </TabsContent>
          
          <TabsContent value="qr" className="mt-0 animate-fade-in">
            <QRCodeDisplay invoiceNumber={data.invoiceNumber} />
          </TabsContent>
        </div>
      </Tabs>
      
      <ActionButtons data={data} onReset={onReset} />
    </div>
  );
};

export default InvoiceResults;
