
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import UploadArea from './UploadArea';
import FilePreview from './FilePreview';
import { validateFile } from './FileValidator';

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

  const processFile = (file: File) => {
    if (!validateFile(file, acceptedTypes, maxSizeMB)) return;

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
        <UploadArea
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onButtonClick={handleButtonClick}
          acceptedTypes={acceptedTypes}
          maxSizeMB={maxSizeMB}
        />
      ) : (
        <FilePreview
          file={selectedFile}
          preview={preview}
          onRemove={removeFile}
          onReplace={handleButtonClick}
        />
      )}
    </div>
  );
};

export default FileUpload;
