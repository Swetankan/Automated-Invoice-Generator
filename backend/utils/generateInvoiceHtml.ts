import { IInvoice } from '../models/Invoice';

export const getInvoiceHtml = (data: IInvoice): string => {
  // Helper to format currency to Indian Rupees (INR)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  // Generate table rows for each item
  const itemsHtml = data.items.map(item => `
    <tr class="item">
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.rate)}</td>
        <td>${formatCurrency(item.quantity * item.rate)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>Invoice #${data.invoiceNumber}</title>
        <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; color: #555; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; }
            .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
            .invoice-box table td { padding: 8px 0; vertical-align: top; }
            .invoice-box table tr.top table td { padding-bottom: 20px; }
            .invoice-box .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
            .invoice-box .header .logo { font-size: 28px; font-weight: bold; color: #333; }
            .invoice-box .header .invoice-title { text-align: right; }
            .invoice-box .header .invoice-title h1 { margin: 0; font-size: 45px; color: #0d9488; font-weight: 300; } /* Teal Accent Color */
            .invoice-box .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .invoice-box .details .bill-to h2 { margin: 0 0 5px 0; font-size: 16px; font-weight: bold; }
            .invoice-box .invoice-meta { text-align: right; }
            .invoice-box .invoice-meta div { margin-bottom: 5px; }
            .invoice-box .invoice-meta span { display: inline-block; min-width: 90px; font-weight: bold; text-align: left; }
            .invoice-box table.items-table { width: 100%; }
            .invoice-box table.items-table th { background: #f7f7f7; border-bottom: 2px solid #ddd; font-weight: bold; padding: 10px 0; text-align: left; }
            .invoice-box table.items-table th:last-child, .invoice-box table.items-table td:last-child { text-align: right; }
            .invoice-box table.items-table td { border-bottom: 1px solid #eee; padding: 10px 0; }
            .invoice-box .totals { text-align: right; margin-top: 20px; }
            .invoice-box .totals div { margin-bottom: 5px; }
            .invoice-box .totals .grand-total { margin-top: 10px; padding: 10px; background-color: #0d9488; color: white; font-size: 1.2em; font-weight: bold; } /* Teal Accent Color */
            .invoice-box .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; }
        </style>
    </head>
    <body>
        <div class="invoice-box">
            <div class="header">
                <div class="logo">GUVI HCL</div>
                <div class="invoice-title">
                    <h1>INVOICE</h1>
                </div>
            </div>
            <div class="details">
                <div class="bill-to">
                    <h2>Bill To:</h2>
                    ${data.clientName}<br>
                    ${data.clientCompany || ''}<br>
                    ${data.clientAddress ? data.clientAddress.replace(/\n/g, '<br>') : ''}
                </div>
                <div class="invoice-meta">
                    <div><span>Invoice No:</span> ${data.invoiceNumber}</div>
                    <div><span>Issue Date:</span> ${new Date(data.issueDate).toLocaleDateString()}</div>
                    <div><span>Due Date:</span> ${new Date(data.dueDate).toLocaleDateString()}</div>
                </div>
            </div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            <div class="totals">
                <div><span>Subtotal:</span> ${formatCurrency(data.subtotal)}</div>
                <div><span>Tax (${data.taxRate}%):</span> ${formatCurrency(data.taxAmount)}</div>
                <div class="grand-total">Grand Total: ${formatCurrency(data.total)}</div>
            </div>
            <div class="footer">
                Thank you for your business!
            </div>
        </div>
    </body>
    </html>
  `;
};
