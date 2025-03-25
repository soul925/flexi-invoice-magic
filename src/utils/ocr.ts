
// This is a mock OCR service for demonstration purposes
// In a real application, this would connect to a real OCR service like
// Google Cloud Vision, Azure Computer Vision, or Tesseract.js

import { InvoiceData } from "@/components/invoice/DataReviewForm";
import { preprocessImage } from "./imageProcessing";

export interface OCRResult {
  success: boolean;
  data?: Partial<InvoiceData>;
  error?: string;
}

// Mock data for demonstration
const mockExtractedData: InvoiceData = {
  invoiceNumber: 'INV-2023-0158',
  invoiceDate: '2023-10-15',
  dueDate: '2023-11-15',
  vendor: {
    name: 'Acme Corporation',
    address: '123 Business St, Suite 100, San Francisco, CA 94107',
    phone: '(555) 123-4567',
    email: 'billing@acmecorp.com',
  },
  customer: {
    name: 'TechStart Inc.',
    address: '456 Innovation Ave, Mountain View, CA 94043',
    phone: '(555) 987-6543',
    email: 'accounts@techstart.io',
  },
  items: [
    {
      description: 'Product A - Premium Subscription',
      quantity: 2,
      unitPrice: 600,
      amount: 1200,
    },
    {
      description: 'Product B - Hardware',
      quantity: 1,
      unitPrice: 850,
      amount: 850,
    },
    {
      description: 'Consulting Services',
      quantity: 10,
      unitPrice: 200,
      amount: 2000,
    },
  ],
  subtotal: 4050,
  tax: 303.75,
  total: 4353.75,
  notes: 'Payment due within 30 days. Late payments subject to 1.5% fee.',
  paymentTerms: 'Net 30',
};

/**
 * Process an invoice image through OCR
 * In a real application, this would send the image to an OCR service
 */
export const processInvoiceImage = async (file: File): Promise<OCRResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // In a real application, we would:
    // 1. Preprocess the image if needed (handled by preprocessImage in a real app)
    // 2. Send the image to an OCR service
    // 3. Parse the OCR results
    // 4. Extract the relevant invoice information
    
    // For demonstration, we'll return mock data
    return {
      success: true,
      data: mockExtractedData
    };
  } catch (error) {
    console.error("OCR processing error:", error);
    return {
      success: false,
      error: "Failed to process the invoice. Please try again or use a clearer image."
    };
  }
};

/**
 * Extract text from an image
 * This would be used for general OCR operations
 */
export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This is a mock implementation
  return "Extracted text would appear here in a real application.";
};

/**
 * Validate the extracted data
 * Checks for missing or inconsistent information
 */
export const validateExtractedData = (data: Partial<InvoiceData>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for required fields
  if (!data.invoiceNumber) errors.push("Missing invoice number");
  if (!data.invoiceDate) errors.push("Missing invoice date");
  if (!data.vendor?.name) errors.push("Missing vendor name");
  if (!data.items || data.items.length === 0) errors.push("No line items found");
  
  // In a real application, we would perform more thorough validation
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Detect the invoice type/sector
 * Used to apply sector-specific processing rules
 */
export const detectInvoiceType = (data: Partial<InvoiceData>): "healthcare" | "retail" | "general" => {
  // This is a simplified detection logic for demonstration
  // In a real application, this would be much more sophisticated
  
  const vendorName = data.vendor?.name?.toLowerCase() || "";
  const items = data.items || [];
  
  // Check for healthcare-related terms
  if (
    vendorName.includes("hospital") ||
    vendorName.includes("clinic") ||
    vendorName.includes("medical") ||
    vendorName.includes("health") ||
    items.some(item => 
      item.description.toLowerCase().includes("patient") ||
      item.description.toLowerCase().includes("treatment")
    )
  ) {
    return "healthcare";
  }
  
  // Check for retail-related terms
  if (
    vendorName.includes("store") ||
    vendorName.includes("shop") ||
    vendorName.includes("retail") ||
    items.some(item => 
      item.description.toLowerCase().includes("product") ||
      item.description.toLowerCase().includes("item")
    )
  ) {
    return "retail";
  }
  
  // Default
  return "general";
};
