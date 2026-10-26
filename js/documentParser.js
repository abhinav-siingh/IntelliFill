/* Local-only document text extraction. This module never makes network requests. */
const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;
const DOCUMENT_MIME = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain"
};

function documentKind(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "pdf" || file.type === DOCUMENT_MIME.pdf) return "pdf";
  if (ext === "docx" || file.type === DOCUMENT_MIME.docx) return "docx";
  if (ext === "txt" || file.type.startsWith("text/")) return "txt";
  if (file.type.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "bmp", "tif", "tiff"].includes(ext)) return "image";
  throw new Error("Unsupported format. Choose PDF, DOCX, TXT, or an image.");
}

async function createOcrWorker() {
  if (!self.Tesseract) throw new Error("Local OCR library is missing.");
  return Tesseract.createWorker("eng", 1, {
    workerPath: chrome.runtime.getURL("vendor/tesseract/worker.min.js"),
    langPath: chrome.runtime.getURL("vendor/tesseract/lang"),
    corePath: chrome.runtime.getURL("vendor/tesseract/core/tesseract-core.wasm.js"),
    logger: () => {}
  });
}

async function ocrImage(source, worker) {
  const result = await worker.recognize(source);
  return result.data.text || "";
}

function pdfItemsAsRows(items) {
  const positioned=items.filter(item=>item.str?.trim()).map(item=>({text:item.str.trim(),x:item.transform?.[4]||0,y:item.transform?.[5]||0}));
  const rows=[];
  for(const item of positioned){let row=rows.find(candidate=>Math.abs(candidate.y-item.y)<=2.5);if(!row){row={y:item.y,items:[]};rows.push(row);}row.items.push(item);}
  return rows.sort((a,b)=>b.y-a.y).map(row=>{
    row.items.sort((a,b)=>a.x-b.x);let line="",end=0;
    for(const item of row.items){const gap=item.x-end;if(line&&gap>Math.max(8,item.text.length*0.55))line+="  ";else if(line&&!/\s$/.test(line))line+=" ";line+=item.text;end=item.x+item.text.length*4.5;}
    return line.trim();
  }).filter(Boolean).join("\n");
}
async function parsePdf(file) {
  if (!self.pdfjsLib) throw new Error("Local PDF.js library is missing.");
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const textParts = [];
  let worker = null;
  try {
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);
      const content = await page.getTextContent();
      let pageText = pdfItemsAsRows(content.items).trim();
      if (pageText.length < 20) {
        if (!worker) worker = await createOcrWorker();
        const viewport = page.getViewport({ scale: 1.7 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        pageText = await ocrImage(canvas, worker);
        canvas.width = canvas.height = 0;
      }
      textParts.push(pageText);
    }
  } finally {
    if (worker) await worker.terminate();
  }
  return textParts.join("\n").trim();
}

async function extractDocumentText(file) {
  if (!file || !file.size) throw new Error("The selected file is empty.");
  if (file.size > MAX_DOCUMENT_BYTES) throw new Error("Each file must be 15 MB or smaller.");
  const kind = documentKind(file);
  if (kind === "txt") return { kind, text: (await file.text()).trim() };
  if (kind === "docx") {
    if (!self.mammoth) throw new Error("Local DOCX parser is missing.");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return { kind, text: (result.value || "").trim() };
  }
  if (kind === "image") {
    const worker = await createOcrWorker();
    try { return { kind, text: (await ocrImage(file, worker)).trim() }; }
    finally { await worker.terminate(); }
  }
  return { kind, text: await parsePdf(file) };
}







