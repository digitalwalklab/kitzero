import QRCode from 'qrcode';
import { loadImageFromFile, triggerDownload } from './utils';

export function initQrGenerator(root: HTMLElement): void {
  const modeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-qr-mode]'));
  const urlPanel = root.querySelector<HTMLElement>('[data-qr-panel="url"]')!;
  const wifiPanel = root.querySelector<HTMLElement>('[data-qr-panel="wifi"]')!;
  const textInput = root.querySelector<HTMLInputElement>('[data-qr-text]')!;
  const ssidInput = root.querySelector<HTMLInputElement>('[data-qr-ssid]')!;
  const passInput = root.querySelector<HTMLInputElement>('[data-qr-pass]')!;
  const encSelect = root.querySelector<HTMLSelectElement>('[data-qr-enc]')!;
  const fgInput = root.querySelector<HTMLInputElement>('[data-qr-fg]')!;
  const bgInput = root.querySelector<HTMLInputElement>('[data-qr-bg]')!;
  const sizeSelect = root.querySelector<HTMLSelectElement>('[data-qr-size]')!;
  const eccSelect = root.querySelector<HTMLSelectElement>('[data-qr-ecc]')!;
  const noFileLabel = root.dataset.noFileLabel || '';
  const logoInput = root.querySelector<HTMLInputElement>('[data-qr-logo]')!;
  const logoNameEl = root.querySelector<HTMLElement>('[data-qr-logo-name]');
  const clearLogoBtn = root.querySelector<HTMLButtonElement>('[data-qr-clear-logo]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-qr-canvas]')!;
  const dlPngBtn = root.querySelector<HTMLButtonElement>('[data-qr-dl-png]')!;
  const dlSvgBtn = root.querySelector<HTMLButtonElement>('[data-qr-dl-svg]')!;

  let mode: 'url' | 'wifi' = 'url';
  let logoImg: HTMLImageElement | null = null;

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.qrMode === 'wifi' ? 'wifi' : 'url';
      modeBtns.forEach((b) => b.classList.toggle('active', b === btn));
      urlPanel.hidden = mode !== 'url';
      wifiPanel.hidden = mode !== 'wifi';
      void renderQr();
    });
  });

  function getPayload(): string {
    if (mode === 'wifi') {
      const ssid = ssidInput.value.trim() || 'MyWiFi';
      const pass = passInput.value;
      const enc = encSelect.value;
      return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }
    return textInput.value.trim() || 'https://kitzero.jokerx04.com';
  }

  logoInput.addEventListener('change', async () => {
    const file = logoInput.files?.[0];
    if (!file) return;
    const { img, objectUrl } = await loadImageFromFile(file);
    logoImg = img;
    URL.revokeObjectURL(objectUrl);
    eccSelect.value = 'H'; // High ECC recommended for center logo
    if (logoNameEl) logoNameEl.textContent = file.name;
    clearLogoBtn.disabled = false;
    void renderQr();
  });

  clearLogoBtn.addEventListener('click', () => {
    logoImg = null;
    logoInput.value = '';
    if (logoNameEl) logoNameEl.textContent = noFileLabel;
    clearLogoBtn.disabled = true;
    void renderQr();
  });

  [textInput, ssidInput, passInput, encSelect, fgInput, bgInput, sizeSelect, eccSelect].forEach((el) => {
    el.addEventListener('input', () => void renderQr());
  });

  async function renderQr(): Promise<void> {
    const size = Number(sizeSelect.value) || 512;
    const ecc = (eccSelect.value as 'L' | 'M' | 'Q' | 'H') || 'M';
    await QRCode.toCanvas(canvas, getPayload(), {
      width: size,
      margin: 2,
      errorCorrectionLevel: ecc,
      color: {
        dark: fgInput.value || '#0f172a',
        light: bgInput.value || '#ffffff',
      },
    });
    canvas.style.width = '';
    canvas.style.height = '';

    if (logoImg) {
      const ctx = canvas.getContext('2d')!;
      const logoSize = Math.round(size * 0.22);
      const pad = Math.round(logoSize * 0.14);
      const x = Math.round((size - logoSize) / 2);
      const y = Math.round((size - logoSize) / 2);
      ctx.fillStyle = bgInput.value || '#ffffff';
      ctx.fillRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2);
      ctx.drawImage(logoImg, x, y, logoSize, logoSize);
    }
  }

  dlPngBtn.addEventListener('click', () => {
    canvas.toBlob((blob) => {
      if (blob) triggerDownload(blob, `kitzero-qr-${Date.now()}.png`);
    }, 'image/png');
  });

  dlSvgBtn.addEventListener('click', async () => {
    const ecc = (eccSelect.value as 'L' | 'M' | 'Q' | 'H') || 'M';
    const svgStr = await QRCode.toString(getPayload(), {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: ecc,
      color: {
        dark: fgInput.value || '#0f172a',
        light: bgInput.value || '#ffffff',
      },
    });
    triggerDownload(new Blob([svgStr], { type: 'image/svg+xml' }), `kitzero-qr-${Date.now()}.svg`);
  });

  void renderQr();
}
