import jsPDF from "jspdf";

export interface Transaction {
  id: number | string;
  invoice_code: string;
  plan_name?: string;
  amount: number;
  status?: string;
  transaction_status?: string;
  created_at: string;
  expired_at?: string;
  due_date?: string;
  customer_name?: string;
  customer_email?: string;
  user_name?: string;
  user_email?: string;
  user?: {
    name?: string;
    full_name?: string;
    email?: string;
  };
  tax?: number;
  notes?: string;
  created_by?: string;
  created_by_name?: string;
  updated_at?: string;
  payment_method?: string;
  payment_string?: string;
}

export interface InvoiceOptions {
  notes?: string;
  terms?: string;
}

/**
 * Generate Invoice PDF
 * @param transaction - Transaction data
 * @param options - Additional options
 * @returns PDF document
 */
export function generateInvoicePDF(
  transaction: Transaction,
  options?: InvoiceOptions
): jsPDF;

/**
 * Download single invoice
 * @param transaction - Transaction data
 */
export function downloadInvoice(transaction: Transaction): Promise<void>;

/**
 * Get invoice as a Blob (PDF)
 * @param transaction - Transaction data
 */
export function getInvoiceBlob(transaction: Transaction): Promise<Blob>;

/**
 * Download all invoices as individual PDF files (no ZIP).
 * Each file is saved as invoice-{invoice_code}.pdf directly to the browser.
 *
 * @param transactions - Array of transaction data
 * @param onProgress   - Optional progress callback (current, total)
 */
export function downloadAllInvoicesAsPDF(
  transactions: Transaction[],
  onProgress?: (current: number, total: number) => void
): Promise<void>;
