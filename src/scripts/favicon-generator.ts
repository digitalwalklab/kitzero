import JSZip from 'jszip';
import {
  bindDropzone,
  generateAndDownloadZip,
  loadImageFromFile,
  releaseCanvas,
} from './utils';

const FAVICON_HTML = `<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`;

function buildIcoFromPngs(entries: { size: number; bytes: Uint8Array }[]): Uint8Array {
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalDir = headerSize + entries.length * dirEntrySize;
  const totalData = entries.reduce((sum, e) => sum + e.bytes.length, 0);
  const out = new Uint8Array(totalDir + totalData);
  const view = new DataView(out.buffer);

  // ICONDIR header
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type = 1 (ICO)
  view.setUint16(4, entries.length, true);

  let dataOffset = totalDir;
  entries.forEach((entry, i) => {
    const pos = headerSize + i * dirEntrySize;
    out[pos] = entry.size >= 256 ? 0 : entry.size;
    out[pos + 1] = entry.size >= 256 ? 0 : entry.size;
    out[pos + 2] = 0; // color count
    out[pos + 3] = 0; // reserved
    view.setUint16(pos + 4, 1, true); // planes
    view.setUint16(pos + 6, 32, true); // bit count
    view.setUint32(pos + 8, entry.bytes.length, true);
    view.setUint32(pos + 12, dataOffset, true);
    out.set(entry.bytes, dataOffset);
    dataOffset += entry.bytes.length;
  });

  return out;
}

export function initFaviconGenerator(root: HTMLElement): void {
  const copyText = root.dataset.copyText || 'Copy HTML';
  const copiedText = root.dataset.copiedText || 'Copied!';
  const dropzone = root.querySelector<HTMLElement>('[data-fav-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-fav-input]')!;
  const bgInput = root.querySelector<HTMLInputElement>('[data-fav-bg]')!;
  const transparentCheck = root.querySelector<HTMLInputElement>('[data-fav-transparent]')!;
  const radiusInput = root.querySelector<HTMLInputElement>('[data-fav-radius]')!;
  const radiusVal = root.querySelector<HTMLElement>('[data-fav-radius-val]')!;
  const downloadBtn = root.querySelector<HTMLButtonElement>('[data-fav-zip]')!;
  const previewWrap = root.querySelector<HTMLElement>('[data-fav-preview-wrap]')!;
  const previewGrid = root.querySelector<HTMLElement>('[data-fav-preview-grid]')!;
  const codeEl = root.querySelector<HTMLElement>('[data-fav-html]')!;
  const copyBtn = root.querySelector<HTMLButtonElement>('[data-fav-copy]')!;

  codeEl.textContent = FAVICON_HTML;

  let sourceImg: HTMLImageElement | null = null;
  let previewUrls: string[] = [];

  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(FAVICON_HTML);
    copyBtn.textContent = copiedText;
    setTimeout(() => {
      copyBtn.textContent = copyText;
    }, 1500);
  });

  radiusInput.addEventListener('input', () => {
    radiusVal.textContent = `${radiusInput.value}%`;
    void renderPreviews();
  });
  bgInput.addEventListener('input', () => {
    transparentCheck.checked = false;
    void renderPreviews();
  });
  transparentCheck.addEventListener('change', () => void renderPreviews());

  bindDropzone(
    dropzone,
    fileInput,
    (files) => {
      if (files[0]) void loadFile(files[0]);
    },
    { pasteImages: true }
  );

  async function loadFile(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) return;
    const { img, objectUrl } = await loadImageFromFile(file);
    sourceImg = img;
    URL.revokeObjectURL(objectUrl);
    downloadBtn.disabled = false;
    await renderPreviews();
  }

  async function renderIconBlob(size: number): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const r = (size * (Number(radiusInput.value) || 0)) / 100;

    if (r > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, r);
      ctx.clip();
    }

    if (!transparentCheck.checked) {
      ctx.fillStyle = bgInput.value || '#ffffff';
      ctx.fillRect(0, 0, size, size);
    }

    if (sourceImg) {
      const srcRatio = sourceImg.naturalWidth / sourceImg.naturalHeight;
      let sx = 0;
      let sy = 0;
      let sw = sourceImg.naturalWidth;
      let sh = sourceImg.naturalHeight;
      if (srcRatio > 1) {
        sw = sourceImg.naturalHeight;
        sx = (sourceImg.naturalWidth - sw) / 2;
      } else {
        sh = sourceImg.naturalWidth;
        sy = (sourceImg.naturalHeight - sh) / 2;
      }
      ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, size, size);
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encode failed'))), 'image/png');
    });
    releaseCanvas(canvas);
    return blob;
  }

  async function renderPreviews(): Promise<void> {
    if (!sourceImg) return;
    previewUrls.forEach((u) => URL.revokeObjectURL(u));
    previewUrls = [];
    previewGrid.innerHTML = '';
    previewWrap.hidden = false;

    const previewSizes = [16, 32, 48, 96, 180];
    for (const s of previewSizes) {
      const blob = await renderIconBlob(s);
      const url = URL.createObjectURL(blob);
      previewUrls.push(url);
      const item = document.createElement('div');
      item.className = 'favicon-sample';
      const img = document.createElement('img');
      img.src = url;
      img.width = Math.min(s, 72);
      img.height = Math.min(s, 72);
      img.alt = `${s}x${s}`;
      const label = document.createElement('span');
      label.textContent = `${s}×${s}`;
      item.append(img, label);
      previewGrid.appendChild(item);
    }
  }

  downloadBtn.addEventListener('click', async () => {
    if (!sourceImg) return;
    const zip = new JSZip();

    const p16 = new Uint8Array(await (await renderIconBlob(16)).arrayBuffer());
    const p32 = new Uint8Array(await (await renderIconBlob(32)).arrayBuffer());
    const p48 = new Uint8Array(await (await renderIconBlob(48)).arrayBuffer());
    const p180 = await renderIconBlob(180);
    const p192 = await renderIconBlob(192);
    const p512 = await renderIconBlob(512);

    const icoBytes = buildIcoFromPngs([
      { size: 16, bytes: p16 },
      { size: 32, bytes: p32 },
      { size: 48, bytes: p48 },
    ]);

    zip.file('favicon.ico', icoBytes);
    zip.file('favicon-16x16.png', p16);
    zip.file('favicon-32x32.png', p32);
    zip.file('apple-touch-icon.png', p180);
    zip.file('android-chrome-192x192.png', p192);
    zip.file('android-chrome-512x512.png', p512);
    zip.file(
      'site.webmanifest',
      JSON.stringify(
        {
          name: 'My Website',
          short_name: 'MySite',
          icons: [
            { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
          theme_color: bgInput.value || '#ffffff',
          background_color: bgInput.value || '#ffffff',
          display: 'standalone',
        },
        null,
        2
      )
    );
    zip.file('head-tags.html', FAVICON_HTML);

    await generateAndDownloadZip(downloadBtn, zip, `kitzero-favicons-${Date.now()}.zip`);
  });
}
