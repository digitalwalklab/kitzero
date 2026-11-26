export type Locale = 'ko' | 'en';

export type ToolCategory = 'image' | 'pdf' | 'utility';
export type ToolAccent = 'emerald' | 'blue' | 'rose' | 'amber' | 'violet' | 'cyan';

export interface ToolSummary {
  id:
    | 'image-optimizer'
    | 'thumbnail-resizer'
    | 'image-crop'
    | 'image-blur'
    | 'heic-converter'
    | 'watermark'
    | 'image-merge'
    | 'id-photo'
    | 'pdf-merge'
    | 'pdf-split'
    | 'pdf-to-image'
    | 'image-to-pdf'
    | 'pdf-organize'
    | 'pdf-compress'
    | 'pdf-watermark'
    | 'pdf-sign'
    | 'qr-generator'
    | 'favicon-generator'
    | 'svg-converter'
    | 'word-counter'
    | 'color-picker';
  category: ToolCategory;
  accent: ToolAccent;
  slug: string;
  badge: string;
  title: string;
  shortTitle: string;
  shortDesc: string;
  description: string;
  features: string[];
  cta: string;
}

export interface TranslationDict {
  lang: Locale;
  htmlLang: string;
  siteName: string;
  tagline: string;
  localBadge: string;
  localBadgeShort: string;
  nav: {
    home: string;
    imageMenu: string;
    pdfMenu: string;
    utilityMenu: string;
    allTools: string;
    imageOptimizer: string;
    thumbnailResizer: string;
    pdfTools: string;
    privacy: string;
  };
  categories: {
    all: string;
    image: string;
    pdf: string;
    utility: string;
  };
  footer: {
    guarantee: string;
    privacyLink: string;
    copyright: string;
  };
  home: {
    metaTitle: string;
    metaDesc: string;
    heroTitle: string;
    heroSubtitle: string;
    trustPoints: { title: string; desc: string }[];
    toolsHeading: string;
    toolsSubheading: string;
    faqHeading: string;
    faqs: { q: string; a: string }[];
  };
  tools: ToolSummary[];
  imageOptimizer: {
    metaTitle: string;
    metaDesc: string;
    title: string;
    subtitle: string;
    dropTitle: string;
    dropHint: string;
    selectFiles: string;
    formatLabel: string;
    qualityLabel: string;
    maxWidthLabel: string;
    maxWidthNone: string;
    stripExifLabel: string;
    stripExifDesc: string;
    processAll: string;
    cancelBtn: string;
    downloadZip: string;
    clearAll: string;
    largeBatchWarn: string;
    canvasLimitError: string;
    cancelledMsg: string;
    summaryBefore: string;
    summaryAfter: string;
    summarySaved: string;
    exifFound: string;
    exifGps: string;
    exifClean: string;
    exifRemovedBadge: string;
    exifPreservedBadge: string;
    exifUnsupportedBadge: string;
    statusReady: string;
    statusProcessing: string;
    statusDone: string;
    statusError: string;
    downloadSingle: string;
    emptyState: string;
    howItWorksTitle: string;
    howItWorksSteps: string[];
  };
  thumbnailResizer: {
    metaTitle: string;
    metaDesc: string;
    title: string;
    subtitle: string;
    dropTitle: string;
    dropHint: string;
    selectFiles: string;
    presetsTitle: string;
    customSizeTitle: string;
    widthLabel: string;
    heightLabel: string;
    fitModeLabel: string;
    fitCover: string;
    fitContain: string;
    fitFill: string;
    bgColorLabel: string;
    formatLabel: string;
    qualityLabel: string;
    processAll: string;
    cancelBtn: string;
    downloadZip: string;
    clearAll: string;
    largeBatchWarn: string;
    downloadSingle: string;
    statusReady: string;
    statusDone: string;
    presets: { id: string; name: string; ratio: string; width: number; height: number }[];
  };
  pdfTools: {
    metaTitle: string;
    metaDesc: string;
    title: string;
    subtitle: string;
    tabMerge: string;
    tabSplit: string;
    tabToImage: string;
    merge: {
      dropTitle: string;
      dropHint: string;
      selectFiles: string;
      moveUp: string;
      moveDown: string;
      remove: string;
      pagesUnit: string;
      mergeBtn: string;
      clearBtn: string;
      needTwo: string;
      doneMsg: string;
      largeWarn: string;
    };
    split: {
      dropTitle: string;
      dropHint: string;
      selectFile: string;
      totalPages: string;
      modeRange: string;
      modeEvery: string;
      rangeLabel: string;
      rangePlaceholder: string;
      rangeHint: string;
      splitBtn: string;
      doneSingle: string;
      doneZip: string;
      invalidRange: string;
      largeWarn: string;
    };
    toImage: {
      dropTitle: string;
      dropHint: string;
      selectFile: string;
      formatLabel: string;
      scaleLabel: string;
      scaleStandard: string;
      scaleHigh: string;
      scaleUltra: string;
      rangeLabel: string;
      rangePlaceholder: string;
      rangeHint: string;
      convertBtn: string;
      cancelBtn: string;
      downloadZip: string;
      downloadSingle: string;
      progressText: string;
      doneMsg: string;
      cancelledMsg: string;
      invalidRange: string;
      largeWarn: string;
    };
  };
  privacy: {
    metaTitle: string;
    metaDesc: string;
    title: string;
    subtitle: string;
    sections: { heading: string; body: string }[];
  };
}

export const translations: Record<Locale, TranslationDict> = {
  ko: {
    lang: 'ko',
    htmlLang: 'ko',
    siteName: 'KitZero',
    tagline: '서버에 올리지 않고 내 기기에서 바로 처리하는 무료 이미지·PDF 도구 (킷제로)',
    localBadge: '서버 업로드 없음 · 안심 사용',
    localBadgeShort: '업로드 없음',
    nav: {
      home: '전체 도구',
      imageMenu: '이미지 도구',
      pdfMenu: 'PDF 도구',
      utilityMenu: '유틸리티',
      allTools: '전체 도구',
      imageOptimizer: '이미지 압축 · EXIF 삭제',
      thumbnailResizer: '썸네일 일괄 리사이저',
      pdfTools: 'PDF 합치기 · 분할 · 변환',
      privacy: '보안 및 개인정보',
    },
    categories: {
      all: '전체 도구',
      image: '이미지',
      pdf: 'PDF 문서',
      utility: '유틸리티',
    },
    footer: {
      guarantee: '내 파일은 내 기기(PC·스마트폰) 안에서만 처리되며, 외부 서버로 전송되거나 저장되지 않습니다.',
      privacyLink: '개인정보처리방침',
      copyright: '© 2026 KitZero (킷제로). 모든 파일은 외부 서버 전송 없이 내 기기에서 바로 처리됩니다.',
    },
    home: {
      metaTitle: 'KitZero(킷제로) — 서버에 올리지 않는 무료 이미지·PDF 변환기',
      metaDesc: '사진 압축, 모자이크, 여권사진, HEIC 변환, PDF 합치기·분할·서명, 글자 수 세기까지 21가지 도구를 외부 서버 전송 없이 내 PC·스마트폰에서 안전하게 무료 처리하세요.',
      heroTitle: '남의 서버에 올리기 불안해서,\n내가 쓰려고 만들었습니다',
      heroSubtitle: '사진·PDF 도구 21종, 외부 전송 없이 내 기기 안에서만 안전하게 처리됩니다.',
      trustPoints: [
        {
          title: '업로드 없음',
          desc: '파일을 외부 서버로 보내지 않습니다.',
        },
        {
          title: '흔적 없음',
          desc: '창을 닫으면 작업 기록이 즉시 사라집니다.',
        },
        {
          title: '가입·결제 없음',
          desc: '로그인·워터마크 없이 바로 무료입니다.',
        },
      ],
      toolsHeading: '자주 쓰는 무료 도구',
      toolsSubheading: '필요한 도구를 고르면 설치 없이 지금 화면에서 바로 열립니다.',
      faqHeading: '자주 묻는 질문',
      faqs: [
        {
          q: '정말로 내 파일이 외부 서버로 올라가지 않나요?',
          a: '네, 100%입니다. 모든 사진·PDF 변환이 외부 서버를 거치지 않고 지금 사용 중인 내 PC·스마트폰 화면 안에서 바로 처리됩니다. 변환 중 네트워크 전송이 발생하지 않으며, 탭을 닫으면 작업 데이터도 즉시 사라집니다.',
        },
        {
          q: 'EXIF 메타데이터 삭제는 어떤 정보를 지워주나요?',
          a: '스마트폰·카메라로 찍은 사진에 숨어 있는 GPS 위도/경도(촬영 위치), 카메라 기종, 렌즈 정보, 촬영 시각 등 모든 EXIF 메타데이터를 완전히 제거합니다. 원하시면 EXIF 삭제 체크를 해제해 WebP·JPG 출력 시 원본 메타데이터를 그대로 유지할 수도 있습니다.',
        },
        {
          q: '변환할 수 있는 파일 크기나 개수 제한이 있나요?',
          a: '서버 제한이 없으므로 사용자 PC나 스마트폰의 메모리가 허용하는 한 제한 없이 처리할 수 있습니다. 다만 대용량 파일 수십 개를 동시에 처리할 때는 브라우저 메모리 절약을 위해 20~30장 단위로 나누어 작업하는 것을 권장합니다.',
        },
      ],
    },
    tools: [
      {
        id: 'image-optimizer',
        category: 'image',
        accent: 'emerald',
        slug: '/image-optimizer/',
        badge: 'IMAGE + EXIF',
        title: '이미지 압축 · WebP 변환',
        shortTitle: '이미지 압축 · EXIF',
        shortDesc: '용량 최대 80% 절감 및 GPS·EXIF 삭제/유지',
        description: '사진 용량을 최대 80% 줄이고 WebP·JPG·PNG로 변환하며, 촬영 위치(GPS)와 카메라 기기정보(EXIF)를 원클릭으로 제어합니다.',
        features: ['EXIF(GPS·카메라) 탐지 및 삭제/유지 선택', 'WebP / JPG / PNG 일괄 변환', '원본 대비 절감 용량(%) 실시간 비교'],
        cta: '열기',
      },
      {
        id: 'thumbnail-resizer',
        category: 'image',
        accent: 'blue',
        slug: '/thumbnail-resizer/',
        badge: 'BATCH RESIZE',
        title: '썸네일 비율 일괄 리사이저',
        shortTitle: '썸네일 리사이저',
        shortDesc: '유튜브·블로그 OG·인스타 규격 일괄 변환',
        description: '유튜브(16:9), 블로그 OG(1200×630), 인스타그램(1:1·9:16) 규격에 맞춰 여러 장을 한 번에 리사이즈하고 ZIP으로 저장합니다.',
        features: ['유튜브·블로그·인스타 원클릭 프리셋', 'Cover(크롭) / Contain(여백) 지원', '일괄 변환 & ZIP 다운로드'],
        cta: '열기',
      },
      {
        id: 'image-crop',
        category: 'image',
        accent: 'violet',
        slug: '/image-crop/',
        badge: 'CROP & ROTATE',
        title: '이미지 자르기 · 회전 · 반전',
        shortTitle: '자르기 · 회전',
        shortDesc: '자유/1:1/16:9 자르기, 90° 회전, 좌우반전',
        description: '원하는 비율로 사진 영역을 드래그해 깔끔하게 자르고 90° 회전 및 좌우/상하 반전을 브라우저에서 즉시 처리합니다.',
        features: ['자유·1:1·16:9·4:3 비율 크롭', '90° 좌/우 회전 및 좌우/상하 반전', 'WebP/JPG/PNG 즉시 저장'],
        cta: '열기',
      },
      {
        id: 'image-blur',
        category: 'image',
        accent: 'rose',
        slug: '/image-blur/',
        badge: 'PRIVACY MASK',
        title: '모자이크 · 블러 가리기',
        shortTitle: '모자이크 · 블러',
        shortDesc: '얼굴·계좌번호·번호판 드래그 마스킹',
        description: '블로그 후기나 증빙 캡처에서 민감한 얼굴·번호판·주소를 드래그해 모자이크·블러·검은 박스로 즉시 가리고 저장합니다.',
        features: ['모자이크 / 블러 / 검은 박스 선택', '되돌리기 및 EXIF 자동 삭제', '100% 브라우저 로컬 편집'],
        cta: '열기',
      },
      {
        id: 'heic-converter',
        category: 'image',
        accent: 'cyan',
        slug: '/heic-converter/',
        badge: 'IPHONE HEIC',
        title: '아이폰 HEIC → JPG · WebP',
        shortTitle: 'HEIC 변환기',
        shortDesc: '아이폰 HEIC 사진을 JPG/WebP로 일괄 변환',
        description: '아이폰에서 찍은 .heic/.heif 사진 여러 장을 서버 업로드 없이 브라우저에서 즉시 JPG·WebP·PNG로 변환하고 ZIP 저장합니다.',
        features: ['HEIC/HEIF 다중 파일 일괄 변환', 'JPG / WebP / PNG 포맷 선택', '변환 후 ZIP 일괄 다운로드'],
        cta: '열기',
      },
      {
        id: 'watermark',
        category: 'image',
        accent: 'amber',
        slug: '/watermark/',
        badge: 'WATERMARK',
        title: '이미지 워터마크 일괄 넣기',
        shortTitle: '워터마크 삽입',
        shortDesc: '텍스트·로고 PNG를 여러 장에 한 번에 적용',
        description: '블로그·쇼핑몰 사진 수십 장에 텍스트 또는 투명 로고 워터마크를 원하는 위치·투명도·반복 패턴으로 한 번에 삽입합니다.',
        features: ['텍스트 & 로고 PNG 워터마크', '위치 선택 및 대각선 도용방지 패턴', '실시간 미리보기 & ZIP 저장'],
        cta: '열기',
      },
      {
        id: 'image-merge',
        category: 'image',
        accent: 'blue',
        slug: '/image-merge/',
        badge: 'STITCH IMAGES',
        title: '이미지 이어붙이기 · 사진 합치기',
        shortTitle: '이미지 합치기',
        shortDesc: '여러 사진·스크린샷을 세로/가로/그리드로 병합',
        description: '스크린샷·영수증·비교 사진 여러 장을 세로, 가로 또는 2열 그리드로 깔끔하게 이어붙여 한 장의 이미지로 저장합니다.',
        features: ['세로 / 가로 / 2열 그리드 배치', '자동 크기 맞춤 & 여백·배경색 조절', 'WebP / PNG / JPG 즉시 저장'],
        cta: '열기',
      },
      {
        id: 'id-photo',
        category: 'image',
        accent: 'emerald',
        slug: '/id-photo/',
        badge: 'ID & PASSPORT',
        title: '여권 · 증명사진 규격 자르기',
        shortTitle: '여권 · 증명사진',
        shortDesc: '3.5×4.5cm·반명함판 가이드 자르기 & 4×6 인화판',
        description: '여권·주민등록증(3.5×4.5cm), 반명함판(3×4cm), 미국 비자 규격에 맞춰 얼굴 가이드라인으로 자르고 낱장 또는 4×6 인화지 배치판으로 저장합니다.',
        features: ['여권·반명함판·미국 비자 300 DPI 규격', '정수리·턱 얼굴 가이드라인 오버레이', '낱장 저장 & 4×6 인화지 자동 배치판'],
        cta: '열기',
      },
      {
        id: 'pdf-merge',
        category: 'pdf',
        accent: 'rose',
        slug: '/pdf-merge/',
        badge: 'PDF MERGE',
        title: 'PDF 합치기',
        shortTitle: 'PDF 합치기',
        shortDesc: '여러 PDF 순서 조정 후 하나로 병합',
        description: '계약서·이력서·강의자료 PDF 여러 개를 외부 서버 업로드 없이 브라우저에서 순서를 정해 하나의 PDF로 안전하게 합칩니다.',
        features: ['파일별 페이지 수 즉시 확인', '위/아래 버튼으로 순서 자유 조정', '100% 로컬 병합 및 즉시 다운로드'],
        cta: '열기',
      },
      {
        id: 'pdf-split',
        category: 'pdf',
        accent: 'amber',
        slug: '/pdf-split/',
        badge: 'PDF SPLIT',
        title: 'PDF 분할 · 페이지 추출',
        shortTitle: 'PDF 분할 · 추출',
        shortDesc: '원하는 페이지만 추출하거나 낱장 분할',
        description: '긴 PDF 문서에서 필요한 페이지 범위(예: 1-3, 5)만 골라 새 PDF로 저장하거나, 모든 페이지를 낱장 PDF(ZIP)로 나눕니다.',
        features: ['페이지 범위 지정 추출', '모든 페이지 낱장 ZIP 일괄 분할', '서버 전송 없이 민감 문서 안전 처리'],
        cta: '열기',
      },
      {
        id: 'pdf-to-image',
        category: 'pdf',
        accent: 'violet',
        slug: '/pdf-to-image/',
        badge: 'PDF TO IMG',
        title: 'PDF → 이미지 변환',
        shortTitle: 'PDF → 이미지',
        shortDesc: 'PDF 각 페이지를 고화질 PNG·JPG로 저장',
        description: 'PDF 문서의 전체 또는 지정한 페이지 범위를 선명한 고해상도(1.5x~3.0x) PNG·JPG 이미지로 렌더링하고 ZIP으로 저장합니다.',
        features: ['페이지 범위 선택 및 중간 중단 지원', '표준/고화질/초고화질 배율 선택', '미리보기 확인 후 개별·ZIP 저장'],
        cta: '열기',
      },
      {
        id: 'image-to-pdf',
        category: 'pdf',
        accent: 'emerald',
        slug: '/image-to-pdf/',
        badge: 'IMG TO PDF',
        title: '이미지 → PDF 변환',
        shortTitle: '이미지 → PDF',
        shortDesc: '신분증·영수증 사진 여러 장을 PDF 1개로',
        description: '신분증·통장사본·영수증 등 여러 장의 JPG/PNG/WebP 이미지를 순서대로 정리해 A4 또는 원본 크기의 PDF 1개로 묶습니다.',
        features: ['사진 순서 조정 및 A4/원본 맞춤', '여백 크기 선택 가능', '민감 서류 사진 서버 업로드 0%'],
        cta: '열기',
      },
      {
        id: 'pdf-organize',
        category: 'pdf',
        accent: 'blue',
        slug: '/pdf-organize/',
        badge: 'ORGANIZE',
        title: 'PDF 회전 · 삭제 · 순서 변경',
        shortTitle: 'PDF 페이지 정리',
        shortDesc: '90° 회전, 불필요한 페이지 삭제, 순서 변경',
        description: 'PDF 각 페이지의 썸네일을 보며 90도 회전, 앞/뒤 순서 이동, 불필요한 페이지 삭제를 한 번에 처리해 새 PDF로 저장합니다.',
        features: ['페이지별 썸네일 미리보기', '90° 좌/우 회전 & 순서 이동', '원클릭 페이지 삭제 후 저장'],
        cta: '열기',
      },
      {
        id: 'pdf-compress',
        category: 'pdf',
        accent: 'emerald',
        slug: '/pdf-compress/',
        badge: 'PDF COMPRESS',
        title: 'PDF 용량 줄이기',
        shortTitle: 'PDF 용량 줄이기',
        shortDesc: '스캔·고용량 PDF를 로컬에서 가볍게 압축',
        description: '스캔본·이미지가 많아 용량이 큰 PDF의 해상도와 압축률을 조절해 서버 업로드 없이 브라우저에서 가볍게 줄입니다.',
        features: ['고화질/균형/최대 3단계 압축', '원본 대비 절감 용량(%) 실시간 표시', '중간 중단 및 메모리 즉시 해제'],
        cta: '열기',
      },
      {
        id: 'pdf-watermark',
        category: 'pdf',
        accent: 'amber',
        slug: '/pdf-watermark/',
        badge: 'PDF STAMP',
        title: 'PDF 워터마크 · 페이지 번호',
        shortTitle: 'PDF 워터마크',
        shortDesc: '한글 대외비 워터마크 및 하단 쪽번호 삽입',
        description: '견적서·계약서·강의자료 PDF 전체 페이지에 한글·영문 대각선 워터마크와 하단 중앙 페이지 번호(1 / N)를 삽입합니다.',
        features: ['한글·영문 깨짐 없는 워터마크', '하단 페이지 번호 자동 삽입', '100% 로컬 처리'],
        cta: '열기',
      },
      {
        id: 'pdf-sign',
        category: 'pdf',
        accent: 'rose',
        slug: '/pdf-sign/',
        badge: 'E-SIGN',
        title: 'PDF 전자서명 · 도장 찍기',
        shortTitle: 'PDF 서명 · 도장',
        shortDesc: '계약서 PDF에 직접 사인하거나 도장 PNG 찍기',
        description: '민감한 계약서·동의서 PDF를 외부 서버에 올리지 않고 브라우저에서 직접 사인하거나 투명 도장을 원하는 위치에 찍어 저장합니다.',
        features: ['마우스·터치 직접 사인 패드', '투명 도장 PNG 업로드 지원', '원하는 페이지·위치 클릭 배치'],
        cta: '열기',
      },
      {
        id: 'qr-generator',
        category: 'utility',
        accent: 'cyan',
        slug: '/qr-generator/',
        badge: 'NO EXPIRY',
        title: '로컬 QR 코드 생성기',
        shortTitle: 'QR 코드 생성기',
        shortDesc: '만료·추적 없는 URL/와이파이 PNG·SVG QR',
        description: '유효기간 만료나 단축 URL 추적 없이 영구적으로 동작하는 URL·텍스트·와이파이 QR 코드를 고화질 PNG·벡터 SVG로 생성합니다.',
        features: ['URL / 텍스트 / Wi-Fi 접속 QR 지원', '색상·오류복원·중앙 로고 커스텀', 'PNG & 벡터 SVG 즉시 다운로드'],
        cta: '열기',
      },
      {
        id: 'favicon-generator',
        category: 'utility',
        accent: 'violet',
        slug: '/favicon-generator/',
        badge: 'WEB ASSETS',
        title: '파비콘 · 앱 아이콘 생성기',
        shortTitle: '파비콘 생성기',
        shortDesc: '이미지 1장으로 ICO·PNG·manifest·HTML 완성',
        description: '로고 이미지 1장으로 favicon.ico(16/32/48px), Apple/Android PNG 아이콘 세트, webmanifest, HTML 태그까지 한 번에 생성합니다.',
        features: ['실제 멀티해상도 favicon.ico 생성', '16~512px 전체 아이콘 ZIP 패키지', '복사해서 쓰는 HTML <head> 태그'],
        cta: '열기',
      },
      {
        id: 'svg-converter',
        category: 'utility',
        accent: 'emerald',
        slug: '/svg-converter/',
        badge: 'VECTOR → PNG',
        title: 'SVG → PNG · WebP 변환기',
        shortTitle: 'SVG 변환기',
        shortDesc: 'SVG 파일·코드를 고해상도 PNG·WebP로 추출',
        description: 'SVG 벡터 파일이나 코드를 붙여넣어 원하는 픽셀 크기의 선명한 PNG·WebP·JPG 이미지로 즉시 변환합니다.',
        features: ['SVG 파일 업로드 & 코드 직접 편집', '원하는 가로 픽셀(최대 4096px) 지정', '투명 배경 유지 및 즉시 다운로드'],
        cta: '열기',
      },
      {
        id: 'word-counter',
        category: 'utility',
        accent: 'blue',
        slug: '/word-counter/',
        badge: 'TEXT COUNTER',
        title: '글자 수 세기 · 바이트 계산기',
        shortTitle: '글자 수 세기',
        shortDesc: '자소서 공백 포함/제외, 한글 2B/UTF-8 바이트',
        description: '자기소개서·블로그 글자 수를 공백 포함/제외, 한글 2바이트(EUC-KR)·UTF-8 바이트, 단어·문장 수까지 실시간 계산합니다.',
        features: ['공백 포함/제외 및 EUC-KR·UTF-8 바이트', '단어·문장·읽기 시간·빈도 Top 5', '중복 공백 정리 & 100% 로컬 저장'],
        cta: '열기',
      },
      {
        id: 'color-picker',
        category: 'utility',
        accent: 'rose',
        slug: '/color-picker/',
        badge: 'COLOR PALETTE',
        title: '이미지 색상 추출기 · 스포이드',
        shortTitle: '색상 추출기',
        shortDesc: '클릭 스포이드 HEX/RGB/HSL & 대표 8색 팔레트',
        description: '사진·시안의 원하는 픽셀을 클릭해 HEX·RGB·HSL 코드를 즉시 복사하고, 대표 색상 팔레트 8색을 자동 추출합니다.',
        features: ['클릭/터치 픽셀 스포이드', 'HEX · RGB · HSL 원클릭 복사', '대표 색상 팔레트 8색 자동 추출'],
        cta: '열기',
      },
    ],
    imageOptimizer: {
      metaTitle: '사진 용량 줄이기 · WebP 변환 · EXIF 위치정보 삭제기 | KitZero(킷제로)',
      metaDesc: '서버 업로드 없이 브라우저에서 사진 용량을 최대 80% 압축하고 WebP·JPG·PNG로 변환하며, 숨겨진 GPS 위치와 카메라 기기정보(EXIF)를 원클릭으로 완전 삭제하세요.',
      title: '이미지 압축 · WebP 변환 · EXIF 삭제기',
      subtitle: '사진 용량을 확 줄이고, 숨어 있는 GPS 위치 및 카메라 기기 정보(EXIF)를 100% 로컬에서 안전하게 지웁니다.',
      dropTitle: '이미지를 여기에 끌어다 놓거나 클릭해서 선택하세요',
      dropHint: 'JPG, PNG, WebP, GIF 지원 · 여러 장 동시 업로드 가능 · 서버 전송 없음',
      selectFiles: '이미지 파일 선택',
      formatLabel: '출력 포맷',
      qualityLabel: '압축 품질',
      maxWidthLabel: '최대 가로 크기',
      maxWidthNone: '원본 유지',
      stripExifLabel: 'EXIF 메타데이터(위치·기기정보) 삭제',
      stripExifDesc: '켜면 GPS·카메라 정보를 완전 삭제합니다. 끄면 WebP·JPG 출력 시 원본 EXIF를 유지합니다.',
      processAll: '전체 변환 시작',
      cancelBtn: '중단',
      downloadZip: 'ZIP 일괄 다운로드',
      clearAll: '비우기',
      largeBatchWarn: '대용량 안내: 파일이 많거나 용량이 100MB를 초과합니다. 브라우저 메모리 보호를 위해 20~30장 단위로 나누어 변환하는 것을 권장합니다.',
      canvasLimitError: '해상도 초과 — 최대 가로 크기를 2560px 이하로 선택해 주세요',
      cancelledMsg: '변환이 중단되었습니다. 완료된 파일은 바로 다운로드할 수 있습니다.',
      summaryBefore: '원본 합계',
      summaryAfter: '변환 후 합계',
      summarySaved: '절감 용량',
      exifFound: 'EXIF 감지됨',
      exifGps: 'GPS 위치정보 포함',
      exifClean: 'EXIF 없음',
      exifRemovedBadge: 'EXIF 삭제 완료',
      exifPreservedBadge: 'EXIF 유지됨',
      exifUnsupportedBadge: 'PNG는 EXIF 미지원',
      statusReady: '대기 중',
      statusProcessing: '변환 중...',
      statusDone: '완료',
      statusError: '오류',
      downloadSingle: '다운로드',
      emptyState: '이미지를 추가하면 EXIF 메타데이터 포함 여부와 예상 압축 결과를 바로 확인할 수 있습니다.',
      howItWorksTitle: '블로그·웹 운영자를 위한 활용 팁',
      howItWorksSteps: [
        '스마트폰 사진에는 집·사무실 GPS 좌표가 EXIF에 남아있는 경우가 많습니다. 블로그에 올리기 전 이 도구로 WebP 변환과 EXIF 삭제를 한 번에 끝내세요.',
        'WebP 품질 80~85%는 육안으로 차이를 느끼기 어려우면서도 JPG/PNG 대비 파일 용량을 50~80% 줄여 페이지 로딩 속도와 SEO 점수를 높여줍니다.',
      ],
    },
    thumbnailResizer: {
      metaTitle: '썸네일 일괄 리사이즈 · 유튜브/블로그/인스타 비율 변환기 | KitZero(킷제로)',
      metaDesc: '유튜브 16:9(1280×720), 블로그 OG(1200×630), 인스타그램 1:1·9:16 비율로 여러 이미지를 한 번에 크롭·리사이즈하고 ZIP으로 무료 저장하세요. 서버 업로드 없음.',
      title: '썸네일 비율 일괄 리사이저',
      subtitle: '플랫폼별 권장 해상도 프리셋을 고르고 여러 장의 이미지를 한 번에 규격에 맞게 자르거나 리사이즈하세요.',
      dropTitle: '리사이즈할 이미지를 끌어다 놓거나 선택하세요',
      dropHint: 'JPG, PNG, WebP 지원 · 여러 장 동시 처리 가능 · 100% 로컬 처리',
      selectFiles: '이미지 파일 선택',
      presetsTitle: '플랫폼 프리셋',
      customSizeTitle: '직접 입력 (px)',
      widthLabel: '가로 (W)',
      heightLabel: '세로 (H)',
      fitModeLabel: '맞춤 방식',
      fitCover: '꽉 채우기 (Cover · 중앙 크롭)',
      fitContain: '전체 보이기 (Contain · 여백 추가)',
      fitFill: '비율 무시 늘리기 (Fill)',
      bgColorLabel: '여백 배경색',
      formatLabel: '출력 포맷',
      qualityLabel: '품질',
      processAll: '일괄 리사이즈 실행',
      cancelBtn: '중단',
      downloadZip: 'ZIP 일괄 다운로드',
      clearAll: '비우기',
      largeBatchWarn: '대용량 안내: 이미지가 많거나 총 용량이 100MB를 초과합니다. 안정적인 처리를 위해 20~30장씩 나누어 작업하는 것을 권장합니다.',
      downloadSingle: '다운로드',
      statusReady: '대기 중',
      statusDone: '변환 완료',
      presets: [
        { id: 'youtube', name: '유튜브 썸네일', ratio: '16:9', width: 1280, height: 720 },
        { id: 'og', name: '블로그 OG / 링크 카드', ratio: '1.91:1', width: 1200, height: 630 },
        { id: 'insta-sq', name: '인스타 / 블로그 정사각', ratio: '1:1', width: 1080, height: 1080 },
        { id: 'insta-port', name: '인스타 피드 세로', ratio: '4:5', width: 1080, height: 1350 },
        { id: 'shorts', name: '쇼츠 / 릴스 / 스토리', ratio: '9:16', width: 1080, height: 1920 },
        { id: 'naver', name: '네이버 블로그 대표', ratio: '1:1', width: 900, height: 900 },
      ],
    },
    pdfTools: {
      metaTitle: 'PDF 합치기 · 분할 · PNG/JPG 이미지 변환기 (무료 로컬) | KitZero(킷제로)',
      metaDesc: '계약서·이력서 PDF를 서버에 올리지 않고 브라우저에서 안전하게 무료 병합, 페이지 추출·분할, 고화질 PNG·JPG 이미지 변환까지 한 번에 처리하세요.',
      title: 'PDF 합치기 · 분할 · 이미지 변환기',
      subtitle: '계약서, 이력서, 증빙서류를 외부 서버에 올리지 마세요. 모든 PDF 작업이 브라우저 안에서 즉시 완료됩니다.',
      tabMerge: 'PDF 합치기',
      tabSplit: 'PDF 분할 · 추출',
      tabToImage: 'PDF → 이미지 변환',
      merge: {
        dropTitle: '합칠 PDF 파일들을 끌어다 놓거나 선택하세요',
        dropHint: '2개 이상의 PDF를 추가하고 위/아래 버튼으로 순서를 정할 수 있습니다',
        selectFiles: 'PDF 파일 추가',
        moveUp: '위로',
        moveDown: '아래로',
        remove: '삭제',
        pagesUnit: '페이지',
        mergeBtn: 'PDF 하나로 합치기',
        clearBtn: '초기화',
        needTwo: 'PDF 파일을 2개 이상 추가해 주세요.',
        doneMsg: 'PDF 병합이 완료되어 다운로드되었습니다.',
        largeWarn: '대용량 PDF 안내: 총 용량이 50MB를 초과합니다. 병합 시 브라우저 메모리를 많이 사용하며 수 초 이상 걸릴 수 있습니다.',
      },
      split: {
        dropTitle: '분할하거나 페이지를 추출할 PDF를 선택하세요',
        dropHint: '단일 PDF 파일 지원 · 원하는 페이지만 골라 새 PDF로 저장',
        selectFile: 'PDF 파일 선택',
        totalPages: '총 페이지 수',
        modeRange: '지정 페이지 추출 (하나의 PDF로 저장)',
        modeEvery: '모든 페이지를 낱장 PDF로 분할 (ZIP 저장)',
        rangeLabel: '추출할 페이지 범위',
        rangePlaceholder: '예: 1-3, 5, 7-9',
        rangeHint: '쉼표(,)와 하이픈(-)으로 원하는 페이지를 지정하세요.',
        splitBtn: 'PDF 분할 실행',
        doneSingle: '선택한 페이지 추출이 완료되었습니다.',
        doneZip: '모든 페이지 분할 ZIP 파일이 생성되었습니다.',
        invalidRange: '유효한 페이지 범위를 입력해 주세요. (예: 1-3, 5)',
        largeWarn: '대용량 PDF 안내: 파일이 크거나 페이지 수가 많습니다. 낱장 분할보다 필요한 페이지 범위만 추출하는 것을 권장합니다.',
      },
      toImage: {
        dropTitle: '이미지로 변환할 PDF 파일을 선택하세요',
        dropHint: '각 페이지를 선명한 PNG 또는 JPG 이미지로 렌더링합니다',
        selectFile: 'PDF 파일 선택',
        formatLabel: '이미지 포맷',
        scaleLabel: '해상도 (배율)',
        scaleStandard: '표준 (1.5x · 웹용)',
        scaleHigh: '고화질 (2.0x · 권장)',
        scaleUltra: '초고화질 (3.0x · 인쇄용)',
        rangeLabel: '변환할 페이지 범위 (선택)',
        rangePlaceholder: '비워두면 전체 (예: 1-20)',
        rangeHint: '페이지가 많은 PDF는 20~30쪽 단위로 나누어 변환하면 빠르고 안전합니다.',
        convertBtn: '이미지로 변환 시작',
        cancelBtn: '중단',
        downloadZip: '전체 이미지 ZIP 다운로드',
        downloadSingle: '저장',
        progressText: '변환 진행 중',
        doneMsg: '선택한 페이지 변환이 완료되었습니다.',
        cancelledMsg: '변환이 중단되었습니다. 지금까지 변환된 페이지는 바로 저장할 수 있습니다.',
        invalidRange: '유효한 페이지 범위를 입력해 주세요. (예: 1-10, 15)',
        largeWarn: '대용량 PDF 안내: 30페이지 이상이거나 50MB를 초과합니다. 페이지 범위를 지정(예: 1-20)하거나 1.5x~2.0x 배율 사용을 권장합니다.',
      },
    },
    privacy: {
      metaTitle: '100% 로컬 처리 원칙 및 개인정보처리방침 | KitZero(킷제로)',
      metaDesc: 'KitZero(킷제로)는 모든 이미지·PDF 파일을 외부 서버에 업로드하지 않고 사용자의 브라우저 메모리에서만 100% 로컬 처리합니다. 개인정보 보호 원칙을 확인하세요.',
      title: '100% 로컬 처리 원칙 및 개인정보처리방침',
      subtitle: '사용자의 파일은 단 1바이트도 서버로 전송되지 않습니다.',
      sections: [
        {
          heading: '1. 파일 처리 방식 (Zero-Upload Architecture)',
          body: 'KitZero(킷제로)의 모든 이미지 압축, WebP 변환, EXIF 삭제, 썸네일 리사이즈, PDF 합치기·분할·이미지 변환 기능은 사용자의 웹 브라우저(HTML5 Canvas, FileReader, WebAssembly/JS) 내부에서만 실행됩니다. 업로드 버튼으로 선택한 파일은 사용자의 기기 메모리에만 머물며, 페이지를 닫거나 새로고침하면 즉시 메모리에서 해제됩니다.',
        },
        {
          heading: '2. 개인정보 수집 및 저장 없음',
          body: 'KitZero(킷제로)는 회원가입을 요구하지 않으며, 사용자가 변환하는 이미지나 PDF 문서의 내용, 파일명, 메타데이터(EXIF 등)를 수집·저장·분석하지 않습니다.',
        },
        {
          heading: '3. 쿠키 및 광고 서비스 안내',
          body: '서비스의 무료 운영을 위해 Google AdSense 등의 제3자 광고 네트워크 또는 익명 트래픽 통계 도구가 사용될 수 있습니다. 이러한 서비스는 브라우저 쿠키를 사용할 수 있으며, 사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.',
        },
      ],
    },
  },
  en: {
    lang: 'en',
    htmlLang: 'en',
    siteName: 'KitZero',
    tagline: 'Free Image & PDF Tools — 0% Server Uploads',
    localBadge: 'No Server Uploads · Safe by Design',
    localBadgeShort: 'No Uploads',
    nav: {
      home: 'All Tools',
      imageMenu: 'Image Tools',
      pdfMenu: 'PDF Tools',
      utilityMenu: 'Utilities',
      allTools: 'All Tools',
      imageOptimizer: 'Image Compress & EXIF',
      thumbnailResizer: 'Thumbnail Resizer',
      pdfTools: 'PDF Toolkit',
      privacy: 'Privacy & Security',
    },
    categories: {
      all: 'All Tools',
      image: 'Image',
      pdf: 'PDF Document',
      utility: 'Utilities',
    },
    footer: {
      guarantee: 'Your files are processed strictly on your device—never uploaded to or stored on any external server.',
      privacyLink: 'Privacy Policy',
      copyright: '© 2026 KitZero. All files are processed privately on your device with zero uploads.',
    },
    home: {
      metaTitle: 'KitZero — Free Image & PDF Tools (0% Server Uploads)',
      metaDesc: 'Compress photos, blur private info, crop ID photos, convert HEIC, merge or sign PDFs, and count words right on your device—100% free with zero server uploads.',
      heroTitle: 'Built Because I Didn’t Trust\nUploading My Files to Random Servers',
      heroSubtitle: '21 image & PDF tools processed safely on your own device — zero server uploads.',
      trustPoints: [
        {
          title: 'No Uploads',
          desc: 'Files are never sent to any external server.',
        },
        {
          title: 'No Trace',
          desc: 'Close the tab and everything disappears.',
        },
        {
          title: 'No Sign-Up',
          desc: 'Free to use, with zero watermarks.',
        },
      ],
      toolsHeading: '21 Free On-Device Tools',
      toolsSubheading: 'Pick a tool below — no installs, no uploads, instant results.',
      faqHeading: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Are my files really never uploaded to any server?',
          a: 'Yes, 100%. Every image and PDF conversion runs directly on your own PC or phone without sending files over the internet, and all temporary data disappears as soon as you close the tab.',
        },
        {
          q: 'What does the EXIF metadata remover strip?',
          a: 'It removes hidden GPS latitude/longitude coordinates, camera make and model, lens details, and capture timestamps. You can also uncheck the option to preserve original EXIF metadata when exporting to WebP or JPG.',
        },
        {
          q: 'Is there a file size or count limit?',
          a: 'Because there is no backend server, there are no artificial limits. Processing capacity depends only on your device memory — for best speed, we recommend batches of 20–30 high-resolution images at a time.',
        },
      ],
    },
    tools: [
      {
        id: 'image-optimizer',
        category: 'image',
        accent: 'emerald',
        slug: '/en/image-optimizer/',
        badge: 'IMAGE + EXIF',
        title: 'Compress Image & EXIF',
        shortTitle: 'Compress & EXIF',
        shortDesc: 'Shrink up to 80%, convert WebP & control EXIF',
        description: 'Shrink photo sizes by up to 80%, convert to WebP/JPG/PNG, and strip or preserve hidden GPS & camera EXIF metadata locally.',
        features: ['Detect & strip or preserve EXIF', 'Batch convert to WebP / JPG / PNG', 'Live before/after savings counter'],
        cta: 'Open',
      },
      {
        id: 'thumbnail-resizer',
        category: 'image',
        accent: 'blue',
        slug: '/en/thumbnail-resizer/',
        badge: 'BATCH RESIZE',
        title: 'Batch Thumbnail Resizer',
        shortTitle: 'Thumbnail Resizer',
        shortDesc: 'YouTube, OG & Instagram presets + ZIP export',
        description: 'Resize multiple images at once for YouTube (16:9), Blog OG (1200×630), Instagram (1:1, 4:5, 9:16), or custom dimensions.',
        features: ['One-click YouTube, OG & Insta presets', 'Smart Cover crop or Contain padding', 'Batch export as single ZIP'],
        cta: 'Open',
      },
      {
        id: 'image-crop',
        category: 'image',
        accent: 'violet',
        slug: '/en/image-crop/',
        badge: 'CROP & ROTATE',
        title: 'Image Crop, Rotate & Flip',
        shortTitle: 'Crop & Rotate',
        shortDesc: 'Free/1:1/16:9 crop, 90° rotate & flip locally',
        description: 'Drag to crop images with free or fixed aspect ratios, rotate 90°, and flip horizontally or vertically locally.',
        features: ['Free, 1:1, 16:9 & 4:3 crop ratios', 'Rotate 90° & flip H/V', 'Export to WebP, JPG, or PNG'],
        cta: 'Open',
      },
      {
        id: 'image-blur',
        category: 'image',
        accent: 'rose',
        slug: '/en/image-blur/',
        badge: 'PRIVACY MASK',
        title: 'Mosaic & Blur Redactor',
        shortTitle: 'Mosaic & Blur',
        shortDesc: 'Drag to censor faces, plates & private text',
        description: 'Redact faces, license plates, addresses, or sensitive screenshot info with pixelate, blur, or blackout boxes locally.',
        features: ['Mosaic, Blur & Solid Blackout modes', 'Undo support + automatic EXIF strip', '100% private in-browser canvas'],
        cta: 'Open',
      },
      {
        id: 'heic-converter',
        category: 'image',
        accent: 'cyan',
        slug: '/en/heic-converter/',
        badge: 'IPHONE HEIC',
        title: 'HEIC → JPG · WebP Converter',
        shortTitle: 'HEIC Converter',
        shortDesc: 'Batch convert iPhone HEIC photos locally',
        description: 'Convert Apple .heic / .heif photos to JPG, WebP, or PNG right inside your browser with zero server uploads and ZIP export.',
        features: ['Batch HEIC/HEIF conversion', 'JPG / WebP / PNG output options', 'One-click ZIP archive download'],
        cta: 'Open',
      },
      {
        id: 'watermark',
        category: 'image',
        accent: 'amber',
        slug: '/en/watermark/',
        badge: 'WATERMARK',
        title: 'Batch Image Watermark',
        shortTitle: 'Watermark Tool',
        shortDesc: 'Stamp text or PNG logos across many photos',
        description: 'Apply custom text or transparent PNG logo watermarks across multiple photos with position, opacity, and tiled protection.',
        features: ['Text & PNG logo watermark modes', 'Corner, center & diagonal tiled pattern', 'Live preview & batch ZIP export'],
        cta: 'Open',
      },
      {
        id: 'image-merge',
        category: 'image',
        accent: 'blue',
        slug: '/en/image-merge/',
        badge: 'STITCH IMAGES',
        title: 'Combine & Stitch Images',
        shortTitle: 'Combine Images',
        shortDesc: 'Stitch photos vertically, horizontally, or in a grid',
        description: 'Combine multiple screenshots or photos vertically, horizontally, or in a 2-column grid with custom spacing and background color.',
        features: ['Vertical, horizontal & 2-column grid', 'Auto-fit alignment & custom spacing', 'Instant WebP / PNG / JPG export'],
        cta: 'Open',
      },
      {
        id: 'id-photo',
        category: 'image',
        accent: 'emerald',
        slug: '/en/id-photo/',
        badge: 'ID & PASSPORT',
        title: 'Passport & ID Photo Cropper',
        shortTitle: 'Passport & ID',
        shortDesc: '35×45mm, 2×2" face guides & 4×6 print sheet',
        description: 'Frame passport, visa, or resume ID photos with face alignment guides and export single 300 DPI images or a 4×6 print sheet locally.',
        features: ['35×45mm, 30×40mm, US 2×2" (300 DPI)', 'Head & chin alignment guide overlay', 'Single export + 4×6 printable sheet'],
        cta: 'Open',
      },
      {
        id: 'pdf-merge',
        category: 'pdf',
        accent: 'rose',
        slug: '/en/pdf-merge/',
        badge: 'PDF MERGE',
        title: 'Merge PDFs',
        shortTitle: 'Merge PDFs',
        shortDesc: 'Reorder and combine multiple PDFs into one',
        description: 'Combine contracts, resumes, or slide decks into a single PDF directly inside your browser with zero server uploads.',
        features: ['Instant page count preview', 'Reorder files before merging', '100% private local processing'],
        cta: 'Open',
      },
      {
        id: 'pdf-split',
        category: 'pdf',
        accent: 'amber',
        slug: '/en/pdf-split/',
        badge: 'PDF SPLIT',
        title: 'Split & Extract PDF',
        shortTitle: 'Split PDF',
        shortDesc: 'Extract page ranges or split every page to ZIP',
        description: 'Extract specific page ranges (e.g. 1-3, 5) into a new PDF, or split every page into individual PDFs bundled in a ZIP.',
        features: ['Custom page range extraction', 'Split all pages into ZIP archive', 'Zero uploads for sensitive docs'],
        cta: 'Open',
      },
      {
        id: 'pdf-to-image',
        category: 'pdf',
        accent: 'violet',
        slug: '/en/pdf-to-image/',
        badge: 'PDF TO IMG',
        title: 'PDF to PNG / JPG',
        shortTitle: 'PDF to Images',
        shortDesc: 'Render PDF pages to high-DPI PNG or JPG',
        description: 'Convert all or selected PDF pages into crisp high-resolution PNG or JPG images locally with instant preview and ZIP download.',
        features: ['Optional page range & stop control', '1.5x / 2.0x / 3.0x crisp scaling', 'Preview & download all as ZIP'],
        cta: 'Open',
      },
      {
        id: 'image-to-pdf',
        category: 'pdf',
        accent: 'emerald',
        slug: '/en/image-to-pdf/',
        badge: 'IMG TO PDF',
        title: 'Images to PDF',
        shortTitle: 'Images to PDF',
        shortDesc: 'Combine JPG, PNG & WebP photos into 1 PDF',
        description: 'Combine receipts, IDs, or photos into a single clean PDF with A4 or original page sizing directly inside your browser.',
        features: ['Reorder photos before exporting', 'A4 fit or original image dimensions', 'Zero uploads for private scans'],
        cta: 'Open',
      },
      {
        id: 'pdf-organize',
        category: 'pdf',
        accent: 'blue',
        slug: '/en/pdf-organize/',
        badge: 'ORGANIZE',
        title: 'Rotate, Delete & Reorder PDF',
        shortTitle: 'Organize PDF',
        shortDesc: 'Rotate 90°, delete pages & rearrange order',
        description: 'Preview every PDF page thumbnail to rotate 90°, rearrange order, or remove unwanted pages and export a clean PDF locally.',
        features: ['Visual thumbnail grid per page', 'Rotate left/right 90° & reorder', 'Delete pages & save instantly'],
        cta: 'Open',
      },
      {
        id: 'pdf-compress',
        category: 'pdf',
        accent: 'emerald',
        slug: '/en/pdf-compress/',
        badge: 'PDF COMPRESS',
        title: 'Compress PDF Size',
        shortTitle: 'Compress PDF',
        shortDesc: 'Shrink heavy scanned PDFs locally in browser',
        description: 'Reduce heavy scanned or image-rich PDF file sizes with selectable compression levels directly inside your browser.',
        features: ['3 compression quality presets', 'Live before/after size savings', 'Zero server uploads'],
        cta: 'Open',
      },
      {
        id: 'pdf-watermark',
        category: 'pdf',
        accent: 'amber',
        slug: '/en/pdf-watermark/',
        badge: 'PDF STAMP',
        title: 'PDF Watermark & Page Numbers',
        shortTitle: 'PDF Watermark',
        shortDesc: 'Add diagonal text watermarks & page numbers',
        description: 'Stamp custom diagonal text watermarks and bottom-center page numbers (1 / N) across every PDF page locally.',
        features: ['Unicode/CJK safe watermark rendering', 'Automatic 1 / N page numbering', '100% private local processing'],
        cta: 'Open',
      },
      {
        id: 'pdf-sign',
        category: 'pdf',
        accent: 'rose',
        slug: '/en/pdf-sign/',
        badge: 'E-SIGN',
        title: 'Sign & Stamp PDF',
        shortTitle: 'Sign PDF',
        shortDesc: 'Draw signature or stamp PNG onto contracts',
        description: 'Sign contracts privately without uploading files. Draw a handwritten signature or upload a PNG stamp and place it on any page.',
        features: ['Mouse & touch signature pad', 'Transparent PNG stamp support', 'Click to place on any PDF page'],
        cta: 'Open',
      },
      {
        id: 'qr-generator',
        category: 'utility',
        accent: 'cyan',
        slug: '/en/qr-generator/',
        badge: 'NO EXPIRY',
        title: 'Local QR Code Generator',
        shortTitle: 'QR Generator',
        shortDesc: 'Permanent PNG & SVG QR for URLs & Wi-Fi',
        description: 'Generate static, never-expiring PNG and vector SVG QR codes for links, text, or Wi-Fi with optional center logos.',
        features: ['URL, Text & Wi-Fi QR presets', 'Custom colors, ECC & center logo', 'Instant PNG & vector SVG download'],
        cta: 'Open',
      },
      {
        id: 'favicon-generator',
        category: 'utility',
        accent: 'violet',
        slug: '/en/favicon-generator/',
        badge: 'WEB ASSETS',
        title: 'Favicon & App Icon Generator',
        shortTitle: 'Favicon Generator',
        shortDesc: 'ICO, Apple/Android PNGs, manifest & HTML',
        description: 'Convert one logo into a full favicon.ico (16/32/48px), Apple Touch & Android PNGs, site.webmanifest, and HTML snippet.',
        features: ['Real multi-size favicon.ico binary', 'Complete 16–512px ZIP package', 'Copy-paste HTML <head> tags'],
        cta: 'Open',
      },
      {
        id: 'svg-converter',
        category: 'utility',
        accent: 'emerald',
        slug: '/en/svg-converter/',
        badge: 'VECTOR → PNG',
        title: 'SVG to PNG & WebP Converter',
        shortTitle: 'SVG Converter',
        shortDesc: 'Export SVG files or code to high-res PNG/WebP',
        description: 'Upload an SVG file or paste SVG code to render crisp high-resolution PNG, WebP, or JPG images locally.',
        features: ['SVG file upload & live code editor', 'Custom pixel width up to 4096px', 'Transparent background support'],
        cta: 'Open',
      },
      {
        id: 'word-counter',
        category: 'utility',
        accent: 'blue',
        slug: '/en/word-counter/',
        badge: 'TEXT COUNTER',
        title: 'Word & Character Counter',
        shortTitle: 'Word Counter',
        shortDesc: 'Characters, words, UTF-8 bytes & reading time',
        description: 'Count characters (with/without spaces), words, sentences, UTF-8/2-byte lengths, and reading time privately in your browser.',
        features: ['Characters w/ and w/o spaces + bytes', 'Words, sentences, reading time & top terms', 'One-click whitespace cleanup'],
        cta: 'Open',
      },
      {
        id: 'color-picker',
        category: 'utility',
        accent: 'rose',
        slug: '/en/color-picker/',
        badge: 'COLOR PALETTE',
        title: 'Image Color Picker & Palette',
        shortTitle: 'Color Picker',
        shortDesc: 'Eyedropper HEX/RGB/HSL & 8-color auto palette',
        description: 'Click any pixel on an image to copy HEX, RGB, or HSL codes and automatically extract an 8-color dominant palette locally.',
        features: ['Click/tap pixel eyedropper', 'One-click HEX, RGB & HSL copy', 'Automatic 8-color dominant palette'],
        cta: 'Open',
      },
    ],
    imageOptimizer: {
      metaTitle: 'Image Compressor, WebP & EXIF Remover (Local) | KitZero',
      metaDesc: 'Compress photos up to 80%, convert to WebP/JPG/PNG, and remove EXIF GPS location & camera metadata 100% locally in your browser with zero server uploads.',
      title: 'Image Compressor · WebP Converter · EXIF Remover',
      subtitle: 'Reduce file sizes dramatically and strip hidden GPS coordinates and device EXIF metadata locally in your browser.',
      dropTitle: 'Drop images here or click to browse',
      dropHint: 'Supports JPG, PNG, WebP, GIF · Multiple files supported · Zero server upload',
      selectFiles: 'Select Images',
      formatLabel: 'Output Format',
      qualityLabel: 'Quality',
      maxWidthLabel: 'Max Width',
      maxWidthNone: 'Keep original',
      stripExifLabel: 'Strip EXIF metadata (GPS, camera)',
      stripExifDesc: 'Removes GPS & device metadata when checked. Uncheck to preserve EXIF on WebP & JPG output.',
      processAll: 'Optimize All',
      cancelBtn: 'Cancel',
      downloadZip: 'Download ZIP',
      clearAll: 'Clear',
      largeBatchWarn: 'Large batch notice: Total size exceeds 100 MB or 30+ images. Consider processing in batches of 20–30 for best browser stability.',
      canvasLimitError: 'Resolution too large — set Max Width to 2560px or smaller',
      cancelledMsg: 'Processing stopped. Already converted files are ready to download.',
      summaryBefore: 'Original Total',
      summaryAfter: 'Optimized Total',
      summarySaved: 'Total Saved',
      exifFound: 'EXIF Detected',
      exifGps: 'GPS Location Found',
      exifClean: 'No EXIF',
      exifRemovedBadge: 'EXIF Stripped',
      exifPreservedBadge: 'EXIF Preserved',
      exifUnsupportedBadge: 'PNG (No EXIF)',
      statusReady: 'Ready',
      statusProcessing: 'Processing...',
      statusDone: 'Done',
      statusError: 'Error',
      downloadSingle: 'Download',
      emptyState: 'Add images to inspect EXIF metadata and compress them locally.',
      howItWorksTitle: 'Why Optimize & Strip EXIF Locally?',
      howItWorksSteps: [
        'Smartphone photos often embed exact GPS coordinates in EXIF headers. Stripping EXIF before publishing protects your privacy.',
        'Converting to WebP at 80–85% quality typically cuts image weight by 50–80% while keeping crisp visuals for blogs and web performance.',
      ],
    },
    thumbnailResizer: {
      metaTitle: 'Batch Thumbnail Resizer (YouTube, OG, Instagram) | KitZero',
      metaDesc: 'Batch resize images to YouTube 16:9 (1280×720), Blog OG (1200×630), Instagram 1:1/4:5/9:16, or custom sizes locally in your browser with ZIP export.',
      title: 'Batch Thumbnail Ratio Resizer',
      subtitle: 'Pick a social or blog preset and resize multiple images at once with smart cropping or padded fit.',
      dropTitle: 'Drop images to resize or click to browse',
      dropHint: 'Supports JPG, PNG, WebP · Batch processing · 100% local in browser',
      selectFiles: 'Select Images',
      presetsTitle: 'Platform Presets',
      customSizeTitle: 'Custom Size (px)',
      widthLabel: 'Width (W)',
      heightLabel: 'Height (H)',
      fitModeLabel: 'Fit Mode',
      fitCover: 'Cover (Smart Center Crop)',
      fitContain: 'Contain (Keep Full Image + Padding)',
      fitFill: 'Fill (Stretch to Exact Size)',
      bgColorLabel: 'Padding Color',
      formatLabel: 'Output Format',
      qualityLabel: 'Quality',
      processAll: 'Resize All',
      cancelBtn: 'Cancel',
      downloadZip: 'Download ZIP',
      clearAll: 'Clear',
      largeBatchWarn: 'Large batch notice: Total size exceeds 100 MB or 30+ images. Processing 20–30 images at a time is recommended.',
      downloadSingle: 'Download',
      statusReady: 'Ready',
      statusDone: 'Resized',
      presets: [
        { id: 'youtube', name: 'YouTube Thumbnail', ratio: '16:9', width: 1280, height: 720 },
        { id: 'og', name: 'Blog OG / Link Card', ratio: '1.91:1', width: 1200, height: 630 },
        { id: 'insta-sq', name: 'Instagram Square', ratio: '1:1', width: 1080, height: 1080 },
        { id: 'insta-port', name: 'Instagram Portrait', ratio: '4:5', width: 1080, height: 1350 },
        { id: 'shorts', name: 'Shorts / Reels / Story', ratio: '9:16', width: 1080, height: 1920 },
        { id: 'x-header', name: 'X / Twitter Post', ratio: '16:9', width: 1600, height: 900 },
      ],
    },
    pdfTools: {
      metaTitle: 'Local PDF Merge, Split & PDF to Image Tools | KitZero',
      metaDesc: 'Merge multiple PDFs, extract or split pages, and convert PDF pages to high-res PNG/JPG images 100% locally in your browser. Zero uploads, 100% private.',
      title: 'PDF Merge · Split · PDF to Image',
      subtitle: 'Never upload contracts, resumes, or receipts to unknown servers. Process PDFs privately inside your browser.',
      tabMerge: 'Merge PDFs',
      tabSplit: 'Split / Extract',
      tabToImage: 'PDF to Images',
      merge: {
        dropTitle: 'Drop multiple PDF files here or click to add',
        dropHint: 'Add 2 or more PDFs and adjust their order before merging',
        selectFiles: 'Add PDF Files',
        moveUp: 'Up',
        moveDown: 'Down',
        remove: 'Remove',
        pagesUnit: 'pages',
        mergeBtn: 'Merge into One PDF',
        clearBtn: 'Clear',
        needTwo: 'Please add at least 2 PDF files to merge.',
        doneMsg: 'Merged PDF is ready and downloaded.',
        largeWarn: 'Large PDF notice: Total size exceeds 50 MB. Merging may use significant browser memory and take several seconds.',
      },
      split: {
        dropTitle: 'Drop a PDF file here to split or extract pages',
        dropHint: 'Single PDF file · Extract specific pages or split every page into individual PDFs',
        selectFile: 'Select PDF File',
        totalPages: 'Total Pages',
        modeRange: 'Extract Page Range (Save as 1 PDF)',
        modeEvery: 'Split Every Page (Download as ZIP)',
        rangeLabel: 'Page Range',
        rangePlaceholder: 'e.g. 1-3, 5, 7-9',
        rangeHint: 'Use commas and hyphens to specify pages.',
        splitBtn: 'Split PDF',
        doneSingle: 'Extracted PDF has been downloaded.',
        doneZip: 'ZIP archive with all split pages has been downloaded.',
        invalidRange: 'Please enter a valid page range (e.g., 1-3, 5).',
        largeWarn: 'Large PDF notice: This file is large or has many pages. Extracting specific ranges is faster and safer than splitting every page.',
      },
      toImage: {
        dropTitle: 'Drop a PDF file here to render pages as images',
        dropHint: 'Converts every page locally into crisp PNG or JPG images',
        selectFile: 'Select PDF File',
        formatLabel: 'Image Format',
        scaleLabel: 'Resolution Scale',
        scaleStandard: 'Standard (1.5x · Web)',
        scaleHigh: 'High (2.0x · Recommended)',
        scaleUltra: 'Ultra (3.0x · Print)',
        rangeLabel: 'Page Range (Optional)',
        rangePlaceholder: 'Leave blank for all (e.g. 1-20)',
        rangeHint: 'For large PDFs, rendering 20–30 pages at a time keeps memory usage low.',
        convertBtn: 'Convert to Images',
        cancelBtn: 'Cancel',
        downloadZip: 'Download All Images (ZIP)',
        downloadSingle: 'Save',
        progressText: 'Rendering',
        doneMsg: 'Selected pages rendered successfully.',
        cancelledMsg: 'Rendering stopped. Pages already rendered can still be downloaded.',
        invalidRange: 'Please enter a valid page range (e.g., 1-10, 15).',
        largeWarn: 'Large PDF notice: 30+ pages or 50 MB+. Specify a page range (e.g. 1-20) or use 1.5x–2.0x scale to avoid high memory usage.',
      },
    },
    privacy: {
      metaTitle: '100% Local Processing & Privacy Policy | KitZero',
      metaDesc: 'Learn how KitZero processes all images and PDFs strictly inside your browser with zero server uploads.',
      title: '100% Local Processing & Privacy Policy',
      subtitle: 'Not a single byte of your files ever leaves your device.',
      sections: [
        {
          heading: '1. Zero-Upload Client-Side Processing',
          body: 'Every tool on KitZero — image compression, WebP conversion, EXIF removal, batch thumbnail resizing, and PDF merging/splitting/rendering — executes strictly inside your browser using HTML5 Canvas, File APIs, and local JavaScript/WebAssembly libraries. Files remain in local memory and are discarded as soon as you close or refresh the tab.',
        },
        {
          heading: '2. No File Data Collection',
          body: 'KitZero requires no account and never collects, transmits, logs, or stores your uploaded files, filenames, or embedded metadata.',
        },
        {
          heading: '3. Cookies & Advertising',
          body: 'To keep KitZero free, third-party ad networks (such as Google AdSense) or privacy-friendly analytics may use browser cookies. You can manage or disable cookies at any time through your browser settings.',
        },
      ],
    },
  },
};

export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  const normalized = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  const withoutEn = normalized.replace(/^\/en(\/|$)/, '/');
  const clean = withoutEn === '' ? '/' : withoutEn;
  if (targetLocale === 'en') {
    return clean === '/' ? '/en/' : `/en${clean}`;
  }
  return clean;
}
