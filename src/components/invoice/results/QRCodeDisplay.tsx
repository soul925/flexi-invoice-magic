
import { useState, useEffect } from 'react';
import { generateInvoiceQRCode } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  invoiceNumber: string;
}

const QRCodeDisplay = ({ invoiceNumber }: QRCodeDisplayProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadQRCode() {
      try {
        const url = await generateInvoiceQRCode(invoiceNumber);
        setQrCodeUrl(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast.error("Failed to generate QR code");
      }
    }
    
    loadQRCode();
  }, [invoiceNumber]);
  
  return (
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
  );
};

export default QRCodeDisplay;
