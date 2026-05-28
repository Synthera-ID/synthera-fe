/**
 * Invoice Generator Utility
 * Client-side only – uses jsPDF + jspdf-autotable
 *
 * Layout (top → bottom):
 *  1. Top accent bar  (purple | orange)
 *  2. Header          Logo + Brand Name (left) | "INVOICE" (right)
 *  3. Meta section    Invoice info (left) | Amount box (right)
 *  4. Bill-To section Customer details (left)
 *  5. Divider line    (purple, thin)
 *  6. Items table     Description / Qty / Amount
 *  7. Total section   Subtotal + Total (right-aligned)
 *  8. Footer divider  (purple, thin)
 *  9. Notes & Terms   (left | right)
 */

import jsPDF from "jspdf";
import "jspdf-autotable";

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  purple: [111, 66, 193],   // #6f42c1 – primary purple (sesuai instruksi)
  purpleLight: [237, 233, 254],  // #ede9fe – soft purple bg
  purpleMid: [139, 92, 246],  // #8b5cf6 – medium purple (accents)
  orange: [255, 145, 0],  // #ff9100 – accent orange (sesuai instruksi)
  grayDark: [31, 41, 55],  // #1f2937 – near-black text
  grayMid: [75, 85, 99],  // #4b5563 – body text
  grayLight: [156, 163, 175],  // #9ca3af – muted labels
  grayBg: [249, 250, 251],  // #f9fafb – table header bg
  white: [255, 255, 255],
  divider: [196, 181, 253],  // #c4b5fd – purple divider
};

// Status colour map
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

/** Load icon.png → base64 dataURL so jsPDF can embed it */
async function loadLogoBase64() {
  try {
    // Try the Next.js public path first
    const url = "/icon.png";
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null; // Skip logo gracefully if unavailable
  }
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
  // 1. TOP ACCENT BAR (Purple | Orange split)
  // ════════════════════════════════════════════════════════════════════════════
  const accentH = 8;
  const orangeW = 70; // Width of orange section
  
  // Purple section (left)
  doc.setFillColor(...C.purple);
  doc.rect(0, 0, PW - orangeW, accentH, 'F');
  
  // Orange section (right)
  doc.setFillColor(...C.orange);
  doc.rect(PW - orangeW, 0, orangeW, accentH, 'F');

  let y = accentH + 15;

  // ── Brand Section (Left) ───────────────────────────────────────────────────
  let bx = ML;
  let by = y;

  if (options.logoBase64) {
    const logoSize = 16;
    doc.addImage(options.logoBase64, "PNG", bx, by, logoSize, logoSize);
    by += logoSize + 3;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...C.grayDark);
  doc.text("Synthera", bx, by);
  
  by += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.grayMid);
  doc.text("Indonesia", bx, by);
  
  by += 5;
  doc.setFontSize(8.5);
  doc.setTextColor(...C.grayLight);
  doc.text("support@synthera.id", bx, by);

  // ── Invoice Section (Right) ────────────────────────────────────────────────
  let ry = y;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...C.purpleMid);
  doc.text("INVOICE", RIGHT, ry, { align: "right" });
  
  ry += 10;
  
  // Invoice Number
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.grayDark);
  doc.text(transaction.invoice_code || "-", RIGHT, ry, { align: "right" });
  
  ry += 8;
  
  // Issued date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.grayLight);
  doc.text("Issued", RIGHT - 35, ry, { align: "right" });
  doc.setTextColor(...C.grayMid);
  // PERBAIKAN: Bind ke data statis dari transaction
  doc.text(formatDate(transaction.created_at || transaction.transaction_date), RIGHT, ry, { align: "right" });
  
  ry += 5;
  
  // Due date
  doc.setTextColor(...C.grayLight);
  doc.text("Due", RIGHT - 35, ry, { align: "right" });
  doc.setTextColor(...C.grayMid);
  // PERBAIKAN: Conditional rendering - jika PAID tampilkan "-", jika PENDING tampilkan tanggal
  const dueDate = (status === 'paid' || status === 'success' || status === 'completed') 
    ? "-" 
    : formatDate(transaction.expired_at || transaction.due_date);
  doc.text(dueDate, RIGHT, ry, { align: "right" });

  y = Math.max(by, ry) + 10;

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
  // 6. FOOTER DIVIDER
  // ════════════════════════════════════════════════════════════════════════════
  doc.setDrawColor(...C.divider);
  doc.setLineWidth(0.5);
  doc.line(ML, y, RIGHT, y);
  y += 8;

  // ════════════════════════════════════════════════════════════════════════════
  // 7. NOTES (left) & TERMS (right) – side by side
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

  // ── Bottom brand watermark ────────────────────────────────────────────────
  const notesHeight = Math.max(splitNotes.length, splitTerms.length) * 3.2;
  const watermarkY = Math.min(y + notesHeight + 16, PH - 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.divider);
  doc.text("Synthera · support@synthera.id", PW / 2, watermarkY, { align: "center" });

  return doc;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Download single invoice PDF
 * Loads the logo async then generates + saves.
 */
export async function downloadInvoice(transaction) {
  if (!transaction) throw new Error("Transaction data is required");
  if (!transaction.invoice_code) throw new Error("Invoice code is required");
  if (transaction.amount == null) throw new Error("Transaction amount is required");

  const logoBase64 = await loadLogoBase64();
  const doc = generateInvoicePDF(transaction, { logoBase64 });
  doc.save(`invoice-${transaction.invoice_code}.pdf`);
}

/**
 * Download all invoices as ZIP
 */
export async function downloadAllInvoicesAsZip(transactions) {
  const JSZip = (await import("jszip")).default;
  const { saveAs } = await import("file-saver");

  const logoBase64 = await loadLogoBase64();
  const zip = new JSZip();
  const folder = zip.folder("invoices");

  for (const tx of transactions) {
    const doc = generateInvoicePDF(tx, { logoBase64 });
    const blob = doc.output("blob");
    folder.file(`invoice-${tx.invoice_code || tx.id}.pdf`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const date = new Date().toISOString().split("T")[0];
  saveAs(content, `all-invoices-${date}.zip`);
}
