import JSZip from 'jszip';
import {
  bindClipboardImagePaste,
  bindDropzoneKeyboard,
  extensionFromMime,
  formatBytes,
  generateAndDownloadZip,
  loadImageFromFile,
  releaseCanvas,
  stripExtension,
  triggerDownload,
} from './utils';

interface WmItem {
  id: string;
  file: File;
  previewUrl: string;
  outputBlob?: Blob;
  outputUrl?: string;
  outputName?: string;
}

export function initWatermark(root: HTMLElement): void {
  const downloadLabel = root.dataset.downloadLabel || 'Download';
  const dropzone = root.querySelector<HTMLElement>('[data-wm-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-wm-input]')!;
  const typeSelect = root.querySelector<HTMLSelectElement>('[data-wm-type]')!;
  const textField = root.querySelector<HTMLElement>('[data-wm-text-field]')!;
  const logoField = root.querySelector<HTMLElement>('[data-wm-logo-field]')!;
  const textInput = root.querySelector<HTMLInputElement>('[data-wm-text]')!;
  const logoInput = root.querySelector<HTMLInputElement>('[data-wm-logo-input]')!;
  const logoNameEl = root.querySelector<HTMLElement>('[data-wm-logo-name]');
  const posSelect = root.querySelector<HTMLSelectElement>('[data-wm-pos]')!;
  const sizeInput = root.querySelector<HTMLInputElement>('[data-wm-size]')!;
  const sizeVal = root.querySelector<HTMLElement>('[data-wm-size-val]')!;
  const opacityInput = root.querySelector<HTMLInputElement>('[data-wm-opacity]')!;
  const opacityVal = root.querySelector<HTMLElement>('[data-wm-opacity-val]')!;
  const colorInput = root.querySelector<HTMLInputElement>('[data-wm-color]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-wm-format]')!;
  const applyBtn = root.querySelector<HTMLButtonElement>('[data-wm-apply]')!;
  const zipBtn = root.querySelector<HTMLButtonElement>('[data-wm-zip]')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-wm-clear]')!;
  const previewWrap = root.querySelector<HTMLElement>('[data-wm-preview-wrap]')!;
  const previewCanvas = root.querySelector<HTMLCanvasElement>('[data-wm-preview]')!;
  const listEl = root.querySelector<HTMLElement>('[data-wm-list]')!;

  let items: WmItem[] = [];
  let logoImg: HTMLImageElement | null = null;

  typeSelect.addEventListener('change', () => {
    const isLogo = typeSelect.value === 'logo';
    textField.hidden = isLogo;
    logoField.hidden = !isLogo;
    void renderPreview();
  });

  logoInput.addEventListener('change', async () => {
    const file = logoInput.files?.[0];
    if (!file) return;
    const { img, objectUrl } = await loadImageFromFile(file);
    logoImg = img;
    if (logoNameEl) logoNameEl.textContent = file.name;
    URL.revokeObjectURL(objectUrl);
    void renderPreview();
  });

  [textInput, posSelect, colorInput].forEach((el) => {
    el.addEventListener('input', () => void renderPreview());
  });
  sizeInput.addEventListener('input', () => {
    sizeVal.textContent = `${sizeInput.value}%`;
    void renderPreview();
  });
  opacityInput.addEventListener('input', () => {
    opacityVal.textContent = `${opacityInput.value}%`;
    void renderPreview();
  });

  dropzone.addEventListener('click', (e) => {
    if (e.target === fileInput) return;
    fileInput.click();
  });
  bindDropzoneKeyboard(dropzone, fileInput);
  bindClipboardImagePaste((files) => {
    addFiles(files);
  });
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer?.files) addFiles(Array.from(e.dataTransfer.files));
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files) {
      addFiles(Array.from(fileInput.files));
      fileInput.value = '';
    }
  });

  function addFiles(files: File[]): void {
    const valid = files.filter((f) => f.type.startsWith('image/'));
    for (const file of valid) {
      items.push({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) });
    }
    renderList();
    void renderPreview();
  }

  function drawWatermarked(canvas: HTMLCanvasElement, img: HTMLImageElement): void {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, w, h);

    const alpha = (Number(opacityInput.value) || 45) / 100;
    const sizePct = (Number(sizeInput.value) || 5) / 100;
    const pos = posSelect.value;
    const margin = Math.max(16, Math.round(Math.min(w, h) * 0.04));

    ctx.save();
    ctx.globalAlpha = alpha;

    if (typeSelect.value === 'logo' && logoImg) {
      const targetW = Math.max(24, Math.round(w * sizePct * 3));
      const targetH = Math.round((logoImg.naturalHeight / logoImg.naturalWidth) * targetW);

      if (pos === 'tile') {
        ctx.translate(w / 2, h / 2);
        ctx.rotate(-Math.PI / 6);
        const stepX = targetW + Math.max(80, targetW * 0.9);
        const stepY = targetH + Math.max(80, targetH * 1.4);
        for (let y = -h; y < h; y += stepY) {
          for (let x = -w; x < w; x += stepX) {
            ctx.drawImage(logoImg, x, y, targetW, targetH);
          }
        }
      } else {
        let x = w - targetW - margin;
        let y = h - targetH - margin;
        if (pos === 'bottom-left') { x = margin; y = h - targetH - margin; }
        else if (pos === 'top-right') { x = w - targetW - margin; y = margin; }
        else if (pos === 'top-left') { x = margin; y = margin; }
        else if (pos === 'center') { x = (w - targetW) / 2; y = (h - targetH) / 2; }
        ctx.drawImage(logoImg, x, y, targetW, targetH);
      }
    } else {
      const text = textInput.value.trim() || '© KitZero';
      const fontSize = Math.max(14, Math.round(Math.min(w, h) * sizePct));
      ctx.font = `700 ${fontSize}px Inter, Pretendard, sans-serif`;
      ctx.fillStyle = colorInput.value || '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = Math.max(2, fontSize * 0.12);
      ctx.textBaseline = 'middle';

      if (pos === 'tile') {
        const tw = ctx.measureText(text).width;
        ctx.translate(w / 2, h / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.textAlign = 'center';
        const stepX = tw + Math.max(90, fontSize * 2.5);
        const stepY = Math.max(90, fontSize * 3.5);
        for (let y = -h; y < h; y += stepY) {
          for (let x = -w; x < w; x += stepX) {
            ctx.fillText(text, x, y);
          }
        }
      } else {
        let x = w - margin;
        let y = h - margin - fontSize / 2;
        ctx.textAlign = 'right';
        if (pos === 'bottom-left') { x = margin; ctx.textAlign = 'left'; }
        else if (pos === 'top-right') { y = margin + fontSize / 2; }
        else if (pos === 'top-left') { x = margin; y = margin + fontSize / 2; ctx.textAlign = 'left'; }
        else if (pos === 'center') { x = w / 2; y = h / 2; ctx.textAlign = 'center'; }
        ctx.fillText(text, x, y);
      }
    }

    ctx.restore();
  }

  async function renderPreview(): Promise<void> {
    if (items.length === 0) {
      previewWrap.hidden = true;
      return;
    }
    const { img, objectUrl } = await loadImageFromFile(items[0].file);
    previewWrap.hidden = false;
    drawWatermarked(previewCanvas, img);
    URL.revokeObjectURL(objectUrl);
  }

  applyBtn.addEventListener('click', async () => {
    if (items.length === 0) return;
    applyBtn.disabled = true;
    const mime = formatSelect.value;
    const ext = extensionFromMime(mime);
    const canvas = document.createElement('canvas');

    for (const item of items) {
      const { img, objectUrl } = await loadImageFromFile(item.file);
      drawWatermarked(canvas, img);
      URL.revokeObjectURL(objectUrl);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Watermark failed'))), mime, mime === 'image/png' ? undefined : 0.9);
      });
      if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
      item.outputBlob = blob;
      item.outputUrl = URL.createObjectURL(blob);
      item.outputName = `${stripExtension(item.file.name)}_wm.${ext}`;
    }

    releaseCanvas(canvas);
    applyBtn.disabled = false;
    renderList();
  });

  zipBtn.addEventListener('click', async () => {
    const done = items.filter((i) => i.outputBlob && i.outputName);
    if (done.length === 0) return;
    const zip = new JSZip();
    for (const item of done) {
      zip.file(item.outputName!, item.outputBlob!);
    }
    await generateAndDownloadZip(zipBtn, zip, `kitzero-watermarked-${Date.now()}.zip`);
  });

  clearBtn.addEventListener('click', () => {
    items.forEach((i) => {
      URL.revokeObjectURL(i.previewUrl);
      if (i.outputUrl) URL.revokeObjectURL(i.outputUrl);
    });
    items = [];
    previewWrap.hidden = true;
    renderList();
  });

  function renderList(): void {
    const doneCount = items.filter((i) => i.outputBlob).length;
    applyBtn.disabled = items.length === 0;
    clearBtn.disabled = items.length === 0;
    zipBtn.disabled = doneCount === 0;
    listEl.innerHTML = '';

    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'file-item';
      const thumb = document.createElement('img');
      thumb.className = 'file-thumb';
      thumb.src = item.outputUrl || item.previewUrl;
      thumb.alt = item.file.name;

      const meta = document.createElement('div');
      meta.className = 'file-meta';
      const name = document.createElement('div');
      name.className = 'file-name';
      name.textContent = item.outputName || item.file.name;
      const sub = document.createElement('div');
      sub.className = 'file-sub';
      sub.textContent = item.outputBlob ? formatBytes(item.outputBlob.size) : formatBytes(item.file.size);
      meta.append(name, sub);

      const actions = document.createElement('div');
      actions.className = 'file-actions';
      if (item.outputBlob && item.outputName) {
        const dlBtn = document.createElement('button');
        dlBtn.type = 'button';
        dlBtn.className = 'btn btn-trust btn-sm';
        dlBtn.textContent = downloadLabel;
        dlBtn.addEventListener('click', () => triggerDownload(item.outputBlob!, item.outputName!));
        actions.appendChild(dlBtn);
      }

      const rmBtn = document.createElement('button');
      rmBtn.type = 'button';
      rmBtn.className = 'btn-remove';
      rmBtn.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      rmBtn.addEventListener('click', () => {
        URL.revokeObjectURL(item.previewUrl);
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
        items = items.filter((x) => x.id !== item.id);
        renderList();
        void renderPreview();
      });
      actions.appendChild(rmBtn);

      row.append(thumb, meta, actions);
      listEl.appendChild(row);
    }
  }

  renderList();
}
