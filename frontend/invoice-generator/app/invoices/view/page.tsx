'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

// Define the type for the invoice data we expect from the backend
interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  total: number;
  status: string;
  dueDate: string;
  items: { description: string; quantity: number; rate: number }[];
}

export default function ViewInvoicePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);
    setError('');
    setInvoice(null);

    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${searchQuery}`);
      
      if (response.status === 404) {
        throw new Error('Invoice not found.');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch invoice.');
      }

      const data = await response.json();
      setInvoice(data);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">View Invoice</h2>
          
          <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Invoice Number (e.g., INV-0001)"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 placeholder:text-gray-600 dark:placeholder:text-gray-400"
            />
            <button type="submit" disabled={isLoading} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-400">
              <Search size={18} className="mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {invoice && (
            <div className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Invoice Details</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                <p><strong>Status:</strong> <span className="font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{invoice.status}</span></p>
                <p><strong>Client:</strong> {invoice.clientName}</p>
                <p><strong>Email:</strong> {invoice.clientEmail}</p>
                <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> {formatCurrency(invoice.total)}</p>
              </div>
              <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200">Items</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {invoice.items.map((item, index) => (
                  <li key={index}>{item.description} - {item.quantity} x {formatCurrency(item.rate)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
