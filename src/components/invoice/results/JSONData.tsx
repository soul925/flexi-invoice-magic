
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { InvoiceData } from '../DataReviewForm';

interface JSONDataProps {
  data: InvoiceData;
}

const JSONData = ({ data }: JSONDataProps) => {
  const handleCopyJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(dataStr);
    
    toast.success('JSON data copied to clipboard');
  };
  
  return (
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
  );
};

export default JSONData;
