
import { File, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFileIcon } from './FileValidator';

interface FilePreviewProps {
  file: File;
  preview: string | null;
  onRemove: () => void;
  onReplace: () => void;
}

const FilePreview = ({ file, preview, onRemove, onReplace }: FilePreviewProps) => {
  const renderFileIcon = () => {
    const iconType = getFileIcon(file);
    
    if (iconType === 'image') {
      return <ImageIcon className="h-6 w-6 text-primary" />;
    } else if (iconType === 'pdf') {
      return <File className="h-6 w-6 text-primary" />;
    } else {
      return <File className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="border rounded-xl p-6 space-y-4 bg-card">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {renderFileIcon()}
          <div>
            <h3 className="font-medium text-sm line-clamp-1">{file.name}</h3>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
          onClick={onRemove}
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
          onClick={onReplace}
          className="rounded-lg focus-ring"
        >
          Replace File
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
