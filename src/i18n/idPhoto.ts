import type { Locale } from './translations';

export const idPhotoCopy = {
  ko: {
    metaTitle: '여권 · 증명사진 규격 자르기 — 3.5×4.5cm · 4×6 인화판 무료 | KitZero',
    metaDesc: '여권사진(3.5×4.5cm), 반명함판(3×4cm), 미국 비자(5×5cm) 규격에 맞춰 얼굴 가이드라인으로 정확히 자르고 낱장 또는 4×6 인화지 배치판으로 무료 저장하세요.',
    title: '여권 · 증명사진 규격 자르기',
    subtitle: '여권·주민등록증·반명함판 규격에 맞춰 얼굴 가이드라인으로 위치를 잡고 낱장(300 DPI) 또는 4×6 인화지 배치판으로 100% 로컬에서 저장합니다.',
    dropTitle: '증명사진으로 만들 원본 사진을 올려주세요',
    dropHint: 'JPG, PNG, WebP 지원 · 서버 업로드 없이 브라우저에서만 처리',
    selectFile: '사진 선택',
    changeBtn: '다른 사진 선택',
    clearBtn: '초기화',
    presetLabel: '사진 규격 선택',
    presets: [
      { id: 'kr-passport', name: '여권 · 주민등록증', spec: '3.5×4.5cm', width: 413, height: 531 },
      { id: 'kr-id', name: '반명함판 · 이력서', spec: '3.0×4.0cm', width: 354, height: 472 },
      { id: 'us-passport', name: '미국 여권 · 비자', spec: '5.0×5.0cm', width: 600, height: 600 },
      { id: 'cn-visa', name: '중국 비자', spec: '3.3×4.8cm', width: 390, height: 567 },
    ],
    zoomLabel: '확대 / 축소',
    bgLabel: '여백 배경색',
    guideLabel: '얼굴 · 정수리 가이드라인 표시 (저장 제외)',
    formatLabel: '낱장 저장 포맷',
    resetBtn: '위치 초기화',
    downloadSingleBtn: '낱장 저장 (300 DPI)',
    downloadSheetBtn: '4×6 인화지 배치판 저장',
    dragHint: '사진을 드래그해 얼굴을 가이드라인 안에 맞추고 슬라이더로 크기를 조절하세요.',
    doneSingle: '규격 증명사진(낱장)을 저장했습니다.',
    doneSheet: '4×6 인화지 배치판(300 DPI)을 저장했습니다.',
  },
  en: {
    metaTitle: 'Passport & ID Photo Cropper — 35×45mm & 4×6 | KitZero',
    metaDesc: 'Crop passport and ID photos (35×45mm, 30×40mm, US 2×2") with official face alignment guides and export single 300 DPI photos or a 4×6 print sheet locally.',
    title: 'Passport & ID Photo Cropper',
    subtitle: 'Frame passport, visa, or ID photos with face alignment guides and export single 300 DPI files or a 4×6 print sheet 100% locally.',
    dropTitle: 'Drop a portrait photo to frame',
    dropHint: 'Supports JPG, PNG, WebP · 100% private in your browser',
    selectFile: 'Select Photo',
    changeBtn: 'Change Photo',
    clearBtn: 'Clear',
    presetLabel: 'Photo Standard',
    presets: [
      { id: 'kr-passport', name: 'Passport / EU / KR ID', spec: '35×45mm', width: 413, height: 531 },
      { id: 'kr-id', name: 'Resume / ID', spec: '30×40mm', width: 354, height: 472 },
      { id: 'us-passport', name: 'US Passport / Visa', spec: '2×2"', width: 600, height: 600 },
      { id: 'cn-visa', name: 'China Visa', spec: '33×48mm', width: 390, height: 567 },
    ],
    zoomLabel: 'Zoom',
    bgLabel: 'Background Fill',
    guideLabel: 'Show face guide (not exported)',
    formatLabel: 'Single Export Format',
    resetBtn: 'Reset Position',
    downloadSingleBtn: 'Download Single (300 DPI)',
    downloadSheetBtn: 'Download 4×6 Print Sheet',
    dragHint: 'Drag the photo to align your head inside the guide and use the slider to zoom.',
    doneSingle: 'Single ID photo downloaded.',
    doneSheet: '4×6 print sheet (300 DPI) downloaded.',
  },
} as const;

export function getIdPhotoCopy(locale: Locale) {
  return idPhotoCopy[locale];
}
