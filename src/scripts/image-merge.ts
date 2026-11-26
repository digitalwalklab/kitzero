import {
  bindDropzone,
  extensionFromMime,
  isCanvasTooLarge,
  loadImageFromFile,
  releaseCanvas,
  setStatusBanner,
  triggerDownload,
} from './utils';

interface MergeImgItem {
  id: string;
  file: File;
  img: HTMLImageElement;
  objectUrl: string;
  width: number;
  height: number;
}

interface ImageMergeLabels {
  needTwo: string;
  doneMsg: string;
  emptyPreview: string;
}

export function initImageMerge(root: HTMLElement): void {
  const labels: ImageMergeLabels = JSON.parse(root.dataset.labels || '{}');

  const dropzone = root.querySelector<HTMLElement>('[data-im-drop]')!;
  const fileInput = root.querySelector<HTMLInputElement>('[data-im-input]')!;
  const listEl = root.querySelector<HTMLElement>('[data-im-list]')!;
  const layoutSelect = root.querySelector<HTMLSelectElement>('[data-im-layout]')!;
  const alignSelect = root.querySelector<HTMLSelectElement>('[data-im-align]')!;
  const gapInput = root.querySelector<HTMLInputElement>('[data-im-gap]')!;
  const gapVal = root.querySelector<HTMLElement>('[data-im-gap-val]')!;
  const bgInput = root.querySelector<HTMLInputElement>('[data-im-bg]')!;
  const formatSelect = root.querySelector<HTMLSelectElement>('[data-im-format]')!;
  const qualityInput = root.querySelector<HTMLInputElement>('[data-im-quality]')!;
  const qualityVal = root.querySelector<HTMLElement>('[data-im-quality-val]')!;
  const downloadBtn = root.querySelector<HTMLButtonElement>('[data-im-download]')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-im-clear]')!;
  const statusEl = root.querySelector<HTMLElement>('[data-im-status]')!;
  const previewCanvas = root.querySelector<HTMLCanvasElement>('[data-im-canvas]')!;
  const previewEmpty = root.querySelector<HTMLElement>('[data-im-empty]')!;
  const previewMeta = root.querySelector<HTMLElement>('[data-im-meta]')!;

  let items: MergeImgItem[] = [];

  const setStatus = (type: 'success' | 'error' | 'info' | '', msg: string) =>
    setStatusBanner(statusEl, type, msg);

  bindDropzone(
    dropzone,
    fileInput,
    (files) => {
      void addFiles(files);
    },
    { pasteImages: true }
  );

  async function addFiles(files: File[]): Promise<void> {
    setStatus('', '');
    const valid = files.filter((f) => f.type.startsWith('image/'));
    for (const file of valid) {
      try {
        const { img, objectUrl } = await loadImageFromFile(file);
        items.push({
          id: crypto.randomUUID(),
          file,
          img,
          objectUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      } catch {}
    }
    renderList();
    renderComposite();
  }

  function renderList(): void {
    listEl.innerHTML = '';
    downloadBtn.disabled = items.length < 2;
    clearBtn.disabled = items.length === 0;

    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'file-item';
      row.innerHTML = `
        <img class="file-thumb" src="${item.objectUrl}" alt="" />
        <div class="file-meta">
          <div class="file-name"></div>
          <div class="file-sub">${item.width} × ${item.height} px</div>
        </div>
        <div class="file-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-up ${idx === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="btn btn-secondary btn-sm" data-down ${idx === items.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="btn-remove" data-del aria-label="Remove">×</button>
        </div>
      `;
      row.querySelector('.file-name')!.textContent = item.file.name;
      row.querySelector('[data-up]')!.addEventListener('click', () => {
        if (idx === 0) return;
        [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
        renderList();
        renderComposite();
      });
      row.querySelector('[data-down]')!.addEventListener('click', () => {
        if (idx >= items.length - 1) return;
        [items[idx + 1], items[idx]] = [items[idx], items[idx + 1]];
        renderList();
        renderComposite();
      });
      row.querySelector('[data-del]')!.addEventListener('click', () => {
        URL.revokeObjectURL(item.objectUrl);
        items = items.filter((x) => x.id !== item.id);
        renderList();
        renderComposite();
      });
      listEl.appendChild(row);
    });
  }

  function drawToCanvas(targetCanvas: HTMLCanvasElement, maxEdge?: number): { width: number; height: number } | null {
    if (items.length < 2) return null;
    const layout = layoutSelect.value as 'vertical' | 'horizontal' | 'grid2';
    const alignFit = alignSelect.value === 'fit';
    const gap = Math.max(0, Number(gapInput.value) || 0);
    const bg = bgInput.value || '#ffffff';

    let rects: { item: MergeImgItem; x: number; y: number; w: number; h: number }[] = [];
    let totalW = 0;
    let totalH = 0;

    if (layout === 'vertical') {
      const baseW = alignFit
        ? Math.round(items.reduce((acc, it) => acc + it.width, 0) / items.length)
        : Math.max(...items.map((it) => it.width));
      let y = 0;
      for (const it of items) {
        const w = alignFit ? baseW : it.width;
        const h = alignFit ? Math.round((it.height * baseW) / it.width) : it.height;
        const x = Math.round((baseW - w) / 2);
        rects.push({ item: it, x, y, w, h });
        y += h + gap;
      }
      totalW = baseW;
      totalH = Math.max(1, y - gap);
    } else if (layout === 'horizontal') {
      const baseH = alignFit
        ? Math.round(items.reduce((acc, it) => acc + it.height, 0) / items.length)
        : Math.max(...items.map((it) => it.height));
      let x = 0;
      for (const it of items) {
        const h = alignFit ? baseH : it.height;
        const w = alignFit ? Math.round((it.width * baseH) / it.height) : it.width;
        const y = Math.round((baseH - h) / 2);
        rects.push({ item: it, x, y, w, h });
        x += w + gap;
      }
      totalW = Math.max(1, x - gap);
      totalH = baseH;
    } else {
      // 2-column grid
      const cols = 2;
      const cellW = Math.round(items.reduce((acc, it) => acc + it.width, 0) / items.length);
      let y = 0;
      for (let i = 0; i < items.length; i += cols) {
        const rowItems = items.slice(i, i + cols);
        const scaled = rowItems.map((it) => {
          const w = alignFit ? cellW : Math.min(it.width, cellW);
          const h = Math.round((it.height * w) / it.width);
          return { it, w, h };
        });
        const rowH = Math.max(...scaled.map((s) => s.h));
        scaled.forEach((s, colIdx) => {
          const cellX = colIdx * (cellW + gap);
          const x = cellX + Math.round((cellW - s.w) / 2);
          const drawY = y + Math.round((rowH - s.h) / 2);
          rects.push({ item: s.it, x, y: drawY, w: s.w, h: s.h });
        });
        y += rowH + gap;
      }
      totalW = cellW * 2 + gap;
      totalH = Math.max(1, y - gap);
    }

    let scale = 1;
    if (maxEdge && Math.max(totalW, totalH) > maxEdge) {
      scale = maxEdge / Math.max(totalW, totalH);
    } else if (isCanvasTooLarge(totalW, totalH)) {
      const dimScale = 12000 / Math.max(totalW, totalH);
      scale = Math.min(1, dimScale);
    }

    const outW = Math.max(1, Math.round(totalW * scale));
    const outH = Math.max(1, Math.round(totalH * scale));
    targetCanvas.width = outW;
    targetCanvas.height = outH;

    const ctx = targetCanvas.getContext('2d')!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, outW, outH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    for (const r of rects) {
      ctx.drawImage(
        r.item.img,
        Math.round(r.x * scale),
        Math.round(r.y * scale),
        Math.max(1, Math.round(r.w * scale)),
        Math.max(1, Math.round(r.h * scale))
      );
    }

    return { width: Math.round(totalW), height: Math.round(totalH) };
  }

  function renderComposite(): void {
    if (items.length < 2) {
      previewCanvas.hidden = true;
      previewEmpty.hidden = false;
      previewMeta.textContent = '';
      return;
    }
    previewCanvas.hidden = false;
    previewEmpty.hidden = true;
    const dims = drawToCanvas(previewCanvas, 1200);
    if (dims) {
      previewMeta.textContent = `${dims.width} × ${dims.height} px`;
    }
  }

  gapInput.addEventListener('input', () => {
    gapVal.textContent = `${gapInput.value}px`;
    renderComposite();
  });
  qualityInput.addEventListener('input', () => {
    qualityVal.textContent = `${qualityInput.value}%`;
  });
  layoutSelect.addEventListener('change', renderComposite);
  alignSelect.addEventListener('change', renderComposite);
  bgInput.addEventListener('input', renderComposite);

  clearBtn.addEventListener('click', () => {
    items.forEach((it) => URL.revokeObjectURL(it.objectUrl));
    items = [];
    setStatus('', '');
    renderList();
    renderComposite();
  });

  downloadBtn.addEventListener('click', () => {
    if (items.length < 2) {
      setStatus('error', labels.needTwo);
      return;
    }
    const outCanvas = document.createElement('canvas');
    drawToCanvas(outCanvas);
    const mime = formatSelect.value;
    const quality = Number(qualityInput.value) / 100;
    const ext = extensionFromMime(mime);
    outCanvas.toBlob(
      (blob) => {
        releaseCanvas(outCanvas);
        if (!blob) return;
        triggerDownload(blob, `kitzero-merged-${items.length}.${ext}`);
        setStatus('success', labels.doneMsg);
      },
      mime,
      mime === 'image/png' ? undefined : quality
    );
  });
}
