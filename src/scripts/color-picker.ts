import {
  bindClipboardImagePaste,
  bindDropzoneKeyboard,
  loadImageFromFile,
  releaseCanvas,
} from './utils';

interface ColorPickerLabels {
  copiedMsg: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function extractDominantPalette(img: HTMLImageElement, count = 8): string[] {
  const sampleCanvas = document.createElement('canvas');
  const maxDim = 120;
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  sampleCanvas.width = w;
  sampleCanvas.height = h;
  const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  releaseCanvas(sampleCanvas);

  // Quantize RGB into 24-step buckets
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${Math.round(r / 24)},${Math.round(g / 24)},${Math.round(b / 24)}`;
    const cur = buckets.get(key);
    if (cur) {
      cur.r += r;
      cur.g += g;
      cur.b += b;
      cur.n += 1;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
  }

  const sorted = Array.from(buckets.values())
    .map((b) => ({
      r: Math.round(b.r / b.n),
      g: Math.round(b.g / b.n),
      b: Math.round(b.b / b.n),
      n: b.n,
    }))
    .sort((a, b) => b.n - a.n);

  const picked: { r: number; g: number; b: number }[] = [];
  for (const c of sorted) {
    const tooClose = picked.some(
      (p) => Math.hypot(p.r - c.r, p.g - c.g, p.b - c.b) < 42
    );
    if (!tooClose) {
      picked.push(c);
      if (picked.length >= count) break;
    }
  }
  return picked.map((c) => rgbToHex(c.r, c.g, c.b));
}

export function initColorPicker(root: HTMLElement): void {
  const labels: ColorPickerLabels = JSON.parse(root.dataset.labels || '{}');

  const dropzone = root.querySelector<HTMLElement>('[data-cp-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-cp-input]')!;
  const stage = root.querySelector<HTMLElement>('[data-cp-stage]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-cp-canvas]')!;
  const changeBtn = root.querySelector<HTMLButtonElement>('[data-cp-change]')!;
  const swatchEl = root.querySelector<HTMLElement>('[data-cp-swatch]')!;
  const hexValEl = root.querySelector<HTMLElement>('[data-cp-hex]')!;
  const rgbValEl = root.querySelector<HTMLElement>('[data-cp-rgb]')!;
  const hslValEl = root.querySelector<HTMLElement>('[data-cp-hsl]')!;
  const copyBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-cp-copy]'));
  const paletteEl = root.querySelector<HTMLElement>('[data-cp-palette]')!;
  const historyEl = root.querySelector<HTMLElement>('[data-cp-history]')!;
  const statusEl = root.querySelector<HTMLElement>('[data-cp-status]')!;

  let ctx: CanvasRenderingContext2D | null = null;
  let history: string[] = [];

  function showCopied(code: string): void {
    statusEl.className = 'status-banner show success';
    statusEl.textContent = `${labels.copiedMsg}${code}`;
    window.setTimeout(() => {
      if (statusEl.textContent === `${labels.copiedMsg}${code}`) {
        statusEl.className = 'status-banner';
        statusEl.textContent = '';
      }
    }, 2000);
  }

  async function copyText(code: string): Promise<void> {
    if (!code || code === '-') return;
    try {
      await navigator.clipboard.writeText(code);
      showCopied(code);
    } catch {}
  }

  function setSelectedColor(r: number, g: number, b: number, pushHistory = true): void {
    const hex = rgbToHex(r, g, b);
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hsl = rgbToHsl(r, g, b);

    swatchEl.style.backgroundColor = hex;
    hexValEl.textContent = hex;
    rgbValEl.textContent = rgb;
    hslValEl.textContent = hsl;

    if (pushHistory) {
      history = [hex, ...history.filter((c) => c !== hex)].slice(0, 10);
      renderHistory();
    }
  }

  function renderHistory(): void {
    historyEl.innerHTML = '';
    for (const hex of history) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cp-chip';
      btn.title = hex;
      btn.innerHTML = `<span class="cp-chip-dot" style="background:${hex}"></span><span>${hex}</span>`;
      btn.addEventListener('click', () => {
        const r = Number.parseInt(hex.slice(1, 3), 16);
        const g = Number.parseInt(hex.slice(3, 5), 16);
        const b = Number.parseInt(hex.slice(5, 7), 16);
        setSelectedColor(r, g, b, false);
        void copyText(hex);
      });
      historyEl.appendChild(btn);
    }
  }

  function renderPalette(colors: string[]): void {
    paletteEl.innerHTML = '';
    for (const hex of colors) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cp-palette-item';
      btn.innerHTML = `<span class="cp-palette-swatch" style="background:${hex}"></span><span class="cp-palette-hex">${hex}</span>`;
      btn.addEventListener('click', () => {
        const r = Number.parseInt(hex.slice(1, 3), 16);
        const g = Number.parseInt(hex.slice(3, 5), 16);
        const b = Number.parseInt(hex.slice(5, 7), 16);
        setSelectedColor(r, g, b, true);
        void copyText(hex);
      });
      paletteEl.appendChild(btn);
    }
  }

  async function loadFile(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) return;
    const { img, objectUrl } = await loadImageFromFile(file);
    try {
      const maxEdge = 1600;
      const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      const palette = extractDominantPalette(img, 8);
      renderPalette(palette);
      if (palette[0]) {
        const hex = palette[0];
        setSelectedColor(
          Number.parseInt(hex.slice(1, 3), 16),
          Number.parseInt(hex.slice(3, 5), 16),
          Number.parseInt(hex.slice(5, 7), 16),
          false
        );
      }

      dropzone.hidden = true;
      stage.hidden = false;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  function pickAtPointer(clientX: number, clientY: number): void {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.min(
      canvas.width - 1,
      Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * canvas.width))
    );
    const y = Math.min(
      canvas.height - 1,
      Math.max(0, Math.floor(((clientY - rect.top) / rect.height) * canvas.height))
    );
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setSelectedColor(pixel[0], pixel[1], pixel[2], true);
  }

  canvas.addEventListener('click', (e) => {
    pickAtPointer(e.clientX, e.clientY);
  });

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.cpCopy;
      if (kind === 'hex') void copyText(hexValEl.textContent || '');
      else if (kind === 'rgb') void copyText(rgbValEl.textContent || '');
      else if (kind === 'hsl') void copyText(hslValEl.textContent || '');
    });
  });

  dropzone.addEventListener('click', (e) => {
    if (e.target === fileInput) return;
    fileInput.click();
  });
  bindDropzoneKeyboard(dropzone, fileInput);
  bindClipboardImagePaste((files) => {
    if (files[0]) void loadFile(files[0]);
  });
  changeBtn.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer?.files?.[0]) void loadFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files?.[0]) {
      void loadFile(fileInput.files[0]);
      fileInput.value = '';
    }
  });
}
