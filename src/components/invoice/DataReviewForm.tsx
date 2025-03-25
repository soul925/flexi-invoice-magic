
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  PlusCircle, 
  MinusCircle, 
  ArrowLeft, 
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  vendor: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  customer: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  paymentTerms: string;
}

interface DataReviewFormProps {
  initialData?: Partial<InvoiceData>;
  onSubmit: (data: InvoiceData) => void;
  onBack: () => void;
}

const emptyInvoiceData: InvoiceData = {
  invoiceNumber: '',
  invoiceDate: '',
  dueDate: '',
  vendor: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  customer: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  items: [
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    },
  ],
  subtotal: 0,
  tax: 0,
  total: 0,
  notes: '',
  paymentTerms: '',
};

// Mock data for demonstration purposes
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

const DataReviewForm = ({ initialData, onSubmit, onBack }: DataReviewFormProps) => {
  // In a real application, initialData would come from OCR processing
  // For this demo, we'll use mock data
  const [formData, setFormData] = useState<InvoiceData>(mockExtractedData);
  const [activeTab, setActiveTab] = useState('invoice');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updateField = (
    field: string,
    value: string | number | object,
    nestedField?: string,
    itemIndex?: number,
    itemField?: string
  ) => {
    setFormData((prev) => {
      const newData = { ...prev };
      
      if (nestedField && typeof nestedField === 'string') {
        if (itemIndex !== undefined && itemField) {
          // Handle item array updates
          newData.items = [...prev.items];
          newData.items[itemIndex] = {
            ...newData.items[itemIndex],
            [itemField]: value,
          };
          
          // Recalculate amount if quantity or unitPrice changes
          if (itemField === 'quantity' || itemField === 'unitPrice') {
            const item = newData.items[itemIndex];
            item.amount = Number(item.quantity) * Number(item.unitPrice);
          }
          
          // Recalculate subtotal and total
          newData.subtotal = newData.items.reduce(
            (sum, item) => sum + Number(item.amount),
            0
          );
          newData.total = newData.subtotal + Number(newData.tax);
        } else {
          // Handle nested field updates (like vendor.name)
          const parentField = field as keyof InvoiceData;
          if (typeof newData[parentField] === 'object' && newData[parentField] !== null) {
            (newData[parentField] as any)[nestedField] = value;
          }
        }
      } else {
        // Handle top-level field updates
        (newData as any)[field] = value;
        
        // Recalculate total if subtotal or tax changes
        if (field === 'subtotal' || field === 'tax') {
          newData.total = Number(newData.subtotal) + Number(newData.tax);
        }
      }
      
      return newData;
    });
    
    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      
      const newSubtotal = newItems.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      
      return {
        ...prev,
        items: newItems,
        subtotal: newSubtotal,
        total: newSubtotal + Number(prev.tax),
      };
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Check required fields
    if (!formData.invoiceNumber) errors.invoiceNumber = 'Invoice number is required';
    if (!formData.invoiceDate) errors.invoiceDate = 'Invoice date is required';
    if (!formData.vendor.name) errors.vendorName = 'Vendor name is required';
    
    // Validate items
    if (formData.items.length === 0) {
      errors.items = 'At least one item is required';
    }
    
    formData.items.forEach((item, index) => {
      if (!item.description) errors[`item_${index}_description`] = 'Description is required';
      if (item.quantity <= 0) errors[`item_${index}_quantity`] = 'Quantity must be positive';
      if (item.unitPrice < 0) errors[`item_${index}_unitPrice`] = 'Price cannot be negative';
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleNext = () => {
    const tabOrder = ['invoice', 'parties', 'items', 'payment'];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    const tabOrder = ['invoice', 'parties', 'items', 'payment'];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  return (
    <div className="border rounded-lg bg-card shadow-sm animate-fade-in">
      <div className="p-6 border-b">
        <h3 className="text-lg font-medium">Review Extracted Data</h3>
        <p className="text-sm text-muted-foreground">
          Verify and correct the information extracted from your invoice
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="invoice">
              Invoice Details
            </TabsTrigger>
            <TabsTrigger value="parties">
              Vendor & Customer
            </TabsTrigger>
            <TabsTrigger value="items">
              Line Items
            </TabsTrigger>
            <TabsTrigger value="payment">
              Payment & Notes
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-[520px] px-6 py-4">
          <TabsContent value="invoice" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">
                  Invoice Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  className={validationErrors.invoiceNumber ? 'border-destructive' : ''}
                />
                {validationErrors.invoiceNumber && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.invoiceNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDate">
                  Invoice Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => updateField('invoiceDate', e.target.value)}
                  className={validationErrors.invoiceDate ? 'border-destructive' : ''}
                />
                {validationErrors.invoiceDate && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.invoiceDate}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parties" className="mt-0 space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Vendor Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">
                    Vendor Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="vendorName"
                    value={formData.vendor.name}
                    onChange={(e) => updateField('vendor', e.target.value, 'name')}
                    className={validationErrors.vendorName ? 'border-destructive' : ''}
                  />
                  {validationErrors.vendorName && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.vendorName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorEmail">Vendor Email</Label>
                  <Input
                    id="vendorEmail"
                    type="email"
                    value={formData.vendor.email}
                    onChange={(e) => updateField('vendor', e.target.value, 'email')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorAddress">Vendor Address</Label>
                  <Input
                    id="vendorAddress"
                    value={formData.vendor.address}
                    onChange={(e) => updateField('vendor', e.target.value, 'address')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorPhone">Vendor Phone</Label>
                  <Input
                    id="vendorPhone"
                    value={formData.vendor.phone}
                    onChange={(e) => updateField('vendor', e.target.value, 'phone')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customer.name}
                    onChange={(e) => updateField('customer', e.target.value, 'name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) => updateField('customer', e.target.value, 'email')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customer.address}
                    onChange={(e) => updateField('customer', e.target.value, 'address')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customer.phone}
                    onChange={(e) => updateField('customer', e.target.value, 'phone')}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Line Items</h4>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 gap-1 text-primary"
                onClick={addItem}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Item</span>
              </Button>
            </div>

            {validationErrors.items && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.items}
              </p>
            )}

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div 
                  key={index} 
                  className="p-4 border rounded-lg relative space-y-3 bg-muted/20"
                >
                  <div className="absolute top-4 right-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeItem(index)}
                    >
                      <MinusCircle className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-${index}-description`}>
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`item-${index}-description`}
                      value={item.description}
                      onChange={(e) => 
                        updateField('items', e.target.value, undefined, index, 'description')
                      }
                      className={validationErrors[`item_${index}_description`] ? 'border-destructive' : ''}
                    />
                    {validationErrors[`item_${index}_description`] && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors[`item_${index}_description`]}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-quantity`}>
                        Quantity <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`item-${index}-quantity`}
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => 
                          updateField('items', Number(e.target.value), undefined, index, 'quantity')
                        }
                        className={validationErrors[`item_${index}_quantity`] ? 'border-destructive' : ''}
                      />
                      {validationErrors[`item_${index}_quantity`] && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {validationErrors[`item_${index}_quantity`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-unitPrice`}>
                        Unit Price <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`item-${index}-unitPrice`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => 
                          updateField('items', Number(e.target.value), undefined, index, 'unitPrice')
                        }
                        className={validationErrors[`item_${index}_unitPrice`] ? 'border-destructive' : ''}
                      />
                      {validationErrors[`item_${index}_unitPrice`] && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {validationErrors[`item_${index}_unitPrice`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-amount`}>Amount</Label>
                      <Input
                        id={`item-${index}-amount`}
                        type="number"
                        readOnly
                        value={item.amount}
                        className="bg-muted/30"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div></div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <Input
                    id="subtotal"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.subtotal}
                    onChange={(e) => updateField('subtotal', Number(e.target.value))}
                    className="w-1/2"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="tax">Tax</Label>
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tax}
                    onChange={(e) => updateField('tax', Number(e.target.value))}
                    className="w-1/2"
                  />
                </div>
                <div className="flex justify-between items-center font-medium">
                  <Label htmlFor="total">Total</Label>
                  <Input
                    id="total"
                    type="number"
                    readOnly
                    value={formData.total}
                    className="w-1/2 bg-muted/30 font-bold"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={(e) => updateField('paymentTerms', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <div className="flex justify-between items-center p-6 border-t bg-muted/20">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          className="gap-2 rounded-lg focus-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          {activeTab === 'invoice' ? 'Back to Upload' : 'Previous'}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          className="gap-2 rounded-lg focus-ring"
        >
          {activeTab === 'payment' ? (
            <>
              <span>Finalize and Export</span>
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DataReviewForm;
