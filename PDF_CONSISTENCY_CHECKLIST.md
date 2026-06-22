# ✅ PDF Export Consistency Checklist

## 🎯 Goal
Memastikan **SEMUA dokumen PDF** di Synthera memiliki:
- Header yang sama (gradient navy → royal blue + glow)
- Footer yang sama (3 kolom solid navy)
- Preview modal yang sama sebelum download

---

## 📊 Status Overview

| Dokumen | Header | Footer | Preview | Status |
|---------|--------|--------|---------|--------|
| **Subscription History** | ✅ | ✅ | ✅ | ✅ COMPLETE |
| **Manual Book** | ✅ | ✅ | ✅ | ✅ COMPLETE |
| **Single Invoice** | ⚠️ | ⚠️ | ✅ | ⚠️ NEEDS UPDATE |
| **Reports/Analytics** | ❌ | ❌ | ❌ | ❌ TODO |
| **Transaction Management** | ❌ | ❌ | ❌ | ❌ TODO |

**Legend**:
- ✅ = Implemented & Working
- ⚠️ = Partially implemented / Needs refactoring
- ❌ = Not yet implemented

---

## 📋 Detailed Checklist

### 1. Subscription History (Riwayat Pembelian)
**File**: `src/utils/invoiceGenerator.js` → `downloadAllTransactionsAsSinglePDF()`

#### Header ✅
- [x] Linear gradient navy darkest → royal blue (80 steps)
- [x] Glow effect di kanan bawah header
- [x] Logo Synthera di kiri atas
- [x] Brand name "SYNTHERA ID" + subtitle
- [x] Document title "RIWAYAT PEMBELIAN"
- [x] Document number di kanan atas
- [x] Info boxes (4 kolom): TANGGAL DITERBITKAN, JATUH TEMPO, TANGGAL PEMBAYARAN, MATA UANG

#### Footer ✅
- [x] Solid navy background (#0D1117)
- [x] 3 kolom layout
- [x] Kolom kiri: Logo + SYNTHERA ID + subtitle
- [x] Kolom tengah: ★ DOKUMEN RESMI
- [x] Kolom kanan: support@synthera.id + https://synthera.id
- [x] Disclaimer text di bawah footer

#### Preview ✅
- [x] Opens in new tab with dark theme
- [x] Toolbar dengan gradient navy → royal blue
- [x] Document title + filename
- [x] Button "Download PDF" (cyan)
- [x] Button "Tutup"
- [x] Mobile responsive
- [x] Fallback untuk popup blockers

#### Table ✅
- [x] Navy header dengan white text
- [x] Zebra striping (alternating rows)
- [x] Status colors: Paid (green), Pending (orange), Failed (red)
- [x] Professional typography

---

### 2. Manual Book
**File**: `src/utils/manualBookGenerator.js` → `downloadManualBookPDF()`

#### Header ✅
- [x] Linear gradient navy darkest → royal blue (80 steps)
- [x] Glow effect di kanan bawah header
- [x] Logo Synthera di kiri atas
- [x] Brand name "SYNTHERA ID" + subtitle
- [x] Document title "MANUAL BOOK"
- [x] Document number `#MB-YYYY-MM-DD`
- [x] Info boxes (4 kolom): TANGGAL DITERBITKAN, VERSI, KATEGORI, BAHASA

#### Footer ✅
- [x] Solid navy background (#0D1117)
- [x] 3 kolom layout
- [x] Kolom kiri: Logo + SYNTHERA ID + subtitle
- [x] Kolom tengah: ★ DOKUMEN RESMI
- [x] Kolom kanan: support@synthera.id + https://synthera.id
- [x] Disclaimer text di bawah footer

#### Preview ✅
- [x] Opens in new tab with dark theme
- [x] Toolbar dengan gradient navy → royal blue
- [x] Document title "Preview Manual Book Synthera"
- [x] Button "Download PDF" (cyan)
- [x] Button "Tutup"
- [x] Mobile responsive
- [x] Fallback untuk popup blockers

#### Content ✅
- [x] Introduction section
- [x] Target users (Member & Admin)
- [x] Technology stack table
- [x] Developer setup guide
- [x] Code blocks dengan styling
- [x] Professional typography

---

### 3. Single Invoice (Per Transaksi) ⚠️
**File**: `src/utils/invoiceGenerator.js` → `generateInvoicePDF()`

**STATUS**: Uses old implementation - NEEDS REFACTORING

#### Current Implementation:
- ⚠️ Manual header code (not using `drawPremiumHeader()`)
- ⚠️ Manual footer code (not using `drawPremiumFooter()`)
- ✅ Preview modal sudah menggunakan `openPDFPreview()`

#### TODO:
```javascript
// Replace manual header code (lines ~100-250) with:
const currentY = drawPremiumHeader(doc, {
  title: "INVOICE",
  documentNumber: transaction.invoice_code || "#INV-0001",
  logoBase64,
  pageWidth: PW,
  marginLeft: ML,
  marginRight: MR,
  withGlow: true,
  infoBoxes: {
    box1: { label: "TANGGAL DITERBITKAN", value: formatDate(transaction.created_at) },
    box2: { label: "JATUH TEMPO", value: formatDate(transaction.expired_at) || "-" },
    box3: { label: "STATUS", value: STATUS_LABELS[status] },
    box4: { label: "MATA UANG", value: "IDR (Rp)" },
  },
});

// Replace manual footer code (lines ~400-500) with:
drawPremiumFooter(doc, {
  logoBase64,
  pageWidth: PW,
  pageHeight: PH,
  marginLeft: ML,
  marginRight: MR,
  currentY: y,
});
```

---

### 4. Reports & Analytics ❌
**Status**: NOT YET IMPLEMENTED

**Files to check**:
- `src/app/dashboard/management/reports/page.jsx`
- Check if ada fungsi export PDF

**TODO**:
1. Identify export functions
2. Implement with reusable components:
   ```javascript
   import {
     drawPremiumHeader,
     drawPremiumFooter,
     openPDFPreview,
   } from "@/utils/pdfComponents";
   ```
3. Use consistent header/footer design
4. Add preview modal before download

---

### 5. Transaction Management (Admin) ❌
**Status**: NOT YET IMPLEMENTED

**Files to check**:
- `src/app/dashboard/management/transaction_management/page.jsx`
- Check if ada fungsi export PDF

**TODO**:
1. Identify export functions
2. Implement with reusable components
3. Use consistent header/footer design
4. Add preview modal before download

---

## 🔧 Refactoring Guide

### When adding PDF export to new document:

1. **Import reusable components**:
```javascript
import {
  PDF_COLORS,
  loadLogoBase64,
  drawPremiumHeader,
  drawPremiumFooter,
  openPDFPreview,
} from "@/utils/pdfComponents";
```

2. **Create PDF instance**:
```javascript
const doc = new jsPDF({ 
  orientation: "portrait", // or "landscape"
  unit: "mm", 
  format: "a4" 
});
```

3. **Load logo**:
```javascript
const logoBase64 = await loadLogoBase64();
```

4. **Draw header with custom info**:
```javascript
const currentY = drawPremiumHeader(doc, {
  title: "YOUR DOCUMENT TITLE",
  documentNumber: "#DOC-2026-001",
  logoBase64,
  pageWidth: doc.internal.pageSize.getWidth(),
  marginLeft: 15,
  marginRight: 15,
  withGlow: true,
  infoBoxes: {
    box1: { label: "LABEL 1", value: "Value 1" },
    box2: { label: "LABEL 2", value: "Value 2" },
    box3: { label: "LABEL 3", value: "Value 3" },
    box4: { label: "LABEL 4", value: "Value 4" },
  },
});
```

5. **Add your content** (tables, text, etc.)

6. **Draw footer**:
```javascript
drawPremiumFooter(doc, {
  logoBase64,
  pageWidth: doc.internal.pageSize.getWidth(),
  pageHeight: doc.internal.pageSize.getHeight(),
  marginLeft: 15,
  marginRight: 15,
  currentY: y, // current Y position after content
});
```

7. **Open preview instead of direct download**:
```javascript
const filename = "your-document-name.pdf";
openPDFPreview(doc, filename, "Preview Your Document");
```

---

## 🎨 Design Standards

### Colors
```javascript
// Header gradient
navyDarkest: #0D1117  // Left
royalBlue:   #2563EB  // Right
glowBlue:    #3B82F6  // Glow effect

// Footer
navyDarkest: #0D1117  // Solid background

// Accents
accentCyan:  #00C2FF  // Buttons, highlights
```

### Typography
```javascript
// Headers
Helvetica Bold, 18-20px

// Body
Helvetica Normal, 8-10px

// Labels/Small text
Helvetica Normal, 6-7px

// Code
Courier, 7px
```

### Layout
```javascript
// A4 Portrait
Width:  210mm
Height: 297mm
Margin: 15mm

// A4 Landscape
Width:  297mm
Height: 210mm
Margin: 15mm

// Header height: 50mm
// Footer height: 35mm
```

---

## ✅ Testing Checklist

Before marking a document as "complete", verify:

### Header Tests:
- [ ] Gradient smooth dari navy → royal blue
- [ ] Glow effect visible di kanan bawah
- [ ] Logo rendered correctly
- [ ] Brand name "SYNTHERA ID" visible
- [ ] Document title centered-right
- [ ] Document number di kanan atas
- [ ] Info boxes (4 kolom) aligned correctly
- [ ] All text readable dan tidak terpotong

### Footer Tests:
- [ ] Solid navy background (no gradient)
- [ ] Logo rendered correctly
- [ ] Brand name di kolom kiri
- [ ] "★ DOKUMEN RESMI" di kolom tengah
- [ ] Kontak info di kolom kanan
- [ ] Disclaimer text di bawah footer
- [ ] All text readable dan tidak terpotong

### Preview Modal Tests:
- [ ] Opens in new tab (not new window)
- [ ] Dark theme (#1a1a1a)
- [ ] Toolbar gradient navy → royal blue
- [ ] Document title + filename visible
- [ ] "Download PDF" button cyan (#00C2FF)
- [ ] "Tutup" button visible
- [ ] PDF iframe displays correctly
- [ ] Download button works
- [ ] Close button works
- [ ] Mobile responsive (test on small screen)
- [ ] Fallback jika popup blocked

### Content Tests:
- [ ] All text aligned correctly
- [ ] Tables formatted professionally
- [ ] Status colors correct (if applicable)
- [ ] No content overflow
- [ ] Page breaks handled correctly
- [ ] Images/logos not pixelated

---

## 📝 Priority Order

**HIGH PRIORITY** (Do first):
1. ✅ Subscription History → DONE
2. ✅ Manual Book → DONE
3. ⚠️ Single Invoice → REFACTOR NEEDED

**MEDIUM PRIORITY** (Do next):
4. ❌ Reports & Analytics
5. ❌ Transaction Management (Admin)

**LOW PRIORITY** (Optional):
6. Any other document exports in the system

---

## 🚀 Quick Commands

### Test Subscription PDF:
```
http://localhost:3000/dashboard/subscription
```
Click "Download Semua Transaksi (PDF)"

### Test Manual Book PDF:
```
http://localhost:3000/manual
```
Click "Download PDF" di header

### Test Single Invoice PDF:
```
http://localhost:3000/dashboard/subscription
```
Click menu (⋮) pada transaksi → "Download Invoice"

---

**Last Updated**: June 22, 2026  
**Maintainer**: Kiro AI Assistant  
**Status**: 2/5 Complete (40%)

---

✨ Goal: 100% consistency across all PDF exports di Synthera platform!
