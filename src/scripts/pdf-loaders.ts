import type JSZipType from 'jszip';

type JSZipCtor = typeof JSZipType;

let pdfLibPromise: Promise<typeof import('pdf-lib')> | null = null;
let pdfJsPromise: Promise<typeof import('pdfjs-dist')> | null = null;
let jszipPromise: Promise<JSZipCtor> | null = null;

export function loadPdfLib(): Promise<typeof import('pdf-lib')> {
  if (!pdfLibPromise) {
    pdfLibPromise = import('pdf-lib');
  }
  return pdfLibPromise;
}

export function loadPdfJs(): Promise<typeof import('pdfjs-dist')> {
  if (!pdfJsPromise) {
    pdfJsPromise = import('pdfjs-dist').then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      return mod;
    });
  }
  return pdfJsPromise;
}

export function loadJSZip(): Promise<JSZipCtor> {
  if (!jszipPromise) {
    jszipPromise = import('jszip').then(
      (mod) => (mod as unknown as { default?: JSZipCtor }).default ?? (mod as unknown as JSZipCtor)
    );
  }
  return jszipPromise;
}
