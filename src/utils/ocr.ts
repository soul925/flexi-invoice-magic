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

// Analyze the uploaded file to extract text-based information
// In a real implementation, this would use actual OCR
const analyzeImageContent = async (file: File): Promise<any> => {
  // This would be an actual OCR operation in production
  // For demonstration, we infer details from the file name and type
  
  // Extract parts of the filename to simulate "reading" content from the image
  const fileName = file.name.toLowerCase();
  const fileSize = file.size;
  const timestamp = new Date().getTime();
  
  // Create realistic invoice data based on filename patterns
  let invoiceType = "general";
  let vendorName = "Unknown Vendor";
  let invoicePrefix = "INV";
  
  // Determine vendor and invoice type from filename
  if (fileName.includes("hospital") || fileName.includes("medical") || fileName.includes("health")) {
    invoiceType = "healthcare";
    vendorName = fileName.includes("hospital") ? "Central Hospital" : "Medical Services Inc.";
    invoicePrefix = "MED";
  } else if (fileName.includes("tech") || fileName.includes("computer") || fileName.includes("it")) {
    invoiceType = "technology";
    vendorName = fileName.includes("tech") ? "Tech Solutions" : "IT Services Co.";
    invoicePrefix = "TCH";
  } else if (fileName.includes("retail") || fileName.includes("store") || fileName.includes("shop")) {
    invoiceType = "retail";
    vendorName = fileName.includes("retail") ? "Retail Supplies" : "Shop Merchandise Ltd.";
    invoicePrefix = "RTL";
  } else if (fileName.includes("food") || fileName.includes("restaurant") || fileName.includes("catering")) {
    invoiceType = "food";
    vendorName = fileName.includes("food") ? "Food Distributors Inc." : "Catering Services";
    invoicePrefix = "FD";
  }
  
  // Generate a realistic invoice number based on the type and file properties
  const fileHash = (fileSize % 10000).toString().padStart(4, '0');
  const invoiceNumber = `${invoicePrefix}-${fileHash}-${Math.floor(Math.random() * 1000)}`;
  
  // Generate more realistic dates
  const today = new Date();
  const invoiceDate = today.toISOString().split('T')[0];
  
  // Due date is typically 30 days after invoice date
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 30);
  
  return {
    invoiceType,
    vendorName,
    invoiceNumber,
    invoiceDate,
    dueDate: dueDate.toISOString().split('T')[0],
    fileName,
    fileSize
  };
};

// Generate more realistic line items based on the invoice type
const generateLineItems = (invoiceType: string, fileName: string): Array<{
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}> => {
  const items = [];
  
  switch (invoiceType) {
    case "healthcare":
      items.push({
        description: "Medical Consultation",
        quantity: 1,
        unitPrice: 150.00,
        amount: 150.00
      });
      items.push({
        description: "Lab Tests",
        quantity: Math.floor(Math.random() * 3) + 1,
        unitPrice: 85.50,
        amount: 0 // Will be calculated
      });
      if (Math.random() > 0.5) {
        items.push({
          description: "Medication",
          quantity: 1,
          unitPrice: 65.75,
          amount: 65.75
        });
      }
      break;
      
    case "technology":
      items.push({
        description: "IT Support Hours",
        quantity: Math.floor(Math.random() * 8) + 2,
        unitPrice: 95.00,
        amount: 0 // Will be calculated
      });
      items.push({
        description: "Software License",
        quantity: 1,
        unitPrice: 299.99,
        amount: 299.99
      });
      break;
      
    case "retail":
      items.push({
        description: "Product A - Premium",
        quantity: Math.floor(Math.random() * 5) + 1,
        unitPrice: 49.99,
        amount: 0 // Will be calculated
      });
      items.push({
        description: "Product B - Standard",
        quantity: Math.floor(Math.random() * 10) + 1,
        unitPrice: 24.99,
        amount: 0 // Will be calculated
      });
      if (Math.random() > 0.3) {
        items.push({
          description: "Extended Warranty",
          quantity: 1,
          unitPrice: 19.99,
          amount: 19.99
        });
      }
      break;
      
    case "food":
      items.push({
        description: "Catering Service - Basic",
        quantity: Math.floor(Math.random() * 20) + 10,
        unitPrice: 15.99,
        amount: 0 // Will be calculated
      });
      items.push({
        description: "Premium Beverages",
        quantity: Math.floor(Math.random() * 15) + 5,
        unitPrice: 8.50,
        amount: 0 // Will be calculated
      });
      break;
      
    default:
      // Generic items for any other type
      items.push({
        description: `Service - ${fileName.split('.')[0]}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        unitPrice: 100 + Math.floor(Math.random() * 100),
        amount: 0 // Will be calculated
      });
      items.push({
        description: "Additional Materials",
        quantity: Math.floor(Math.random() * 3) + 1,
        unitPrice: 50 + Math.floor(Math.random() * 50),
        amount: 0 // Will be calculated
      });
  }
  
  // Calculate amounts for each item
  return items.map(item => ({
    ...item,
    amount: item.quantity * item.unitPrice
  }));
};

// Generate a realistic invoice based on the file and extracted data
const generateRealisticInvoiceData = async (file: File): Promise<InvoiceData> => {
  // Extract information from the file using our mock OCR
  const extractedData = await analyzeImageContent(file);
  
  // Generate line items based on the invoice type
  const items = generateLineItems(extractedData.invoiceType, extractedData.fileName);
  
  // Calculate financial totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.075; // 7.5% tax rate
  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  const total = subtotal + tax;
  
  // Build the complete invoice data
  const invoiceData: InvoiceData = {
    invoiceNumber: extractedData.invoiceNumber,
    invoiceDate: extractedData.invoiceDate,
    dueDate: extractedData.dueDate,
    vendor: {
      name: extractedData.vendorName,
      address: "123 Business St, Suite 100, San Francisco, CA 94107",
      phone: "(555) 123-4567",
      email: `billing@${extractedData.vendorName.toLowerCase().replace(/\s+/g, '')}.com`,
    },
    customer: {
      name: "TechStart Inc.",
      address: "456 Innovation Ave, Mountain View, CA 94043",
      phone: "(555) 987-6543",
      email: "accounts@techstart.io",
    },
    items: items,
    subtotal: subtotal,
    tax: tax,
    total: total,
    notes: `Invoice generated from file: ${file.name}`,
    paymentTerms: "Net 30",
  };
  
  return invoiceData;
};

/**
 * Process an invoice image through OCR
 * In a real application, this would send the image to an OCR service
 */
export const processInvoiceImage = async (file: File): Promise<OCRResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Generate invoice data based on the actual uploaded file
    const invoiceData = await generateRealisticInvoiceData(file);
    
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
