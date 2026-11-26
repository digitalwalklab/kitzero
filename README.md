# KitZero (킷제로) — 서버 업로드 없는 무료 이미지·PDF·문서 도구 21종

> **남의 서버에 올리기 불안해서, 내가 쓰려고 만들었습니다.**

🌐 **서비스 주소**: https://kitzero.jokerx04.com/ ([한국어](https://kitzero.jokerx04.com/) · [English](https://kitzero.jokerx04.com/en/))

**KitZero(킷제로)**는 사진 압축·모자이크·여권사진부터 PDF 합치기·분할·압축·서명, 글자 수 세기, 색상 추출까지 **21가지 실무 도구**를 외부 서버 전송 없이 내 PC·스마트폰 브라우저 안에서 바로 처리하는 100% 정적 웹 도구 모음입니다.

---

## 핵심 원칙

- **서버 업로드 0%**: 모든 파일 처리는 브라우저 메모리(HTML5 Canvas, `pdf-lib`, `pdfjs-dist`, `heic2any`, `exifr`, `qrcode`, `jszip`) 안에서만 실행됩니다.
- **브라우저 강제 보안**: Content-Security-Policy(CSP) 및 HTTPS 강제 리디렉션(301) 적용, 백엔드·DB·파일 저장소 없음.
- **가입·워터마크·결제 없음**: 열고 바로 무료로 사용할 수 있으며, 탭을 닫는 순간 작업 흔적도 함께 사라집니다.
- **빠른 속도 & 편의 기능**: 한/영 53개 정적 페이지, PDF/HEIC 엔진 지연 로딩, CSS 인라인화, 다크/라이트 모드, `/` 도구 빠른 검색, `Ctrl+V` 클립보드 이미지 붙여넣기, 최근 사용 도구 바, PWA 오프라인 캐싱 지원.

---

## 포함된 도구 (총 21종)

### 이미지 도구 (8종)
| 도구 | 주소 | 주요 기능 |
|---|---|---|
| **이미지 압축 · WebP · EXIF** | [`/image-optimizer/`](https://kitzero.jokerx04.com/image-optimizer/) | WebP/JPG/PNG 일괄 압축, GPS·EXIF 탐지 및 삭제/유지 선택(JPEG·WebP), 전후 비교 슬라이더, ZIP 저장 |
| **썸네일 비율 리사이저** | [`/thumbnail-resizer/`](https://kitzero.jokerx04.com/thumbnail-resizer/) | 유튜브(16:9), 블로그 OG(1200×630), 인스타(1:1·4:5·9:16), 네이버 프리셋, Cover/Contain/Fill, ZIP 저장 |
| **이미지 자르기 · 회전 · 반전** | [`/image-crop/`](https://kitzero.jokerx04.com/image-crop/) | 자유·1:1·16:9·4:3·3:4 드래그 자르기, 90° 회전, 좌우/상하 반전 |
| **모자이크 · 블러 가리기** | [`/image-blur/`](https://kitzero.jokerx04.com/image-blur/) | 얼굴·차량번호·계좌번호 드래그 마스킹 (모바일/사파리 호환 블러, 모자이크, 검은 박스, 되돌리기) |
| **아이폰 HEIC 변환기** | [`/heic-converter/`](https://kitzero.jokerx04.com/heic-converter/) | `.heic`/`.heif` 다중 파일 → JPG/WebP/PNG 일괄 변환 및 ZIP 다운로드 |
| **이미지 워터마크 일괄 넣기** | [`/watermark/`](https://kitzero.jokerx04.com/watermark/) | 텍스트 또는 투명 PNG 로고 워터마크, 6가지 위치 및 대각선 도용방지 패턴 |
| **이미지 이어붙이기 · 합치기** | [`/image-merge/`](https://kitzero.jokerx04.com/image-merge/) | 세로·가로·2열 그리드 이어붙이기, 크기 자동 맞춤, 간격·배경색 조절 |
| **여권 · 증명사진 규격 자르기** | [`/id-photo/`](https://kitzero.jokerx04.com/id-photo/) | 여권(3.5×4.5cm), 반명함판(3×4cm), 미국 비자(5×5cm), 중국 비자 300 DPI 가이드 자르기 + 4×6 인화지 배치판 |

### PDF 도구 (8종)
| 도구 | 주소 | 주요 기능 |
|---|---|---|
| **PDF 합치기** | [`/pdf-merge/`](https://kitzero.jokerx04.com/pdf-merge/) | 여러 PDF 파일 순서 조정 후 하나로 병합 |
| **PDF 분할 · 페이지 추출** | [`/pdf-split/`](https://kitzero.jokerx04.com/pdf-split/) | 원하는 페이지 범위(`1-3, 5`) 추출 또는 전체 낱장 PDF(ZIP) 분할 |
| **PDF → 이미지 변환** | [`/pdf-to-image/`](https://kitzero.jokerx04.com/pdf-to-image/) | 1.5x~3.0x 고해상도 PNG/JPG 렌더링, 페이지 범위 선택, 중단 버튼, ZIP 저장 |
| **이미지 → PDF 변환** | [`/image-to-pdf/`](https://kitzero.jokerx04.com/image-to-pdf/) | JPG/PNG/WebP 사진 여러 장을 A4 또는 원본 크기의 PDF 1개로 묶기 (`Ctrl+V` 지원) |
| **PDF 회전 · 삭제 · 순서 변경** | [`/pdf-organize/`](https://kitzero.jokerx04.com/pdf-organize/) | 페이지 썸네일 미리보기, 90° 회전, 순서 이동, 삭제 (텍스트 검색 유지) |
| **PDF 용량 줄이기** | [`/pdf-compress/`](https://kitzero.jokerx04.com/pdf-compress/) | 무손실 구조 최적화 + 3단계 스캔 압축 자동 비교 (원본보다 커지는 파일 다운로드 방지) |
| **PDF 워터마크 · 페이지 번호** | [`/pdf-watermark/`](https://kitzero.jokerx04.com/pdf-watermark/) | 한글 깨짐 없는 대각선 워터마크 + 하단 중앙 페이지 번호(`1 / N`) 삽입 |
| **PDF 전자서명 · 도장 찍기** | [`/pdf-sign/`](https://kitzero.jokerx04.com/pdf-sign/) | 마우스·터치 직접 사인 패드 또는 투명 도장 PNG를 원하는 페이지·위치에 배치 |

*(통합 PDF 허브 [`/pdf-tools/`](https://kitzero.jokerx04.com/pdf-tools/)에서도 7개 탭을 한 번에 이용할 수 있습니다.)*

### 웹 · 문서 유틸리티 (5종)
| 도구 | 주소 | 주요 기능 |
|---|---|---|
| **QR 코드 생성기** | [`/qr-generator/`](https://kitzero.jokerx04.com/qr-generator/) | 만료·추적 없는 URL/텍스트/Wi-Fi QR 코드 생성, 중앙 로고 삽입, PNG·SVG 저장 |
| **파비콘 · 앱 아이콘 생성기** | [`/favicon-generator/`](https://kitzero.jokerx04.com/favicon-generator/) | 멀티해상도 `favicon.ico` + Apple/Android PNG + `site.webmanifest` + HTML 태그 ZIP |
| **SVG → PNG · WebP 변환기** | [`/svg-converter/`](https://kitzero.jokerx04.com/svg-converter/) | `.svg` 파일 업로드 또는 코드 실시간 편집 후 최대 4096px 고해상도 추출 |
| **글자 수 세기 · 바이트 계산기** | [`/word-counter/`](https://kitzero.jokerx04.com/word-counter/) | 공백 포함/제외, 한글 2B(EUC-KR) & UTF-8 바이트, 단어·문장·읽기 시간, 빈도 Top 5, 중복 공백 정리 |
| **이미지 색상 추출기 · 스포이드** | [`/color-picker/`](https://kitzero.jokerx04.com/color-picker/) | 클릭/터치 픽셀 스포이드(HEX/RGB/HSL 복사) + 대표 색상 팔레트 8색 자동 추출 |

---

## 기술 스택 및 폴더 구조

- **프레임워크**: [Astro 5](https://astro.build) (100% 정적 빌드, 콘텐츠 페이지 런타임 JS 0KB)
- **클라이언트 라이브러리** *(전부 MIT / Apache-2.0)*: `pdf-lib`, `pdfjs-dist` (로컬 워커), `heic2any`, `jszip`, `exifr`, `qrcode`
- **스타일**: 모듈화 CSS (`src/styles/tokens.css`, `layout.css`, `components.css`)
- **단일 레지스트리**: `src/i18n/toolRegistry.ts`에서 내비게이션·브레드크럼·`sitemap.xml` 자동 파생

```text
src/
├── components/   # 21종 도구 뷰 + 홈, 안내/약관, SEO 가이드, 카테고리 서브탭
├── i18n/         # 한/영(ko/en) 다국어 문구, 사용법/FAQ, toolRegistry.ts
├── layouts/      # BaseLayout.astro (CSP, JSON-LD, hreflang, 헤더/모바일 메뉴, 스킵 링크)
├── pages/        # 정적 라우트 (/, /en/, /404, /sitemap.xml, /rss.xml, /en/rss.xml)
├── scripts/      # 순수 TypeScript 도구 로직, 공통 utils.ts, 지연 로딩 pdf-loaders.ts
└── styles/       # tokens.css, layout.css, components.css, global.css
tests/
└── core.test.ts  # Node 내장 테스트 러너 기반 핵심 로직 유닛 테스트
```

---

## 로컬 실행 및 배포

```bash
npm install
npm run dev      # 로컬 개발 서버 실행 (http://localhost:4321)
npm test         # 핵심 로직 유닛 테스트 실행
npm run check    # TypeScript / Astro 타입 검사
npm run build    # dist/ 폴더에 정적 사이트 빌드
```

`main` 브랜치에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 빌드해 GitHub Pages(`https://kitzero.jokerx04.com/`)에 배포합니다.
