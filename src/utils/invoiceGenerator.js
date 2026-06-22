/**
 * Invoice Generator Utility
 * Client-side only – uses jsPDF + jspdf-autotable
 * 
 * UPDATED: Now uses reusable PDF components for consistency
 */

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  PDF_COLORS,
  loadLogoBase64,
  drawLinearGradient,
  drawGlowEffect,
  drawPremiumHeader,
  drawPremiumFooter,
  openPDFPreview,
} from "./pdfComponents";

// Legacy color mappings untuk backward compatibility dengan invoice lama
const C = {
  ...PDF_COLORS,
  // Tambahan untuk backward compatibility
  purple: [111, 66, 193],
  purpleLight: [237, 233, 254],
  purpleMid: [139, 92, 246],
  orange: [255, 145, 0],
  divider: [196, 181, 253],
};

// Status colour map (Premium style)
const STATUS_COLORS = {
  paid: [16, 185, 129],
  success: [16, 185, 129],
  completed: [16, 185, 129],
  pending: [255, 145, 0],  // #ff9100 – orange untuk PENDING (sesuai instruksi)
  failed: [239, 68, 68],
  expired: [156, 163, 175],
  cancelled: [239, 68, 68],
};

const STATUS_LABELS = {
  paid: "PAID",
  success: "PAID",
  completed: "PAID",
  pending: "PENDING",
  failed: "FAILED",
  expired: "EXPIRED",
  cancelled: "CANCELLED",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatRupiah(amount) {
  if (amount == null || amount === "") return "Rp 0";
  const num = Number(amount);
  return "Rp " + num.toLocaleString("id-ID");
}

function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatus(transaction) {
  return (
    (transaction.status || transaction.transaction_status || "pending")
      .toLowerCase()
  );
}

// ─── Core Generator ───────────────────────────────────────────────────────────
/**
 * @param {Object}  transaction
 * @param {Object}  [options]
 * @param {string}  [options.logoBase64]  – pre-fetched base64 of logo
 * @param {string}  [options.notes]
 * @param {string}  [options.terms]
 */
export function generateInvoicePDF(transaction, options = {}) {
  if (!transaction) throw new Error("Transaction data is required");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  if (typeof doc.autoTable !== "function") {
    throw new Error("jspdf-autotable plugin not loaded");
  }

  const PW = doc.internal.pageSize.getWidth();   // 210
  const PH = doc.internal.pageSize.getHeight();  // 297
  const ML = 20;   // margin left
  const MR = 20;   // margin right
  const CW = PW - ML - MR; // content width  170
  const RIGHT = PW - MR;      // right edge x   190

  const status = getStatus(transaction);
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const statusLabel = STATUS_LABELS[status] || "PENDING";

  // ── Bill-To data ────────────────────────────────────────────────────────────
  const customerName =
    transaction.customer_name ||
    transaction.user_name ||
    transaction.user?.name ||
    transaction.user?.full_name ||
    "Customer";

  const customerEmail =
    transaction.customer_email ||
    transaction.user_email ||
    transaction.user?.email ||
    "-";

  // ── Notes / Terms ───────────────────────────────────────────────────────────
  // PERBAIKAN: Conditional rendering untuk catatan berdasarkan status
  const notes = options.notes || (
    (status === 'paid' || status === 'success' || status === 'completed')
      ? "Terima kasih telah berlangganan layanan Synthera. Pembayaran Anda telah kami terima dan dicatat dengan baik. Layanan Anda aktif selama 1 bulan penuh dan tidak memiliki sistem perpanjangan otomatis (Anda bebas menentukan untuk update atau berhenti setelah masa aktif habis)."
      : "Terima kasih telah memilih layanan Synthera. Silakan lakukan pembayaran sebelum tanggal jatuh tempo di atas untuk mengaktifkan layanan 1 bulan Anda. Layanan ini tidak diperpanjang secara otomatis."
  );

  const terms =
    options.terms ||
    "Pembayaran bersifat final. Jika ada pertanyaan mengenai invoice ini, silakan hubungi support@synthera.id dalam 30 hari kerja.";

  // ════════════════════════════════════════════════════════════════════════════
  // 1. PREMIUM HEADER (using drawPremiumHeader for consistency)
  // ════════════════════════════════════════════════════════════════════════════
  const exportDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  const currentY = drawPremiumHeader(doc, {
    title: "INVOICE",
    documentNumber: transaction.invoice_code || "-",
    logoBase64: options.logoBase64,
    pageWidth: PW,
    marginLeft: ML,
    marginRight: MR,
    withGlow: false,
    infoBoxes: {
      box1: { label: "TANGGAL DITERBITKAN", value: exportDate },
      box2: { label: "JATUH TEMPO", value: formatDate(transaction.due_date) || "-" },
      box3: { label: "STATUS", value: statusLabel },
      box4: { label: "MATA UANG", value: "IDR (Rp)" },
    },
  });

  let y = currentY;

  // ════════════════════════════════════════════════════════════════════════════
  // 2. BILL TO SECTION (Left) & AMOUNT DUE BOX (Right)
  // ════════════════════════════════════════════════════════════════════════════
  const billY = y;
  
  // Bill To - Left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.grayLight);
  doc.text("BILL TO", ML, billY);

  let billTextY = billY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...C.grayDark);
  doc.text(customerName, ML, billTextY);

  billTextY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.grayMid);
  doc.text(customerEmail, ML, billTextY);

  // Amount Due Box - Right
  const boxW      = 75;
  const boxH      = 38;
  const boxX      = RIGHT - boxW;
  const boxY      = billY - 3;
  const boxRadius = 4;
  const boxCenterX = boxX + boxW / 2;

  doc.setFillColor(...C.purpleLight);
  doc.roundedRect(boxX, boxY, boxW, boxH, boxRadius, boxRadius, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.purpleMid);
  doc.text("AMOUNT DUE", boxCenterX, boxY + 9, { align: "center" });

  const amountStr = formatRupiah(transaction.amount || 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...C.purple);
  doc.text(amountStr, boxCenterX, boxY + 20, { align: "center" });

  // Currency label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.grayLight);
  doc.text("IDR", boxCenterX, boxY + 27, { align: "center" });

  // PERBAIKAN: Tambahkan status badge di bawah IDR
  const badgeLabelW = doc.getTextWidth(statusLabel) + 10;
  const badgeX      = boxCenterX - badgeLabelW / 2;
  const badgeY      = boxY + 30;
  doc.setFillColor(...statusColor);
  doc.roundedRect(badgeX, badgeY, badgeLabelW, 6, 2, 2, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text(statusLabel, boxCenterX, badgeY + 4.5, { align: "center" });

  y = Math.max(billTextY, boxY + boxH) + 12;

  // ════════════════════════════════════════════════════════════════════════════
  // 3. DIVIDER LINE
  // ════════════════════════════════════════════════════════════════════════════
  doc.setDrawColor(...C.divider);
  doc.setLineWidth(0.5);
  doc.line(ML, y, RIGHT, y);
  y += 8;

  // ════════════════════════════════════════════════════════════════════════════
  // 4. ITEMS TABLE  (Description | Qty | Amount)
  // ════════════════════════════════════════════════════════════════════════════
  const tableHead = [["DESCRIPTION", "QTY", "AMOUNT"]];
  
  // PERBAIKAN: Format deskripsi dengan nama paket + sub-teks masa aktif
  const planName = transaction.plan_name || transaction.membership_name || "Basic Plan";
  const descriptionText = `Subscription Plan - ${planName}`;
  const subText = `Masa Aktif: 1 Bulan (Non-Autobilling)`;
  
  const tableBody = [
    [
      { content: descriptionText, styles: { fontStyle: 'bold', textColor: C.grayDark } },
      "1",
      formatRupiah(transaction.amount || 0),
    ],
  ];

  doc.autoTable({
    startY: y,
    head: tableHead,
    body: tableBody,
    theme: "plain",

    headStyles: {
      fillColor: C.grayBg,
      textColor: C.grayLight,
      fontSize: 8,
      fontStyle: "bold",
      cellPadding: { top: 7, bottom: 7, left: 5, right: 5 },
      lineWidth: { bottom: 0.5 },
      lineColor: C.divider,
    },

    bodyStyles: {
      textColor: C.grayMid,
      fontSize: 10,
      cellPadding: { top: 9, bottom: 9, left: 5, right: 5 },
      lineWidth: { bottom: 0.3 },
      lineColor: [229, 231, 235],
      minCellHeight: 20,
    },

    columnStyles: {
      0: { cellWidth: CW * 0.60, halign: "left" },   // Description
      1: { cellWidth: CW * 0.15, halign: "center" },   // Qty
      2: { cellWidth: CW * 0.25, halign: "right" },   // Amount
    },

    margin: { left: ML, right: MR },
    tableLineColor: C.divider,
    tableLineWidth: 0,
    didParseCell(data) {
      // Purple amount
      if (data.section === "body" && data.column.index === 2) {
        data.cell.styles.textColor = C.purple;
        data.cell.styles.fontStyle = "bold";
      }
    },
    
    // PERBAIKAN: Custom drawing untuk sub-teks muted di bawah
    didDrawCell(data) {
      if (data.section === "body" && data.column.index === 0) {
        // Sub-teks di bawah judul (dengan jarak lebih jauh)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...C.grayLight);
        doc.text(subText, data.cell.x + 5, data.cell.y + 15);
      }
    },
  });

  y = doc.lastAutoTable.finalY + 6;

  // ════════════════════════════════════════════════════════════════════════════
  // 5. TOTAL SECTION (right-aligned)
  // ════════════════════════════════════════════════════════════════════════════
  // Top thin purple line
  doc.setDrawColor(...C.divider);
  doc.setLineWidth(0.5);
  doc.line(PW / 2, y, RIGHT, y);
  y += 10;

  const totalLabelX = PW / 2 + 6;
  const totalValX = RIGHT;

  // Subtotal row
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...C.grayLight);
  doc.text("Subtotal", totalLabelX, y);
  doc.setTextColor(...C.grayMid);
  doc.text(formatRupiah(transaction.amount || 0), totalValX, y, { align: "right" });
  y += 10;

  // Tax row (only if present)
  if (transaction.tax && Number(transaction.tax) > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...C.grayLight);
    doc.text("Pajak", totalLabelX, y);
    doc.setTextColor(...C.grayMid);
    doc.text(formatRupiah(transaction.tax), totalValX, y, { align: "right" });
    y += 10;
  }

  // Divider before TOTAL
  doc.setDrawColor(...C.divider);
  doc.setLineWidth(0.4);
  doc.line(PW / 2, y - 3, RIGHT, y - 3);
  y += 6;

  // TOTAL
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...C.grayDark);
  doc.text("TOTAL", totalLabelX, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...C.purple);
  doc.text(formatRupiah(transaction.amount || 0), totalValX, y, { align: "right" });
  y += 16;

  // ════════════════════════════════════════════════════════════════════════════
  // 6. NOTES (left) & TERMS (right) – side by side
  // ════════════════════════════════════════════════════════════════════════════
  const colMid = ML + CW / 2 + 6;
  const colW = CW / 2 - 8;

  // Notes – left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.grayDark);
  doc.text("CATATAN", ML, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grayLight);
  const splitNotes = doc.splitTextToSize(notes, colW);
  doc.text(splitNotes, ML, y + 5);

  // Terms – right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.grayDark);
  doc.text("SYARAT & KETENTUAN", colMid, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grayLight);
  const splitTerms = doc.splitTextToSize(terms, colW);
  doc.text(splitTerms, colMid, y + 5);

  const notesHeight = Math.max(splitNotes.length, splitTerms.length) * 3.2;
  y += notesHeight + 12;

  // ════════════════════════════════════════════════════════════════════════════
  // 7. PREMIUM FOOTER (using drawPremiumFooter for consistency)
  // ════════════════════════════════════════════════════════════════════════════
  drawPremiumFooter(doc, {
    logoBase64: options.logoBase64,
    pageWidth: PW,
    pageHeight: PH,
    marginLeft: ML,
    marginRight: MR,
    currentY: y,
  });

  return doc;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Download single invoice PDF
 * Shows preview (same simple approach as Manual Book - fastest method)
 */
export async function downloadInvoice(transaction) {
  if (!transaction) throw new Error("Transaction data is required");
  if (!transaction.invoice_code) throw new Error("Invoice code is required");
  if (transaction.amount == null) throw new Error("Transaction amount is required");

  const filename = `invoice-${transaction.invoice_code}.pdf`;
  
  // Generate PDF first (fastest approach, no about:blank delay)
  const logoBase64 = await loadLogoBase64();
  const doc = generateInvoicePDF(transaction, { logoBase64 });
  
  // Use openPDFPreview helper (same as Manual Book)
  openPDFPreview(doc, filename, "Invoice Preview");
}

/**
 * Get invoice as a Blob (PDF) – useful for custom download logic.
 */
export async function getInvoiceBlob(transaction) {
  if (!transaction) throw new Error("Transaction data is required");
  const logoBase64 = await loadLogoBase64();
  const doc = generateInvoicePDF(transaction, { logoBase64 });
  return doc.output("blob");
}

/**
 * Download all invoices as individual PDF files (no ZIP).
 * Each file is downloaded directly as PDF with a small delay between
 * downloads to avoid browser popup blocking.
 *
 * @param {Object[]} transactions
 * @param {(current: number, total: number) => void} [onProgress]
 */
export async function downloadAllInvoicesAsPDF(transactions, onProgress) {
  if (!transactions || transactions.length === 0) {
    throw new Error("Tidak ada invoice untuk didownload.");
  }

  const logoBase64 = await loadLogoBase64();

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];

    if (!tx) continue;

    const doc = generateInvoicePDF(tx, { logoBase64 });
    const filename = `invoice-${tx.invoice_code || tx.id || i + 1}.pdf`;

    // Use blob + <a> download approach for consistent behaviour in Chrome
    const blob = doc.output("blob");
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke after a short delay so the browser can start the download
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    if (onProgress) onProgress(i + 1, transactions.length);

    // Small gap between files to avoid browser popup blocking
    if (i < transactions.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
}

/**
 * Download all transactions as a single PDF file with table format.
 * Generates one PDF containing all transaction data in a table.
 * Shows preview before downloading.
 *
 * @param {Object[]} transactions - Array of transaction objects
 */
export async function downloadAllTransactionsAsSinglePDF(transactions) {
  if (!transactions || transactions.length === 0) {
    throw new Error("Tidak ada transaksi untuk didownload.");
  }

  // Debug: Log data transaksi untuk melihat field yang tersedia
  console.log("📊 Transactions data for PDF:", transactions);
  console.log("📦 First transaction plan_name:", transactions[0]?.plan_name);
  console.log("📦 First transaction membership_name:", transactions[0]?.membership_name);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  if (typeof doc.autoTable !== "function") {
    throw new Error("jspdf-autotable plugin not loaded");
  }

  const PW = doc.internal.pageSize.getWidth();   // 297 (landscape)
  const PH = doc.internal.pageSize.getHeight();  // 210 (landscape)
  const ML = 15;   // margin left
  const MR = 15;   // margin right
  const CW = PW - ML - MR; // content width
  const RIGHT = PW - MR;

  // Load logo
  const logoBase64 = await loadLogoBase64();

  // ════════════════════════════════════════════════════════════════════════════
  // 1. PREMIUM HEADER (Navy → Royal Blue Gradient)
  // ════════════════════════════════════════════════════════════════════════════
  const headerHeight = 50;
  
  // Draw premium linear gradient from navyDarkest (left) to royalBlue (right)
  drawLinearGradient(doc, 0, 0, PW, headerHeight, C.navyDarkest, C.royalBlue);
  
  // Glow effect disabled to prevent blocking text
  // drawGlowEffect(doc, PW, headerHeight, 60, C.glowBlue);

  let y = 12;

  // Logo + Brand Name (Top Left)
  if (logoBase64) {
    const logoSize = 14;
    doc.addImage(logoBase64, "PNG", ML, y, logoSize, logoSize);
  }

  // Brand Name & Subtitle (Left, next to logo)
  const brandX = ML + 18;
  let brandY = y + 5;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...C.white);
  doc.text("SYNTHERA ID", brandX, brandY);
  
  brandY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(200, 210, 220); // Light gray
  doc.text("E Course Membership System", brandX, brandY);

  // Title "INVOICE" atau "RIWAYAT PEMBELIAN" (Center Right area)
  const titleX = PW / 2 + 30;
  const titleY = y + 10;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...C.white);
  doc.text("RIWAYAT PEMBELIAN", titleX, titleY);

  // Invoice Number & Status badge (Top Right - jika ada)
  const invoiceNumberY = y + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.accentCyan);
  doc.text(`#${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(transactions.length).padStart(4, '0')}`, RIGHT, invoiceNumberY, { align: "right" });

  // Export Info (Right)
  const exportDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  let infoY = invoiceNumberY + 6;
  
  // Status badge "LUNAS / PAID" (jika semua paid) - opsional
  const allPaid = transactions.every(tx => {
    const status = getStatus(tx);
    return status === 'paid' || status === 'success' || status === 'completed';
  });
  
  if (allPaid && transactions.length > 0) {
    // Draw status badge
    const badgeText = "[LUNAS / PAID]";
    const badgeWidth = doc.getTextWidth(badgeText) + 8;
    const badgeX = RIGHT - badgeWidth;
    const badgeY = infoY - 4;
    
    doc.setFillColor(16, 185, 129); // Green
    doc.roundedRect(badgeX, badgeY, badgeWidth, 6, 2, 2, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...C.white);
    doc.text(badgeText, badgeX + 4, badgeY + 4.5);
    
    infoY += 8;
  }

  // Info box bawah header (TANGGAL DITERBITKAN, JATUH TEMPO, TANGGAL PEMBAYARAN, MATA UANG)
  y = headerHeight - 16;
  const infoBoxStartX = ML;
  const infoBoxSpacing = (PW - ML - MR) / 4;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(150, 160, 180);
  
  // TANGGAL DITERBITKAN
  doc.text("TANGGAL DITERBITKAN", infoBoxStartX, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text(exportDate, infoBoxStartX, y + 4);
  
  // JATUH TEMPO
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(150, 160, 180);
  doc.text("JATUH TEMPO", infoBoxStartX + infoBoxSpacing, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text("-", infoBoxStartX + infoBoxSpacing, y + 4);
  
  // TANGGAL PEMBAYARAN
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(150, 160, 180);
  doc.text("TANGGAL PEMBAYARAN", infoBoxStartX + infoBoxSpacing * 2, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text(exportDate, infoBoxStartX + infoBoxSpacing * 2, y + 4);
  
  // MATA UANG
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(150, 160, 180);
  doc.text("MATA UANG", infoBoxStartX + infoBoxSpacing * 3, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text("IDR (Rp)", infoBoxStartX + infoBoxSpacing * 3, y + 4);

  y = headerHeight + 12;

  // ════════════════════════════════════════════════════════════════════════════
  // 2. DIVIDER LINE (Thin Navy)
  // ════════════════════════════════════════════════════════════════════════════
  doc.setDrawColor(200, 210, 220);
  doc.setLineWidth(0.3);
  doc.line(ML, y, RIGHT, y);
  y += 8;

  // ════════════════════════════════════════════════════════════════════════════
  // 3. PREMIUM TRANSACTIONS TABLE (Navy Header + Zebra Striping)
  // ════════════════════════════════════════════════════════════════════════════
  
  const tableHead = [["NO", "INVOICE", "PAKET", "HARGA", "STATUS", "TANGGAL", "PEMBUAT"]];
  
  const tableBody = transactions.map((tx, index) => {
    const status = getStatus(tx);
    const statusLabel = STATUS_LABELS[status] || "PENDING";
    // Ganti "System" menjadi "Synthera.id"
    const createdBy = tx.created_by_name || tx.created_by || "System";
    const displayCreatedBy = createdBy === "System" ? "Synthera.id" : createdBy;
    
    // Ambil nama paket yang sebenarnya dari data dengan berbagai fallback
    const planName = 
      tx.plan_name || 
      tx.membership_name || 
      tx.membership?.name || 
      tx.plan?.name ||
      tx.subscription_plan ||
      tx.package_name ||
      "Basic Plan";
    
    return [
      (index + 1).toString(),
      tx.invoice_code || "-",
      planName,
      formatRupiah(tx.amount || 0),
      statusLabel,
      formatDate(tx.created_at),
      displayCreatedBy,
    ];
  });

  doc.autoTable({
    startY: y,
    head: tableHead,
    body: tableBody,
    theme: "plain",

    headStyles: {
      fillColor: C.navyDarkest,   // Navy sangat gelap untuk header table (consistency)
      textColor: C.white,          // Teks putih
      fontSize: 9,
      fontStyle: "bold",
      cellPadding: { top: 7, bottom: 7, left: 5, right: 5 },
      halign: "center",
      valign: "middle",
      minCellHeight: 12,
      lineWidth: 0,                // No border untuk header
      overflow: 'linebreak',
    },

    bodyStyles: {
      textColor: C.grayDark,
      fontSize: 8,
      cellPadding: { top: 6, bottom: 6, left: 5, right: 5 },
      lineWidth: { bottom: 0.2 },  // Border tipis antar baris
      lineColor: [230, 235, 240],  // Border abu-abu sangat halus
      valign: "middle",
      overflow: 'linebreak',
      minCellHeight: 11,
    },

    alternateRowStyles: {
      fillColor: C.grayBg,         // Zebra striping dengan light gray (seperti referensi)
    },

    columnStyles: {
      0: { cellWidth: 20, halign: "center", minCellWidth: 20, overflow: 'visible' },   // NO
      1: { cellWidth: 50, halign: "left", overflow: 'linebreak' },     // INVOICE - diperlebar agar tidak terpecah
      2: { cellWidth: 50, halign: "left", overflow: 'linebreak' },     // PAKET - diperlebar untuk nama paket lengkap
      3: { cellWidth: 38, halign: "center", overflow: 'linebreak' },   // HARGA - diperlebar dan center agar sejajar
      4: { cellWidth: 28, halign: "center", overflow: 'linebreak' },   // STATUS
      5: { cellWidth: 35, halign: "center", overflow: 'linebreak' },   // TANGGAL
      6: { cellWidth: 'auto', halign: "left", overflow: 'linebreak' }, // PEMBUAT - auto mengisi sisa ruang
    },

    margin: { left: ML, right: MR },
    
    // Nonaktifkan garis vertikal
    tableLineWidth: 0,
    tableLineColor: [224, 224, 224],
    
    didParseCell(data) {
      // Pastikan header "NO" tidak terpecah - force horizontal
      if (data.section === "head" && data.column.index === 0) {
        data.cell.styles.cellPadding = { top: 6, bottom: 6, left: 8, right: 8 };
        data.cell.styles.minCellWidth = 20;
        data.cell.styles.overflow = 'visible';
      }
      
      // Pastikan header INVOICE rata kiri (sejajar dengan body)
      if (data.section === "head" && data.column.index === 1) {
        data.cell.styles.halign = "left";
        data.cell.styles.cellPadding = { top: 6, bottom: 6, left: 4, right: 4 };
      }
      
      // Pastikan header PAKET rata kiri (sejajar dengan body)
      if (data.section === "head" && data.column.index === 2) {
        data.cell.styles.halign = "left";
        data.cell.styles.cellPadding = { top: 6, bottom: 6, left: 4, right: 4 };
      }
      
      // Pastikan header HARGA center (bukan JUMLAH)
      if (data.section === "head" && data.column.index === 3) {
        data.cell.styles.halign = "center";
      }
      
      // Pastikan header PEMBUAT rata kiri
      if (data.section === "head" && data.column.index === 6) {
        data.cell.styles.halign = "left";
        data.cell.styles.cellPadding = { top: 6, bottom: 6, left: 4, right: 4 };
      }
      
      // Kolom INVOICE - pastikan tidak terpecah
      if (data.section === "body" && data.column.index === 1) {
        data.cell.styles.overflow = 'linebreak';
        data.cell.styles.halign = "left";
      }
      
      // Kolom PAKET - pastikan sejajar dan tidak terpecah
      if (data.section === "body" && data.column.index === 2) {
        data.cell.styles.overflow = 'linebreak';
        data.cell.styles.halign = "left";
        data.cell.styles.valign = "middle";
        data.cell.styles.cellPadding = { top: 5, bottom: 5, left: 4, right: 4 };
      }
      
      // Style untuk kolom HARGA (navy accent & bold & center - seperti referensi)
      if (data.section === "body" && data.column.index === 3) {
        data.cell.styles.textColor = C.navyMid;  // Navy untuk harga (premium look)
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.halign = "center";
        data.cell.styles.valign = "middle";
        data.cell.styles.overflow = 'linebreak';
      }
      
      // Style untuk kolom STATUS dengan warna sesuai status
      if (data.section === "body" && data.column.index === 4) {
        const statusText = data.cell.text[0];
        let statusColor = C.grayMid;
        
        if (statusText === "PAID" || statusText === "COMPLETED") {
          statusColor = STATUS_COLORS.paid;
        } else if (statusText === "PENDING") {
          statusColor = STATUS_COLORS.pending;
        } else if (statusText === "FAILED" || statusText === "CANCELLED") {
          statusColor = STATUS_COLORS.failed;
        } else if (statusText === "EXPIRED") {
          statusColor = STATUS_COLORS.expired;
        }
        
        data.cell.styles.textColor = statusColor;
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.halign = "center";
        data.cell.styles.valign = "middle";
      }
      
      // Kolom TANGGAL - pastikan center dan sejajar
      if (data.section === "body" && data.column.index === 5) {
        data.cell.styles.halign = "center";
        data.cell.styles.valign = "middle";
      }
      
      // Pastikan kolom PEMBUAT body sejajar dengan header (rata kiri)
      if (data.section === "body" && data.column.index === 6) {
        data.cell.styles.halign = "left";
        data.cell.styles.valign = "middle";
        data.cell.styles.cellPadding = { top: 5, bottom: 5, left: 4, right: 4 };
        data.cell.styles.overflow = 'linebreak';
      }
    },
  });

  y = doc.lastAutoTable.finalY + 12;

  // ════════════════════════════════════════════════════════════════════════════
  // 4. PREMIUM FOOTER (Navy Solid Background - 3 Kolom seperti referensi invoice)
  // ════════════════════════════════════════════════════════════════════════════
  
  // Ensure footer is at consistent position (or at bottom if space allows)
  const footerHeight = 35;
  const footerY = Math.max(y, PH - footerHeight - 5);
  
  // Navy solid background untuk footer (tidak gradasi, tetap solid)
  doc.setFillColor(...C.navyDarkest);
  doc.rect(0, footerY, PW, footerHeight, 'F');
  
  let fY = footerY + 8;
  
  // Calculate footer columns (3 sections)
  const footerCol1 = ML;                    // Kiri: Logo + Brand
  const footerCol2 = PW / 2;                // Tengah: Dokumen Resmi
  const footerCol3 = RIGHT - 55;            // Kanan: Kontak
  
  // ── KOLOM KIRI: Logo + Brand ──────────────────────────────────────────────
  if (logoBase64) {
    const logoSize = 10;
    doc.addImage(logoBase64, "PNG", footerCol1, fY, logoSize, logoSize);
  }
  
  const brandFooterX = footerCol1 + 12;
  let brandFooterY = fY + 4;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text("SYNTHERA ID", brandFooterX, brandFooterY);
  
  brandFooterY += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 190, 200);
  doc.text("E Course Membership System", brandFooterX, brandFooterY);
  
  // ── KOLOM TENGAH: Icon Dokumen Resmi ──────────────────
  const centerY = fY + 6;
  
  // Draw star icon simulation (using text) - changed to avoid unicode issues
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.accentCyan);
  doc.text("[*]", footerCol2 - 10, centerY, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 190, 200);
  doc.text("DOKUMEN RESMI", footerCol2 + 5, centerY, { align: "center" });
  
  // ── KOLOM KANAN: Kontak ───────────────────────────────────────────────────
  let contactY = fY + 3;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 190, 200);
  doc.text("support@synthera.id", footerCol3, contactY);
  
  contactY += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.accentCyan);
  doc.text("https://synthera.id", footerCol3, contactY);
  
  // ── Footer Disclaimer (bawah footer navy) ─────────────────────────────────
  fY = footerY + footerHeight + 3;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.grayLight);
  doc.text(
    "Dokumen ini dibuat secara otomatis oleh sistem Synthera ID. Apabila terdapat pertanyaan terkait dokumen ini,",
    PW / 2,
    fY,
    { align: "center" }
  );
  
  fY += 3;
  doc.text(
    "silakan hubungi support@synthera.id dalam 7 hari kerja sejak tanggal penerbitan.",
    PW / 2,
    fY,
    { align: "center" }
  );

  // ════════════════════════════════════════════════════════════════════════════
  // 5. PREVIEW & DOWNLOAD PDF
  // ════════════════════════════════════════════════════════════════════════════
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `riwayat-pembelian-${today}.pdf`;

  // Open PDF in new tab for preview (tidak langsung download)
  const pdfDataUri = doc.output('dataurlstring');
  const previewWindow = window.open('', '_blank');
  
  if (previewWindow) {
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview: ${filename}</title>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              background: #1a1a1a; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              overflow: hidden;
            }
            .toolbar {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              height: 60px;
              background: linear-gradient(135deg, #0F172A 0%, #2563EB 100%);
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 24px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              z-index: 1000;
            }
            .toolbar-left {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .toolbar-title {
              color: white;
              font-size: 16px;
              font-weight: 600;
            }
            .toolbar-subtitle {
              color: rgba(255,255,255,0.7);
              font-size: 13px;
            }
            .toolbar-actions {
              display: flex;
              gap: 12px;
            }
            .btn {
              padding: 10px 20px;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .btn-download {
              background: #00C2FF;
              color: white;
            }
            .btn-download:hover {
              background: #00A8E0;
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0,194,255,0.3);
            }
            .btn-close {
              background: rgba(255,255,255,0.1);
              color: white;
            }
            .btn-close:hover {
              background: rgba(255,255,255,0.2);
            }
            .pdf-container {
              position: fixed;
              top: 60px;
              left: 0;
              right: 0;
              bottom: 0;
              background: #2a2a2a;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <div class="toolbar-left">
              <div>
                <div class="toolbar-title">📄 Preview Riwayat Pembelian</div>
                <div class="toolbar-subtitle">${filename}</div>
              </div>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-download" onclick="downloadPDF()">
                <span>⬇</span>
                <span>Download PDF</span>
              </button>
              <button class="btn btn-close" onclick="window.close()">
                <span>✕</span>
                <span>Tutup</span>
              </button>
            </div>
          </div>
          <div class="pdf-container">
            <iframe src="${pdfDataUri}"></iframe>
          </div>
          <script>
            function downloadPDF() {
              const link = document.createElement('a');
              link.href = '${pdfDataUri}';
              link.download = '${filename}';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          </script>
        </body>
      </html>
    `);
    previewWindow.document.close();
  } else {
    // Fallback jika popup diblokir - langsung download
    alert('Popup diblokir! PDF akan didownload langsung.');
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
