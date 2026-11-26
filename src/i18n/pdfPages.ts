import type { Locale, ToolSummary } from './translations';
import type { GuideKey } from './toolGuides';

export type PdfTabKey =
  | 'merge'
  | 'split'
  | 'to-image'
  | 'from-image'
  | 'organize'
  | 'compress'
  | 'watermark';

export type PdfDedicatedPageId =
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-to-image'
  | 'image-to-pdf'
  | 'pdf-organize'
  | 'pdf-compress'
  | 'pdf-watermark';

export interface PdfDedicatedPageMeta {
  id: PdfDedicatedPageId;
  tab: PdfTabKey;
  toolId: ToolSummary['id'];
  guideKey: GuideKey;
  metaTitle: string;
  metaDesc: string;
  title: string;
  subtitle: string;
}

export const pdfDedicatedPages: Record<Locale, Record<PdfDedicatedPageId, PdfDedicatedPageMeta>> = {
  ko: {
    'pdf-merge': {
      id: 'pdf-merge',
      tab: 'merge',
      toolId: 'pdf-merge',
      guideKey: 'pdf-merge',
      metaTitle: 'PDF 합치기 — 서버 업로드 없는 무료 로컬 병합 | KitZero',
      metaDesc: '여러 개의 PDF 파일을 외부 서버 업로드 없이 브라우저에서 순서대로 합쳐 하나의 PDF로 무료 저장하세요. 계약서·이력서·강의자료 병합에 안전합니다.',
      title: 'PDF 합치기',
      subtitle: '여러 PDF 파일의 순서를 자유롭게 조정하고 외부 서버 전송 없이 브라우저에서 하나의 PDF로 병합합니다.',
    },
    'pdf-split': {
      id: 'pdf-split',
      tab: 'split',
      toolId: 'pdf-split',
      guideKey: 'pdf-split',
      metaTitle: 'PDF 분할 · 페이지 추출 — 무료 로컬 PDF 나누기 | KitZero',
      metaDesc: '긴 PDF 문서에서 원하는 페이지 범위만 추출하거나 모든 페이지를 낱장 PDF(ZIP)로 나누세요. 100% 브라우저 로컬 처리로 민감 서류도 안전합니다.',
      title: 'PDF 분할 · 페이지 추출',
      subtitle: '필요한 페이지 범위(예: 1-3, 5)만 골라 새 PDF로 추출하거나 모든 페이지를 낱장 ZIP으로 분할합니다.',
    },
    'pdf-to-image': {
      id: 'pdf-to-image',
      tab: 'to-image',
      toolId: 'pdf-to-image',
      guideKey: 'pdf-to-image',
      metaTitle: 'PDF 이미지 변환 — 고화질 PNG · JPG 무료 저장 | KitZero',
      metaDesc: 'PDF 각 페이지를 1.5x~3.0x 고해상도 PNG·JPG 이미지로 브라우저에서 즉시 변환하고 ZIP으로 한 번에 저장하세요. 서버 업로드 없는 무료 도구입니다.',
      title: 'PDF → 이미지 변환',
      subtitle: 'PDF 전체 또는 지정한 페이지 범위를 선명한 고화질 PNG·JPG 이미지로 변환해 개별 또는 ZIP으로 내려받습니다.',
    },
    'image-to-pdf': {
      id: 'image-to-pdf',
      tab: 'from-image',
      toolId: 'image-to-pdf',
      guideKey: 'image-to-pdf',
      metaTitle: '이미지 PDF 변환 — JPG · PNG · WebP 사진 합치기 | KitZero',
      metaDesc: '신분증·영수증·스캔 사진 여러 장을 서버 업로드 없이 브라우저에서 순서대로 묶어 A4 또는 원본 크기의 PDF 1개로 무료 변환하세요.',
      title: '이미지 → PDF 변환',
      subtitle: 'JPG, PNG, WebP 사진 여러 장을 순서대로 배치해 A4 또는 원본 크기의 PDF 문서 1개로 안전하게 묶습니다.',
    },
    'pdf-organize': {
      id: 'pdf-organize',
      tab: 'organize',
      toolId: 'pdf-organize',
      guideKey: 'pdf-organize',
      metaTitle: 'PDF 회전 · 페이지 삭제 · 순서 변경 — 무료 로컬 정리 | KitZero',
      metaDesc: 'PDF 페이지 썸네일을 보며 90도 회전, 불필요한 페이지 삭제, 순서 변경을 브라우저에서 한 번에 처리하고 새 PDF로 저장하세요.',
      title: 'PDF 회전 · 삭제 · 순서 변경',
      subtitle: '각 페이지 미리보기를 확인하며 90° 회전, 페이지 삭제, 순서 이동을 로컬에서 빠르게 정리합니다.',
    },
    'pdf-compress': {
      id: 'pdf-compress',
      tab: 'compress',
      toolId: 'pdf-compress',
      guideKey: 'pdf-compress',
      metaTitle: 'PDF 용량 줄이기 — 서버 업로드 없는 무료 로컬 압축 | KitZero',
      metaDesc: '스캔본·이미지가 많아 무거운 PDF 파일의 용량을 3단계 압축 옵션으로 브라우저에서 안전하게 줄이세요. 이메일·관공서 첨부 제한 해결에 유용합니다.',
      title: 'PDF 용량 줄이기',
      subtitle: '고화질·균형·최대 압축 프리셋으로 대용량 PDF를 외부 서버 전송 없이 가볍게 압축합니다.',
    },
    'pdf-watermark': {
      id: 'pdf-watermark',
      tab: 'watermark',
      toolId: 'pdf-watermark',
      guideKey: 'pdf-watermark',
      metaTitle: 'PDF 워터마크 · 페이지 번호 넣기 — 한글 지원 무료 | KitZero',
      metaDesc: '견적서·계약서·강의자료 PDF에 깨짐 없는 한글 대각선 워터마크와 하단 페이지 번호(1/N)를 서버 업로드 없이 브라우저에서 삽입하세요.',
      title: 'PDF 워터마크 · 페이지 번호',
      subtitle: 'PDF 모든 페이지에 한글·영문 대각선 워터마크와 하단 중앙 쪽번호를 100% 로컬에서 삽입합니다.',
    },
  },
  en: {
    'pdf-merge': {
      id: 'pdf-merge',
      tab: 'merge',
      toolId: 'pdf-merge',
      guideKey: 'pdf-merge',
      metaTitle: 'Merge PDFs Locally — Free Private PDF Combiner | KitZero',
      metaDesc: 'Combine multiple PDF files into one document directly in your browser with zero server uploads. Reorder files freely and download immediately.',
      title: 'Merge PDFs',
      subtitle: 'Reorder and combine multiple PDF files into a single document locally with zero server uploads.',
    },
    'pdf-split': {
      id: 'pdf-split',
      tab: 'split',
      toolId: 'pdf-split',
      guideKey: 'pdf-split',
      metaTitle: 'Split & Extract PDF Pages — Free Local Tool | KitZero',
      metaDesc: 'Extract specific page ranges (e.g. 1-3, 5) into a new PDF or split every page into individual PDFs in a ZIP—100% private in your browser.',
      title: 'Split & Extract PDF',
      subtitle: 'Extract custom page ranges into a new PDF or split every page into a ZIP archive locally.',
    },
    'pdf-to-image': {
      id: 'pdf-to-image',
      tab: 'to-image',
      toolId: 'pdf-to-image',
      guideKey: 'pdf-to-image',
      metaTitle: 'PDF to PNG / JPG Converter — High-DPI Local Tool | KitZero',
      metaDesc: 'Convert PDF pages into crisp 1.5x–3.0x PNG or JPG images directly in your browser. Select custom page ranges and download all as a ZIP.',
      title: 'PDF to PNG / JPG',
      subtitle: 'Render all or selected PDF pages to high-resolution PNG or JPG images locally with ZIP export.',
    },
    'image-to-pdf': {
      id: 'image-to-pdf',
      tab: 'from-image',
      toolId: 'image-to-pdf',
      guideKey: 'image-to-pdf',
      metaTitle: 'Images to PDF Converter — JPG, PNG & WebP Locally | KitZero',
      metaDesc: 'Combine multiple JPG, PNG, or WebP photos into one clean PDF with A4 or original sizing right inside your browser—no uploads required.',
      title: 'Images to PDF',
      subtitle: 'Combine receipts, scans, or photos into a single A4 or original-size PDF privately in your browser.',
    },
    'pdf-organize': {
      id: 'pdf-organize',
      tab: 'organize',
      toolId: 'pdf-organize',
      guideKey: 'pdf-organize',
      metaTitle: 'Rotate, Delete & Reorder PDF Pages — Free Local | KitZero',
      metaDesc: 'Preview PDF page thumbnails to rotate 90°, delete unwanted pages, and reorder pages directly in your browser with zero server uploads.',
      title: 'Rotate, Delete & Reorder PDF',
      subtitle: 'Visually rotate 90°, delete unwanted pages, and rearrange PDF page order 100% locally.',
    },
    'pdf-compress': {
      id: 'pdf-compress',
      tab: 'compress',
      toolId: 'pdf-compress',
      guideKey: 'pdf-compress',
      metaTitle: 'Compress PDF Size Locally — Free Private Reducer | KitZero',
      metaDesc: 'Shrink heavy scanned or image-rich PDF files right in your browser with 3 compression presets and instant size savings—no server uploads.',
      title: 'Compress PDF Size',
      subtitle: 'Reduce large scanned PDFs locally with High Quality, Balanced, or Max Compression presets.',
    },
    'pdf-watermark': {
      id: 'pdf-watermark',
      tab: 'watermark',
      toolId: 'pdf-watermark',
      guideKey: 'pdf-watermark',
      metaTitle: 'PDF Watermark & Page Numbers — Free Local Stamp | KitZero',
      metaDesc: 'Stamp diagonal Unicode text watermarks and automatic bottom page numbers across every page of your PDF privately inside your browser.',
      title: 'PDF Watermark & Page Numbers',
      subtitle: 'Add diagonal text watermarks and bottom center page numbers to every PDF page 100% locally.',
    },
  },
};
