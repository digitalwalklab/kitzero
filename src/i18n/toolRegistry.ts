import type { Locale, ToolCategory, ToolSummary } from './translations';

export type PageNavId =
  | 'home'
  | 'pdf-tools'
  | 'privacy'
  | 'terms'
  | 'about'
  | ToolSummary['id'];

export interface ToolRegistryEntry {
  id: ToolSummary['id'];
  path: string;
  category: ToolCategory;
  label: Record<Locale, string>;
}

/**
 * Single source of truth for all 21 KitZero tool routes, categories, and breadcrumb labels.
 * Sitemap, BaseLayout breadcrumbs, and category highlighting derive from this list.
 */
export const TOOL_REGISTRY: readonly ToolRegistryEntry[] = [
  // Image Tools (8)
  { id: 'image-optimizer', path: '/image-optimizer/', category: 'image', label: { ko: '이미지 압축 · EXIF', en: 'Image Compressor & EXIF' } },
  { id: 'thumbnail-resizer', path: '/thumbnail-resizer/', category: 'image', label: { ko: '썸네일 비율 리사이저', en: 'Thumbnail Resizer' } },
  { id: 'image-crop', path: '/image-crop/', category: 'image', label: { ko: '이미지 자르기 · 회전 · 반전', en: 'Image Crop, Rotate & Flip' } },
  { id: 'image-blur', path: '/image-blur/', category: 'image', label: { ko: '모자이크 · 블러 가리기', en: 'Mosaic & Blur Redactor' } },
  { id: 'heic-converter', path: '/heic-converter/', category: 'image', label: { ko: '아이폰 HEIC 변환기', en: 'HEIC Converter' } },
  { id: 'watermark', path: '/watermark/', category: 'image', label: { ko: '이미지 워터마크', en: 'Batch Watermark' } },
  { id: 'image-merge', path: '/image-merge/', category: 'image', label: { ko: '이미지 이어붙이기 · 사진 합치기', en: 'Combine & Stitch Images' } },
  { id: 'id-photo', path: '/id-photo/', category: 'image', label: { ko: '여권 · 증명사진 규격 자르기', en: 'Passport & ID Photo Cropper' } },
  // PDF Tools (8)
  { id: 'pdf-merge', path: '/pdf-merge/', category: 'pdf', label: { ko: 'PDF 합치기', en: 'Merge PDFs' } },
  { id: 'pdf-split', path: '/pdf-split/', category: 'pdf', label: { ko: 'PDF 분할 · 페이지 추출', en: 'Split & Extract PDF' } },
  { id: 'pdf-to-image', path: '/pdf-to-image/', category: 'pdf', label: { ko: 'PDF → 이미지 변환', en: 'PDF to PNG / JPG' } },
  { id: 'image-to-pdf', path: '/image-to-pdf/', category: 'pdf', label: { ko: '이미지 → PDF 변환', en: 'Images to PDF' } },
  { id: 'pdf-organize', path: '/pdf-organize/', category: 'pdf', label: { ko: 'PDF 회전 · 삭제 · 순서 변경', en: 'Rotate, Delete & Reorder PDF' } },
  { id: 'pdf-compress', path: '/pdf-compress/', category: 'pdf', label: { ko: 'PDF 용량 줄이기', en: 'Compress PDF Size' } },
  { id: 'pdf-watermark', path: '/pdf-watermark/', category: 'pdf', label: { ko: 'PDF 워터마크 · 페이지 번호', en: 'PDF Watermark & Page Numbers' } },
  { id: 'pdf-sign', path: '/pdf-sign/', category: 'pdf', label: { ko: 'PDF 전자서명 · 도장 찍기', en: 'Sign & Stamp PDF' } },
  // Utilities (5)
  { id: 'qr-generator', path: '/qr-generator/', category: 'utility', label: { ko: 'QR 코드 생성기', en: 'QR Code Generator' } },
  { id: 'favicon-generator', path: '/favicon-generator/', category: 'utility', label: { ko: '파비콘 생성기', en: 'Favicon Generator' } },
  { id: 'svg-converter', path: '/svg-converter/', category: 'utility', label: { ko: 'SVG → PNG · WebP 변환기', en: 'SVG Converter' } },
  { id: 'word-counter', path: '/word-counter/', category: 'utility', label: { ko: '글자 수 세기 · 바이트 계산기', en: 'Word & Character Counter' } },
  { id: 'color-picker', path: '/color-picker/', category: 'utility', label: { ko: '이미지 색상 추출기 · 스포이드', en: 'Image Color Picker' } },
] as const;

export const LEGAL_PATHS = ['/about/', '/terms/', '/privacy/'] as const;

export const SITEMAP_PATHS: readonly string[] = [
  '/',
  ...TOOL_REGISTRY.map((t) => t.path),
  '/pdf-tools/',
  ...LEGAL_PATHS,
];

export function getToolRegistryEntry(id: PageNavId): ToolRegistryEntry | undefined {
  return TOOL_REGISTRY.find((t) => t.id === id);
}

export function getNavLabel(id: PageNavId, locale: Locale): string {
  const entry = getToolRegistryEntry(id);
  if (entry) return entry.label[locale];
  const staticLabels: Record<'home' | 'pdf-tools' | 'privacy' | 'terms' | 'about', Record<Locale, string>> = {
    home: { ko: '홈', en: 'Home' },
    'pdf-tools': { ko: 'PDF 도구', en: 'PDF Tools' },
    privacy: { ko: '개인정보처리방침', en: 'Privacy Policy' },
    terms: { ko: '이용약관', en: 'Terms of Service' },
    about: { ko: '소개 · 문의', en: 'About & Contact' },
  };
  return staticLabels[id as keyof typeof staticLabels][locale];
}
