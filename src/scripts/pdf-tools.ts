import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import {
  bindDropzoneKeyboard,
  formatBytes,
  generateAndDownloadZip,
  parsePageRanges,
  releaseCanvas,
  stripExtension,
  triggerDownload,
  WARN_PDF_BYTES,
  WARN_PDF_IMAGE_PAGES,
} from './utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface MergeItem {
  id: string;
  file: File;
  bytes: Uint8Array;
  pageCount: number;
}

interface RenderedPage {
  pageNumber: number;
  blob: Blob;
  url: string;
  filename: string;
}

interface Labels {
  merge: {
    moveUp: string;
    moveDown: string;
    remove: string;
    pagesUnit: string;
    needTwo: string;
    doneMsg: string;
    largeWarn: string;
  };
  split: {
    totalPages: string;
    doneSingle: string;
    doneZip: string;
    invalidRange: string;
    largeWarn: string;
  };
  toImage: {
    downloadSingle: string;
    progressText: string;
    doneMsg: string;
    cancelledMsg: string;
    invalidRange: string;
    largeWarn: string;
    pagesUnit: string;
  };
}

export function initPdfTools(root: HTMLElement): void {
  const labels: Labels = JSON.parse(root.dataset.labels || '{}');

  // Tabs + URL ?tab= deep-link support + live breadcrumb sync
  const tabBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab-btn]'));
  const tabPanels = Array.from(root.querySelectorAll<HTMLElement>('[data-tab-panel]'));
  const breadcrumbCurrent = document.querySelector<HTMLElement>('[data-breadcrumb-current]');
  function activateTab(target: string | undefined): void {
    if (!target) return;
    const matchedBtn = tabBtns.find((b) => b.dataset.tabBtn === target);
    if (!matchedBtn) return;
    tabBtns.forEach((b) => b.classList.toggle('active', b === matchedBtn));
    tabPanels.forEach((p) => p.classList.toggle('active', p.dataset.tabPanel === target));
    const labelText = matchedBtn.textContent?.trim();
    if (breadcrumbCurrent && labelText) {
      breadcrumbCurrent.textContent = labelText;
    }
    const tabsBar = matchedBtn.parentElement;
    if (tabsBar) {
      const targetLeft = matchedBtn.offsetLeft - (tabsBar.clientWidth - matchedBtn.clientWidth) / 2;
      tabsBar.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tabBtn;
      activateTab(target);
      if (target) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', target);
        window.history.replaceState({}, '', url);
      }
    });
  });
  const urlTab = new URLSearchParams(window.location.search).get('tab');
  const defaultTab = root.dataset.initialTab || 'merge';
  if (tabBtns.length > 0) {
    activateTab(urlTab || defaultTab);
  }

  function setStatus(el: HTMLElement, type: 'success' | 'error' | 'info' | 'warn' | '', message: string): void {
    el.className = 'status-banner';
    if (!message) return;
    el.classList.add('show', type || 'info');
    el.textContent = message;
  }

  // ==================== 1. MERGE PDF ====================
  const mergeDrop = root.querySelector<HTMLElement>('[data-merge-drop]')!;
  const mergeInput = root.querySelector<HTMLInputElement>('[data-merge-input]')!;
  const mergeList = root.querySelector<HTMLElement>('[data-merge-list]')!;
  const mergeRunBtn = root.querySelector<HTMLButtonElement>('[data-merge-run]')!;
  const mergeClearBtn = root.querySelector<HTMLButtonElement>('[data-merge-clear]')!;
  const mergeStatus = root.querySelector<HTMLElement>('[data-merge-status]')!;
  let mergeItems: MergeItem[] = [];

  mergeDrop.addEventListener('click', (e) => {
    if (e.target === mergeInput) return;
    mergeInput.click();
  });
  bindDropzoneKeyboard(mergeDrop, mergeInput);
  mergeDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    mergeDrop.classList.add('drag-over');
  });
  mergeDrop.addEventListener('dragleave', () => mergeDrop.classList.remove('drag-over'));
  mergeDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    mergeDrop.classList.remove('drag-over');
    if (e.dataTransfer?.files) void addMergeFiles(Array.from(e.dataTransfer.files));
  });
  mergeInput.addEventListener('change', () => {
    if (mergeInput.files) {
      void addMergeFiles(Array.from(mergeInput.files));
      mergeInput.value = '';
    }
  });

  async function addMergeFiles(files: File[]): Promise<void> {
    setStatus(mergeStatus, '', '');
    const pdfs = files.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    for (const file of pdfs) {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const doc = await PDFDocument.load(bytes);
        mergeItems.push({
          id: crypto.randomUUID(),
          file,
          bytes,
          pageCount: doc.getPageCount(),
        });
      } catch {
        // Skip encrypted/invalid PDF
      }
    }
    renderMergeList();
  }

  function renderMergeList(): void {
    mergeRunBtn.disabled = mergeItems.length < 2;
    mergeClearBtn.disabled = mergeItems.length === 0;
    const totalBytes = mergeItems.reduce((sum, i) => sum + i.file.size, 0);
    if (totalBytes > WARN_PDF_BYTES) {
      setStatus(mergeStatus, 'warn', labels.merge.largeWarn);
    }
    mergeList.innerHTML = '';

    mergeItems.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'file-item';

      const meta = document.createElement('div');
      meta.className = 'file-meta';
      const name = document.createElement('div');
      name.className = 'file-name';
      name.textContent = `${index + 1}. ${item.file.name}`;
      const sub = document.createElement('div');
      sub.className = 'file-sub';
      sub.textContent = `${item.pageCount} ${labels.merge.pagesUnit} · ${formatBytes(item.file.size)}`;
      meta.append(name, sub);

      const actions = document.createElement('div');
      actions.className = 'file-actions';

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.className = 'btn btn-secondary btn-sm';
      upBtn.textContent = labels.merge.moveUp;
      upBtn.disabled = index === 0;
      upBtn.addEventListener('click', () => {
        [mergeItems[index - 1], mergeItems[index]] = [mergeItems[index], mergeItems[index - 1]];
        renderMergeList();
      });

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.className = 'btn btn-secondary btn-sm';
      downBtn.textContent = labels.merge.moveDown;
      downBtn.disabled = index === mergeItems.length - 1;
      downBtn.addEventListener('click', () => {
        [mergeItems[index + 1], mergeItems[index]] = [mergeItems[index], mergeItems[index + 1]];
        renderMergeList();
      });

      const rmBtn = document.createElement('button');
      rmBtn.type = 'button';
      rmBtn.className = 'btn btn-secondary btn-sm';
      rmBtn.textContent = labels.merge.remove;
      rmBtn.addEventListener('click', () => {
        mergeItems = mergeItems.filter((x) => x.id !== item.id);
        renderMergeList();
      });

      actions.append(upBtn, downBtn, rmBtn);
      row.append(meta, actions);
      mergeList.appendChild(row);
    });
  }

  mergeClearBtn.addEventListener('click', () => {
    mergeItems = [];
    setStatus(mergeStatus, '', '');
    renderMergeList();
  });

  mergeRunBtn.addEventListener('click', async () => {
    if (mergeItems.length < 2) {
      setStatus(mergeStatus, 'error', labels.merge.needTwo);
      return;
    }
    mergeRunBtn.disabled = true;
    try {
      const merged = await PDFDocument.create();
      for (const item of mergeItems) {
        const src = await PDFDocument.load(item.bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const outBytes = await merged.save();
      const blob = new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' });
      triggerDownload(blob, `kitzero-merged-${Date.now()}.pdf`);
      setStatus(mergeStatus, 'success', labels.merge.doneMsg);
    } catch (err) {
      setStatus(mergeStatus, 'error', String(err));
    } finally {
      mergeRunBtn.disabled = mergeItems.length < 2;
    }
  });

  // ==================== 2. SPLIT / EXTRACT PDF ====================
  const splitDrop = root.querySelector<HTMLElement>('[data-split-drop]')!;
  const splitInput = root.querySelector<HTMLInputElement>('[data-split-input]')!;
  const splitInfoBar = root.querySelector<HTMLElement>('[data-split-info-bar]')!;
  const splitFileInfo = root.querySelector<HTMLElement>('[data-split-info]')!;
  const splitClearBtn = root.querySelector<HTMLButtonElement>('[data-split-clear]')!;
  const splitModeSelect = root.querySelector<HTMLSelectElement>('[data-split-mode]')!;
  const splitRangeField = root.querySelector<HTMLElement>('[data-split-range-field]')!;
  const splitRangeInput = root.querySelector<HTMLInputElement>('[data-split-range]')!;
  const splitRunBtn = root.querySelector<HTMLButtonElement>('[data-split-run]')!;
  const splitStatus = root.querySelector<HTMLElement>('[data-split-status]')!;

  let splitFile: File | null = null;
  let splitBytes: Uint8Array | null = null;
  let splitTotalPages = 0;

  splitModeSelect.addEventListener('change', () => {
    splitRangeField.style.display = splitModeSelect.value === 'range' ? 'block' : 'none';
  });

  splitDrop.addEventListener('click', (e) => {
    if (e.target === splitInput) return;
    splitInput.click();
  });
  bindDropzoneKeyboard(splitDrop, splitInput);
  splitDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    splitDrop.classList.add('drag-over');
  });
  splitDrop.addEventListener('dragleave', () => splitDrop.classList.remove('drag-over'));
  splitDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    splitDrop.classList.remove('drag-over');
    if (e.dataTransfer?.files?.[0]) void loadSplitFile(e.dataTransfer.files[0]);
  });
  splitInput.addEventListener('change', () => {
    if (splitInput.files?.[0]) {
      void loadSplitFile(splitInput.files[0]);
      splitInput.value = '';
    }
  });

  async function loadSplitFile(file: File): Promise<void> {
    setStatus(splitStatus, '', '');
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      splitFile = file;
      splitBytes = bytes;
      splitTotalPages = doc.getPageCount();
      splitInfoBar.hidden = false;
      splitFileInfo.textContent = `${file.name} (${labels.split.totalPages}: ${splitTotalPages})`;
      splitRangeInput.value = splitTotalPages > 1 ? `1-${Math.min(2, splitTotalPages)}` : '1';
      splitRunBtn.disabled = false;
      if (file.size > WARN_PDF_BYTES || splitTotalPages > 100) {
        setStatus(splitStatus, 'warn', labels.split.largeWarn);
      }
    } catch (err) {
      setStatus(splitStatus, 'error', String(err));
    }
  }

  splitClearBtn.addEventListener('click', () => {
    splitFile = null;
    splitBytes = null;
    splitTotalPages = 0;
    splitFileInfo.textContent = '';
    splitInfoBar.hidden = true;
    splitRangeInput.value = '';
    splitRunBtn.disabled = true;
    setStatus(splitStatus, '', '');
  });

  splitRunBtn.addEventListener('click', async () => {
    if (!splitFile || !splitBytes) return;
    splitRunBtn.disabled = true;
    try {
      const srcDoc = await PDFDocument.load(splitBytes);
      const baseName = stripExtension(splitFile.name);

      if (splitModeSelect.value === 'every') {
        const zip = new JSZip();
        for (let i = 0; i < splitTotalPages; i++) {
          const single = await PDFDocument.create();
          const [page] = await single.copyPages(srcDoc, [i]);
          single.addPage(page);
          const bytes = await single.save();
          zip.file(`${baseName}_page_${i + 1}.pdf`, bytes);
        }
        await generateAndDownloadZip(splitRunBtn, zip, `${baseName}_split_pages.zip`);
        setStatus(splitStatus, 'success', labels.split.doneZip);
      } else {
        const indices = parsePageRanges(splitRangeInput.value, splitTotalPages);
        if (indices.length === 0) {
          setStatus(splitStatus, 'error', labels.split.invalidRange);
          splitRunBtn.disabled = false;
          return;
        }
        const outDoc = await PDFDocument.create();
        const copied = await outDoc.copyPages(srcDoc, indices);
        copied.forEach((p) => outDoc.addPage(p));
        const outBytes = await outDoc.save();
        triggerDownload(new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }), `${baseName}_extracted.pdf`);
        setStatus(splitStatus, 'success', labels.split.doneSingle);
      }
    } catch (err) {
      setStatus(splitStatus, 'error', String(err));
    } finally {
      splitRunBtn.disabled = false;
    }
  });

  // ==================== 3. PDF TO IMAGES ====================
  const imgDrop = root.querySelector<HTMLElement>('[data-img-drop]')!;
  const imgInput = root.querySelector<HTMLInputElement>('[data-img-input]')!;
  const imgInfoBar = root.querySelector<HTMLElement>('[data-img-info-bar]')!;
  const imgFileInfo = root.querySelector<HTMLElement>('[data-img-info]')!;
  const imgClearBtn = root.querySelector<HTMLButtonElement>('[data-img-clear]')!;
  const imgFormatSelect = root.querySelector<HTMLSelectElement>('[data-img-format]')!;
  const imgScaleSelect = root.querySelector<HTMLSelectElement>('[data-img-scale]')!;
  const imgRangeInput = root.querySelector<HTMLInputElement>('[data-img-range]')!;
  const imgRunBtn = root.querySelector<HTMLButtonElement>('[data-img-run]')!;
  const imgCancelBtn = root.querySelector<HTMLButtonElement>('[data-img-cancel]')!;
  const imgZipBtn = root.querySelector<HTMLButtonElement>('[data-img-zip]')!;
  const imgStatus = root.querySelector<HTMLElement>('[data-img-status]')!;
  const imgGrid = root.querySelector<HTMLElement>('[data-img-grid]')!;

  let imgPdfFile: File | null = null;
  let imgPdfPageCount = 0;
  let imgCancelRequested = false;
  let renderedPages: RenderedPage[] = [];

  imgCancelBtn.addEventListener('click', () => {
    imgCancelRequested = true;
    imgCancelBtn.disabled = true;
  });

  imgDrop.addEventListener('click', (e) => {
    if (e.target === imgInput) return;
    imgInput.click();
  });
  bindDropzoneKeyboard(imgDrop, imgInput);
  imgDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    imgDrop.classList.add('drag-over');
  });
  imgDrop.addEventListener('dragleave', () => imgDrop.classList.remove('drag-over'));
  imgDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    imgDrop.classList.remove('drag-over');
    if (e.dataTransfer?.files?.[0]) void selectImgPdf(e.dataTransfer.files[0]);
  });
  imgInput.addEventListener('change', () => {
    if (imgInput.files?.[0]) {
      void selectImgPdf(imgInput.files[0]);
      imgInput.value = '';
    }
  });

  function clearRenderedPages(): void {
    renderedPages.forEach((p) => URL.revokeObjectURL(p.url));
    renderedPages = [];
    imgGrid.innerHTML = '';
    imgZipBtn.disabled = true;
  }

  async function selectImgPdf(file: File): Promise<void> {
    clearRenderedPages();
    imgPdfFile = file;
    imgPdfPageCount = 0;
    imgRunBtn.disabled = true;
    setStatus(imgStatus, '', '');

    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const doc = await pdfjsLib.getDocument({ data }).promise;
      imgPdfPageCount = doc.numPages;
      await doc.destroy();

      imgInfoBar.hidden = false;
      imgFileInfo.textContent = `${file.name} (${imgPdfPageCount} ${labels.toImage.pagesUnit} · ${formatBytes(file.size)})`;
      imgRunBtn.disabled = false;

      if (file.size > WARN_PDF_BYTES || imgPdfPageCount > WARN_PDF_IMAGE_PAGES) {
        setStatus(imgStatus, 'warn', labels.toImage.largeWarn);
      }
    } catch (err) {
      imgFileInfo.textContent = `${file.name} (${formatBytes(file.size)})`;
      setStatus(imgStatus, 'error', String(err));
    }
  }

  imgClearBtn.addEventListener('click', () => {
    clearRenderedPages();
    imgPdfFile = null;
    imgPdfPageCount = 0;
    imgFileInfo.textContent = '';
    imgInfoBar.hidden = true;
    imgRangeInput.value = '';
    imgRunBtn.disabled = true;
    setStatus(imgStatus, '', '');
  });

  imgRunBtn.addEventListener('click', async () => {
    if (!imgPdfFile) return;
    clearRenderedPages();
    imgRunBtn.disabled = true;
    imgCancelRequested = false;
    imgCancelBtn.disabled = false;

    let pdf: pdfjsLib.PDFDocumentProxy | null = null;
    try {
      const mime = imgFormatSelect.value;
      const ext = mime === 'image/png' ? 'png' : 'jpg';
      const scale = Number(imgScaleSelect.value) || 2;
      const baseName = stripExtension(imgPdfFile.name);
      const data = new Uint8Array(await imgPdfFile.arrayBuffer());

      const loadingTask = pdfjsLib.getDocument({ data });
      pdf = await loadingTask.promise;

      const rangeText = imgRangeInput.value.trim();
      let pageNumbers: number[];
      if (rangeText) {
        const zeroIndexed = parsePageRanges(rangeText, pdf.numPages);
        if (zeroIndexed.length === 0) {
          setStatus(imgStatus, 'error', labels.toImage.invalidRange);
          return;
        }
        pageNumbers = zeroIndexed.map((idx) => idx + 1);
      } else {
        pageNumbers = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
      }

      for (let i = 0; i < pageNumbers.length; i++) {
        if (imgCancelRequested) {
          setStatus(imgStatus, 'info', labels.toImage.cancelledMsg);
          break;
        }
        const pageNum = pageNumbers[i];
        setStatus(imgStatus, 'info', `${labels.toImage.progressText}: ${i + 1} / ${pageNumbers.length} (P.${pageNum})`);
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;

        if (mime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Image render failed'))),
            mime,
            mime === 'image/jpeg' ? 0.92 : undefined
          );
        });

        releaseCanvas(canvas);
        page.cleanup();

        const url = URL.createObjectURL(blob);
        const filename = `${baseName}_page_${pageNum}.${ext}`;
        const entry: RenderedPage = { pageNumber: pageNum, blob, url, filename };
        renderedPages.push(entry);

        const card = document.createElement('div');
        card.className = 'preview-card';
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Page ${pageNum}`;
        const foot = document.createElement('div');
        foot.className = 'preview-card-foot';
        const label = document.createElement('span');
        label.textContent = `P.${pageNum}`;
        const dlBtn = document.createElement('button');
        dlBtn.type = 'button';
        dlBtn.className = 'btn btn-trust btn-sm';
        dlBtn.textContent = labels.toImage.downloadSingle;
        dlBtn.addEventListener('click', () => triggerDownload(entry.blob, entry.filename));
        foot.append(label, dlBtn);
        card.append(img, foot);
        imgGrid.appendChild(card);
      }

      imgZipBtn.disabled = renderedPages.length === 0;
      if (!imgCancelRequested) {
        setStatus(imgStatus, 'success', labels.toImage.doneMsg);
      }
    } catch (err) {
      setStatus(imgStatus, 'error', String(err));
    } finally {
      if (pdf) await pdf.destroy();
      imgCancelBtn.disabled = true;
      imgRunBtn.disabled = false;
      imgZipBtn.disabled = renderedPages.length === 0;
    }
  });

  imgZipBtn.addEventListener('click', async () => {
    if (renderedPages.length === 0 || !imgPdfFile) return;
    const zip = new JSZip();
    for (const p of renderedPages) {
      zip.file(p.filename, p.blob);
    }
    await generateAndDownloadZip(imgZipBtn, zip, `${stripExtension(imgPdfFile.name)}_images.zip`);
  });
}
