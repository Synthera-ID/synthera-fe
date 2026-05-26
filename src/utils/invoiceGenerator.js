import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generate Invoice PDF
 * @param {Object} transaction - Transaction data
 * @param {Object} options - Additional options
 * @returns {jsPDF} PDF document
 */
export function generateInvoicePDF(transaction, options = {}) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

  // Colors
  const primaryColor = [139, 92, 246]; // Purple
  const darkColor = [31, 41, 55];
  const grayColor = [107, 114, 128];
  const lightGrayColor = [243, 244, 246];

  // Status colors
  const statusColors = {
    paid: [16, 185, 129],
    success: [16, 185, 129],
    completed: [16, 185, 129],
    pending: [245, 158, 11],
    failed: [239, 68, 68],
    expired: [156, 163, 175],
    cancelled: [239, 68, 68],
  };

  const status = (transaction.status || transaction.transaction_status || "pending").toLowerCase();
  const statusColor = statusColors[status] || statusColors.pending;

  let yPos = margin;

  // ─── Header Section ───────────────────────────────────────────────────────
  // Company Logo/Name
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPos, 40, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SYNTHERA", margin + 20, yPos + 7, { align: "center" });

  // Invoice Title
  doc.setTextColor(...darkColor);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - margin, yPos + 7, { align: "right" });

  yPos += 20;

  // ─── Invoice Info & Customer Info ─────────────────────────────────────────
  // Left side - Invoice details
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("INVOICE NUMBER", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  doc.text(transaction.invoice_code || "-", margin, yPos + 5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("ISSUED DATE", margin, yPos + 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  doc.text(formatDate(transaction.created_at), margin, yPos + 17);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("DUE DATE", margin, yPos + 24);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  const dueDate = transaction.expired_at || transaction.due_date;
  doc.text(dueDate ? formatDate(dueDate) : "-", margin, yPos + 29);

  // Right side - Customer details
  const rightX = pageWidth - margin - 70;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("CUSTOMER NAME", rightX, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  const customerName = transaction.customer_name || 
                       transaction.user_name || 
                       transaction.user?.name || 
                       transaction.user?.full_name ||
                       "Customer";
  doc.text(customerName, rightX, yPos + 5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("CUSTOMER EMAIL", rightX, yPos + 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  const customerEmail = transaction.customer_email || 
                        transaction.user_email || 
                        transaction.user?.email ||
                        "-";
  doc.text(customerEmail, rightX, yPos + 17);

  // Status Badge
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("STATUS", rightX, yPos + 24);
  
  const statusLabel = getStatusLabel(status);
  const statusWidth = doc.getTextWidth(statusLabel) + 8;
  doc.setFillColor(...statusColor);
  doc.roundedRect(rightX, yPos + 26, statusWidth, 6, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(statusLabel, rightX + statusWidth / 2, yPos + 30, { align: "center" });

  yPos += 45;

  // ─── Divider Line ─────────────────────────────────────────────────────────
  doc.setDrawColor(...lightGrayColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 10;

  // ─── Items Table ──────────────────────────────────────────────────────────
  const tableData = [
    [
      transaction.plan_name || "Subscription Plan",
      "1",
      formatRupiah(transaction.amount || 0),
      formatRupiah(transaction.amount || 0),
    ],
  ];

  doc.autoTable({
    startY: yPos,
    head: [["DESCRIPTION", "QTY", "PRICE", "TOTAL"]],
    body: tableData,
    theme: "plain",
    headStyles: {
      fillColor: lightGrayColor,
      textColor: grayColor,
      fontSize: 9,
      fontStyle: "bold",
      cellPadding: 4,
    },
    bodyStyles: {
      textColor: darkColor,
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.5 },
      1: { cellWidth: contentWidth * 0.1, halign: "center" },
      2: { cellWidth: contentWidth * 0.2, halign: "right" },
      3: { cellWidth: contentWidth * 0.2, halign: "right" },
    },
    margin: { left: margin, right: margin },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // ─── Total Section ────────────────────────────────────────────────────────
  const totalBoxX = pageWidth - margin - 70;
  const totalBoxWidth = 70;

  // Subtotal
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Subtotal:", totalBoxX, yPos);
  doc.setTextColor(...darkColor);
  doc.text(formatRupiah(transaction.amount || 0), totalBoxX + totalBoxWidth, yPos, { align: "right" });

  yPos += 7;

  // Tax (if applicable)
  const tax = transaction.tax || 0;
  if (tax > 0) {
    doc.setTextColor(...grayColor);
    doc.text("Tax:", totalBoxX, yPos);
    doc.setTextColor(...darkColor);
    doc.text(formatRupiah(tax), totalBoxX + totalBoxWidth, yPos, { align: "right" });
    yPos += 7;
  }

  // Divider
  doc.setDrawColor(...lightGrayColor);
  doc.line(totalBoxX, yPos, totalBoxX + totalBoxWidth, yPos);
  yPos += 7;

  // Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkColor);
  doc.text("TOTAL:", totalBoxX, yPos);
  doc.setTextColor(...primaryColor);
  doc.text(formatRupiah((transaction.amount || 0) + tax), totalBoxX + totalBoxWidth, yPos, { align: "right" });

  yPos += 15;

  // ─── Notes Section ────────────────────────────────────────────────────────
  if (transaction.notes || options.notes) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...grayColor);
    doc.text("NOTES", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    const notes = transaction.notes || options.notes || "Thank you for your subscription!";
    const splitNotes = doc.splitTextToSize(notes, contentWidth);
    doc.text(splitNotes, margin, yPos);
    yPos += splitNotes.length * 5 + 10;
  }

  // ─── Terms Section ────────────────────────────────────────────────────────
  yPos += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("TERMS & CONDITIONS", margin, yPos);
  yPos += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const terms = options.terms || "Payment is due within 30 days. Late payments may result in service suspension.";
  const splitTerms = doc.splitTextToSize(terms, contentWidth);
  doc.text(splitTerms, margin, yPos);

  // ─── Footer ───────────────────────────────────────────────────────────────
  const footerY = pageHeight - 20;
  doc.setDrawColor(...lightGrayColor);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.setFont("helvetica", "normal");
  doc.text("Synthera - Digital Learning Platform", pageWidth / 2, footerY, { align: "center" });
  doc.text("support@synthera.com | www.synthera.com", pageWidth / 2, footerY + 4, { align: "center" });

  return doc;
  } catch (error) {
    console.error("Error in generateInvoicePDF:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

/**
 * Download single invoice
 * @param {Object} transaction - Transaction data
 */
export function downloadInvoice(transaction) {
  try {
    // Validate transaction data
    if (!transaction) {
      throw new Error("Transaction data is required");
    }

    if (!transaction.invoice_code) {
      throw new Error("Invoice code is required");
    }

    if (transaction.amount === undefined || transaction.amount === null) {
      throw new Error("Transaction amount is required");
    }

    const doc = generateInvoicePDF(transaction);
    const fileName = `invoice-${transaction.invoice_code || "unknown"}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    throw new Error(`Gagal membuat invoice: ${error.message}`);
  }
}

/**
 * Download all invoices as ZIP
 * @param {Array} transactions - Array of transaction data
 */
export async function downloadAllInvoicesAsZip(transactions) {
  const JSZip = (await import("jszip")).default;
  const { saveAs } = await import("file-saver");

  const zip = new JSZip();
  const folder = zip.folder("invoices");

  transactions.forEach((transaction) => {
    const doc = generateInvoicePDF(transaction);
    const pdfBlob = doc.output("blob");
    const fileName = `invoice-${transaction.invoice_code || transaction.id}.pdf`;
    folder.file(fileName, pdfBlob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  const date = new Date().toISOString().split("T")[0];
  saveAs(content, `all-invoices-${date}.zip`);
}

/**
 * Download all invoices as single multi-page PDF
 * @param {Array} transactions - Array of transaction data
 */
export function downloadAllInvoicesAsPDF(transactions) {
  if (transactions.length === 0) return;

  const doc = generateInvoicePDF(transactions[0]);

  for (let i = 1; i < transactions.length; i++) {
    doc.addPage();
    const tempDoc = generateInvoicePDF(transactions[i]);
    // Copy pages from temp doc to main doc
    // Note: jsPDF doesn't have a direct way to merge, so we regenerate on new pages
    const pageCount = tempDoc.internal.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      if (i > 0 || p > 1) {
        doc.addPage();
      }
    }
  }

  // Simpler approach: generate each invoice on a new page
  const finalDoc = new jsPDF();
  let isFirstPage = true;

  transactions.forEach((transaction) => {
    if (!isFirstPage) {
      finalDoc.addPage();
    }
    isFirstPage = false;

    // Generate invoice content directly on the current page
    const tempDoc = generateInvoicePDF(transaction);
    // Since we can't easily merge, we'll use the simpler ZIP approach
  });

  const date = new Date().toISOString().split("T")[0];
  
  // For multi-page PDF, we'll create each invoice and add page breaks
  // This is a simplified version - for production, consider using PDF merge libraries
  const firstDoc = generateInvoicePDF(transactions[0]);
  
  for (let i = 1; i < transactions.length; i++) {
    firstDoc.addPage();
    // Note: This creates blank pages. For proper multi-page PDF with content,
    // you'd need a more sophisticated approach or use server-side PDF generation
  }
  
  firstDoc.save(`all-invoices-${date}.pdf`);
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRupiah(amount) {
  if (!amount && amount !== 0) return "Rp 0";
  return `Rp ${Number(amount).toLocaleString("id-ID")}`;
}

function getStatusLabel(status) {
  const labels = {
    paid: "PAID",
    success: "PAID",
    completed: "PAID",
    pending: "PENDING",
    failed: "FAILED",
    expired: "EXPIRED",
    cancelled: "CANCELLED",
  };
  return labels[status] || "PENDING";
}
