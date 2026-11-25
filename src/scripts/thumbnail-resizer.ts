import JSZip from 'jszip';
import {
  bindDropzoneKeyboard,
  extensionFromMime,
  formatBytes,
  generateAndDownloadZip,
  loadImageFromFile,
  releaseCanvas,
  stripExtension,
  triggerDownload,
  WARN_IMAGE_BYTES,
  WARN_IMAGE_COUNT,
} from './utils';

interface ResizeItem {
  id: string;
  file: File;
  previewUrl: string;
  origWidth: number;
  origHeight: number;
  status: 'ready' | 'done';
  outputBlob?: Blob;
  outputUrl?: string;
  outputName?: string;
  targetWidth?: number;
  targetHeight?: number;
}

interface Labels {
  downloadSingle: string;
  statusReady: string;
  statusDone: string;
  processAll: string;
  largeBatchWarn: string;
}

export function initThumbnailResizer(root: HTMLElement): void {
  const labels: Labels = JSON.parse(root.dataset.labels || '{}');
  const dropzone = root.querySelector<HTMLElement>('[data-dropzone]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-file-input]')!;
  const presetBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-preset-btn]'));
  const widthInput = root.querySelector<HTMLInputElement>('[data-width]')!;
  const heightInput = root.querySelector<HTMLInputElement>('[data-height]')!;
  const fitSelect = root.querySelector<HTMLSelectElement>('[data-fit]')!;
  const bgInput = root.querySelector<HTMLInputElement>('[data-bg]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-format]')!;
  const qualityInput = root.querySelector<HTMLInputElement>('[data-quality]')!;
  const qualityValue = root.querySelector<HTMLElement>('[data-quality-value]')!;
  const processBtn = root.querySelector<HTMLButtonElement>('[data-process-all]')!;
  const cancelBtn = root.querySelector<HTMLButtonElement>('[data-cancel-all]')!;
  const zipBtn = root.querySelector<HTMLButtonElement>('[data-download-zip]')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-clear-all]')!;
  const bannerEl = root.querySelector<HTMLElement>('[data-batch-banner]')!;
  const listEl = root.querySelector<HTMLElement>('[data-file-list]')!;

  let items: ResizeItem[] = [];
  let isProcessing = false;
  let cancelRequested = false;

  cancelBtn.addEventListener('click', () => {
    cancelRequested = true;
    cancelBtn.disabled = true;
  });

  qualityInput.addEventListener('input', () => {
    qualityValue.textContent = `${qualityInput.value}%`;
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      widthInput.value = btn.dataset.w || '1280';
      heightInput.value = btn.dataset.h || '720';
    });
  });

  [widthInput, heightInput].forEach((input) => {
    input.addEventListener('input', () => {
      presetBtns.forEach((b) => b.classList.remove('active'));
    });
  });

  dropzone.addEventListener('click', (e) => {
    if (e.target === fileInput) return;
    fileInput.click();
  });
  bindDropzoneKeyboard(dropzone, fileInput);
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer?.files) {
      void addFiles(Array.from(e.dataTransfer.files));
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files) {
      void addFiles(Array.from(fileInput.files));
      fileInput.value = '';
    }
  });

  async function addFiles(files: File[]): Promise<void> {
    const valid = files.filter((f) => f.type.startsWith('image/'));
    for (const file of valid) {
      try {
        const { img, objectUrl } = await loadImageFromFile(file);
        items.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: objectUrl,
          origWidth: img.naturalWidth,
          origHeight: img.naturalHeight,
          status: 'ready',
        });
      } catch {
        // Ignore broken image
      }
    }
    render();
  }

  async function resizeItem(item: ResizeItem): Promise<void> {
    const targetW = Math.max(16, Math.min(8000, Number(widthInput.value) || 1280));
    const targetH = Math.max(16, Math.min(8000, Number(heightInput.value) || 720));
    const fit = fitSelect.value;
    const bg = bgInput.value || '#FFFFFF';
    const mime = formatSelect.value;
    const quality = Number(qualityInput.value) / 100;

    const { img, objectUrl } = await loadImageFromFile(item.file);
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      return;
    }

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, targetW, targetH);

    const srcRatio = img.naturalWidth / img.naturalHeight;
    const dstRatio = targetW / targetH;

    if (fit === 'fill') {
      ctx.drawImage(img, 0, 0, targetW, targetH);
    } else if (fit === 'contain') {
      let drawW = targetW;
      let drawH = targetH;
      if (srcRatio > dstRatio) {
        drawH = targetW / srcRatio;
      } else {
        drawW = targetH * srcRatio;
      }
      const dx = (targetW - drawW) / 2;
      const dy = (targetH - drawH) / 2;
      ctx.drawImage(img, dx, dy, drawW, drawH);
    } else {
      // cover: smart center crop
      let sx = 0;
      let sy = 0;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (srcRatio > dstRatio) {
        sw = img.naturalHeight * dstRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / dstRatio;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
    }

    URL.revokeObjectURL(objectUrl);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Resize failed'))),
        mime,
        mime === 'image/png' ? undefined : quality
      );
    });
    releaseCanvas(canvas);

    if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
    item.outputBlob = blob;
    item.outputUrl = URL.createObjectURL(blob);
    item.outputName = `${stripExtension(item.file.name)}_${targetW}x${targetH}.${extensionFromMime(mime)}`;
    item.targetWidth = targetW;
    item.targetHeight = targetH;
    item.status = 'done';
  }

  processBtn.addEventListener('click', async () => {
    if (isProcessing || items.length === 0) return;
    isProcessing = true;
    cancelRequested = false;
    processBtn.disabled = true;
    cancelBtn.disabled = false;

    for (let i = 0; i < items.length; i++) {
      if (cancelRequested) break;
      processBtn.textContent = `${labels.processAll} (${i + 1}/${items.length})`;
      await resizeItem(items[i]);
    }

    isProcessing = false;
    processBtn.textContent = labels.processAll;
    cancelBtn.disabled = true;
    render();
  });

  zipBtn.addEventListener('click', async () => {
    const done = items.filter((i) => i.status === 'done' && i.outputBlob && i.outputName);
    if (done.length === 0) return;
    const zip = new JSZip();
    for (const item of done) {
      zip.file(item.outputName!, item.outputBlob!);
    }
    await generateAndDownloadZip(zipBtn, zip, `kitzero-thumbnails-${Date.now()}.zip`);
  });

  clearBtn.addEventListener('click', () => {
    for (const item of items) {
      URL.revokeObjectURL(item.previewUrl);
      if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
    }
    items = [];
    render();
  });

  function render(): void {
    const doneCount = items.filter((i) => i.status === 'done').length;
    const totalBytes = items.reduce((sum, i) => sum + i.file.size, 0);
    processBtn.disabled = isProcessing || items.length === 0;
    clearBtn.disabled = isProcessing || items.length === 0;
    zipBtn.disabled = isProcessing || doneCount === 0;

    if (totalBytes > WARN_IMAGE_BYTES || items.length > WARN_IMAGE_COUNT) {
      bannerEl.className = 'status-banner show warn';
      bannerEl.textContent = labels.largeBatchWarn;
    } else {
      bannerEl.className = 'status-banner';
      bannerEl.textContent = '';
    }

    listEl.innerHTML = '';
    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'file-item';

      const img = document.createElement('img');
      img.className = 'file-thumb';
      img.src = item.outputUrl || item.previewUrl;
      img.alt = item.file.name;

      const meta = document.createElement('div');
      meta.className = 'file-meta';

      const name = document.createElement('div');
      name.className = 'file-name';
      name.textContent = item.outputName || item.file.name;

      const sub = document.createElement('div');
      sub.className = 'file-sub';
      sub.textContent =
        item.status === 'done' && item.outputBlob
          ? `${item.origWidth}×${item.origHeight} → ${item.targetWidth}×${item.targetHeight} · ${formatBytes(item.outputBlob.size)}`
          : `${item.origWidth}×${item.origHeight} · ${formatBytes(item.file.size)}`;

      meta.append(name, sub);

      const actions = document.createElement('div');
      actions.className = 'file-actions';

      if (item.status === 'done' && item.outputBlob && item.outputName) {
        const dlBtn = document.createElement('button');
        dlBtn.type = 'button';
        dlBtn.className = 'btn btn-trust btn-sm';
        dlBtn.textContent = labels.downloadSingle;
        dlBtn.addEventListener('click', () => triggerDownload(item.outputBlob!, item.outputName!));
        actions.appendChild(dlBtn);
      } else {
        const badge = document.createElement('span');
        badge.className = 'pill pill-neutral';
        badge.textContent = labels.statusReady;
        actions.appendChild(badge);
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
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
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
