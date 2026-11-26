import JSZip from 'jszip';
import {
  bindDropzone,
  extensionFromMime,
  formatBytes,
  generateAndDownloadZip,
  loadImageFromFile,
  releaseCanvas,
  stripExtension,
  triggerDownload,
} from './utils';

interface HeicItem {
  id: string;
  file: File;
  status: 'ready' | 'processing' | 'done' | 'error';
  outputBlob?: Blob;
  outputUrl?: string;
  outputName?: string;
}

interface Labels {
  statusReady: string;
  statusProcessing: string;
  statusDone: string;
  statusError: string;
  downloadSingle: string;
  convertBtn: string;
}

export function initHeicConverter(root: HTMLElement): void {
  const labels: Labels = JSON.parse(root.dataset.labels || '{}');
  const dropzone = root.querySelector<HTMLElement>('[data-heic-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-heic-input]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-heic-format]')!;
  const qualityInput = root.querySelector<HTMLInputElement>('[data-heic-quality]')!;
  const qualityVal = root.querySelector<HTMLElement>('[data-heic-quality-val]')!;
  const convertBtn = root.querySelector<HTMLButtonElement>('[data-heic-run]')!;
  const cancelBtn = root.querySelector<HTMLButtonElement>('[data-heic-cancel]')!;
  const zipBtn = root.querySelector<HTMLButtonElement>('[data-heic-zip]')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-heic-clear]')!;
  const listEl = root.querySelector<HTMLElement>('[data-heic-list]')!;

  let items: HeicItem[] = [];
  let isProcessing = false;
  let cancelRequested = false;

  qualityInput.addEventListener('input', () => {
    qualityVal.textContent = `${qualityInput.value}%`;
  });

  cancelBtn.addEventListener('click', () => {
    cancelRequested = true;
    cancelBtn.disabled = true;
  });

  bindDropzone(dropzone, fileInput, (files) => addFiles(files));

  function addFiles(files: File[]): void {
    const valid = files.filter((f) => /\.(heic|heif)$/i.test(f.name) || f.type.includes('heic') || f.type.includes('heif'));
    for (const file of valid) {
      items.push({ id: crypto.randomUUID(), file, status: 'ready' });
    }
    render();
  }

  async function convertOne(item: HeicItem): Promise<void> {
    item.status = 'processing';
    render();
    try {
      const { default: heic2any } = await import('heic2any');
      const mime = formatSelect.value;
      const quality = Number(qualityInput.value) / 100;

      const raw = await heic2any({
        blob: item.file,
        toType: mime === 'image/png' ? 'image/png' : 'image/jpeg',
        quality,
      });
      let outBlob = Array.isArray(raw) ? raw[0] : raw;

      // If WebP requested, re-encode decoded JPEG blob through Canvas
      if (mime === 'image/webp') {
        const tempFile = new File([outBlob], 'temp.jpg', { type: 'image/jpeg' });
        const { img, objectUrl } = await loadImageFromFile(tempFile);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        URL.revokeObjectURL(objectUrl);
        outBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('WebP encode failed'))), 'image/webp', quality);
        });
        releaseCanvas(canvas);
      }

      if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
      item.outputBlob = outBlob;
      item.outputUrl = URL.createObjectURL(outBlob);
      item.outputName = `${stripExtension(item.file.name)}.${extensionFromMime(mime)}`;
      item.status = 'done';
    } catch {
      item.status = 'error';
    }
    render();
  }

  convertBtn.addEventListener('click', async () => {
    if (isProcessing || items.length === 0) return;
    isProcessing = true;
    cancelRequested = false;
    convertBtn.disabled = true;
    cancelBtn.disabled = false;

    for (let i = 0; i < items.length; i++) {
      if (cancelRequested) break;
      convertBtn.textContent = `${labels.statusProcessing} (${i + 1}/${items.length})`;
      await convertOne(items[i]);
    }

    isProcessing = false;
    convertBtn.textContent = labels.convertBtn;
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
    await generateAndDownloadZip(zipBtn, zip, `kitzero-heic-${Date.now()}.zip`);
  });

  clearBtn.addEventListener('click', () => {
    items.forEach((i) => {
      if (i.outputUrl) URL.revokeObjectURL(i.outputUrl);
    });
    items = [];
    render();
  });

  function render(): void {
    const doneCount = items.filter((i) => i.status === 'done').length;
    convertBtn.disabled = isProcessing || items.length === 0;
    clearBtn.disabled = isProcessing || items.length === 0;
    zipBtn.disabled = isProcessing || doneCount === 0;
    listEl.innerHTML = '';

    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'file-item';

      if (item.outputUrl) {
        const img = document.createElement('img');
        img.className = 'file-thumb';
        img.src = item.outputUrl;
        img.alt = item.file.name;
        row.appendChild(img);
      }

      const meta = document.createElement('div');
      meta.className = 'file-meta';
      const name = document.createElement('div');
      name.className = 'file-name';
      name.textContent = item.outputName ? `${item.file.name} → ${item.outputName}` : item.file.name;
      const sub = document.createElement('div');
      sub.className = 'file-sub';
      sub.textContent = item.outputBlob
        ? `${formatBytes(item.file.size)} → ${formatBytes(item.outputBlob.size)}`
        : formatBytes(item.file.size);
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
        const pill = document.createElement('span');
        pill.className = item.status === 'error' ? 'pill pill-warn' : 'pill pill-neutral';
        pill.textContent =
          item.status === 'processing'
            ? labels.statusProcessing
            : item.status === 'error'
              ? labels.statusError
              : labels.statusReady;
        actions.appendChild(pill);
      }

      const rmBtn = document.createElement('button');
      rmBtn.type = 'button';
      rmBtn.className = 'btn-remove';
      rmBtn.disabled = isProcessing;
      rmBtn.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      rmBtn.addEventListener('click', () => {
        if (isProcessing) return;
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
        items = items.filter((x) => x.id !== item.id);
        render();
      });
      actions.appendChild(rmBtn);

      row.append(meta, actions);
      listEl.appendChild(row);
    }
  }

  render();
}
