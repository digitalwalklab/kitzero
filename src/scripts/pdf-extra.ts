import { degrees, PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import {
  bindDropzoneKeyboard,
  formatBytes,
  loadImageFromFile,
  releaseCanvas,
  stripExtension,
  triggerDownload,
} from './utils';

interface ImgPdfEntry {
  id: string;
  file: File;
  previewUrl: string;
}

interface OrgPage {
  origIndex: number;
  origPageNum: number;
  thumbUrl: string;
  rotationDelta: number;
}

interface ExtraLabels {
  moveUp: string;
  moveDown: string;
  remove: string;
  fromImageDone: string;
  rotateLeft: string;
  rotateRight: string;
  moveLeft: string;
  moveRight: string;
  deletePage: string;
  loadingMsg: string;
  organizeDone: string;
  emptyError: string;
}

export function initPdfExtra(root: HTMLElement): void {
  const labels: ExtraLabels = JSON.parse(root.dataset.extraLabels || '{}');

  function setStatus(el: HTMLElement, type: 'success' | 'error' | 'info' | '', msg: string): void {
    el.className = 'status-banner';
    if (!msg) return;
    el.classList.add('show', type || 'info');
    el.textContent = msg;
  }

  // ==================== TAB 4: IMAGES -> PDF ====================
  const fromImgDrop = root.querySelector<HTMLElement>('[data-fromimg-drop]');
  const fromImgInput = root.querySelector<HTMLInputElement>('[data-fromimg-input]');
  const fromImgList = root.querySelector<HTMLElement>('[data-fromimg-list]');
  const fromImgSize = root.querySelector<HTMLSelectElement>('[data-fromimg-size]');
  const fromImgMargin = root.querySelector<HTMLSelectElement>('[data-fromimg-margin]');
  const fromImgRun = root.querySelector<HTMLButtonElement>('[data-fromimg-run]');
  const fromImgClear = root.querySelector<HTMLButtonElement>('[data-fromimg-clear]');
  const fromImgStatus = root.querySelector<HTMLElement>('[data-fromimg-status]');

  let imgEntries: ImgPdfEntry[] = [];

  if (fromImgDrop && fromImgInput && fromImgList && fromImgSize && fromImgMargin && fromImgRun && fromImgClear && fromImgStatus) {
    fromImgDrop.addEventListener('click', (e) => {
      if (e.target === fromImgInput) return;
      fromImgInput.click();
    });
    bindDropzoneKeyboard(fromImgDrop, fromImgInput);
    fromImgDrop.addEventListener('dragover', (e) => {
      e.preventDefault();
      fromImgDrop.classList.add('drag-over');
    });
    fromImgDrop.addEventListener('dragleave', () => fromImgDrop.classList.remove('drag-over'));
    fromImgDrop.addEventListener('drop', (e) => {
      e.preventDefault();
      fromImgDrop.classList.remove('drag-over');
      if (e.dataTransfer?.files) addImages(Array.from(e.dataTransfer.files));
    });
    fromImgInput.addEventListener('change', () => {
      if (fromImgInput.files) {
        addImages(Array.from(fromImgInput.files));
        fromImgInput.value = '';
      }
    });

    function addImages(files: File[]): void {
      setStatus(fromImgStatus!, '', '');
      const valid = files.filter((f) => f.type.startsWith('image/'));
      for (const file of valid) {
        imgEntries.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
      renderImgList();
    }

    function renderImgList(): void {
      fromImgRun!.disabled = imgEntries.length === 0;
      fromImgClear!.disabled = imgEntries.length === 0;
      fromImgList!.innerHTML = '';

      imgEntries.forEach((entry, idx) => {
        const row = document.createElement('div');
        row.className = 'file-item';

        const thumb = document.createElement('img');
        thumb.className = 'file-thumb';
        thumb.src = entry.previewUrl;
        thumb.alt = entry.file.name;

        const meta = document.createElement('div');
        meta.className = 'file-meta';
        const name = document.createElement('div');
        name.className = 'file-name';
        name.textContent = `${idx + 1}. ${entry.file.name}`;
        const sub = document.createElement('div');
        sub.className = 'file-sub';
        sub.textContent = formatBytes(entry.file.size);
        meta.append(name, sub);

        const actions = document.createElement('div');
        actions.className = 'file-actions';

        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.className = 'btn btn-secondary btn-sm';
        upBtn.textContent = labels.moveUp;
        upBtn.disabled = idx === 0;
        upBtn.addEventListener('click', () => {
          [imgEntries[idx - 1], imgEntries[idx]] = [imgEntries[idx], imgEntries[idx - 1]];
          renderImgList();
        });

        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.className = 'btn btn-secondary btn-sm';
        downBtn.textContent = labels.moveDown;
        downBtn.disabled = idx === imgEntries.length - 1;
        downBtn.addEventListener('click', () => {
          [imgEntries[idx + 1], imgEntries[idx]] = [imgEntries[idx], imgEntries[idx + 1]];
          renderImgList();
        });

        const rmBtn = document.createElement('button');
        rmBtn.type = 'button';
        rmBtn.className = 'btn-remove';
        rmBtn.title = labels.remove;
        rmBtn.innerHTML =
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        rmBtn.addEventListener('click', () => {
          URL.revokeObjectURL(entry.previewUrl);
          imgEntries = imgEntries.filter((x) => x.id !== entry.id);
          renderImgList();
        });

        actions.append(upBtn, downBtn, rmBtn);
        row.append(thumb, meta, actions);
        fromImgList!.appendChild(row);
      });
    }

    fromImgClear.addEventListener('click', () => {
      imgEntries.forEach((e) => URL.revokeObjectURL(e.previewUrl));
      imgEntries = [];
      setStatus(fromImgStatus, '', '');
      renderImgList();
    });

    fromImgRun.addEventListener('click', async () => {
      if (imgEntries.length === 0) return;
      fromImgRun.disabled = true;
      try {
        const pdfDoc = await PDFDocument.create();
        const mode = fromImgSize.value;
        const margin = Number(fromImgMargin.value) || 0;

        for (const entry of imgEntries) {
          let embedded;
          if (entry.file.type === 'image/jpeg') {
            embedded = await pdfDoc.embedJpg(await entry.file.arrayBuffer());
          } else if (entry.file.type === 'image/png') {
            embedded = await pdfDoc.embedPng(await entry.file.arrayBuffer());
          } else {
            // Convert WebP / GIF / etc. via canvas to JPEG/PNG for pdf-lib
            const { img, objectUrl } = await loadImageFromFile(entry.file);
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(objectUrl);
            const jpgBlob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Image encode failed'))), 'image/jpeg', 0.92);
            });
            releaseCanvas(canvas);
            embedded = await pdfDoc.embedJpg(await jpgBlob.arrayBuffer());
          }

          const imgW = embedded.width;
          const imgH = embedded.height;

          if (mode === 'fit') {
            const page = pdfDoc.addPage([imgW + margin * 2, imgH + margin * 2]);
            page.drawImage(embedded, { x: margin, y: margin, width: imgW, height: imgH });
          } else {
            // A4 portrait or landscape based on image aspect ratio
            const isLandscape = imgW > imgH;
            const pageW = isLandscape ? 841.89 : 595.28;
            const pageH = isLandscape ? 595.28 : 841.89;
            const maxW = pageW - margin * 2;
            const maxH = pageH - margin * 2;
            const scale = Math.min(maxW / imgW, maxH / imgH, 1);
            const drawW = imgW * scale;
            const drawH = imgH * scale;
            const page = pdfDoc.addPage([pageW, pageH]);
            page.drawImage(embedded, {
              x: (pageW - drawW) / 2,
              y: (pageH - drawH) / 2,
              width: drawW,
              height: drawH,
            });
          }
        }

        const outBytes = await pdfDoc.save();
        triggerDownload(new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }), `kitzero-images-${Date.now()}.pdf`);
        setStatus(fromImgStatus, 'success', labels.fromImageDone);
      } catch (err) {
        setStatus(fromImgStatus, 'error', String(err));
      } finally {
        fromImgRun.disabled = imgEntries.length === 0;
      }
    });
  }

  // ==================== TAB 5: PDF ORGANIZE (ROTATE / DELETE / REORDER) ====================
  const orgDrop = root.querySelector<HTMLElement>('[data-org-drop]');
  const orgInput = root.querySelector<HTMLInputElement>('[data-org-input]');
  const orgGrid = root.querySelector<HTMLElement>('[data-org-grid]');
  const orgSaveBtn = root.querySelector<HTMLButtonElement>('[data-org-save]');
  const orgResetBtn = root.querySelector<HTMLButtonElement>('[data-org-reset]');
  const orgStatus = root.querySelector<HTMLElement>('[data-org-status]');

  let orgFile: File | null = null;
  let orgBytes: Uint8Array | null = null;
  let orgPages: OrgPage[] = [];
  let orgInitialPages: OrgPage[] = [];

  if (orgDrop && orgInput && orgGrid && orgSaveBtn && orgResetBtn && orgStatus) {
    orgDrop.addEventListener('click', (e) => {
      if (e.target === orgInput) return;
      orgInput.click();
    });
    bindDropzoneKeyboard(orgDrop, orgInput);
    orgDrop.addEventListener('dragover', (e) => {
      e.preventDefault();
      orgDrop.classList.add('drag-over');
    });
    orgDrop.addEventListener('dragleave', () => orgDrop.classList.remove('drag-over'));
    orgDrop.addEventListener('drop', (e) => {
      e.preventDefault();
      orgDrop.classList.remove('drag-over');
      if (e.dataTransfer?.files?.[0]) void loadOrgPdf(e.dataTransfer.files[0]);
    });
    orgInput.addEventListener('change', () => {
      if (orgInput.files?.[0]) {
        void loadOrgPdf(orgInput.files[0]);
        orgInput.value = '';
      }
    });

    function clearOrgThumbs(): void {
      orgInitialPages.forEach((p) => URL.revokeObjectURL(p.thumbUrl));
      orgPages = [];
      orgInitialPages = [];
      orgGrid!.innerHTML = '';
    }

    async function loadOrgPdf(file: File): Promise<void> {
      clearOrgThumbs();
      orgFile = file;
      orgSaveBtn!.disabled = true;
      orgResetBtn!.disabled = true;
      setStatus(orgStatus!, 'info', labels.loadingMsg);

      let pdf: pdfjsLib.PDFDocumentProxy | null = null;
      try {
        orgBytes = new Uint8Array(await file.arrayBuffer());
        pdf = await pdfjsLib.getDocument({ data: orgBytes.slice() }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.6 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Thumb error'))), 'image/jpeg', 0.8);
          });
          releaseCanvas(canvas);
          page.cleanup();
          const entry: OrgPage = {
            origIndex: i - 1,
            origPageNum: i,
            thumbUrl: URL.createObjectURL(blob),
            rotationDelta: 0,
          };
          orgPages.push({ ...entry });
          orgInitialPages.push({ ...entry });
        }
        setStatus(orgStatus!, '', '');
        renderOrgGrid();
      } catch (err) {
        setStatus(orgStatus!, 'error', String(err));
      } finally {
        if (pdf) await pdf.destroy();
      }
    }

    function renderOrgGrid(): void {
      orgSaveBtn!.disabled = orgPages.length === 0;
      orgResetBtn!.disabled = orgInitialPages.length === 0;
      orgGrid!.innerHTML = '';

      orgPages.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'preview-card';

        const imgWrap = document.createElement('div');
        imgWrap.style.cssText = 'overflow:hidden;background:var(--surface-subtle);display:flex;align-items:center;justify-content:center;aspect-ratio:3/4;border-bottom:1px solid var(--border);';
        const img = document.createElement('img');
        img.src = p.thumbUrl;
        img.alt = `Page ${p.origPageNum}`;
        img.style.cssText = `max-width:100%;max-height:100%;object-fit:contain;border:none;aspect-ratio:auto;transition:transform 150ms ease;transform:rotate(${p.rotationDelta}deg);`;
        imgWrap.appendChild(img);

        const foot = document.createElement('div');
        foot.className = 'preview-card-foot';
        foot.innerHTML = `<span>#${idx + 1} (P.${p.origPageNum})</span><span>${((p.rotationDelta % 360) + 360) % 360}°</span>`;

        const controls = document.createElement('div');
        controls.className = 'org-actions';

        const rotL = document.createElement('button');
        rotL.type = 'button';
        rotL.className = 'btn btn-secondary';
        rotL.textContent = '↺';
        rotL.title = labels.rotateLeft;
        rotL.addEventListener('click', () => {
          p.rotationDelta -= 90;
          renderOrgGrid();
        });

        const rotR = document.createElement('button');
        rotR.type = 'button';
        rotR.className = 'btn btn-secondary';
        rotR.textContent = '↻';
        rotR.title = labels.rotateRight;
        rotR.addEventListener('click', () => {
          p.rotationDelta += 90;
          renderOrgGrid();
        });

        const mvL = document.createElement('button');
        mvL.type = 'button';
        mvL.className = 'btn btn-secondary';
        mvL.textContent = '←';
        mvL.title = labels.moveLeft;
        mvL.disabled = idx === 0;
        mvL.addEventListener('click', () => {
          [orgPages[idx - 1], orgPages[idx]] = [orgPages[idx], orgPages[idx - 1]];
          renderOrgGrid();
        });

        const mvR = document.createElement('button');
        mvR.type = 'button';
        mvR.className = 'btn btn-secondary';
        mvR.textContent = '→';
        mvR.title = labels.moveRight;
        mvR.disabled = idx === orgPages.length - 1;
        mvR.addEventListener('click', () => {
          [orgPages[idx + 1], orgPages[idx]] = [orgPages[idx], orgPages[idx + 1]];
          renderOrgGrid();
        });

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn btn-secondary';
        del.textContent = '×';
        del.title = labels.deletePage;
        del.addEventListener('click', () => {
          if (orgPages.length <= 1) {
            setStatus(orgStatus!, 'error', labels.emptyError);
            return;
          }
          orgPages.splice(idx, 1);
          renderOrgGrid();
        });

        controls.append(rotL, rotR, mvL, mvR, del);
        card.append(imgWrap, foot, controls);
        orgGrid!.appendChild(card);
      });
    }

    orgResetBtn.addEventListener('click', () => {
      orgPages = orgInitialPages.map((p) => ({ ...p, rotationDelta: 0 }));
      setStatus(orgStatus, '', '');
      renderOrgGrid();
    });

    orgSaveBtn.addEventListener('click', async () => {
      if (!orgFile || !orgBytes || orgPages.length === 0) return;
      orgSaveBtn.disabled = true;
      try {
        const srcDoc = await PDFDocument.load(orgBytes);
        const outDoc = await PDFDocument.create();
        const indices = orgPages.map((p) => p.origIndex);
        const copied = await outDoc.copyPages(srcDoc, indices);

        copied.forEach((page, i) => {
          const delta = orgPages[i].rotationDelta;
          if (delta !== 0) {
            const currentAngle = page.getRotation().angle;
            page.setRotation(degrees((((currentAngle + delta) % 360) + 360) % 360));
          }
          outDoc.addPage(page);
        });

        const outBytes = await outDoc.save();
        triggerDownload(
          new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }),
          `${stripExtension(orgFile.name)}_organized.pdf`
        );
        setStatus(orgStatus, 'success', labels.organizeDone);
      } catch (err) {
        setStatus(orgStatus, 'error', String(err));
      } finally {
        orgSaveBtn.disabled = orgPages.length === 0;
      }
    });
  }
}
