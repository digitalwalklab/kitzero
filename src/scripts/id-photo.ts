import {
  bindDropzone,
  extensionFromMime,
  loadImageFromFile,
  releaseCanvas,
  setStatusBanner,
  triggerDownload,
} from './utils';

interface PresetDef {
  id: string;
  width: number;
  height: number;
}

interface IdPhotoLabels {
  doneSingle: string;
  doneSheet: string;
}

export function initIdPhoto(root: HTMLElement): void {
  const labels: IdPhotoLabels = JSON.parse(root.dataset.labels || '{}');
  const presets: PresetDef[] = JSON.parse(root.dataset.presets || '[]');

  const dropzone = root.querySelector<HTMLElement>('[data-id-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-id-input]')!;
  const stage = root.querySelector<HTMLElement>('[data-id-stage]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-id-canvas]')!;
  const changeBtn = root.querySelector<HTMLButtonElement>('[data-id-change]')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-id-clear]')!;
  const presetSelect = root.querySelector<HTMLSelectElement>('[data-id-preset]')!;
  const zoomInput = root.querySelector<HTMLInputElement>('[data-id-zoom]')!;
  const zoomVal = root.querySelector<HTMLElement>('[data-id-zoom-val]')!;
  const bgInput = root.querySelector<HTMLInputElement>('[data-id-bg]')!;
  const guideCheck = root.querySelector<HTMLInputElement>('[data-id-guide]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-id-format]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-id-reset]')!;
  const downloadSingleBtn = root.querySelector<HTMLButtonElement>('[data-id-download-single]')!;
  const downloadSheetBtn = root.querySelector<HTMLButtonElement>('[data-id-download-sheet]')!;
  const specBadge = root.querySelector<HTMLElement>('[data-id-spec]')!;
  const statusEl = root.querySelector<HTMLElement>('[data-id-status]')!;

  let sourceImg: HTMLImageElement | null = null;
  let currentPreset: PresetDef = presets[0] || { id: 'kr-passport', width: 413, height: 531 };
  let zoom = 1;
  let offsetX = 0; // in preset pixel coordinates
  let offsetY = 0;

  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let startOffsetX = 0;
  let startOffsetY = 0;

  const setStatus = (type: 'success' | 'error' | '', msg: string) =>
    setStatusBanner(statusEl, type, msg);

  function getBaseScale(): number {
    if (!sourceImg) return 1;
    // Cover-fit the image into the preset frame by default
    return Math.max(
      currentPreset.width / sourceImg.naturalWidth,
      currentPreset.height / sourceImg.naturalHeight
    );
  }

  function drawFrame(targetCanvas: HTMLCanvasElement, includeGuide: boolean): void {
    const w = currentPreset.width;
    const h = currentPreset.height;
    targetCanvas.width = w;
    targetCanvas.height = h;
    const ctx = targetCanvas.getContext('2d')!;

    ctx.fillStyle = bgInput.value || '#ffffff';
    ctx.fillRect(0, 0, w, h);

    if (sourceImg) {
      const scale = getBaseScale() * zoom;
      const drawW = sourceImg.naturalWidth * scale;
      const drawH = sourceImg.naturalHeight * scale;
      const drawX = (w - drawW) / 2 + offsetX;
      const drawY = (h - drawH) / 2 + offsetY;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sourceImg, drawX, drawY, drawW, drawH);
    }

    if (includeGuide && guideCheck.checked) {
      ctx.save();
      // Subtle center axis
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.05);
      ctx.lineTo(w / 2, h * 0.95);
      ctx.stroke();

      // Official top-of-head (~10%) & chin (~82%) guide lines
      const crownY = h * 0.1;
      const chinY = h * 0.82;
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.72)';
      ctx.beginPath();
      ctx.moveTo(w * 0.14, crownY);
      ctx.lineTo(w * 0.86, crownY);
      ctx.moveTo(w * 0.14, chinY);
      ctx.lineTo(w * 0.86, chinY);
      ctx.stroke();

      // Head oval guide
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.82)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.ellipse(w / 2, (crownY + chinY) / 2, w * 0.28, (chinY - crownY) / 2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Shoulder hint arc
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 1.04, w * 0.44, h * 0.2, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function renderPreview(): void {
    specBadge.textContent = `${currentPreset.width} × ${currentPreset.height} px (300 DPI)`;
    drawFrame(canvas, true);
  }

  function resetTransform(): void {
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    zoomInput.value = '100';
    zoomVal.textContent = '100%';
    renderPreview();
  }

  async function loadFile(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) return;
    setStatus('', '');
    const { img, objectUrl } = await loadImageFromFile(file);
    sourceImg = img;
    URL.revokeObjectURL(objectUrl);

    dropzone.hidden = true;
    stage.hidden = false;
    downloadSingleBtn.disabled = false;
    downloadSheetBtn.disabled = false;
    resetBtn.disabled = false;
    resetTransform();
  }

  // Pointer drag on preview canvas
  canvas.addEventListener('pointerdown', (e) => {
    if (!sourceImg) return;
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    startOffsetX = offsetX;
    startOffsetY = offsetY;
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = currentPreset.width / Math.max(1, rect.width);
    const scaleY = currentPreset.height / Math.max(1, rect.height);
    offsetX = startOffsetX + (e.clientX - dragStartX) * scaleX;
    offsetY = startOffsetY + (e.clientY - dragStartY) * scaleY;
    renderPreview();
  });

  const endDrag = () => {
    dragging = false;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  // Wheel zoom
  canvas.addEventListener(
    'wheel',
    (e) => {
      if (!sourceImg) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 5 : -5;
      const next = Math.min(300, Math.max(50, Number(zoomInput.value) + delta));
      zoomInput.value = String(next);
      zoom = next / 100;
      zoomVal.textContent = `${next}%`;
      renderPreview();
    },
    { passive: false }
  );

  presetSelect.addEventListener('change', () => {
    const found = presets.find((p) => p.id === presetSelect.value);
    if (found) {
      currentPreset = found;
      resetTransform();
    }
  });

  zoomInput.addEventListener('input', () => {
    const val = Number(zoomInput.value);
    zoom = val / 100;
    zoomVal.textContent = `${val}%`;
    renderPreview();
  });

  bgInput.addEventListener('input', renderPreview);
  guideCheck.addEventListener('change', renderPreview);
  resetBtn.addEventListener('click', resetTransform);

  clearBtn.addEventListener('click', () => {
    sourceImg = null;
    releaseCanvas(canvas);
    fileInput.value = '';
    setStatus('', '');
    stage.hidden = true;
    dropzone.hidden = false;
    downloadSingleBtn.disabled = true;
    downloadSheetBtn.disabled = true;
    resetBtn.disabled = true;
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    zoomInput.value = '100';
    zoomVal.textContent = '100%';
  });

  // Export single photo (exact 300 DPI pixel size, no guide)
  downloadSingleBtn.addEventListener('click', () => {
    if (!sourceImg) return;
    const outCanvas = document.createElement('canvas');
    drawFrame(outCanvas, false);
    const mime = formatSelect.value;
    const ext = extensionFromMime(mime);
    outCanvas.toBlob(
      (blob) => {
        releaseCanvas(outCanvas);
        if (!blob) return;
        triggerDownload(blob, `kitzero-${currentPreset.id}-${currentPreset.width}x${currentPreset.height}.${ext}`);
        setStatus('success', labels.doneSingle);
      },
      mime,
      mime === 'image/png' ? undefined : 0.95
    );
  });

  // Export 4x6 inch (1800 x 1200 px @ 300 DPI) print sheet with cut lines
  downloadSheetBtn.addEventListener('click', () => {
    if (!sourceImg) return;
    const singleCanvas = document.createElement('canvas');
    drawFrame(singleCanvas, false);

    const sheetW = 1800; // 6 inches * 300 DPI
    const sheetH = 1200; // 4 inches * 300 DPI
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = sheetW;
    sheetCanvas.height = sheetH;
    const sctx = sheetCanvas.getContext('2d')!;
    sctx.fillStyle = '#ffffff';
    sctx.fillRect(0, 0, sheetW, sheetH);

    const gap = 24;
    const pw = currentPreset.width;
    const ph = currentPreset.height;
    const cols = Math.max(1, Math.floor((sheetW - gap) / (pw + gap)));
    const rows = Math.max(1, Math.floor((sheetH - gap) / (ph + gap)));
    const gridW = cols * pw + (cols - 1) * gap;
    const gridH = rows * ph + (rows - 1) * gap;
    const startX = Math.round((sheetW - gridW) / 2);
    const startY = Math.round((sheetH - gridH) / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (pw + gap);
        const y = startY + r * (ph + gap);
        sctx.drawImage(singleCanvas, x, y);
        // Subtle cut-line border
        sctx.strokeStyle = '#d1d5db';
        sctx.lineWidth = 1;
        sctx.strokeRect(x - 0.5, y - 0.5, pw + 1, ph + 1);
      }
    }

    releaseCanvas(singleCanvas);
    sheetCanvas.toBlob(
      (blob) => {
        releaseCanvas(sheetCanvas);
        if (!blob) return;
        triggerDownload(blob, `kitzero-${currentPreset.id}-4x6-sheet-${cols * rows}cuts.jpg`);
        setStatus('success', labels.doneSheet);
      },
      'image/jpeg',
      0.95
    );
  });

  // File input / drag-drop / Ctrl+V
  bindDropzone(
    dropzone,
    fileInput,
    (files) => {
      if (files[0]) void loadFile(files[0]);
    },
    { pasteImages: true }
  );
  changeBtn.addEventListener('click', () => fileInput.click());
}
