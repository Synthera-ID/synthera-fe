import * as XLSX from "xlsx";

export function openExcelPreview({ header, rows, filename, documentTitle = "Export Data" }) {
  // Generate Excel Data URI
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws["!cols"] = header.map((h, i) => ({
    wch: Math.max(h.length, ...rows.map((r) => String(r[i] ?? "").length), 10),
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  const b64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + b64;

  const previewWindow = window.open('', '_blank');
  
  if (previewWindow) {
    let tableHtml = '<table class="excel-table"><thead><tr>';
    header.forEach(h => {
      tableHtml += `<th>${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    
    // Show only first 100 rows in preview
    const previewRows = rows.slice(0, 100);
    previewRows.forEach(r => {
      tableHtml += '<tr>';
      r.forEach((cell, i) => {
        let displayCell = cell !== null && cell !== undefined ? cell : '';
        if (typeof cell === 'number') {
            displayCell = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(cell);
        }
        
        // Add status dots if column is Status
        if (header[i].toLowerCase() === 'status' && typeof cell === 'string') {
           const s = cell.toLowerCase();
           let dotClass = 'status-pending';
           if (s === 'paid' || s === 'completed') dotClass = 'status-paid';
           else if (s === 'failed') dotClass = 'status-failed';
           else if (s === 'refunded') dotClass = 'status-refunded';
           displayCell = `<span class="status-dot ${dotClass}"></span><span style="font-weight: 600; text-transform: capitalize; color: #334155;">${cell}</span>`;
        } else if (typeof cell === 'number') {
           displayCell = `<span style="font-weight: 600; color: #0f172a;">${displayCell}</span>`;
        }
        
        tableHtml += `<td>${displayCell}</td>`;
      });
      tableHtml += '</tr>';
    });
    
    if (rows.length > 100) {
      tableHtml += `<tr><td colspan="${header.length}" class="text-center bg-gray">... and ${rows.length - 100} more rows not shown in preview ...</td></tr>`;
    }
    tableHtml += '</tbody></table>';

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
              display: flex;
              flex-direction: column;
              height: 100vh;
              overflow: hidden;
            }
            .toolbar {
              flex-shrink: 0;
              height: 60px;
              background: linear-gradient(135deg, #0F172A 0%, #10B981 100%);
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
            .content-container {
              flex: 1;
              overflow: auto;
              padding: 32px;
              background: #2a2a2a;
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
            .table-wrapper {
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
              overflow: hidden;
              width: 100%;
              max-width: 1200px;
              height: fit-content;
              overflow-x: auto;
            }
            .excel-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
            }
            .excel-table th {
              background: #f8fafc;
              color: #475569;
              font-weight: 600;
              text-align: left;
              padding: 16px;
              border-bottom: 2px solid #e2e8f0;
              white-space: nowrap;
            }
            .excel-table td {
              padding: 14px 16px;
              border-bottom: 1px solid #e2e8f0;
              color: #64748b;
              white-space: nowrap;
            }
            .excel-table tr:last-child td {
              border-bottom: none;
            }
            .excel-table tr:hover td {
              background: #f1f5f9;
            }
            .text-center { text-align: center !important; }
            .bg-gray { background: #f8fafc !important; color: #64748b !important; font-style: italic; }
            
            /* Status Dots */
            .status-dot {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-right: 8px;
              vertical-align: middle;
            }
            .status-paid, .status-completed { background: #10B981; }
            .status-pending { background: #F59E0B; }
            .status-failed { background: #EF4444; }
            .status-refunded { background: #8B5CF6; }
            
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
              .content-container {
                padding: 16px;
              }
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <div class="toolbar-left">
              <div>
                <div class="toolbar-title">📊 ${documentTitle}</div>
                <div class="toolbar-subtitle">${filename}</div>
              </div>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-download" onclick="downloadExcel()">
                <span>⬇</span>
                <span>Download Excel</span>
              </button>
              <button class="btn btn-close" onclick="window.close()">
                <span>✕</span>
                <span>Tutup</span>
              </button>
            </div>
          </div>
          <div class="content-container">
            <div class="table-wrapper">
              ${tableHtml}
            </div>
          </div>
          <script>
            function downloadExcel() {
              const link = document.createElement('a');
              link.href = '${dataUri}';
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
    alert('Popup diblokir! Excel akan didownload langsung.');
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
