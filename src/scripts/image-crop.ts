import {
  bindDropzoneKeyboard,
  extensionFromMime,
  loadImageFromFile,
  releaseCanvas,
  stripExtension,
  triggerDownload,
} from './utils';

export function initImageCrop(root: HTMLElement): void {
  const dropzone = root.querySelector<HTMLElement>('[data-crop-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-crop-input]')!;
  const stage = root.querySelector<HTMLElement>('[data-crop-stage]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-crop-canvas]')!;
  const ratioSelect = root.querySelector<HTMLSelectElement>('[data-crop-ratio]')!;
  const rotLeftBtn = root.querySelector<HTMLButtonElement>('[data-crop-rot-l]')!;
  const rotRightBtn = root.querySelector<HTMLButtonElement>('[data-crop-rot-r]')!;
  const flipHBtn = root.querySelector<HTMLButtonElement>('[data-crop-flip-h]')!;
  const flipVBtn = root.querySelector<HTMLButtonElement>('[data-crop-flip-v]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-crop-format]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-crop-reset]')!;
  const changeBtn = root.querySelector<HTMLButtonElement>('[data-crop-change]')!;
  const downloadBtn = root.querySelector<HTMLButtonElement>('[data-crop-download]')!;
  const dimsLabel = root.querySelector<HTMLElement>('[data-crop-dims]')!;

  let workingCanvas: HTMLCanvasElement | null = null;
  let sourceName = 'cropped';
  let crop = { x: 0, y: 0, w: 0, h: 0 };
  let dragging = false;
  let startX = 0;
  let startY = 0;

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
    sourceName = stripExtension(file.name);
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d')!.drawImage(img, 0, 0);
    URL.revokeObjectURL(objectUrl);

    if (workingCanvas) releaseCanvas(workingCanvas);
    workingCanvas = c;
    resetFullCrop();

    dropzone.hidden = true;
    stage.hidden = false;
    [rotLeftBtn, rotRightBtn, flipHBtn, flipVBtn, resetBtn, changeBtn, downloadBtn].forEach((b) => {
      b.disabled = false;
    });
    redraw();
  }

  function resetFullCrop(): void {
    if (!workingCanvas) return;
    crop = { x: 0, y: 0, w: workingCanvas.width, h: workingCanvas.height };
  }

  function transformWorking(op: 'rotL' | 'rotR' | 'flipH' | 'flipV'): void {
    if (!workingCanvas) return;
    const src = workingCanvas;
    const dst = document.createElement('canvas');
    const rotate = op === 'rotL' || op === 'rotR';
    dst.width = rotate ? src.height : src.width;
    dst.height = rotate ? src.width : src.height;
    const ctx = dst.getContext('2d')!;
    ctx.translate(dst.width / 2, dst.height / 2);
    if (op === 'rotL') ctx.rotate(-Math.PI / 2);
    else if (op === 'rotR') ctx.rotate(Math.PI / 2);
    else if (op === 'flipH') ctx.scale(-1, 1);
    else if (op === 'flipV') ctx.scale(1, -1);
    ctx.drawImage(src, -src.width / 2, -src.height / 2);
    releaseCanvas(src);
    workingCanvas = dst;
    resetFullCrop();
    redraw();
  }

  rotLeftBtn.addEventListener('click', () => transformWorking('rotL'));
  rotRightBtn.addEventListener('click', () => transformWorking('rotR'));
  flipHBtn.addEventListener('click', () => transformWorking('flipH'));
  flipVBtn.addEventListener('click', () => transformWorking('flipV'));
  resetBtn.addEventListener('click', () => {
    resetFullCrop();
    redraw();
  });

  function redraw(): void {
    if (!workingCanvas) return;
    canvas.width = workingCanvas.width;
    canvas.height = workingCanvas.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(workingCanvas, 0, 0);

    // Dim outside crop area
    ctx.save();
    ctx.fillStyle = 'rgba(11, 17, 32, 0.52)';
    ctx.fillRect(0, 0, canvas.width, crop.y);
    ctx.fillRect(0, crop.y + crop.h, canvas.width, canvas.height - (crop.y + crop.h));
    ctx.fillRect(0, crop.y, crop.x, crop.h);
    ctx.fillRect(crop.x + crop.w, crop.y, canvas.width - (crop.x + crop.w), crop.h);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = Math.max(2, canvas.width / 320);
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);
    ctx.restore();

    dimsLabel.textContent = `${Math.round(crop.w)} × ${Math.round(crop.h)} px`;
  }

  function getPos(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(canvas.width, ((e.clientX - r.left) * canvas.width) / r.width)),
      y: Math.max(0, Math.min(canvas.height, ((e.clientY - r.top) * canvas.height) / r.height)),
    };
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (!workingCanvas) return;
    canvas.setPointerCapture(e.pointerId);
    const p = getPos(e);
    dragging = true;
    startX = p.x;
    startY = p.y;
    crop = { x: startX, y: startY, w: 1, h: 1 };
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragging || !workingCanvas) return;
    const p = getPos(e);
    let dx = p.x - startX;
    let dy = p.y - startY;
    const ratio = Number(ratioSelect.value) || 0;
    if (ratio > 0) {
      const signY = dy >= 0 ? 1 : -1;
      dy = (Math.abs(dx) / ratio) * signY;
    }
    const x = Math.max(0, Math.min(startX, startX + dx));
    const y = Math.max(0, Math.min(startY, startY + dy));
    const w = Math.min(workingCanvas.width - x, Math.abs(dx));
    const h = Math.min(workingCanvas.height - y, Math.abs(dy));
    crop = { x, y, w: Math.max(4, w), h: Math.max(4, h) };
    redraw();
  });

  canvas.addEventListener('pointerup', () => {
    dragging = false;
  });

  downloadBtn.addEventListener('click', () => {
    if (!workingCanvas) return;
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round(crop.w));
    out.height = Math.max(1, Math.round(crop.h));
    const ctx = out.getContext('2d')!;
    const mime = formatSelect.value;
    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, out.width, out.height);
    }
    ctx.drawImage(workingCanvas, crop.x, crop.y, crop.w, crop.h, 0, 0, out.width, out.height);
    out.toBlob(
      (blob) => {
        if (blob) triggerDownload(blob, `${sourceName}_cropped.${extensionFromMime(mime)}`);
        releaseCanvas(out);
      },
      mime,
      mime === 'image/png' ? undefined : 0.92
    );
  });
}
