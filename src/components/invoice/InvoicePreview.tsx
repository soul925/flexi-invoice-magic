
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ZoomIn, ZoomOut, RotateCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InvoicePreviewProps {
  file: File | null;
  isProcessing?: boolean;
}

const InvoicePreview = ({ file, isProcessing = false }: InvoicePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      // For PDFs, we'd normally use PDF.js to render a preview
      // Since we can't fully implement that here, we'll use a placeholder
      setPreviewUrl('/placeholder.svg');
      setTotalPages(3); // Mock multiple pages for demo
      setLoading(false);
    } else {
      setPreviewUrl('/placeholder.svg');
      setLoading(false);
    }
  }, [file]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const renderContent = () => {
    if (!previewUrl || loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden rounded-lg relative">
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <img
              src={previewUrl}
              alt="Invoice preview"
              className="max-h-full max-w-full object-contain transition-all p-4"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                opacity: isProcessing ? 0.6 : 1,
              }}
            />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-xs">
                <div className="flex flex-col items-center space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm font-medium text-primary">Processing Invoice...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-3 px-4 border-t">
          {totalPages > 1 ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-full"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="h-8 w-8 rounded-full"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="h-8 w-8 rounded-full"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRotate}
              className="h-8 w-8 rounded-full"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "border rounded-lg h-full min-h-[400px] flex flex-col overflow-hidden bg-card shadow-sm transition-all animate-fade-in",
        isProcessing && "shadow-md"
      )}
    >
      {renderContent()}
    </div>
  );
};

export default InvoicePreview;
