import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import {
  bindDropzoneKeyboard,
  loadImageFromFile,
  stripExtension,
  triggerDownload,
} from './utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PlacedMark {
  pageIndex: number; // 0-based
  nx: number; // normalized center X (0..1)
  ny: number; // normalized center Y from top (0..1)
  nw: number; // normalized width (0..1)
  pngDataUrl: string;
  aspect: number; // height / width
}

export function initPdfSign(root: HTMLElement): void {
  const doneMsg = root.dataset.doneMsg || 'Done';
  const noStampLabel = root.dataset.noStamp || '';
  const dropzone = root.querySelector<HTMLElement>('[data-sign-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-sign-input]')!;
  const stage = root.querySelector<HTMLElement>('[data-sign-stage]')!;
  const pdfCanvas = root.querySelector<HTMLCanvasElement>('[data-sign-pdf-canvas]')!;
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-sign-prev]')!;
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-sign-next]')!;
  const pageLabel = root.querySelector<HTMLElement>('[data-sign-page-label]')!;
  const clearMarksBtn = root.querySelector<HTMLButtonElement>('[data-sign-clear-marks]')!;
  const modeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-sign-mode]'));
  const drawPanel = root.querySelector<HTMLElement>('[data-sign-panel="draw"]')!;
  const stampPanel = root.querySelector<HTMLElement>('[data-sign-panel="stamp"]')!;
  const padCanvas = root.querySelector<HTMLCanvasElement>('[data-sign-pad]')!;
  const clearPadBtn = root.querySelector<HTMLButtonElement>('[data-sign-clear-pad]')!;
  const stampInput = root.querySelector<HTMLInputElement>('[data-sign-stamp-input]')!;
  const stampNameEl = root.querySelector<HTMLElement>('[data-sign-stamp-name]')!;
  const sizeInput = root.querySelector<HTMLInputElement>('[data-sign-size]')!;
  const sizeVal = root.querySelector<HTMLElement>('[data-sign-size-val]')!;
  const saveBtn = root.querySelector<HTMLButtonElement>('[data-sign-save]')!;
  const changeBtn = root.querySelector<HTMLButtonElement>('[data-sign-change]')!;
  const statusEl = root.querySelector<HTMLElement>('[data-sign-status]')!;

  let mode: 'draw' | 'stamp' = 'draw';
  let pdfFile: File | null = null;
  let pdfBytes: Uint8Array | null = null;
  let pdfProxy: pdfjsLib.PDFDocumentProxy | null = null;
  let currentPage = 1;
  let basePageImg: HTMLCanvasElement | null = null;
  let marks: PlacedMark[] = [];
  let stampDataUrl: string | null = null;
  let stampAspect = 1;

  // Signature pad setup
  const padCtx = padCanvas.getContext('2d')!;
  padCtx.lineCap = 'round';
  padCtx.lineJoin = 'round';
  padCtx.lineWidth = 3;
  padCtx.strokeStyle = '#0f172a';
  let padDrawing = false;
  let padHasInk = false;

  function padPos(e: PointerEvent) {
    const r = padCanvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * padCanvas.width) / r.width,
      y: ((e.clientY - r.top) * padCanvas.height) / r.height,
    };
  }

  padCanvas.addEventListener('pointerdown', (e) => {
    padCanvas.setPointerCapture(e.pointerId);
    padDrawing = true;
    padHasInk = true;
    const p = padPos(e);
    padCtx.beginPath();
    padCtx.moveTo(p.x, p.y);
  });
  padCanvas.addEventListener('pointermove', (e) => {
    if (!padDrawing) return;
    const p = padPos(e);
    padCtx.lineTo(p.x, p.y);
    padCtx.stroke();
  });
  padCanvas.addEventListener('pointerup', () => {
    padDrawing = false;
  });
  clearPadBtn.addEventListener('click', () => {
    padCtx.clearRect(0, 0, padCanvas.width, padCanvas.height);
    padHasInk = false;
  });

  sizeInput.addEventListener('input', () => {
    sizeVal.textContent = `${sizeInput.value}%`;
  });

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.signMode === 'stamp' ? 'stamp' : 'draw';
      modeBtns.forEach((b) => b.classList.toggle('active', b === btn));
      drawPanel.hidden = mode !== 'draw';
      stampPanel.hidden = mode !== 'stamp';
    });
  });

  stampInput.addEventListener('change', async () => {
    const file = stampInput.files?.[0];
    if (!file) return;
    const { img, objectUrl } = await loadImageFromFile(file);
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d')!.drawImage(img, 0, 0);
    stampDataUrl = c.toDataURL('image/png');
    stampAspect = img.naturalHeight / img.naturalWidth;
    stampNameEl.textContent = file.name;
    URL.revokeObjectURL(objectUrl);
  });

  dropzone.addEventListener('click', (e) => {
    if (e.target === fileInput) return;
    fileInput.click();
  });
  bindDropzoneKeyboard(dropzone, fileInput);
  changeBtn.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer?.files?.[0]) void loadPdf(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files?.[0]) {
      void loadPdf(fileInput.files[0]);
      fileInput.value = '';
    }
  });

  async function loadPdf(file: File): Promise<void> {
    if (pdfProxy) await pdfProxy.destroy();
    pdfFile = file;
    pdfBytes = new Uint8Array(await file.arrayBuffer());
    pdfProxy = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
    currentPage = 1;
    marks = [];
    dropzone.hidden = true;
    stage.hidden = false;
    changeBtn.disabled = false;
    saveBtn.disabled = false;
    statusEl.className = 'status-banner';
    await renderCurrentPage();
  }

  async function renderCurrentPage(): Promise<void> {
    if (!pdfProxy) return;
    const page = await pdfProxy.getPage(currentPage);
    const vp = page.getViewport({ scale: 1.5 });
    const off = document.createElement('canvas');
    off.width = vp.width;
    off.height = vp.height;
    const octx = off.getContext('2d')!;
    octx.fillStyle = '#FFFFFF';
    octx.fillRect(0, 0, off.width, off.height);
    await page.render({ canvasContext: octx, viewport: vp }).promise;
    page.cleanup();

    basePageImg = off;
    pdfCanvas.width = off.width;
    pdfCanvas.height = off.height;
    pageLabel.textContent = `${currentPage} / ${pdfProxy.numPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= pdfProxy.numPages;
    await redrawMarks();
  }

  async function redrawMarks(): Promise<void> {
    if (!basePageImg) return;
    const ctx = pdfCanvas.getContext('2d')!;
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    ctx.drawImage(basePageImg, 0, 0);

    const pageMarks = marks.filter((m) => m.pageIndex === currentPage - 1);
    for (const m of pageMarks) {
      const img = new Image();
      await new Promise<void>((res) => {
        img.onload = () => res();
        img.src = m.pngDataUrl;
      });
      const w = m.nw * pdfCanvas.width;
      const h = w * m.aspect;
      const x = m.nx * pdfCanvas.width - w / 2;
      const y = m.ny * pdfCanvas.height - h / 2;
      ctx.drawImage(img, x, y, w, h);
    }
    clearMarksBtn.disabled = pageMarks.length === 0;
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      void renderCurrentPage();
    }
  });
  nextBtn.addEventListener('click', () => {
    if (pdfProxy && currentPage < pdfProxy.numPages) {
      currentPage++;
      void renderCurrentPage();
    }
  });

  clearMarksBtn.addEventListener('click', () => {
    marks = marks.filter((m) => m.pageIndex !== currentPage - 1);
    void redrawMarks();
  });

  pdfCanvas.addEventListener('click', (e) => {
    if (!basePageImg) return;
    let dataUrl: string | null = null;
    let aspect = 0.45;
    if (mode === 'stamp') {
      if (!stampDataUrl) return;
      dataUrl = stampDataUrl;
      aspect = stampAspect;
    } else {
      if (!padHasInk) return;
      dataUrl = padCanvas.toDataURL('image/png');
      aspect = padCanvas.height / padCanvas.width;
    }

    const r = pdfCanvas.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    const nw = (Number(sizeInput.value) || 22) / 100;

    marks.push({ pageIndex: currentPage - 1, nx, ny, nw, pngDataUrl: dataUrl, aspect });
    void redrawMarks();
  });

  saveBtn.addEventListener('click', async () => {
    if (!pdfFile || !pdfBytes) return;
    saveBtn.disabled = true;
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      for (const m of marks) {
        const page = pages[m.pageIndex];
        if (!page) continue;
        const { width, height } = page.getSize();
        const res = await fetch(m.pngDataUrl);
        const pngBytes = await res.arrayBuffer();
        const embedded = await pdfDoc.embedPng(pngBytes);
        const drawW = m.nw * width;
        const drawH = drawW * m.aspect;
        const x = m.nx * width - drawW / 2;
        const y = height - m.ny * height - drawH / 2;
        page.drawImage(embedded, { x, y, width: drawW, height: drawH });
      }

      const outBytes = await pdfDoc.save();
      triggerDownload(
        new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }),
        `${stripExtension(pdfFile.name)}_signed.pdf`
      );
      statusEl.className = 'status-banner show success';
      statusEl.textContent = doneMsg;
    } catch (err) {
      statusEl.className = 'status-banner show error';
      statusEl.textContent = String(err);
    } finally {
      saveBtn.disabled = false;
    }
  });

  stampNameEl.textContent = noStampLabel;
}
