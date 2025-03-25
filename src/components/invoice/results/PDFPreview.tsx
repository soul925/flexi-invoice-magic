
import { formatCurrency } from '../../../utils/formatters';
import { InvoiceData } from '../DataReviewForm';

interface PDFPreviewProps {
  data: InvoiceData;
}

const PDFPreview = ({ data }: PDFPreviewProps) => {
  return (
    <div className="p-6 border rounded-lg bg-white">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
          <p className="text-gray-600">#{data.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Date: {data.invoiceDate}</p>
          <p className="text-gray-600">Due Date: {data.dueDate}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-10 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">FROM</h3>
          <p className="font-medium text-gray-800">{data.vendor.name}</p>
          <p className="text-gray-600 text-sm whitespace-pre-line">{data.vendor.address}</p>
          <p className="text-gray-600 text-sm">{data.vendor.phone}</p>
          <p className="text-gray-600 text-sm">{data.vendor.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">TO</h3>
          <p className="font-medium text-gray-800">{data.customer.name}</p>
          <p className="text-gray-600 text-sm whitespace-pre-line">{data.customer.address}</p>
          <p className="text-gray-600 text-sm">{data.customer.phone}</p>
          <p className="text-gray-600 text-sm">{data.customer.email}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left font-medium text-gray-600">Description</th>
              <th className="py-2 text-right font-medium text-gray-600">Qty</th>
              <th className="py-2 text-right font-medium text-gray-600">Unit Price</th>
              <th className="py-2 text-right font-medium text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 text-gray-800">{item.description}</td>
                <td className="py-3 text-right text-gray-800">{item.quantity}</td>
                <td className="py-3 text-right text-gray-800">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-right text-gray-800">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-1">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>{formatCurrency(data.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax:</span>
            <span>{formatCurrency(data.tax)}</span>
          </div>
          <div className="flex justify-between font-medium text-gray-800 pt-2 border-t">
            <span>Total:</span>
            <span>{formatCurrency(data.total)}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Notes</h3>
        <p className="text-gray-600 text-sm">{data.notes}</p>
        
        <div className="mt-2">
          <p className="text-gray-600 text-sm">
            Payment Terms: {data.paymentTerms}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
