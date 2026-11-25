import type { Locale } from './translations';

export type GuideKey =
  | 'thumbnail-resizer'
  | 'image-crop'
  | 'image-blur'
  | 'heic-converter'
  | 'watermark'
  | 'pdf-tools'
  | 'pdf-sign'
  | 'qr-generator'
  | 'favicon-generator'
  | 'svg-converter';

interface ToolGuide {
  howToTitle: string;
  steps: string[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
}

export const toolGuides: Record<Locale, Record<GuideKey, ToolGuide>> = {
  ko: {
    'thumbnail-resizer': {
      howToTitle: '썸네일 비율 일괄 리사이즈 사용법',
      steps: [
        '좌측에서 유튜브(1280×720), 블로그 OG(1200×630), 인스타그램(1:1·4:5·9:16) 프리셋을 고르거나 원하는 가로·세로 픽셀을 입력합니다.',
        '여러 장의 이미지를 드롭존에 올리고 Cover(중앙 크롭) 또는 Contain(여백 채우기) 방식을 선택합니다.',
        '일괄 리사이즈 실행 후 개별 저장 또는 ZIP 일괄 다운로드로 한 번에 내려받습니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: 'Cover와 Contain 방식의 차이는 무엇인가요?',
          a: 'Cover는 지정한 비율에 빈틈없이 꽉 채우기 위해 중앙을 기준으로 가장자리를 자연스럽게 자르고, Contain은 원본 사진이 잘리지 않도록 전체를 유지하면서 남는 여백을 지정한 배경색으로 채웁니다.',
        },
        {
          q: '블로그나 유튜브 썸네일에 어떤 포맷이 가장 좋나요?',
          a: '웹 로딩 속도와 SEO를 생각하면 WebP(품질 85~90%)가 가장 가볍고 선명하며, 호환성이 꼭 필요한 플랫폼이라면 JPG로 저장하시면 됩니다.',
        },
      ],
    },
    'image-crop': {
      howToTitle: '이미지 자르기 · 90도 회전 · 반전 사용법',
      steps: [
        '편집할 JPG, PNG, WebP 이미지를 드롭존에 올립니다.',
        '자유 비율 또는 1:1, 16:9, 4:3, 3:4 비율을 고른 뒤 이미지 위를 드래그해 자를 영역을 지정합니다.',
        '필요하면 90° 좌/우 회전 또는 좌우·상하 반전을 적용하고 원하는 포맷으로 즉시 저장합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '자른 사진의 화질이 떨어지지 않나요?',
          a: '원본 해상도 픽셀 그대로 브라우저 Canvas에서 잘라내며, 무손실이 필요할 경우 출력 포맷을 PNG로 선택하면 화질 손실 없이 저장됩니다.',
        },
        {
          q: '모바일에서도 드래그로 자를 수 있나요?',
          a: '네. 터치 포인터 이벤트를 지원하므로 스마트폰 화면에서도 손가락으로 영역을 지정해 바로 자르고 회전할 수 있습니다.',
        },
      ],
    },
    'image-blur': {
      howToTitle: '개인정보 모자이크 · 블러 가리기 사용법',
      steps: [
        '얼굴, 차량번호, 주소, 계좌번호 등 가리고 싶은 이미지를 업로드합니다.',
        '모자이크(픽셀화), 블러(흐림), 검은 박스 중 스타일과 강도를 선택합니다.',
        '이미지 위에서 가릴 부분을 마우스나 손가락으로 드래그한 뒤 마스킹 이미지를 저장합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '모자이크 처리한 원본 사진이 서버에 남지 않나요?',
          a: '네. 모든 모자이크·블러 처리는 사용자의 브라우저 메모리 안에서만 실행되므로 원본과 결과물 모두 외부 서버로 전송되지 않습니다.',
        },
        {
          q: '모자이크 처리된 영역을 다시 복원할 수 있나요?',
          a: '저장된 파일은 픽셀 자체가 영구적으로 덮어씌워지므로 복원할 수 없어 안전합니다. 편집 도중 실수했다면 되돌리기 버튼으로 이전 단계로 돌아갈 수 있습니다.',
        },
      ],
    },
    'heic-converter': {
      howToTitle: '아이폰 HEIC → JPG · WebP 일괄 변환 사용법',
      steps: [
        '아이폰이나 아이패드에서 찍은 .heic 또는 .heif 사진들을 여러 장 한 번에 끌어다 놓습니다.',
        '출력 포맷(JPG, WebP, PNG)과 압축 품질을 선택합니다.',
        '전체 변환 시작을 누른 뒤 개별 다운로드 또는 ZIP 일괄 다운로드로 저장합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: 'HEIC 파일이 윈도우나 웹사이트에서 안 열리는 이유는 무엇인가요?',
          a: 'HEIC는 애플 iOS 기본 고효율 이미지 포맷으로 용량이 작지만, 일부 구형 윈도우·관공서·블로그 업로드 폼에서는 지원하지 않아 JPG나 WebP로 변환해 올리는 것이 안전합니다.',
        },
        {
          q: '변환 속도가 조금 걸리는 이유는 무엇인가요?',
          a: '파일을 외부 서버로 보내지 않고 내 브라우저 안에서 직접 HEIC 디코딩을 수행하기 때문이며, 덕분에 개인 사진이 외부로 유출될 걱정이 전혀 없습니다.',
        },
      ],
    },
    watermark: {
      howToTitle: '이미지 워터마크 일괄 삽입 사용법',
      steps: [
        '워터마크를 넣을 블로그·쇼핑몰 사진 여러 장을 한 번에 업로드합니다.',
        '텍스트 워터마크 또는 투명 로고 PNG를 선택하고 위치(우측 하단, 정중앙, 대각선 반복 패턴 등), 크기, 투명도를 실시간 미리보기로 맞춥니다.',
        '전체 워터마크 적용 후 ZIP 파일로 한 번에 내려받습니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '도용 방지에 가장 효과적인 워터마크 설정은 무엇인가요?',
          a: '배치 위치를 "전체 대각선 반복"으로 두고 불투명도를 20~35% 정도로 설정하면 사진 감상을 크게 해치지 않으면서 무단 크롭 도용을 막을 수 있습니다.',
        },
        {
          q: '로고 워터마크는 어떤 파일이 좋나요?',
          a: '배경이 투명한 PNG 로고 파일을 올리시면 사진 위에 자연스럽게 합성됩니다.',
        },
      ],
    },
    'pdf-tools': {
      howToTitle: '로컬 PDF 합치기 · 분할 · 변환 · 압축 사용법',
      steps: [
        '상단 탭에서 원하는 작업(PDF 합치기, 분할·추출, PDF→이미지, 이미지→PDF, 회전·삭제, 용량 줄이기, 워터마크)을 선택합니다.',
        'PDF 또는 이미지 파일을 끌어다 놓고 순서·페이지 범위·압축 강도를 설정합니다.',
        '실행 버튼을 누르면 모든 처리가 브라우저 안에서 즉시 끝나고 결과 파일이 다운로드됩니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '계약서나 이력서 같은 민감한 PDF를 올려도 정말 안전한가요?',
          a: '네. KitZero의 모든 PDF 병합·분할·압축·변환은 외부 서버 업로드 없이 사용자의 브라우저 메모리(pdf-lib, PDF.js)에서만 실행됩니다.',
        },
        {
          q: '페이지 수가 많은 대용량 PDF는 어떻게 작업하는 게 좋나요?',
          a: 'PDF → 이미지 변환 시 페이지 범위(예: 1-20)를 지정해 나누어 변환하시면 브라우저 메모리를 안정적으로 유지하면서 빠르게 작업할 수 있습니다.',
        },
      ],
    },
    'pdf-sign': {
      howToTitle: 'PDF 전자서명 · 도장 찍기 사용법',
      steps: [
        '서명할 계약서·동의서 PDF 파일을 업로드합니다.',
        '좌측에서 마우스/터치로 직접 사인을 그리거나 투명 배경 도장 PNG 파일을 선택합니다.',
        '오른쪽 PDF 페이지에서 원하는 위치를 클릭해 서명/도장을 배치한 뒤 서명된 PDF를 저장합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '여러 페이지에 각각 다른 위치로 서명할 수 있나요?',
          a: '네. 상단의 이전/다음 버튼으로 페이지를 이동하며 원하는 페이지마다 클릭해서 서명이나 도장을 추가한 뒤 한 번에 저장할 수 있습니다.',
        },
        {
          q: '계약서 PDF 파일이 서버에 저장되나요?',
          a: '아니요. 서명 합성부터 PDF 저장까지 100% 브라우저 로컬에서만 처리되며 파일은 단 1바이트도 외부로 전송되지 않습니다.',
        },
      ],
    },
    'qr-generator': {
      howToTitle: '만료 없는 로컬 QR 코드 생성 사용법',
      steps: [
        'URL/텍스트 또는 와이파이(Wi-Fi) 탭을 선택하고 링크나 접속 정보를 입력합니다.',
        '필요에 따라 QR 색상, 배경색, 해상도(최대 1024px), 오류 복원 수준, 중앙 로고를 설정합니다.',
        '웹/문서용 PNG 또는 인쇄용 고화질 벡터 SVG 파일로 즉시 다운로드합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '생성한 QR 코드에 유효기간이나 스캔 횟수 제한이 있나요?',
          a: '없습니다. 중간 리다이렉트 서버를 거치지 않는 순수 정적(Static) QR 코드이므로 영구적으로 만료 없이 작동합니다.',
        },
        {
          q: '중앙에 로고를 넣어도 인식이 잘 되나요?',
          a: '로고를 추가하면 오류 복원 수준이 자동으로 최고 단계(H, 30%)로 조정되어 스마트폰 카메라로 안정적으로 스캔됩니다.',
        },
      ],
    },
    'favicon-generator': {
      howToTitle: '파비콘(Favicon) & 앱 아이콘 세트 생성 사용법',
      steps: [
        '512×512px 이상의 정사각형 로고 이미지(PNG, SVG, JPG)를 드롭존에 올립니다.',
        '투명 배경 유지 여부, 배경색, 모서리 둥글기를 미리보기로 확인하며 조절합니다.',
        '전체 파비콘 세트 ZIP을 내려받아 웹사이트 루트(public/)에 넣고 제공된 HTML 태그를 <head>에 붙여넣습니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: 'ZIP 파일 안에 어떤 파일들이 들어 있나요?',
          a: '멀티 해상도 favicon.ico(16/32/48px), favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png(180px), android-chrome-192/512.png, site.webmanifest, head-tags.html이 모두 포함됩니다.',
        },
        {
          q: '구글 검색 결과에 파비콘이 나오게 하려면 어떻게 해야 하나요?',
          a: '생성된 favicon.ico와 PNG 파일을 사이트 루트에 올리고 <head>에 링크 태그를 추가하면 구글 크롤러가 자동으로 인식합니다.',
        },
      ],
    },
    'svg-converter': {
      howToTitle: 'SVG → PNG · WebP 고해상도 변환 사용법',
      steps: [
        '.svg 파일을 끌어다 놓거나 하단 코드 입력칸에 <svg>...</svg> 코드를 직접 붙여넣습니다.',
        '출력 가로 픽셀 크기(16~4096px), 포맷(PNG, WebP, JPG), 투명 배경 여부를 설정합니다.',
        '이미지 다운로드 버튼을 누르면 선명한 래스터 이미지가 즉시 저장됩니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: 'SVG를 2048px 이상으로 키워도 깨지지 않나요?',
          a: 'SVG는 수학적 벡터 포맷이므로 브라우저에서 원하는 고해상도로 직접 렌더링하면 픽셀 깨짐 없이 아주 선명한 PNG·WebP로 추출됩니다.',
        },
        {
          q: '코드를 바로 수정해서 색상만 바꾼 뒤 저장할 수 있나요?',
          a: '네. SVG 코드 편집창에서 fill 색상이나 크기를 수정하면 상단 미리보기에 즉시 반영되며 그대로 다운로드할 수 있습니다.',
        },
      ],
    },
  },
  en: {
    'thumbnail-resizer': {
      howToTitle: 'How to Batch Resize Thumbnails',
      steps: [
        'Select a preset (YouTube 1280×720, Blog OG 1200×630, Instagram 1:1 / 4:5 / 9:16) or enter custom dimensions.',
        'Drop multiple images and choose Cover (smart center crop) or Contain (keep full image with padding).',
        'Click Resize All and download individual images or export everything in a single ZIP archive.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'What is the difference between Cover and Contain?',
          a: 'Cover fills the exact aspect ratio by cleanly cropping excess edges from the center, while Contain preserves the entire image and pads remaining space with your chosen background color.',
        },
        {
          q: 'Which format is best for YouTube and blog thumbnails?',
          a: 'WebP (85–90% quality) delivers the smallest file size for fast web loading and SEO, while JPG is ideal when maximum platform compatibility is needed.',
        },
      ],
    },
    'image-crop': {
      howToTitle: 'How to Crop, Rotate & Flip Images Locally',
      steps: [
        'Upload a JPG, PNG, or WebP image into the dropzone.',
        'Choose Freeform or a fixed ratio (1:1, 16:9, 4:3, 3:4) and drag directly on the canvas to select your crop area.',
        'Rotate 90° left/right or flip horizontally/vertically, then export in your preferred format.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Does cropping reduce image quality?',
          a: 'The tool crops directly from full-resolution canvas pixels. Select PNG for lossless output or WebP/JPG for lightweight web files.',
        },
        {
          q: 'Does this work on mobile touchscreens?',
          a: 'Yes. Pointer events support both mouse and touch dragging so you can crop and rotate on phones and tablets.',
        },
      ],
    },
    'image-blur': {
      howToTitle: 'How to Redact Sensitive Info with Mosaic or Blur',
      steps: [
        'Upload a screenshot or photo containing faces, license plates, addresses, or private numbers.',
        'Pick Mosaic (pixelate), Gaussian Blur, or Solid Blackout and adjust the intensity slider.',
        'Drag over each sensitive area and click Download Redacted Image.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Is my unredacted photo ever uploaded to a server?',
          a: 'Never. All pixelation and blurring runs locally inside your browser memory with zero network uploads.',
        },
        {
          q: 'Can someone reverse the mosaic or blackout?',
          a: 'The exported image permanently overwrites the original pixels in the masked areas, and EXIF metadata is stripped automatically.',
        },
      ],
    },
    'heic-converter': {
      howToTitle: 'How to Batch Convert iPhone HEIC Photos',
      steps: [
        'Drop one or more .heic / .heif photos from your iPhone or iPad into the dropzone.',
        'Select JPG, WebP, or PNG output and set your desired quality.',
        'Click Convert All and save files individually or as a single ZIP archive.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Why convert HEIC to JPG or WebP?',
          a: 'Apple uses HEIC by default on iOS, but many web forms, Windows apps, and CMS platforms still require JPG or WebP.',
        },
        {
          q: 'Are my personal iPhone photos kept private?',
          a: 'Yes. Decoding happens entirely inside your browser via client-side JavaScript/WebAssembly with zero server uploads.',
        },
      ],
    },
    watermark: {
      howToTitle: 'How to Batch Add Watermarks to Photos',
      steps: [
        'Upload multiple JPG, PNG, or WebP images at once.',
        'Choose a text watermark or transparent PNG logo, then adjust position, size, and opacity with live preview.',
        'Click Apply to All and export all watermarked images in one ZIP file.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Which watermark layout prevents unauthorized cropping best?',
          a: 'Use the Diagonal Tiled Pattern at 20–35% opacity to protect the entire frame without overwhelming your visual.',
        },
        {
          q: 'What logo file works best for image watermarks?',
          a: 'A transparent-background PNG logo blends cleanly over any photo.',
        },
      ],
    },
    'pdf-tools': {
      howToTitle: 'How to Use KitZero Local PDF Tools',
      steps: [
        'Select the tab you need: Merge, Split/Extract, PDF to Images, Images to PDF, Organize, Compress, or Watermark.',
        'Drop your PDF or image files and adjust page order, ranges, or compression level.',
        'Run the tool — processing completes directly inside your browser and downloads immediately.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Is it safe to process confidential PDFs like contracts or IDs?',
          a: 'Yes. Every PDF tool runs 100% locally in your browser using pdf-lib and PDF.js — zero bytes are sent to any server.',
        },
        {
          q: 'How should I handle very large multi-hundred-page PDFs?',
          a: 'Use the Page Range input (e.g., 1-20) when rendering PDF pages to images so memory usage stays fast and stable.',
        },
      ],
    },
    'pdf-sign': {
      howToTitle: 'How to Sign or Stamp a PDF Locally',
      steps: [
        'Upload the contract or form PDF you want to sign.',
        'Draw your handwritten signature on the pad or upload a transparent PNG stamp.',
        'Navigate to the target page, click where you want to place it, and click Save Signed PDF.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Can I place signatures on multiple pages?',
          a: 'Yes. Use Prev/Next to switch pages and click to place signatures or stamps on as many pages as needed before saving.',
        },
        {
          q: 'Is my signed contract uploaded anywhere?',
          a: 'No. Your PDF and signature stay strictly inside your local browser memory.',
        },
      ],
    },
    'qr-generator': {
      howToTitle: 'How to Create Permanent Local QR Codes',
      steps: [
        'Choose URL/Text or Wi-Fi Login mode and enter your link or network details.',
        'Customize colors, PNG resolution, error correction level, or add an optional center logo.',
        'Download a crisp PNG for web/docs or scalable vector SVG for print.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Do these QR codes ever expire?',
          a: 'Never. KitZero generates pure static QR codes with no tracking redirect server, so they work forever.',
        },
        {
          q: 'Will my QR code still scan reliably with a center logo?',
          a: 'Yes. Adding a logo automatically sets error correction to Level H (30%), keeping scans fast and reliable.',
        },
      ],
    },
    'favicon-generator': {
      howToTitle: 'How to Generate a Complete Favicon Package',
      steps: [
        'Upload a square logo image (512×512px+ PNG, SVG, or JPG recommended).',
        'Toggle transparent background or pick a custom background color and corner radius.',
        'Download the ZIP package, place the files in your site root, and paste the generated HTML tags into <head>.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'What files are included in the favicon ZIP?',
          a: 'Multi-size favicon.ico (16/32/48px), favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png (180px), android-chrome-192/512.png, site.webmanifest, and head-tags.html.',
        },
        {
          q: 'How does Google display my favicon in search results?',
          a: 'Include favicon.ico and the <link rel="icon"> tags in your site <head> at your root domain so Googlebot indexes it cleanly.',
        },
      ],
    },
    'svg-converter': {
      howToTitle: 'How to Convert SVG to High-Res PNG or WebP',
      steps: [
        'Drop an .svg file or paste raw <svg>...</svg> markup into the editor.',
        'Set your desired output width (up to 4096px), format (PNG, WebP, JPG), and background option.',
        'Click Download Image to export a razor-sharp raster file locally.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Will exporting an SVG at 2048px or 4096px look blurry?',
          a: 'No. Because SVG is vector-based, the browser renders it natively at your target resolution with crisp edges.',
        },
        {
          q: 'Can I tweak colors directly in the SVG code before downloading?',
          a: 'Yes. Any edits in the SVG markup box update the live preview immediately and carry into your downloaded image.',
        },
      ],
    },
  },
};
