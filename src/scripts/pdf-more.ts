import type { PDFDocumentProxy } from 'pdfjs-dist';
import { loadPdfJs, loadPdfLib } from './pdf-loaders';
import {
  bindDropzoneKeyboard,
  formatBytes,
  releaseCanvas,
  setStatusBanner,
  stripExtension,
  triggerDownload,
} from './utils';

interface MoreLabels {
  compressProgress: string;
  compressDone: string;
  compressCancelled: string;
  compressAlreadyOptimal: string;
  compressLosslessTag: string;
  watermarkDone: string;
}

export function initPdfMore(root: HTMLElement): void {
  const labels: MoreLabels = JSON.parse(root.dataset.moreLabels || '{}');

  const setStatus = setStatusBanner;

  // ==================== TAB 6: PDF COMPRESS ====================
  const cmpDrop = root.querySelector<HTMLElement>('[data-cmp-drop]');
  const cmpInput = root.querySelector<HTMLInputElement>('[data-cmp-input]');
  const cmpInfoBar = root.querySelector<HTMLElement>('[data-cmp-info-bar]');
  const cmpInfo = root.querySelector<HTMLElement>('[data-cmp-info]');
  const cmpClear = root.querySelector<HTMLButtonElement>('[data-cmp-clear]');
  const cmpLevel = root.querySelector<HTMLSelectElement>('[data-cmp-level]');
  const cmpRun = root.querySelector<HTMLButtonElement>('[data-cmp-run]');
  const cmpCancel = root.querySelector<HTMLButtonElement>('[data-cmp-cancel]');
  const cmpStatus = root.querySelector<HTMLElement>('[data-cmp-status]');

  let cmpFile: File | null = null;
  let cmpCancelRequested = false;

  if (cmpDrop && cmpInput && cmpInfoBar && cmpInfo && cmpClear && cmpLevel && cmpRun && cmpCancel && cmpStatus) {
    cmpCancel.addEventListener('click', () => {
      cmpCancelRequested = true;
      cmpCancel.disabled = true;
    });

    cmpDrop.addEventListener('click', (e) => {
      if (e.target === cmpInput) return;
      cmpInput.click();
    });
    bindDropzoneKeyboard(cmpDrop, cmpInput);
    cmpDrop.addEventListener('dragover', (e) => {
      e.preventDefault();
      cmpDrop.classList.add('drag-over');
    });
    cmpDrop.addEventListener('dragleave', () => cmpDrop.classList.remove('drag-over'));
    cmpDrop.addEventListener('drop', (e) => {
      e.preventDefault();
      cmpDrop.classList.remove('drag-over');
      if (e.dataTransfer?.files?.[0]) selectCmpFile(e.dataTransfer.files[0]);
    });
    cmpInput.addEventListener('change', () => {
      if (cmpInput.files?.[0]) {
        selectCmpFile(cmpInput.files[0]);
        cmpInput.value = '';
      }
    });

    function selectCmpFile(file: File): void {
      cmpFile = file;
      cmpInfoBar!.hidden = false;
      cmpInfo!.textContent = `${file.name} (${formatBytes(file.size)})`;
      cmpRun!.disabled = false;
      setStatus(cmpStatus!, '', '');
    }

    cmpClear.addEventListener('click', () => {
      cmpFile = null;
      cmpInfoBar.hidden = true;
      cmpInfo.textContent = '';
      cmpRun.disabled = true;
      setStatus(cmpStatus, '', '');
    });

    cmpRun.addEventListener('click', async () => {
      if (!cmpFile) return;
      cmpRun.disabled = true;
      cmpCancelRequested = false;
      cmpCancel.disabled = false;

      let pdf: PDFDocumentProxy | null = null;
      try {
        const preset = cmpLevel.value;
        const scale = preset === 'light' ? 1.5 : preset === 'strong' ? 1.0 : 1.2;
        const quality = preset === 'light' ? 0.8 : preset === 'strong' ? 0.52 : 0.68;

        const data = new Uint8Array(await cmpFile.arrayBuffer());
        const [pdfjsLib, { PDFDocument }] = await Promise.all([loadPdfJs(), loadPdfLib()]);

        // 1. Try lossless structural optimization first (preserves vector text & links)
        let losslessBytes: Uint8Array | null = null;
        try {
          const losslessDoc = await PDFDocument.load(data.slice(), { ignoreEncryption: true });
          losslessBytes = await losslessDoc.save({ useObjectStreams: true, addDefaultPage: false });
        } catch {
          losslessBytes = null;
        }

        // 2. Rasterized JPEG compression (great for heavy scanned / image-rich PDFs)
        pdf = await pdfjsLib.getDocument({ data: data.slice() }).promise;
        const outDoc = await PDFDocument.create();

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cmpCancelRequested) {
            setStatus(cmpStatus, 'info', labels.compressCancelled);
            return;
          }
          setStatus(cmpStatus, 'info', `${labels.compressProgress}: ${i} / ${pdf.numPages}`);
          const page = await pdf.getPage(i);
          const origVp = page.getViewport({ scale: 1 });
          const renderVp = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = renderVp.width;
          canvas.height = renderVp.height;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport: renderVp }).promise;

          const jpgBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Compress failed'))), 'image/jpeg', quality);
          });
          releaseCanvas(canvas);
          page.cleanup();

          const embedded = await outDoc.embedJpg(await jpgBlob.arrayBuffer());
          const newPage = outDoc.addPage([origVp.width, origVp.height]);
          newPage.drawImage(embedded, { x: 0, y: 0, width: origVp.width, height: origVp.height });
        }

        const rasterBytes = await outDoc.save({ useObjectStreams: true });

        // 3. Pick the strictly smallest candidate — never download a bloated file
        let bestBytes: Uint8Array = rasterBytes;
        let usedLossless = false;
        if (losslessBytes && losslessBytes.length < bestBytes.length) {
          bestBytes = losslessBytes;
          usedLossless = true;
        }

        if (bestBytes.length >= cmpFile.size) {
          setStatus(
            cmpStatus,
            'warn',
            `${labels.compressAlreadyOptimal} (${formatBytes(cmpFile.size)})`
          );
          return;
        }

        const outBlob = new Blob([new Uint8Array(bestBytes)], { type: 'application/pdf' });
        const savedPct = Math.max(1, Math.round(((cmpFile.size - outBlob.size) / cmpFile.size) * 100));
        triggerDownload(outBlob, `${stripExtension(cmpFile.name)}_compressed.pdf`);
        const modeNote = usedLossless ? `, ${labels.compressLosslessTag}` : '';
        setStatus(
          cmpStatus,
          'success',
          `${labels.compressDone} (${formatBytes(cmpFile.size)} → ${formatBytes(outBlob.size)}, -${savedPct}%${modeNote})`
        );
      } catch (err) {
        setStatus(cmpStatus, 'error', String(err));
      } finally {
        if (pdf) await pdf.destroy();
        cmpCancel.disabled = true;
        cmpRun.disabled = !cmpFile;
      }
    });
  }

  // ==================== TAB 7: PDF WATERMARK & PAGE NUMBERS ====================
  const wmDrop = root.querySelector<HTMLElement>('[data-pdfwm-drop]');
  const wmInput = root.querySelector<HTMLInputElement>('[data-pdfwm-input]');
  const wmInfoBar = root.querySelector<HTMLElement>('[data-pdfwm-info-bar]');
  const wmInfo = root.querySelector<HTMLElement>('[data-pdfwm-info]');
  const wmClear = root.querySelector<HTMLButtonElement>('[data-pdfwm-clear]');
  const wmText = root.querySelector<HTMLInputElement>('[data-pdfwm-text]');
  const wmOpacity = root.querySelector<HTMLInputElement>('[data-pdfwm-opacity]');
  const wmOpacityVal = root.querySelector<HTMLElement>('[data-pdfwm-opacity-val]');
  const wmPageNum = root.querySelector<HTMLInputElement>('[data-pdfwm-pagenum]');
  const wmRun = root.querySelector<HTMLButtonElement>('[data-pdfwm-run]');
  const wmStatus = root.querySelector<HTMLElement>('[data-pdfwm-status]');

  let wmFile: File | null = null;

  if (wmDrop && wmInput && wmInfoBar && wmInfo && wmClear && wmText && wmOpacity && wmOpacityVal && wmPageNum && wmRun && wmStatus) {
    wmOpacity.addEventListener('input', () => {
      wmOpacityVal.textContent = `${wmOpacity.value}%`;
    });

    wmDrop.addEventListener('click', (e) => {
      if (e.target === wmInput) return;
      wmInput.click();
    });
    bindDropzoneKeyboard(wmDrop, wmInput);
    wmDrop.addEventListener('dragover', (e) => {
      e.preventDefault();
      wmDrop.classList.add('drag-over');
    });
    wmDrop.addEventListener('dragleave', () => wmDrop.classList.remove('drag-over'));
    wmDrop.addEventListener('drop', (e) => {
      e.preventDefault();
      wmDrop.classList.remove('drag-over');
      if (e.dataTransfer?.files?.[0]) selectWmFile(e.dataTransfer.files[0]);
    });
    wmInput.addEventListener('change', () => {
      if (wmInput.files?.[0]) {
        selectWmFile(wmInput.files[0]);
        wmInput.value = '';
      }
    });

    function selectWmFile(file: File): void {
      wmFile = file;
      wmInfoBar!.hidden = false;
      wmInfo!.textContent = `${file.name} (${formatBytes(file.size)})`;
      wmRun!.disabled = false;
      setStatus(wmStatus!, '', '');
    }

    wmClear.addEventListener('click', () => {
      wmFile = null;
      wmInfoBar.hidden = true;
      wmInfo.textContent = '';
      wmRun.disabled = true;
      setStatus(wmStatus, '', '');
    });

    wmRun.addEventListener('click', async () => {
      if (!wmFile) return;
      wmRun.disabled = true;
      try {
        const bytes = new Uint8Array(await wmFile.arrayBuffer());
        const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
        const pdfDoc = await PDFDocument.load(bytes);
        const pages = pdfDoc.getPages();
        const text = wmText.value.trim();
        const alpha = (Number(wmOpacity.value) || 22) / 100;

        // Render Unicode/Korean watermark text to PNG via Canvas so any script works cleanly
        let wmImage: Awaited<ReturnType<typeof pdfDoc.embedPng>> | null = null;
        if (text) {
          const canvas = document.createElement('canvas');
          canvas.width = 900;
          canvas.height = 420;
          const ctx = canvas.getContext('2d')!;
          ctx.translate(450, 210);
          ctx.rotate(-Math.PI / 6);
          ctx.font = '700 54px Inter, Pretendard, sans-serif';
          ctx.fillStyle = `rgba(30, 58, 95, ${alpha})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, 0, 0);
          const pngBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('WM render failed'))), 'image/png');
          });
          releaseCanvas(canvas);
          wmImage = await pdfDoc.embedPng(await pngBlob.arrayBuffer());
        }

        const font = wmPageNum.checked ? await pdfDoc.embedFont(StandardFonts.Helvetica) : null;

        pages.forEach((page, idx) => {
          const { width, height } = page.getSize();
          if (wmImage) {
            const drawW = width * 0.85;
            const drawH = (wmImage.height / wmImage.width) * drawW;
            page.drawImage(wmImage, {
              x: (width - drawW) / 2,
              y: (height - drawH) / 2,
              width: drawW,
              height: drawH,
            });
          }
          if (font && wmPageNum.checked) {
            const label = `${idx + 1} / ${pages.length}`;
            const size = 10;
            const tw = font.widthOfTextAtSize(label, size);
            page.drawText(label, {
              x: (width - tw) / 2,
              y: 18,
              size,
              font,
              color: rgb(0.35, 0.4, 0.48),
            });
          }
        });

        const outBytes = await pdfDoc.save();
        triggerDownload(
          new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }),
          `${stripExtension(wmFile.name)}_stamped.pdf`
        );
        setStatus(wmStatus, 'success', labels.watermarkDone);
      } catch (err) {
        setStatus(wmStatus, 'error', String(err));
      } finally {
        wmRun.disabled = !wmFile;
      }
    });
  }
}
