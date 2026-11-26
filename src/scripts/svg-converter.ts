import { bindDropzone, extensionFromMime, releaseCanvas, stripExtension, triggerDownload } from './utils';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="28" fill="#1e3a5f"/>
  <rect x="28" y="28" width="64" height="64" rx="12" fill="none" stroke="#38bdf8" stroke-width="6"/>
  <path d="M44 61l11 11 22-22" fill="none" stroke="#22c55e" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function initSvgConverter(root: HTMLElement): void {
  const dropzone = root.querySelector<HTMLElement>('[data-svg-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-svg-input]')!;
  const codeInput = root.querySelector<HTMLTextAreaElement>('[data-svg-code]')!;
  const widthInput = root.querySelector<HTMLInputElement>('[data-svg-width]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-svg-format]')!;
  const transparentCheck = root.querySelector<HTMLInputElement>('[data-svg-transparent]')!;
  const bgInput = root.querySelector<HTMLInputElement>('[data-svg-bg]')!;
  const downloadBtn = root.querySelector<HTMLButtonElement>('[data-svg-download]')!;
  const previewImg = root.querySelector<HTMLImageElement>('[data-svg-preview]')!;

  let fileName = 'kitzero-vector';
  let previewUrl: string | null = null;
  codeInput.value = SAMPLE_SVG;

  bindDropzone(dropzone, fileInput, (files) => {
    if (files[0]) void loadSvgFile(files[0]);
  });

  async function loadSvgFile(file: File): Promise<void> {
    fileName = stripExtension(file.name);
    codeInput.value = await file.text();
    updatePreview();
  }

  function updatePreview(): void {
    const svgText = codeInput.value.trim();
    if (!svgText) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
    previewImg.src = previewUrl;
  }

  codeInput.addEventListener('input', updatePreview);
  bgInput.addEventListener('input', () => {
    transparentCheck.checked = false;
  });

  downloadBtn.addEventListener('click', async () => {
    const svgText = codeInput.value.trim();
    if (!svgText) return;
    const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Invalid SVG'));
        img.src = url;
      });
      const targetW = Math.max(16, Math.min(4096, Number(widthInput.value) || 1024));
      const aspect = img.naturalHeight > 0 && img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : 1;
      const targetH = Math.max(16, Math.round(targetW * aspect));
      const mime = formatSelect.value;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;
      if (!transparentCheck.checked || mime === 'image/jpeg') {
        ctx.fillStyle = bgInput.value || '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (blob) triggerDownload(blob, `${fileName}_${targetW}px.${extensionFromMime(mime)}`);
          releaseCanvas(canvas);
        },
        mime,
        mime === 'image/png' ? undefined : 0.92
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  });

  updatePreview();
}
