import {
  bindClipboardImagePaste,
  bindDropzoneKeyboard,
  extensionFromMime,
  loadImageFromFile,
  releaseCanvas,
  stripExtension,
  triggerDownload,
} from './utils';

interface MaskRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  mode: 'mosaic' | 'blur' | 'solid';
  strength: number;
}

export function initImageBlur(root: HTMLElement): void {
  const dropzone = root.querySelector<HTMLElement>('[data-blur-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-blur-input]')!;
  const stage = root.querySelector<HTMLElement>('[data-blur-stage]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-blur-canvas]')!;
  const modeSelect = root.querySelector<HTMLSelectElement>('[data-blur-mode]')!;
  const strengthInput = root.querySelector<HTMLInputElement>('[data-blur-strength]')!;
  const strengthValue = root.querySelector<HTMLElement>('[data-blur-strength-val]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-blur-format]')!;
  const undoBtn = root.querySelector<HTMLButtonElement>('[data-blur-undo]')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-blur-clear]')!;
  const changeBtn = root.querySelector<HTMLButtonElement>('[data-blur-change]')!;
  const downloadBtn = root.querySelector<HTMLButtonElement>('[data-blur-download]')!;
  const countEl = root.querySelector<HTMLElement>('[data-blur-count]')!;

  const ctx = canvas.getContext('2d')!;
  let sourceImg: HTMLImageElement | null = null;
  let sourceFileName = 'redacted';
  let regions: MaskRegion[] = [];
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let currentRect: { x: number; y: number; w: number; h: number } | null = null;

  strengthInput.addEventListener('input', () => {
    strengthValue.textContent = strengthInput.value;
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

  async function loadFile(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) return;
    const { img, objectUrl } = await loadImageFromFile(file);
    sourceImg = img;
    sourceFileName = stripExtension(file.name);
    regions = [];
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    URL.revokeObjectURL(objectUrl);

    dropzone.hidden = true;
    stage.hidden = false;
    changeBtn.disabled = false;
    downloadBtn.disabled = false;
    redraw();
  }

  function applyMaskRegion(region: MaskRegion): void {
    const x = Math.max(0, Math.floor(region.x));
    const y = Math.max(0, Math.floor(region.y));
    const w = Math.min(canvas.width - x, Math.ceil(region.w));
    const h = Math.min(canvas.height - y, Math.ceil(region.h));
    if (w < 2 || h < 2) return;

    if (region.mode === 'solid') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, y, w, h);
      return;
    }

    if (region.mode === 'mosaic') {
      const pixelSize = Math.max(4, Math.round((Math.min(canvas.width, canvas.height) / 100) * (region.strength / 8)));
      const smallW = Math.max(1, Math.floor(w / pixelSize));
      const smallH = Math.max(1, Math.floor(h / pixelSize));
      const tmp = document.createElement('canvas');
      tmp.width = smallW;
      tmp.height = smallH;
      const tctx = tmp.getContext('2d')!;
      tctx.imageSmoothingEnabled = true;
      tctx.drawImage(canvas, x, y, w, h, 0, 0, smallW, smallH);

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, smallW, smallH, x, y, w, h);
      ctx.restore();
      releaseCanvas(tmp);
      return;
    }

    // Cross-browser smooth Gaussian-like blur (works on iOS Safari / in-app WebViews where ctx.filter is ignored)
    const maxDim = Math.max(w, h);
    const scale = maxDim > 480 ? 480 / maxDim : 1;
    const bw = Math.max(2, Math.round(w * scale));
    const bh = Math.max(2, Math.round(h * scale));
    const radius = Math.max(2, Math.round(region.strength * 0.45 * scale * (Math.min(canvas.width, canvas.height) / 600 + 0.6)));
    const clampedRadius = Math.min(radius, Math.max(2, Math.floor(Math.min(bw, bh) / 2)));

    const tmp = document.createElement('canvas');
    tmp.width = bw;
    tmp.height = bh;
    const tctx = tmp.getContext('2d')!;
    tctx.imageSmoothingEnabled = true;
    tctx.drawImage(canvas, x, y, w, h, 0, 0, bw, bh);

    const imgData = tctx.getImageData(0, 0, bw, bh);
    boxBlurRgba(imgData.data, bw, bh, clampedRadius, 3);
    tctx.putImageData(imgData, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(tmp, 0, 0, bw, bh, x, y, w, h);
    ctx.restore();
    releaseCanvas(tmp);
  }

  function boxBlurRgba(data: Uint8ClampedArray, w: number, h: number, radius: number, passes: number): void {
    const tmp = new Uint8ClampedArray(data.length);
    const win = radius * 2 + 1;

    for (let p = 0; p < passes; p++) {
      // Horizontal pass
      for (let y = 0; y < h; y++) {
        const row = y * w * 4;
        let r = 0, g = 0, b = 0, a = 0;
        for (let k = -radius; k <= radius; k++) {
          const sx = Math.max(0, Math.min(w - 1, k));
          const idx = row + sx * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
        }
        for (let x = 0; x < w; x++) {
          const out = row + x * 4;
          tmp[out] = r / win;
          tmp[out + 1] = g / win;
          tmp[out + 2] = b / win;
          tmp[out + 3] = a / win;

          const left = Math.max(0, x - radius);
          const right = Math.min(w - 1, x + radius + 1);
          const lIdx = row + left * 4;
          const rIdx = row + right * 4;
          r += data[rIdx] - data[lIdx];
          g += data[rIdx + 1] - data[lIdx + 1];
          b += data[rIdx + 2] - data[lIdx + 2];
          a += data[rIdx + 3] - data[lIdx + 3];
        }
      }

      // Vertical pass
      for (let x = 0; x < w; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        for (let k = -radius; k <= radius; k++) {
          const sy = Math.max(0, Math.min(h - 1, k));
          const idx = (sy * w + x) * 4;
          r += tmp[idx];
          g += tmp[idx + 1];
          b += tmp[idx + 2];
          a += tmp[idx + 3];
        }
        for (let y = 0; y < h; y++) {
          const out = (y * w + x) * 4;
          data[out] = r / win;
          data[out + 1] = g / win;
          data[out + 2] = b / win;
          data[out + 3] = a / win;

          const top = Math.max(0, y - radius);
          const bot = Math.min(h - 1, y + radius + 1);
          const tIdx = (top * w + x) * 4;
          const bIdx = (bot * w + x) * 4;
          r += tmp[bIdx] - tmp[tIdx];
          g += tmp[bIdx + 1] - tmp[tIdx + 1];
          b += tmp[bIdx + 2] - tmp[tIdx + 2];
          a += tmp[bIdx + 3] - tmp[tIdx + 3];
        }
      }
    }
  }

  function redraw(): void {
    if (!sourceImg) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sourceImg, 0, 0);
    for (const region of regions) {
      applyMaskRegion(region);
    }
    if (currentRect) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = Math.max(2, canvas.width / 350);
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
      ctx.restore();
    }
    undoBtn.disabled = regions.length === 0;
    clearBtn.disabled = regions.length === 0;
    countEl.textContent = String(regions.length);
  }

  function getCanvasCoords(e: PointerEvent): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (!sourceImg) return;
    e.preventDefault();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Some mobile browsers throw if pointerId is synthetic
    }
    const pos = getCanvasCoords(e);
    dragging = true;
    startX = pos.x;
    startY = pos.y;
    currentRect = { x: startX, y: startY, w: 0, h: 0 };
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const pos = getCanvasCoords(e);
    currentRect = {
      x: Math.min(startX, pos.x),
      y: Math.min(startY, pos.y),
      w: Math.abs(pos.x - startX),
      h: Math.abs(pos.y - startY),
    };
    redraw();
  });

  function finishDrag(): void {
    if (!dragging) return;
    dragging = false;
    if (currentRect && currentRect.w >= 4 && currentRect.h >= 4) {
      regions.push({
        ...currentRect,
        mode: modeSelect.value as MaskRegion['mode'],
        strength: Number(strengthInput.value) || 20,
      });
    }
    currentRect = null;
    redraw();
  }

  canvas.addEventListener('pointerup', finishDrag);
  canvas.addEventListener('pointercancel', finishDrag);

  undoBtn.addEventListener('click', () => {
    regions.pop();
    redraw();
  });

  clearBtn.addEventListener('click', () => {
    regions = [];
    redraw();
  });

  downloadBtn.addEventListener('click', () => {
    if (!sourceImg) return;
    currentRect = null;
    redraw();
    const mime = formatSelect.value;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        triggerDownload(blob, `${sourceFileName}_masked.${extensionFromMime(mime)}`);
      },
      mime,
      mime === 'image/png' ? undefined : 0.9
    );
  });
}
