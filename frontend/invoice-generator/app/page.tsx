'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

// --- Define TypeScript Interfaces ---

interface Item {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

// This interface defines the shape of all the data needed for the preview
interface InvoiceData {
    clientName: string;
    clientEmail: string;
    clientCompany: string;
    clientAddress: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    paymentTerms: string;
    status: string;
    items: Item[];
    notes: string;
    terms: string;
    taxRate: number;
    subtotal: number;
    taxAmount: number;
    total: number;
}

// This interface defines the props for our modal component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceData: InvoiceData;
}


// --- Reusable Invoice Preview Component ---
const InvoicePreviewModal = ({ isOpen, onClose, invoiceData }: ModalProps) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Invoice Preview</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="p-8">
            {/* This is the styled invoice content, similar to the PDF template */}
            <div className="header flex justify-between items-start mb-10">
                <div className="logo text-2xl font-bold text-gray-800 dark:text-gray-200">Your Company</div>
                <div className="invoice-title text-right">
                    <h1 className="text-4xl font-light text-teal-600 dark:text-teal-400 m-0">INVOICE</h1>
                </div>
            </div>
            <div className="details grid grid-cols-2 gap-8 mb-10">
                <div className="bill-to text-gray-700 dark:text-gray-300">
                    <h2 className="font-bold mb-2 text-gray-600 dark:text-gray-400">Bill To:</h2>
                    <p>{invoiceData.clientName}</p>
                    <p>{invoiceData.clientCompany}</p>
                    <p className="whitespace-pre-line">{invoiceData.clientAddress}</p>
                </div>
                <div className="invoice-meta text-right text-gray-700 dark:text-gray-300">
                    <div className="mb-1"><span className="font-bold text-gray-600 dark:text-gray-400">Invoice No: </span> {invoiceData.invoiceNumber}</div>
                    <div className="mb-1"><span className="font-bold text-gray-600 dark:text-gray-400">Issue Date: </span> {new Date(invoiceData.issueDate).toLocaleDateString()}</div>
                    <div><span className="font-bold text-gray-600 dark:text-gray-400">Due Date: </span> {new Date(invoiceData.dueDate).toLocaleDateString()}</div>
                </div>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="p-3 font-bold text-gray-600 dark:text-gray-300 uppercase text-sm">Description</th>
                        <th className="p-3 font-bold text-gray-600 dark:text-gray-300 uppercase text-sm text-center">Qty</th>
                        <th className="p-3 font-bold text-gray-600 dark:text-gray-300 uppercase text-sm text-right">Unit Price</th>
                        <th className="p-3 font-bold text-gray-600 dark:text-gray-300 uppercase text-sm text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="dark:text-gray-300">
                    {invoiceData.items.map((item: Item) => (
                        <tr key={item.id} className="border-b dark:border-gray-700">
                            <td className="p-3">{item.description}</td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                            <td className="p-3 text-right">{formatCurrency(item.quantity * item.rate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end mt-6">
                <div className="w-full max-w-xs text-gray-700 dark:text-gray-300 space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(invoiceData.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Tax ({invoiceData.taxRate}%):</span><span>{formatCurrency(invoiceData.taxAmount)}</span></div>
                    <div className="mt-2 pt-2 border-t dark:border-gray-700">
                        <div className="flex justify-between font-bold text-lg p-2 bg-teal-600 text-white rounded-md"><span>Grand Total:</span><span>{formatCurrency(invoiceData.total)}</span></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function NewInvoicePage() {
  // State for all form fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [invoiceStatus, setInvoiceStatus] = useState('Draft');
  
  const [items, setItems] = useState<Item[]>([]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');

  const [taxRate, setTaxRate] = useState(10);
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);

  // State to control the preview modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Set default values on component mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    setIssueDate(today);
    setDueDate(futureDate.toISOString().split('T')[0]);
    setClientCompany('Client Company LLC');
    setClientAddress('123 Business Ave\nCity, State 10001');
    setInvoiceNumber('INV-0001');
    setNotes('Thank you for your business!');
    setTerms('Payment due upon receipt. Late fees may apply.');
    setItems([{ id: Date.now(), description: '', quantity: 1, rate: 0 }]);
  }, []);

  // Recalculate totals
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const newTaxAmount = newSubtotal * (taxRate / 100);
    const newTotal = newSubtotal + newTaxAmount;
    
    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotal(newTotal);
  }, [items, taxRate]);

  // --- HANDLER FUNCTIONS ---

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: number, field: keyof Item, value: any) => {
    const updatedItems = items.map(item => {
      // FIX: Corrected the condition to only parse numbers for quantity and rate
      const numericValue = (field === 'quantity' || field === 'rate') ? parseFloat(value) || 0 : value;
      return item.id === id ? { ...item, [field]: numericValue } : item;
    });
    setItems(updatedItems);
  };
  
  // --- BACKEND INTEGRATION ---

  const handleSaveDraft = async () => {
    const invoiceData = {
      clientName, clientEmail, clientCompany, clientAddress,
      invoiceNumber, issueDate, dueDate, paymentTerms,
      status: invoiceStatus, items, notes, terms,
      taxRate, subtotal, taxAmount, total,
    };
    try {
      const response = await fetch('http://localhost:3001/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
      if (!response.ok) throw new Error('Failed to save invoice');
      const savedInvoice = await response.json();
      alert(`Invoice saved successfully with ID: ${savedInvoice._id}`);
    } catch (error) {
      console.error(error);
      alert('Error: Could not save the invoice.');
    }
  };

  const handleDownloadPdf = async () => {
    const invoiceData = {
      clientName, clientEmail, clientCompany, clientAddress,
      invoiceNumber, issueDate, dueDate, paymentTerms,
      status: invoiceStatus, items, notes, terms,
      taxRate, subtotal, taxAmount, total,
    };
    try {
      const response = await fetch('http://localhost:3001/api/invoices/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
      if (!response.ok) throw new Error('PDF generation failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceData.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert('Could not download PDF.');
    }
  };

  const handlePreview = () => setIsPreviewOpen(true);

  const handleEmailInvoice = async () => {
    if (!clientEmail) {
        alert('Please enter a client email address before sending.');
        return;
    }
    const invoiceData = {
      clientName, clientEmail, clientCompany, clientAddress,
      invoiceNumber, issueDate, dueDate, paymentTerms,
      status: invoiceStatus, items, notes, terms,
      taxRate, subtotal, taxAmount, total,
    };
    try {
      const response = await fetch('http://localhost:3001/api/invoices/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
      if (!response.ok) throw new Error('Failed to send email');
      
      const result = await response.json();
      alert(result.message);

    } catch (error) {
      console.error("Error sending email:", error);
      alert('Could not send email.');
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
          <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Create New Invoice</h2>
              
              {/* Form fields... (rest of the JSX is the same) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                  {/* Bill To Column */}
                  <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Bill To</h3>
                      <div>
                          <label htmlFor="clientName" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Client Name</label>
                          <input type="text" id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g., Swetankan Sinha" className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 placeholder:text-gray-600 dark:placeholder:text-gray-400" />
                      </div>
                      <div>
                          <label htmlFor="clientEmail" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
                          <input type="email" id="clientEmail" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="e.g., swetankan@sinha.com" className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 placeholder:text-gray-600 dark:placeholder:text-gray-400" />
                      </div>
                      <div>
                          <label htmlFor="clientCompany" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Company</label>
                          <input type="text" id="clientCompany" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500" />
                      </div>
                      <div>
                          <label htmlFor="clientAddress" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Address</label>
                          <textarea id="clientAddress" value={clientAddress} rows={2} onChange={(e) => setClientAddress(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500"></textarea>
                      </div>
                  </div>

                  {/* Invoice Details Column */}
                  <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Invoice Details</h3>
                      <div>
                          <label htmlFor="invoiceNumber" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Invoice Number</label>
                          <input type="text" id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label htmlFor="issueDate" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Issue Date</label>
                              <input type="date" id="issueDate" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500" />
                          </div>
                          <div>
                              <label htmlFor="dueDate" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Due Date</label>
                              <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500" />
                          </div>
                      </div>
                      <div>
                          <label htmlFor="paymentTerms" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Terms</label>
                          <select id="paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500">
                              <option value="15">Net 15 Days</option>
                              <option value="30">Net 30 Days</option>
                              <option value="7">Net 7 Days</option>
                              <option value="0">Due on Receipt</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor="invoiceStatus" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Invoice Status</label>
                          <select id="invoiceStatus" value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500">
                              <option value="Draft">Draft</option>
                              <option value="Sent">Sent</option>
                              <option value="Paid">Paid</option>
                              <option value="Overdue">Overdue</option>
                          </select>
                      </div>
                  </div>
              </div>

              {/* Items Table */}
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Items</h3>
              <div className="overflow-x-auto">
                  <table className="min-w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rate</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                              <th className="py-3"></th>
                          </tr>
                      </thead>
                      <tbody className="dark:bg-gray-800">
                          {items.map(item => (
                              <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="px-6 py-2"><input type="text" placeholder="Item description" value={item.description} onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)} className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-600 dark:placeholder:text-gray-400" /></td>
                                  <td className="px-3 py-2"><input type="number" min="0" value={item.quantity} onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)} className="w-20 px-2 py-1 border rounded text-right bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600" /></td>
                                  <td className="px-3 py-2"><input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)} className="w-24 px-2 py-1 border rounded text-right bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600" /></td>
                                  <td className="px-6 py-2 text-right dark:text-gray-300">₹{(item.quantity * item.rate).toFixed(2)}</td>
                                  <td className="py-2 text-center"><button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="flex justify-end mt-4">
                  <button onClick={handleAddItem} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                      <Plus size={18} className="mr-2" /> Add Item
                  </button>
              </div>

              {/* Notes, Totals and Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="md:col-span-2 space-y-4">
                      <div>
                          <label htmlFor="notes" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Notes</label>
                          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500"></textarea>
                      </div>
                      <div>
                          <label htmlFor="terms" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Terms</label>
                          <textarea id="terms" value={terms} onChange={(e) => setTerms(e.target.value)} rows={2} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500"></textarea>
                      </div>
                  </div>
                  <div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2 text-gray-800 dark:text-gray-200">
                          <div className="flex justify-between"><span>Subtotal:</span><span id="subtotal">₹{subtotal.toFixed(2)}</span></div>
                          <div className="flex justify-between items-center">
                              <span>Tax Rate (%):</span>
                              <input type="number" id="taxRate" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-20 px-2 py-1 border rounded text-right bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600" />
                          </div>
                          <div className="flex justify-between"><span>Tax Amount:</span><span id="taxAmount">₹{taxAmount.toFixed(2)}</span></div>
                          <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                          <div className="flex justify-between font-bold text-lg"><span>Total:</span><span id="totalAmount">₹{total.toFixed(2)}</span></div>
                      </div>
                      <div className="mt-4 space-y-2">
                          <button onClick={handleSaveDraft} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Save Draft</button>
                          <button onClick={handlePreview} className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg">Preview Invoice</button>
                          <button onClick={handleDownloadPdf} className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">Download PDF</button>
                          <button onClick={handleEmailInvoice} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Email Invoice</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <InvoicePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        invoiceData={{
            clientName, clientEmail, clientCompany, clientAddress,
            invoiceNumber, issueDate, dueDate, paymentTerms,
            status: invoiceStatus, items, notes, terms,
            taxRate, subtotal, taxAmount, total,
        }} 
      />
    </>
  );
}
