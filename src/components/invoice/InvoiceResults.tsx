import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Clipboard, CheckCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { InvoiceData } from './DataReviewForm';
import { generateInvoicePDF, generateInvoiceQRCode } from '@/utils/pdfGenerator';

interface InvoiceResultsProps {
  data: InvoiceData;
  onReset: () => void;
}

const InvoiceResults = ({ data, onReset }: InvoiceResultsProps) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    
    if (value === 'qr' && !qrCodeUrl) {
      try {
        const url = await generateInvoiceQRCode(data.invoiceNumber);
        setQrCodeUrl(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast.error("Failed to generate QR code");
      }
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${data.invoiceNumber}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('JSON file downloaded successfully');
  };
  
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      
      const pdfBlob = await generateInvoicePDF(data);
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${data.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('PDF file downloaded successfully');
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleCopyJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(dataStr);
    
    toast.success('JSON data copied to clipboard');
  };
  
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
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
            <div className="p-6 border rounded-lg bg-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                  <p className="text-gray-600">#{data.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Date: {data.invoiceDate}</p>
                  <p className="text-gray-600">Due Date: {data.dueDate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-10 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">FROM</h3>
                  <p className="font-medium text-gray-800">{data.vendor.name}</p>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{data.vendor.address}</p>
                  <p className="text-gray-600 text-sm">{data.vendor.phone}</p>
                  <p className="text-gray-600 text-sm">{data.vendor.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">TO</h3>
                  <p className="font-medium text-gray-800">{data.customer.name}</p>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{data.customer.address}</p>
                  <p className="text-gray-600 text-sm">{data.customer.phone}</p>
                  <p className="text-gray-600 text-sm">{data.customer.email}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="py-2 text-left font-medium text-gray-600">Description</th>
                      <th className="py-2 text-right font-medium text-gray-600">Qty</th>
                      <th className="py-2 text-right font-medium text-gray-600">Unit Price</th>
                      <th className="py-2 text-right font-medium text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 text-gray-800">{item.description}</td>
                        <td className="py-3 text-right text-gray-800">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-800">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-right text-gray-800">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(data.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>{formatCurrency(data.tax)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-800 pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(data.total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Notes</h3>
                <p className="text-gray-600 text-sm">{data.notes}</p>
                
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">
                    Payment Terms: {data.paymentTerms}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="mt-0 animate-fade-in">
            <div className="relative">
              <ScrollArea className="h-[400px] rounded-lg border bg-muted p-4">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </ScrollArea>
              
              <div className="absolute top-2 right-2 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm" 
                  onClick={handleCopyJSON}
                >
                  <Clipboard className="h-4 w-4" />
                  <span className="sr-only">Copy JSON</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="qr" className="mt-0 animate-fade-in">
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm mb-4">
                <img 
                  src={qrCodeUrl || '/placeholder.svg'} 
                  alt="Invoice QR Code" 
                  className="w-full h-full object-contain" 
                />
              </div>
              
              <p className="text-center text-sm text-muted-foreground max-w-sm">
                This QR code contains a unique identifier for your invoice. 
                Use it for quick access to invoice details or for payment processing.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-between items-center p-6 border-t bg-muted/20">
        <Button
          variant="outline"
          onClick={onReset}
          className="rounded-lg focus-ring"
        >
          Process Another Invoice
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadJSON}
            className="gap-2 rounded-lg focus-ring"
          >
            <Download className="h-4 w-4" />
            JSON
          </Button>
          
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="gap-2 rounded-lg focus-ring"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'Generating...' : 'PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceResults;
