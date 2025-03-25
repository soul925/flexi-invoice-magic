
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

// Function to generate dynamic invoice data based on the file
const generateDynamicInvoiceData = (file: File): InvoiceData => {
  // In a real application, this would be replaced with actual OCR extraction
  // For demonstration, we're creating unique data based on the file name and timestamp
  const timestamp = new Date().getTime();
  const fileNameHash = file.name.split('.')[0].slice(0, 4).toUpperCase();
  
  return {
    invoiceNumber: `INV-${fileNameHash}-${timestamp.toString().slice(-4)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vendor: {
      name: `Vendor ${fileNameHash}`,
      address: '123 Business St, Suite 100, San Francisco, CA 94107',
      phone: '(555) 123-4567',
      email: `billing@${fileNameHash.toLowerCase()}.com`,
    },
    customer: {
      name: 'TechStart Inc.',
      address: '456 Innovation Ave, Mountain View, CA 94043',
      phone: '(555) 987-6543',
      email: 'accounts@techstart.io',
    },
    items: [
      {
        description: `Product X - ${file.name.split('.')[0]}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        unitPrice: Math.floor(Math.random() * 500) + 100,
        amount: 0, // Will be calculated
      },
      {
        description: 'Hardware Component',
        quantity: Math.floor(Math.random() * 3) + 1,
        unitPrice: Math.floor(Math.random() * 200) + 50,
        amount: 0, // Will be calculated
      },
    ],
    subtotal: 0, // Will be calculated
    tax: 0, // Will be calculated
    total: 0, // Will be calculated
    notes: `Invoice generated from file: ${file.name}`,
    paymentTerms: 'Net 30',
  };
};

// Calculate the financial values for an invoice
const calculateInvoiceAmounts = (invoice: InvoiceData): InvoiceData => {
  const result = { ...invoice };
  
  // Calculate amount for each line item
  result.items = result.items.map(item => ({
    ...item,
    amount: item.quantity * item.unitPrice
  }));
  
  // Calculate subtotal
  result.subtotal = result.items.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate tax (7.5%)
  result.tax = parseFloat((result.subtotal * 0.075).toFixed(2));
  
  // Calculate total
  result.total = result.subtotal + result.tax;
  
  return result;
};

/**
 * Process an invoice image through OCR
 * In a real application, this would send the image to an OCR service
 */
export const processInvoiceImage = async (file: File): Promise<OCRResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Generate dynamic data based on the uploaded file
    let invoiceData = generateDynamicInvoiceData(file);
    
    // Calculate the financial amounts
    invoiceData = calculateInvoiceAmounts(invoiceData);
    
    return {
      success: true,
      data: invoiceData
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
