# KitZero (킷제로) — 100% Local Browser Image & PDF Converter

서버 업로드 없이 브라우저 안에서 즉시 실행되는 이미지·PDF 로컬 변환 유틸리티입니다.  
한국어(`/`)와 영어(`/en/`)를 동시에 지원하며, 정적 사이트(Astro)로 빌드되어 Cloudflare Pages / Vercel / Netlify에 무료 배포할 수 있습니다.

## 포함된 도구 (MVP)

1. **이미지 압축 · WebP 변환 · EXIF 삭제기** (`/image-optimizer/`, `/en/image-optimizer/`)
   - EXIF 메타데이터(GPS 위치, 카메라 모델) 자동 감지 및 Canvas 재인코딩을 통한 완전 삭제
   - WebP / JPG / PNG 일괄 변환, 압축 품질·최대 가로 크기 설정
   - 원본 대비 용량 절감(%) 실시간 집계 및 개별/ZIP 일괄 다운로드

2. **썸네일 비율 일괄 리사이저** (`/thumbnail-resizer/`, `/en/thumbnail-resizer/`)
   - 유튜브(1280×720), 블로그 OG(1200×630), 인스타 정사각(1080×1080)·세로(1080×1350)·쇼츠/릴스(1080×1920), 네이버 블로그(900×900) 프리셋 및 직접 입력
   - Cover(중앙 크롭), Contain(여백 채우기 + 배경색), Fill(늘리기) 지원
   - 다중 이미지 일괄 리사이징 및 ZIP 다운로드

3. **PDF 합치기 · 분할 · 이미지 변환기** (`/pdf-tools/`, `/en/pdf-tools/`)
   - **합치기**: 여러 PDF 파일 순서 조정 후 하나로 병합 (`pdf-lib`)
   - **분할/추출**: 페이지 범위(`1-3, 5`) 추출 또는 모든 페이지 낱장 분할(ZIP)
   - **PDF → 이미지**: 각 페이지를 고해상도 PNG/JPG로 로컬 렌더링 (`pdfjs-dist` + 로컬 워커 `/pdf.worker.min.mjs`)

## 실행 및 배포

```bash
npm install
npm run dev
npm run build
```

배포 전 `astro.config.mjs`와 `public/robots.txt`의 `https://kitzero.jokerx04.com`을 실제 도메인으로 변경하세요.
