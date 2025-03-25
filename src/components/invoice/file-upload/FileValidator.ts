
/**
 * Utility functions for file validation
 */
import { toast } from 'sonner';

export const validateFile = (
  file: File, 
  acceptedTypes: string[] = ['.jpg', '.jpeg', '.png', '.pdf', '.tiff'],
  maxSizeMB: number = 10
): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
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

export const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) {
    return 'image';
  } else if (file.type === 'application/pdf') {
    return 'pdf';
  } else {
    return 'file';
  }
};
