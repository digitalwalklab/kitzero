import exifr from 'exifr';
import JSZip from 'jszip';
import {
  bindDropzone,
  extensionFromMime,
  extractRawExifTiff,
  extractWebpExifPayload,
  formatBytes,
  generateAndDownloadZip,
  injectJpegExifSegment,
  injectWebpExifPayload,
  isCanvasTooLarge,
  loadImageFromFile,
  releaseCanvas,
  stripExtension,
  triggerDownload,
  WARN_IMAGE_BYTES,
  WARN_IMAGE_COUNT,
  wrapTiffAsJpegApp1,
} from './utils';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  hasExif: boolean;
  hasGps: boolean;
  cameraLabel: string;
  status: 'ready' | 'processing' | 'done' | 'error';
  errorMsg?: string;
  exifOutcome?: 'removed' | 'preserved' | 'unsupported' | 'none';
  outputBlob?: Blob;
  outputUrl?: string;
  outputName?: string;
}

interface Labels {
  exifFound: string;
  exifGps: string;
  exifClean: string;
  exifRemovedBadge: string;
  exifPreservedBadge: string;
  exifUnsupportedBadge: string;
  statusReady: string;
  statusProcessing: string;
  statusDone: string;
  statusError: string;
  downloadSingle: string;
  emptyState: string;
  processAll: string;
  largeBatchWarn: string;
  canvasLimitError: string;
  cancelledMsg: string;
  compareBtn: string;
  compareBefore: string;
  compareAfter: string;
}

export function initImageOptimizer(root: HTMLElement): void {
  const labels: Labels = JSON.parse(root.dataset.labels || '{}');
  const dropzone = root.querySelector<HTMLElement>('[data-dropzone]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-file-input]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-format]')!;
  const qualityInput = root.querySelector<HTMLInputElement>('[data-quality]')!;
  const qualityValue = root.querySelector<HTMLElement>('[data-quality-value]')!;
  const maxWidthSelect = root.querySelector<HTMLSelectElement>('[data-max-width]')!;
  const stripExifInput = root.querySelector<HTMLInputElement>('[data-strip-exif]')!;
  const processBtn = root.querySelector<HTMLButtonElement>('[data-process-all]')!;
  const cancelBtn = root.querySelector<HTMLButtonElement>('[data-cancel-all]')!;
  const zipBtn = root.querySelector<HTMLButtonElement>('[data-download-zip]')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-clear-all]')!;
  const bannerEl = root.querySelector<HTMLElement>('[data-batch-banner]')!;
  const listEl = root.querySelector<HTMLElement>('[data-file-list]')!;
  const statBefore = root.querySelector<HTMLElement>('[data-stat-before]')!;
  const statAfter = root.querySelector<HTMLElement>('[data-stat-after]')!;
  const statSaved = root.querySelector<HTMLElement>('[data-stat-saved]')!;
  const compareModal = root.querySelector<HTMLElement>('[data-compare-modal]');
  const compareClose = root.querySelector<HTMLButtonElement>('[data-compare-close]');
  const compareBeforeImg = root.querySelector<HTMLImageElement>('[data-compare-before-img]');
  const compareAfterImg = root.querySelector<HTMLImageElement>('[data-compare-after-img]');
  const compareAfterLayer = root.querySelector<HTMLElement>('[data-compare-after-layer]');
  const compareDivider = root.querySelector<HTMLElement>('[data-compare-divider]');
  const compareSlider = root.querySelector<HTMLInputElement>('[data-compare-slider]');
  const compareBeforeLabel = root.querySelector<HTMLElement>('[data-compare-before-label]');
  const compareAfterLabel = root.querySelector<HTMLElement>('[data-compare-after-label]');

  function openCompare(item: ImageItem): void {
    if (!compareModal || !item.outputUrl || !item.outputBlob) return;
    if (compareBeforeImg) compareBeforeImg.src = item.previewUrl;
    if (compareAfterImg) compareAfterImg.src = item.outputUrl;
    if (compareBeforeLabel) compareBeforeLabel.textContent = `${labels.compareBefore} (${formatBytes(item.file.size)})`;
    if (compareAfterLabel) compareAfterLabel.textContent = `${labels.compareAfter} (${formatBytes(item.outputBlob.size)})`;
    if (compareSlider) compareSlider.value = '50';
    if (compareAfterLayer) compareAfterLayer.style.clipPath = 'inset(0 0 0 50%)';
    if (compareDivider) compareDivider.style.left = '50%';
    compareModal.hidden = false;
  }

  compareSlider?.addEventListener('input', () => {
    const pct = `${compareSlider.value}%`;
    if (compareAfterLayer) compareAfterLayer.style.clipPath = `inset(0 0 0 ${pct})`;
    if (compareDivider) compareDivider.style.left = pct;
  });
  compareClose?.addEventListener('click', () => {
    if (compareModal) compareModal.hidden = true;
  });
  compareModal?.addEventListener('click', (e) => {
    if (e.target === compareModal) compareModal.hidden = true;
  });

  let items: ImageItem[] = [];
  let isProcessing = false;
  let cancelRequested = false;

  function setBanner(type: 'warn' | 'info' | 'error' | '', msg: string): void {
    bannerEl.className = 'status-banner';
    if (!msg) return;
    bannerEl.classList.add('show', type || 'info');
    bannerEl.textContent = msg;
  }

  cancelBtn.addEventListener('click', () => {
    cancelRequested = true;
    cancelBtn.disabled = true;
  });

  qualityInput.addEventListener('input', () => {
    qualityValue.textContent = `${qualityInput.value}%`;
  });

  bindDropzone(
    dropzone,
    fileInput,
    (files) => {
      void addFiles(files);
    },
    { pasteImages: true }
  );

  async function addFiles(files: File[]): Promise<void> {
    const valid = files.filter((f) => f.type.startsWith('image/'));
    for (const file of valid) {
      try {
        const { img, objectUrl } = await loadImageFromFile(file);
        let hasExif = false;
        let hasGps = false;
        let cameraLabel = '';

        try {
          let parsed = await exifr.parse(file, { gps: true }).catch(async () => {
            const bytes = new Uint8Array(await file.arrayBuffer());
            const webpExif = extractWebpExifPayload(bytes);
            return webpExif ? exifr.parse(webpExif, { gps: true }) : undefined;
          });
          if (parsed && Object.keys(parsed).length > 0) {
            hasExif = true;
            if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
              hasGps = true;
            }
            const makeModel = [parsed.Make, parsed.Model].filter(Boolean).join(' ').trim();
            if (makeModel) cameraLabel = makeModel;
          }
        } catch {
          // Non-EXIF image format
        }

        items.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: objectUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          hasExif,
          hasGps,
          cameraLabel,
          status: 'ready',
        });
      } catch {
        // Skip unreadable files
      }
    }
    render();
  }

  async function optimizeSingle(item: ImageItem): Promise<void> {
    item.status = 'processing';
    item.errorMsg = undefined;
    render();

    const canvas = document.createElement('canvas');
    try {
      const mime = formatSelect.value;
      const quality = Number(qualityInput.value) / 100;
      const maxWidth = Number(maxWidthSelect.value);

      const { img, objectUrl } = await loadImageFromFile(item.file);
      let targetW = img.naturalWidth;
      let targetH = img.naturalHeight;
      if (maxWidth > 0 && targetW > maxWidth) {
        const ratio = maxWidth / targetW;
        targetW = maxWidth;
        targetH = Math.round(targetH * ratio);
      }

      if (isCanvasTooLarge(targetW, targetH)) {
        URL.revokeObjectURL(objectUrl);
        item.status = 'error';
        item.errorMsg = labels.canvasLimitError;
        render();
        return;
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);
      URL.revokeObjectURL(objectUrl);

      let blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error(labels.canvasLimitError))),
          mime,
          mime === 'image/png' ? undefined : quality
        );
      });

      const shouldStripExif = stripExifInput.checked;
      let exifOutcome: 'removed' | 'preserved' | 'unsupported' | 'none' = item.hasExif
        ? shouldStripExif
          ? 'removed'
          : 'unsupported'
        : 'none';

      if (!shouldStripExif && (mime === 'image/jpeg' || mime === 'image/webp')) {
        const origBytes = new Uint8Array(await item.file.arrayBuffer());
        const tiffBytes = extractRawExifTiff(origBytes);
        if (tiffBytes) {
          const outBytes = new Uint8Array(await blob.arrayBuffer());
          if (mime === 'image/jpeg') {
            const withExif = injectJpegExifSegment(outBytes, wrapTiffAsJpegApp1(tiffBytes));
            blob = new Blob([new Uint8Array(withExif)], { type: 'image/jpeg' });
          } else {
            const withExif = injectWebpExifPayload(outBytes, tiffBytes, targetW, targetH);
            blob = new Blob([new Uint8Array(withExif)], { type: 'image/webp' });
          }
          exifOutcome = 'preserved';
        }
      }

      const ext = extensionFromMime(mime);
      if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
      item.outputBlob = blob;
      item.outputUrl = URL.createObjectURL(blob);
      item.outputName = `${stripExtension(item.file.name)}.${ext}`;
      item.exifOutcome = exifOutcome;
      item.status = 'done';
    } catch (err) {
      item.status = 'error';
      item.errorMsg = err instanceof Error ? err.message : labels.statusError;
    } finally {
      releaseCanvas(canvas);
    }
    render();
  }

  processBtn.addEventListener('click', async () => {
    if (isProcessing || items.length === 0) return;
    isProcessing = true;
    cancelRequested = false;
    processBtn.disabled = true;
    cancelBtn.disabled = false;

    for (let i = 0; i < items.length; i++) {
      if (cancelRequested) {
        setBanner('info', labels.cancelledMsg);
        break;
      }
      processBtn.textContent = `${labels.statusProcessing} (${i + 1}/${items.length})`;
      await optimizeSingle(items[i]);
    }

    isProcessing = false;
    processBtn.textContent = labels.processAll;
    cancelBtn.disabled = true;
    render();
  });

  zipBtn.addEventListener('click', async () => {
    const doneItems = items.filter((i) => i.status === 'done' && i.outputBlob && i.outputName);
    if (doneItems.length === 0) return;
    const zip = new JSZip();
    const usedNames = new Map<string, number>();

    for (const item of doneItems) {
      const base = item.outputName!;
      const count = usedNames.get(base) ?? 0;
      usedNames.set(base, count + 1);
      const finalName =
        count === 0 ? base : `${stripExtension(base)}_${count}.${base.split('.').pop()}`;
      zip.file(finalName, item.outputBlob!);
    }

    await generateAndDownloadZip(zipBtn, zip, `kitzero-optimized-${Date.now()}.zip`);
  });

  clearBtn.addEventListener('click', () => {
    for (const item of items) {
      URL.revokeObjectURL(item.previewUrl);
    }
    items = [];
    render();
  });

  function updateStats(): void {
    const totalBefore = items.reduce((sum, i) => sum + i.file.size, 0);
    const doneItems = items.filter((i) => i.status === 'done' && i.outputBlob);
    const totalAfter = doneItems.reduce((sum, i) => sum + (i.outputBlob?.size ?? 0), 0);
    const beforeOfDone = doneItems.reduce((sum, i) => sum + i.file.size, 0);

    statBefore.textContent = formatBytes(totalBefore);
    statAfter.textContent = doneItems.length > 0 ? formatBytes(totalAfter) : '-';
    if (doneItems.length > 0 && beforeOfDone > 0) {
      const diff = beforeOfDone - totalAfter;
      const pct = Math.round((diff / beforeOfDone) * 100);
      statSaved.textContent = `${diff >= 0 ? '-' : '+'}${formatBytes(Math.abs(diff))} (${pct}%)`;
    } else {
      statSaved.textContent = '-';
    }

    processBtn.disabled = isProcessing || items.length === 0;
    clearBtn.disabled = isProcessing || items.length === 0;
    zipBtn.disabled = isProcessing || doneItems.length === 0;

    if (!cancelRequested) {
      if (totalBefore > WARN_IMAGE_BYTES || items.length > WARN_IMAGE_COUNT) {
        setBanner('warn', labels.largeBatchWarn);
      } else {
        setBanner('', '');
      }
    }
  }

  function render(): void {
    updateStats();

    if (items.length === 0) {
      listEl.innerHTML = `<div class="card panel" style="text-align:center; color: var(--ink-muted); font-size:0.9rem;">${labels.emptyState}</div>`;
      return;
    }

    listEl.innerHTML = '';
    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'file-item';

      const img = document.createElement('img');
      img.className = 'file-thumb';
      img.src = item.previewUrl;
      img.alt = item.file.name;

      const meta = document.createElement('div');
      meta.className = 'file-meta';

      const nameEl = document.createElement('div');
      nameEl.className = 'file-name';
      nameEl.textContent = item.outputName ? `${item.file.name} → ${item.outputName}` : item.file.name;

      const subEl = document.createElement('div');
      subEl.className = 'file-sub';

      const sizeSpan = document.createElement('span');
      if (item.outputBlob) {
        const diff = item.file.size - item.outputBlob.size;
        const pct = Math.round((diff / item.file.size) * 100);
        sizeSpan.textContent = `${formatBytes(item.file.size)} → ${formatBytes(item.outputBlob.size)} (${pct >= 0 ? `-${pct}%` : `+${Math.abs(pct)}%`})`;
      } else {
        sizeSpan.textContent = `${formatBytes(item.file.size)} · ${item.width}×${item.height}`;
      }
      subEl.appendChild(sizeSpan);

      const exifPill = document.createElement('span');
      if (item.status === 'done') {
        if (item.exifOutcome === 'preserved') {
          exifPill.className = 'pill pill-warn';
          exifPill.textContent = labels.exifPreservedBadge;
        } else if (item.exifOutcome === 'removed') {
          exifPill.className = 'pill pill-trust';
          exifPill.textContent = labels.exifRemovedBadge;
        } else if (item.exifOutcome === 'unsupported') {
          exifPill.className = 'pill pill-neutral';
          exifPill.textContent = labels.exifUnsupportedBadge;
        } else {
          exifPill.className = 'pill pill-neutral';
          exifPill.textContent = labels.exifClean;
        }
      } else if (item.hasGps) {
        exifPill.className = 'pill pill-warn';
        exifPill.textContent = item.cameraLabel
          ? `${labels.exifGps} · ${item.cameraLabel}`
          : labels.exifGps;
      } else if (item.hasExif) {
        exifPill.className = 'pill pill-warn';
        exifPill.textContent = item.cameraLabel
          ? `${labels.exifFound} · ${item.cameraLabel}`
          : labels.exifFound;
      } else {
        exifPill.className = 'pill pill-neutral';
        exifPill.textContent = labels.exifClean;
      }
      subEl.appendChild(exifPill);

      meta.append(nameEl, subEl);

      const actions = document.createElement('div');
      actions.className = 'file-actions';

      if (item.status === 'done' && item.outputBlob && item.outputName) {
        const cmpBtn = document.createElement('button');
        cmpBtn.type = 'button';
        cmpBtn.className = 'btn btn-secondary btn-sm';
        cmpBtn.textContent = labels.compareBtn;
        cmpBtn.addEventListener('click', () => openCompare(item));
        actions.appendChild(cmpBtn);

        const dlBtn = document.createElement('button');
        dlBtn.type = 'button';
        dlBtn.className = 'btn btn-trust btn-sm';
        dlBtn.textContent = labels.downloadSingle;
        dlBtn.addEventListener('click', () => triggerDownload(item.outputBlob!, item.outputName!));
        actions.appendChild(dlBtn);
      } else {
        const statusPill = document.createElement('span');
        statusPill.className = item.status === 'error' ? 'pill pill-warn' : 'pill pill-neutral';
        statusPill.textContent =
          item.status === 'processing'
            ? labels.statusProcessing
            : item.status === 'error'
              ? item.errorMsg || labels.statusError
              : labels.statusReady;
        actions.appendChild(statusPill);
      }

      const rmBtn = document.createElement('button');
      rmBtn.type = 'button';
      rmBtn.className = 'btn-remove';
      const rmLabel = document.documentElement.lang === 'en' ? 'Remove file' : '파일 삭제';
      rmBtn.title = rmLabel;
      rmBtn.setAttribute('aria-label', `${item.file.name} ${rmLabel}`);
      rmBtn.disabled = isProcessing;
      rmBtn.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      rmBtn.addEventListener('click', () => {
        if (isProcessing) return;
        URL.revokeObjectURL(item.previewUrl);
        items = items.filter((x) => x.id !== item.id);
        render();
      });
      actions.appendChild(rmBtn);

      row.append(img, meta, actions);
      listEl.appendChild(row);
    }
  }

  render();
}
