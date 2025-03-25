
import { DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onButtonClick: () => void;
  acceptedTypes: string[];
  maxSizeMB: number;
}

const UploadArea = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onButtonClick,
  acceptedTypes,
  maxSizeMB
}: UploadAreaProps) => {
  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-all ease-in-out duration-300 hover:bg-muted/40",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={cn(
          "p-4 rounded-full transition-all",
          isDragging ? "bg-primary/10" : "bg-muted"
        )}>
          <Upload className={cn(
            "h-8 w-8 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Upload your invoice</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Drag and drop your invoice file here, or click the button below to select a file
          </p>
        </div>
        <div className="space-y-2">
          <Button 
            type="button"
            className="rounded-lg focus-ring"
            onClick={onButtonClick}
          >
            Select File
          </Button>
          <p className="text-xs text-muted-foreground">
            Supported formats: {acceptedTypes.join(', ')} - Max size: {maxSizeMB}MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
