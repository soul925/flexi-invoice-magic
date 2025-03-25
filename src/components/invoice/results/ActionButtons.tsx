
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { InvoiceData } from '../DataReviewForm';

interface ActionButtonsProps {
  data: InvoiceData;
  onReset: () => void;
}

const ActionButtons = ({ data, onReset }: ActionButtonsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
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
  
  return (
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
  );
};

export default ActionButtons;
