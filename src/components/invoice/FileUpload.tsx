
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, X, Camera, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

const FileUpload = ({
  onFileSelect,
  acceptedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.tiff'],
  maxSizeMB = 10
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedTypes.includes(fileType) && !acceptedTypes.includes('*')) {
      toast.error(`File type not supported. Please upload: ${acceptedTypes.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just show the file name
      setPreview(null);
    }

    // Success message
    toast.success(`File "${file.name}" selected successfully`);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    
    if (selectedFile.type.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6 text-primary" />;
    } else if (selectedFile.type === 'application/pdf') {
      return <File className="h-6 w-6 text-primary" />;
    } else {
      return <File className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept={acceptedTypes.join(',')}
      />

      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all ease-in-out duration-300 hover:bg-muted/40",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
                onClick={handleButtonClick}
              >
                Select File
              </Button>
              <p className="text-xs text-muted-foreground">
                Supported formats: {acceptedTypes.join(', ')} - Max size: {maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 space-y-4 bg-card">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <h3 className="font-medium text-sm line-clamp-1">{selectedFile.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>

          {preview && (
            <div className="relative w-full overflow-hidden rounded-lg border bg-muted/30">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-[300px] w-auto object-contain p-2"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              File selected successfully
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleButtonClick}
              className="rounded-lg focus-ring"
            >
              Replace File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
