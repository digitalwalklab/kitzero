import {
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

    // Blur
    const radius = Math.max(4, Math.round(region.strength * 0.9));
    const tmp = document.createElement('canvas');
    tmp.width = w;
    tmp.height = h;
    const tctx = tmp.getContext('2d')!;
    tctx.filter = `blur(${radius}px)`;
    tctx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
    ctx.drawImage(tmp, x, y);
    releaseCanvas(tmp);
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
    canvas.setPointerCapture(e.pointerId);
    const pos = getCanvasCoords(e);
    dragging = true;
    startX = pos.x;
    startY = pos.y;
    currentRect = { x: startX, y: startY, w: 0, h: 0 };
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const pos = getCanvasCoords(e);
    currentRect = {
      x: Math.min(startX, pos.x),
      y: Math.min(startY, pos.y),
      w: Math.abs(pos.x - startX),
      h: Math.abs(pos.y - startY),
    };
    redraw();
  });

  canvas.addEventListener('pointerup', () => {
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
  });

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
