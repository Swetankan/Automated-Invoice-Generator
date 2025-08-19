import mongoose, { Schema, Document } from 'mongoose';

// This defines the structure for each item in the invoice's item list
const ItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
});

// This defines the structure for the main invoice document
const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientCompany: { type: String },
  clientAddress: { type: String },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  paymentTerms: { type: String },
  status: { type: String, required: true, default: 'Draft' },
  items: [ItemSchema], // This is an array of items using the schema above
  notes: { type: String },
  terms: { type: String },
  taxRate: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true }); // This automatically adds `createdAt` and `updatedAt` fields

export interface IInvoice extends Document {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientAddress?: string;
  issueDate: Date;
  dueDate: Date;
  paymentTerms?: string;
  status: string;
  items: { description: string; quantity: number; rate: number }[];
  notes?: string;
  terms?: string;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
