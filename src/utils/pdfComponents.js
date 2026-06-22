/**
 * PDF Components - Reusable Premium Header & Footer for all Synthera PDFs
 * 
 * Komponen ini menyediakan Header dan Footer yang konsisten untuk semua dokumen PDF
 * di aplikasi Synthera, termasuk:
 * - Subscription History
 * - Reports & Analytics
 * - Manual Book
 * - Transaction History
 * - Dan dokumen lainnya
 */

// ─── Color Palette (Premium Synthera) ─────────────────────────────────────────
export const PDF_COLORS = {
  // Primary Navy Colors dengan gradasi premium (gelap → royal blue)
  navyDarkest: [13, 17, 23],     // #0D1117 – navy sangat gelap (KIRI)
  navyDark: [15, 23, 42],        // #0F172A – navy dark (tengah-kiri)
  navyMid: [30, 58, 138],        // #1E3A8A – navy mid blue (tengah)
  royalBlue: [37, 99, 235],      // #2563EB – royal blue (KANAN)
  glowBlue: [59, 130, 246],      // #3B82F6 – bright blue untuk glow effect
  accentCyan: [0, 194, 255],     // #00C2FF – accent cyan/blue
  
  // Grayscale
  grayDark: [31, 41, 55],        // #1f2937 – near-black text
  grayMid: [75, 85, 99],         // #4b5563 – body text
  grayLight: [156, 163, 175],    // #9ca3af – muted labels
  grayBg: [245, 247, 250],       // #F5F7FA – light gray bg
  
  white: [255, 255, 255],
  divider: [200, 210, 220],
  
  // Status colors
  green: [16, 185, 129],
  orange: [255, 145, 0],
  red: [239, 68, 68],
};

// ─── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Load Synthera logo as base64
 */
export async function loadLogoBase64() {
  try {
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

/**
 * Draw linear gradient background
 */
export function drawLinearGradient(doc, x, y, width, height, colorStart, colorEnd) {
  const steps = 80; // More steps for smoother gradient
  const stepWidth = width / steps;
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(colorStart[0] + (colorEnd[0] - colorStart[0]) * ratio);
    const g = Math.round(colorStart[1] + (colorEnd[1] - colorStart[1]) * ratio);
    const b = Math.round(colorStart[2] + (colorEnd[2] - colorStart[2]) * ratio);
    
    doc.setFillColor(r, g, b);
    doc.rect(x + (i * stepWidth), y, stepWidth, height, 'F');
  }
}

/**
 * Draw glow effect (optional, untuk header yang lebih premium)
 * UPDATED: Reduced intensity to prevent blocking text
 */
export function drawGlowEffect(doc, x, y, radius, glowColor) {
  const steps = 15; // Reduced from 20
  
  for (let i = steps; i > 0; i--) {
    const ratio = i / steps;
    const currentRadius = radius * ratio * 0.5; // Reduced size by 50%
    const alpha = 0.08 * (1 - ratio); // Reduced from 0.15 to 0.08
    
    const r = Math.round(glowColor[0] + (255 - glowColor[0]) * (1 - alpha));
    const g = Math.round(glowColor[1] + (255 - glowColor[1]) * (1 - alpha));
    const b = Math.round(glowColor[2] + (255 - glowColor[2]) * (1 - alpha));
    
    doc.setFillColor(r, g, b);
    doc.circle(x, y, currentRadius, 'F');
  }
}

/**
 * Draw Premium Header with Gradient
 * 
 * @param {Object} doc - jsPDF instance
 * @param {Object} options - Header options
 * @param {string} options.title - Document title (e.g., "RIWAYAT PEMBELIAN", "LAPORAN KEUANGAN")
 * @param {string} options.documentNumber - Document number (e.g., "#2026-06-0001")
 * @param {string} options.logoBase64 - Base64 encoded logo
 * @param {number} options.pageWidth - Page width
 * @param {number} options.marginLeft - Left margin
 * @param {number} options.marginRight - Right margin
 * @param {boolean} options.withGlow - Add glow effect (default: true)
 * @param {Object} options.infoBoxes - Info boxes data (4 kolom)
 */
export function drawPremiumHeader(doc, options = {}) {
  const {
    title = "DOKUMEN SYNTHERA",
    documentNumber = "#2026-01-0001",
    logoBase64 = null,
    pageWidth = 297,
    marginLeft = 15,
    marginRight = 15,
    withGlow = true,
    infoBoxes = null,
  } = options;
  
  const RIGHT = pageWidth - marginRight;
  const headerHeight = 50;
  
  // Draw gradient background
  drawLinearGradient(
    doc, 
    0, 
    0, 
    pageWidth, 
    headerHeight, 
    PDF_COLORS.navyDarkest, 
    PDF_COLORS.royalBlue
  );
  
  // Optional glow effect
  if (withGlow) {
    drawGlowEffect(doc, pageWidth, headerHeight, 60, PDF_COLORS.glowBlue);
  }
  
  let y = 12;
  
  // Logo
  if (logoBase64) {
    const logoSize = 12;
    doc.addImage(logoBase64, "PNG", marginLeft, y, logoSize, logoSize);
  }
  
  // Brand Name & Subtitle
  const brandX = marginLeft + 15;
  let brandY = y + 4;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.white);
  doc.text("SYNTHERA ID", brandX, brandY);
  
  brandY += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(200, 210, 220);
  doc.text("E Course Membership System", brandX, brandY);
  
  // Document Title (SEJAJAR dengan SYNTHERA ID - di kanan)
  const titleY = y + 4; // Same Y as "SYNTHERA ID"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12); // Same size as SYNTHERA ID
  doc.setTextColor(...PDF_COLORS.white);
  doc.text(title, RIGHT, titleY, { align: "right" });
  
  // Document Number (DI BAWAH Title - aligned right)
  const docNumberY = titleY + 4; // Below title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...PDF_COLORS.accentCyan);
  doc.text(documentNumber, RIGHT, docNumberY, { align: "right" });
  
  // Info boxes (4 kolom) if provided
  if (infoBoxes) {
    y = headerHeight - 12;
    const infoBoxStartX = marginLeft;
    const infoBoxSpacing = (pageWidth - marginLeft - marginRight) / 4;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(150, 160, 180);
    
    // Box 1
    if (infoBoxes.box1) {
      doc.text(infoBoxes.box1.label, infoBoxStartX, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...PDF_COLORS.white);
      doc.text(infoBoxes.box1.value, infoBoxStartX, y + 4);
    }
    
    // Box 2
    if (infoBoxes.box2) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(150, 160, 180);
      doc.text(infoBoxes.box2.label, infoBoxStartX + infoBoxSpacing, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...PDF_COLORS.white);
      doc.text(infoBoxes.box2.value, infoBoxStartX + infoBoxSpacing, y + 4);
    }
    
    // Box 3
    if (infoBoxes.box3) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(150, 160, 180);
      doc.text(infoBoxes.box3.label, infoBoxStartX + infoBoxSpacing * 2, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...PDF_COLORS.white);
      doc.text(infoBoxes.box3.value, infoBoxStartX + infoBoxSpacing * 2, y + 4);
    }
    
    // Box 4
    if (infoBoxes.box4) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(150, 160, 180);
      doc.text(infoBoxes.box4.label, infoBoxStartX + infoBoxSpacing * 3, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...PDF_COLORS.white);
      doc.text(infoBoxes.box4.value, infoBoxStartX + infoBoxSpacing * 3, y + 4);
    }
  }
  
  return headerHeight + 22; // Return next Y position with adequate spacing below header
}

/**
 * Draw Premium Footer (Solid Navy)
 * 
 * @param {Object} doc - jsPDF instance
 * @param {Object} options - Footer options
 * @param {string} options.logoBase64 - Base64 encoded logo
 * @param {number} options.pageWidth - Page width
 * @param {number} options.pageHeight - Page height
 * @param {number} options.marginLeft - Left margin
 * @param {number} options.marginRight - Right margin
 * @param {number} options.currentY - Current Y position (to calculate footer position)
 */
export function drawPremiumFooter(doc, options = {}) {
  const {
    logoBase64 = null,
    pageWidth = 297,
    pageHeight = 210,
    marginLeft = 15,
    marginRight = 15,
    currentY = 150,
  } = options;
  
  const RIGHT = pageWidth - marginRight;
  const footerHeight = 35;
  const footerY = Math.max(currentY, pageHeight - footerHeight - 5);
  
  // Solid navy background
  doc.setFillColor(...PDF_COLORS.navyDarkest);
  doc.rect(0, footerY, pageWidth, footerHeight, 'F');
  
  let fY = footerY + 8;
  
  // Calculate footer columns
  const footerCol1 = marginLeft;
  const footerCol2 = pageWidth / 2;
  const footerCol3 = RIGHT - 55;
  
  // ── KOLOM KIRI: Logo + Brand ──
  if (logoBase64) {
    const logoSize = 10;
    doc.addImage(logoBase64, "PNG", footerCol1, fY, logoSize, logoSize);
  }
  
  const brandFooterX = footerCol1 + 12;
  let brandFooterY = fY + 4;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.white);
  doc.text("SYNTHERA ID", brandFooterX, brandFooterY);
  
  brandFooterY += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 190, 200);
  doc.text("E Course Membership System", brandFooterX, brandFooterY);
  
  // ── KOLOM TENGAH: Dokumen Resmi ──
  const centerY = fY + 6;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...PDF_COLORS.accentCyan);
  doc.text("[*]", footerCol2 - 10, centerY, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 190, 200);
  doc.text("DOKUMEN RESMI", footerCol2 + 5, centerY, { align: "center" });
  
  // ── KOLOM KANAN: Kontak ──
  let contactY = fY + 3;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 190, 200);
  doc.text("support@synthera.id", footerCol3, contactY);
  
  contactY += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...PDF_COLORS.accentCyan);
  doc.text("https://synthera.id", footerCol3, contactY);
  
  // ── Footer Disclaimer ──
  fY = footerY + footerHeight + 3;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...PDF_COLORS.grayLight);
  doc.text(
    "Dokumen ini dibuat secara otomatis oleh sistem Synthera ID. Apabila terdapat pertanyaan terkait dokumen ini,",
    pageWidth / 2,
    fY,
    { align: "center" }
  );
  
  fY += 3;
  doc.text(
    "silakan hubungi support@synthera.id dalam 7 hari kerja sejak tanggal penerbitan.",
    pageWidth / 2,
    fY,
    { align: "center" }
  );
}

/**
 * Open PDF Preview in new tab
 * 
 * @param {Object} doc - jsPDF instance
 * @param {string} filename - Filename for download
 * @param {string} documentTitle - Document title for preview toolbar
 */
export function openPDFPreview(doc, filename, documentTitle = "Dokumen Synthera") {
  const pdfDataUri = doc.output('dataurlstring');
  const previewWindow = window.open('', '_blank');
  
  if (previewWindow) {
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview: ${filename}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            
            /* Mobile responsive */
            @media (max-width: 768px) {
              .toolbar {
                height: auto;
                flex-direction: column;
                padding: 12px 16px;
                gap: 12px;
              }
              .toolbar-left {
                width: 100%;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
              }
              .toolbar-actions {
                width: 100%;
                flex-direction: column;
              }
              .btn {
                width: 100%;
                justify-content: center;
              }
              .pdf-container {
                top: 140px;
              }
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <div class="toolbar-left">
              <div>
                <div class="toolbar-title">📄 ${documentTitle}</div>
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
    // Fallback jika popup diblokir
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
