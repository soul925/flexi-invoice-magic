// PDF generation utility for invoice processing
// Uses browser's built-in capabilities to generate PDFs

import { InvoiceData } from "@/components/invoice/DataReviewForm";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Generate a PDF invoice from the given data
 */
export const generateInvoicePDF = async (data: InvoiceData): Promise<Blob> => {
  console.log("Generating PDF for invoice:", data.invoiceNumber);
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add invoice header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 105, 20, { align: "center" });
  
  // Add invoice number
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${data.invoiceNumber}`, 20, 30);
  doc.text(`Date: ${data.invoiceDate}`, 20, 35);
  doc.text(`Due Date: ${data.dueDate}`, 20, 40);
  
  // Add vendor details
  doc.setFont("helvetica", "bold");
  doc.text("From:", 20, 50);
  doc.setFont("helvetica", "normal");
  doc.text(data.vendor.name, 20, 55);
  
  // Split address into multiple lines if needed
  const vendorAddressLines = data.vendor.address.split(",");
  vendorAddressLines.forEach((line, index) => {
    doc.text(line.trim(), 20, 60 + (index * 5));
  });
  
  const vendorEndY = 60 + (vendorAddressLines.length * 5);
  doc.text(data.vendor.phone, 20, vendorEndY + 5);
  doc.text(data.vendor.email, 20, vendorEndY + 10);
  
  // Add customer details
  doc.setFont("helvetica", "bold");
  doc.text("To:", 120, 50);
  doc.setFont("helvetica", "normal");
  doc.text(data.customer.name, 120, 55);
  
  // Split address into multiple lines if needed
  const customerAddressLines = data.customer.address.split(",");
  customerAddressLines.forEach((line, index) => {
    doc.text(line.trim(), 120, 60 + (index * 5));
  });
  
  const customerEndY = 60 + (customerAddressLines.length * 5);
  doc.text(data.customer.phone, 120, customerEndY + 5);
  doc.text(data.customer.email, 120, customerEndY + 10);
  
  // Start table at the maximum Y position from both sections
  const tableStartY = Math.max(vendorEndY, customerEndY) + 20;
  
  // Add line items as a table
  doc.autoTable({
    startY: tableStartY,
    head: [["Description", "Quantity", "Unit Price", "Amount"]],
    body: data.items.map(item => [
      item.description,
      item.quantity.toString(),
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.amount.toFixed(2)}`
    ]),
    foot: [
      ["", "", "Subtotal", `$${data.subtotal.toFixed(2)}`],
      ["", "", "Tax", `$${data.tax.toFixed(2)}`],
      ["", "", "Total", `$${data.total.toFixed(2)}`]
    ],
    theme: "grid",
    headStyles: { fillColor: [66, 66, 66] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" }
  });
  
  // Add payment terms and notes
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.text("Payment Terms:", 20, finalY);
  doc.setFont("helvetica", "normal");
  doc.text(data.paymentTerms, 60, finalY);
  
  if (data.notes) {
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 20, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(data.notes, 20, finalY + 15);
  }
  
  // Convert to blob
  const pdfBlob = doc.output("blob");
  return pdfBlob;
};

/**
 * Generate a QR code for the invoice
 */
export const generateInvoiceQRCode = async (invoiceNumber: string): Promise<string> => {
  // Simulate QR code generation
  console.log("Generating QR code for invoice:", invoiceNumber);
  
  // For a real implementation, we would use a QR code generation library
  // For now, return a placeholder
  return '/placeholder.svg';
};

/**
 * Generate a report of multiple invoices
 * Useful for batch processing and summary reports
 */
export const generateInvoiceBatchReport = async (invoices: InvoiceData[]): Promise<Blob> => {
  // Simulate batch report generation
  console.log("Generating batch report for", invoices.length, "invoices");
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // This is a mock implementation
  const reportContent = `
    Invoice Batch Report
    Total Invoices: ${invoices.length}
    Total Value: $${invoices.reduce((sum, inv) => sum + inv.total, 0)}
    
    Invoice List:
    ${invoices.map(inv => 
      `${inv.invoiceNumber} - ${inv.invoiceDate} - ${inv.vendor.name} - $${inv.total}`
    ).join('\n')}
  `;
  
  return new Blob([reportContent], { type: 'application/pdf' });
};

/**
 * Convert JSON invoice data to a properly formatted PDF
 */
export const jsonToPDF = async (jsonData: string): Promise<Blob> => {
  // Parse the JSON
  const data = JSON.parse(jsonData) as InvoiceData;
  
  // Generate PDF
  return await generateInvoicePDF(data);
};

/**
 * Add a digital signature to the PDF
 * For security and authentication of the invoice
 */
export const addDigitalSignature = async (pdfBlob: Blob, signatureInfo: any): Promise<Blob> => {
  // Simulate adding a digital signature
  console.log("Adding digital signature to PDF");
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, this would add an actual digital signature
  // For demonstration, we'll just return the original blob
  return pdfBlob;
};
