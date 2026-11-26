export const MAX_CANVAS_DIM = 16384;
export const MAX_CANVAS_PIXELS = 100_000_000; // 100MP safe cross-browser ceiling
export const WARN_IMAGE_BYTES = 100 * 1024 * 1024; // 100 MB
export const WARN_IMAGE_COUNT = 30;
export const WARN_PDF_BYTES = 50 * 1024 * 1024; // 50 MB
export const WARN_PDF_IMAGE_PAGES = 30;

export function releaseCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = 0;
  canvas.height = 0;
}

export function isCanvasTooLarge(width: number, height: number): boolean {
  return width > MAX_CANVAS_DIM || height > MAX_CANVAS_DIM || width * height > MAX_CANVAS_PIXELS;
}

export function extractJpegExifSegment(bytes: Uint8Array): Uint8Array | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const segLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (segLength < 2 || offset + 2 + segLength > bytes.length) break;
    if (
      marker === 0xe1 &&
      segLength >= 8 &&
      bytes[offset + 4] === 0x45 &&
      bytes[offset + 5] === 0x78 &&
      bytes[offset + 6] === 0x69 &&
      bytes[offset + 7] === 0x66 &&
      bytes[offset + 8] === 0x00 &&
      bytes[offset + 9] === 0x00
    ) {
      return bytes.slice(offset, offset + 2 + segLength);
    }
    offset += 2 + segLength;
  }
  return null;
}

export function injectJpegExifSegment(jpegBytes: Uint8Array, exifSegment: Uint8Array): Uint8Array {
  if (jpegBytes.length < 2 || jpegBytes[0] !== 0xff || jpegBytes[1] !== 0xd8) {
    return jpegBytes;
  }
  const out = new Uint8Array(jpegBytes.length + exifSegment.length);
  out.set(jpegBytes.subarray(0, 2), 0);
  out.set(exifSegment, 2);
  out.set(jpegBytes.subarray(2), 2 + exifSegment.length);
  return out;
}

export function extractWebpExifPayload(bytes: Uint8Array): Uint8Array | null {
  if (
    bytes.length < 12 ||
    bytes[0] !== 0x52 ||
    bytes[1] !== 0x49 ||
    bytes[2] !== 0x46 ||
    bytes[3] !== 0x46 ||
    bytes[8] !== 0x57 ||
    bytes[9] !== 0x45 ||
    bytes[10] !== 0x42 ||
    bytes[11] !== 0x50
  ) {
    return null;
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const fourcc = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
    const size = view.getUint32(offset + 4, true);
    const dataStart = offset + 8;
    if (dataStart + size > bytes.length) break;
    if (fourcc === 'EXIF') {
      return bytes.slice(dataStart, dataStart + size);
    }
    offset = dataStart + size + (size % 2);
  }
  return null;
}

export function extractRawExifTiff(bytes: Uint8Array): Uint8Array | null {
  const jpegSeg = extractJpegExifSegment(bytes);
  if (jpegSeg && jpegSeg.length > 10) {
    return jpegSeg.slice(10); // strip FF E1 [len2] "Exif\0\0"
  }
  return extractWebpExifPayload(bytes);
}

export function wrapTiffAsJpegApp1(tiffBytes: Uint8Array): Uint8Array {
  const segLen = 2 + 6 + tiffBytes.length;
  const out = new Uint8Array(2 + segLen);
  out[0] = 0xff;
  out[1] = 0xe1;
  out[2] = (segLen >> 8) & 0xff;
  out[3] = segLen & 0xff;
  out.set([0x45, 0x78, 0x69, 0x66, 0x00, 0x00], 4);
  out.set(tiffBytes, 10);
  return out;
}

export function injectWebpExifPayload(
  webpBytes: Uint8Array,
  tiffBytes: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  if (
    webpBytes.length < 20 ||
    webpBytes[0] !== 0x52 ||
    webpBytes[1] !== 0x49 ||
    webpBytes[2] !== 0x46 ||
    webpBytes[3] !== 0x46 ||
    webpBytes[8] !== 0x57 ||
    webpBytes[9] !== 0x45 ||
    webpBytes[10] !== 0x42 ||
    webpBytes[11] !== 0x50
  ) {
    return webpBytes;
  }

  const exifPad = tiffBytes.length % 2;
  const exifChunk = new Uint8Array(8 + tiffBytes.length + exifPad);
  exifChunk.set([0x45, 0x58, 0x49, 0x46], 0); // "EXIF"
  new DataView(exifChunk.buffer).setUint32(4, tiffBytes.length, true);
  exifChunk.set(tiffBytes, 8);

  const firstFourcc = String.fromCharCode(
    webpBytes[12],
    webpBytes[13],
    webpBytes[14],
    webpBytes[15]
  );

  let body: Uint8Array;
  if (firstFourcc === 'VP8X') {
    const existing = webpBytes.slice(12);
    existing[8] |= 0x08; // set EXIF flag
    body = new Uint8Array(existing.length + exifChunk.length);
    body.set(existing, 0);
    body.set(exifChunk, existing.length);
  } else {
    const vp8x = new Uint8Array(18);
    vp8x.set([0x56, 0x50, 0x38, 0x58], 0); // "VP8X"
    new DataView(vp8x.buffer).setUint32(4, 10, true);
    const hasAlpha = firstFourcc === 'VP8L';
    vp8x[8] = 0x08 | (hasAlpha ? 0x10 : 0x00);
    const w = Math.max(1, width) - 1;
    const h = Math.max(1, height) - 1;
    vp8x[12] = w & 0xff;
    vp8x[13] = (w >> 8) & 0xff;
    vp8x[14] = (w >> 16) & 0xff;
    vp8x[15] = h & 0xff;
    vp8x[16] = (h >> 8) & 0xff;
    vp8x[17] = (h >> 16) & 0xff;

    const rest = webpBytes.subarray(12);
    body = new Uint8Array(vp8x.length + rest.length + exifChunk.length);
    body.set(vp8x, 0);
    body.set(rest, vp8x.length);
    body.set(exifChunk, vp8x.length + rest.length);
  }

  const out = new Uint8Array(12 + body.length);
  out.set([0x52, 0x49, 0x46, 0x46], 0); // "RIFF"
  new DataView(out.buffer).setUint32(4, 4 + body.length, true);
  out.set([0x57, 0x45, 0x42, 0x50], 8); // "WEBP"
  out.set(body, 12);
  return out;
}

export function bindDropzoneKeyboard(dropzone: HTMLElement, fileInput: HTMLInputElement): void {
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value >= 100 ? value.toFixed(0) : value.toFixed(1)} ${sizes[i]}`;
}

export function stripExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx > 0 ? filename.slice(0, idx) : filename;
}

export function extensionFromMime(mime: string): string {
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/png') return 'png';
  return 'jpg';
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const activeZipButtons = new WeakSet<HTMLButtonElement>();

export async function generateAndDownloadZip(
  button: HTMLButtonElement,
  zip: import('jszip'),
  filename: string
): Promise<void> {
  if (activeZipButtons.has(button)) return;
  activeZipButtons.add(button);

  const originalHtml = button.innerHTML;
  const isEn = document.documentElement.lang === 'en';
  const label = isEn ? 'Creating ZIP...' : 'ZIP 압축 중...';

  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.classList.add('is-loading');
  button.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span><span>${label} 0%</span>`;

  try {
    const blob = await zip.generateAsync(
      { type: 'blob', compression: 'STORE' },
      (meta) => {
        const pct = Math.round(meta.percent);
        const textEl = button.querySelector('span:last-child');
        if (textEl) textEl.textContent = `${label} ${pct}%`;
      }
    );
    triggerDownload(blob, filename);
  } finally {
    button.innerHTML = originalHtml;
    button.classList.remove('is-loading');
    button.removeAttribute('aria-busy');
    button.disabled = false;
    activeZipButtons.delete(button);
  }
}

export function loadImageFromFile(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, objectUrl });
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

export function parsePageRanges(input: string, maxPages: number): number[] {
  const result = new Set<number>();
  const parts = input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 0) return [];

  for (const part of parts) {
    if (part.includes('-')) {
      const [startRaw, endRaw] = part.split('-').map((s) => Number.parseInt(s.trim(), 10));
      if (!Number.isInteger(startRaw) || !Number.isInteger(endRaw)) return [];
      const start = Math.min(startRaw, endRaw);
      const end = Math.max(startRaw, endRaw);
      if (start < 1 || end > maxPages) return [];
      for (let p = start; p <= end; p++) {
        result.add(p - 1);
      }
    } else {
      const page = Number.parseInt(part, 10);
      if (!Number.isInteger(page) || page < 1 || page > maxPages) return [];
      result.add(page - 1);
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

export function bindClipboardImagePaste(
  onFiles: (files: File[]) => void,
  isActive?: () => boolean
): void {
  window.addEventListener('paste', (e: ClipboardEvent) => {
    if (isActive && !isActive()) return;
    const items = Array.from(e.clipboardData?.items ?? []);
    const imageItems = items.filter((item) => item.kind === 'file' && item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    const files: File[] = [];
    const stamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    let idx = 0;

    for (const item of imageItems) {
      const raw = item.getAsFile();
      if (!raw) continue;
      idx += 1;
      const mime = raw.type || 'image/png';
      const ext = extensionFromMime(mime);
      const name =
        raw.name && raw.name !== 'image.png'
          ? raw.name
          : `clipboard-${stamp}${idx > 1 ? `-${idx}` : ''}.${ext}`;
      files.push(new File([raw], name, { type: mime, lastModified: Date.now() }));
    }

    if (files.length > 0) {
      e.preventDefault();
      onFiles(files);
    }
  });
}

export type StatusBannerType = 'success' | 'error' | 'info' | 'warn' | '';

let toastTimer: number | undefined;

export function showToast(message: string, type: 'success' | 'info' | 'warn' = 'success'): void {
  if (typeof document === 'undefined' || !message) return;
  let el = document.getElementById('kitzero-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'kitzero-toast';
    el.className = 'kitzero-toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = `kitzero-toast show${type === 'warn' ? ' warn' : ''}`;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el?.classList.remove('show');
  }, 2400);
}

export function setStatusBanner(
  el: HTMLElement | null | undefined,
  type: StatusBannerType,
  message: string
): void {
  if (!el) return;
  if (!el.hasAttribute('role')) el.setAttribute('role', 'status');
  if (!el.hasAttribute('aria-live')) el.setAttribute('aria-live', 'polite');
  el.className = 'status-banner';
  if (!message) {
    el.textContent = '';
    return;
  }
  el.classList.add('show', type || 'info');
  el.textContent = message;
  if (type === 'success' || type === 'warn') {
    showToast(message, type);
  }
}

export interface BindDropzoneOptions {
  pasteImages?: boolean;
  isPasteActive?: () => boolean;
}

export function bindDropzone(
  dropzone: HTMLElement,
  fileInput: HTMLInputElement,
  onFiles: (files: File[]) => void,
  options: BindDropzoneOptions = {}
): void {
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
    if (e.dataTransfer?.files?.length) {
      onFiles(Array.from(e.dataTransfer.files));
    }
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files?.length) {
      onFiles(Array.from(fileInput.files));
      fileInput.value = '';
    }
  });
  if (options.pasteImages) {
    bindClipboardImagePaste(onFiles, options.isPasteActive);
  }
}
