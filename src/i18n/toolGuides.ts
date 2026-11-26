import type { Locale } from './translations';

export type GuideKey =
  | 'image-optimizer'
  | 'thumbnail-resizer'
  | 'image-crop'
  | 'image-blur'
  | 'heic-converter'
  | 'watermark'
  | 'pdf-tools'
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
  | 'image-merge'
  | 'id-photo'
  | 'word-counter'
  | 'color-picker';

interface ToolGuide {
  howToTitle: string;
  steps: string[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
}

export const toolGuides: Record<Locale, Record<GuideKey, ToolGuide>> = {
  ko: {
    'image-optimizer': {
      howToTitle: '이미지 압축 · WebP 변환 · EXIF 삭제 사용법',
      steps: [
        '압축하거나 포맷을 바꿀 사진 여러 장을 드롭존에 올리거나 Ctrl+V로 붙여넣습니다.',
        '좌측에서 출력 포맷(WebP/JPG/PNG), 압축 품질, 최대 가로 크기, 그리고 EXIF(GPS·카메라 정보) 삭제 여부를 선택합니다.',
        '일괄 변환 실행 후 전후 비교 슬라이더로 화질을 확인하고 개별 저장 또는 ZIP 일괄 다운로드로 내려받습니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: 'EXIF 삭제 체크를 해제하면 GPS와 촬영 정보가 유지되나요?',
          a: '네. JPG 및 WebP 출력 시 EXIF 삭제 체크를 해제하면 원본 사진에 들어 있던 카메라·촬영일시·GPS 메타데이터를 그대로 보존해 저장합니다.',
        },
        {
          q: 'WebP로 변환하면 용량이 얼마나 줄어드나요?',
          a: '일반적인 스마트폰 JPG 사진 기준 품질 80~85% WebP로 변환하면 눈에 띄는 화질 저하 없이 보통 50~80%까지 용량이 절감됩니다.',
        },
      ],
    },
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
    'pdf-merge': {
      howToTitle: 'PDF 합치기 사용법',
      steps: [
        '합칠 PDF 파일 2개 이상을 드롭존에 끌어다 놓거나 파일 선택 버튼으로 불러옵니다.',
        '각 파일의 페이지 수를 확인하고 위/아래 버튼으로 원하는 결합 순서를 조정합니다.',
        'PDF 합치기 및 다운로드 버튼을 누르면 서버 업로드 없이 브라우저에서 즉시 하나의 PDF가 생성됩니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '계약서나 이력서 PDF를 합쳐도 외부 서버에 저장되지 않나요?',
          a: '네. KitZero는 브라우저 내 pdf-lib 엔진으로 로컬 메모리에서만 병합하므로 문서가 외부 서버로 전송되거나 남지 않습니다.',
        },
        {
          q: '합칠 수 있는 PDF 파일 개수나 페이지 제한이 있나요?',
          a: '별도의 유료 제한이나 워터마크는 없으며, 기기 메모리(RAM)가 허용하는 범위 내에서 여러 PDF를 자유롭게 합칠 수 있습니다.',
        },
      ],
    },
    'pdf-split': {
      howToTitle: 'PDF 분할 · 페이지 추출 사용법',
      steps: [
        '분할할 PDF 문서를 드롭존에 올려 전체 페이지 수를 확인합니다.',
        '특정 페이지만 뽑으려면 범위(예: 1-3, 5, 8-10)를 입력하고, 전체를 낱장으로 나누려면 모든 페이지 분할 옵션을 선택합니다.',
        '실행 버튼을 누르면 추출된 PDF 또는 낱장 PDF가 담긴 ZIP 파일이 즉시 다운로드됩니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '원하는 페이지 몇 장만 골라서 새 PDF 1개로 만들 수 있나요?',
          a: '네. 페이지 범위 입력칸에 "1-3, 7, 10-12"처럼 쉼표와 하이픈으로 지정하면 해당 페이지만 묶인 새 PDF로 바로 저장됩니다.',
        },
        {
          q: '원본 PDF 파일이 손상되거나 변경되나요?',
          a: '아니요. 원본 파일은 읽기 전용으로만 처리되며, 추출 결과는 항상 새로운 PDF/ZIP 파일로 다운로드됩니다.',
        },
      ],
    },
    'pdf-to-image': {
      howToTitle: 'PDF → 이미지(PNG · JPG) 변환 사용법',
      steps: [
        '이미지로 변환할 PDF 파일을 선택합니다.',
        '출력 포맷(PNG 또는 JPG), 해상도 배율(1.5x~3.0x), 필요한 경우 변환할 페이지 범위를 지정합니다.',
        '변환 실행 후 미리보기를 확인하고 개별 이미지 또는 전체 ZIP 파일로 내려받습니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '글자가 선명하게 보이려면 어떤 배율을 선택하는 게 좋나요?',
          a: '웹 공유나 일반 문서용은 2.0x(고화질), 인쇄나 작은 글씨가 많은 슬라이드·도면은 3.0x(초고화질) PNG 설정을 권장합니다.',
        },
        {
          q: '페이지가 아주 많은 PDF도 중간에 멈출 수 있나요?',
          a: '네. 변환 중 언제든 중단 버튼으로 멈출 수 있으며, 필요한 페이지 범위만 입력해 빠르게 변환할 수도 있습니다.',
        },
      ],
    },
    'image-to-pdf': {
      howToTitle: '이미지(JPG · PNG · WebP) → PDF 변환 사용법',
      steps: [
        'PDF로 묶을 신분증, 영수증, 스캔 사진 여러 장을 드롭존에 올립니다.',
        '위/아래 버튼으로 사진 순서를 정렬하고 페이지 크기(A4 맞춤 또는 이미지 원본 크기)와 여백을 선택합니다.',
        'PDF 생성 버튼을 누르면 모든 이미지가 깔끔하게 담긴 PDF 1개가 즉시 저장됩니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '신분증이나 통장사본 사진을 PDF로 만들어도 안전한가요?',
          a: '네. 이미지가 외부 서버로 전혀 업로드되지 않고 현재 사용 중인 기기의 브라우저 안에서만 PDF로 변환됩니다.',
        },
        {
          q: 'A4 맞춤과 원본 크기 옵션의 차이는 무엇인가요?',
          a: 'A4 맞춤은 인쇄·제출용 문서 규격(A4) 안에 비율을 유지해 배치하고, 원본 크기는 각 사진의 실제 해상도 크기에 맞춰 페이지를 생성합니다.',
        },
      ],
    },
    'pdf-organize': {
      howToTitle: 'PDF 회전 · 페이지 삭제 · 순서 변경 사용법',
      steps: [
        '정리할 PDF 파일을 올리면 모든 페이지가 썸네일 카드 형태로 표시됩니다.',
        '각 페이지 카드의 버튼으로 90° 좌/우 회전, 앞/뒤 순서 이동, 불필요한 페이지 삭제를 적용합니다.',
        '편집이 끝나면 새 PDF 저장 버튼을 눌러 변경 사항이 반영된 PDF를 다운로드합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '스캔이 거꾸로 된 특정 페이지만 90도·180도 돌릴 수 있나요?',
          a: '네. 전체 문서가 아니라 원하는 개별 페이지마다 좌/우 90° 회전 버튼을 눌러 필요한 각도로 정확히 맞출 수 있습니다.',
        },
        {
          q: '페이지 순서를 바꾸거나 삭제하면 텍스트 검색 기능도 유지되나요?',
          a: '네. 페이지를 이미지로 다시 굽지 않고 원본 PDF 페이지 구조를 그대로 재배치하므로 텍스트 선택과 화질이 그대로 유지됩니다.',
        },
      ],
    },
    'pdf-compress': {
      howToTitle: 'PDF 용량 줄이기 사용법',
      steps: [
        '용량을 줄이고 싶은 스캔본·고용량 PDF 파일을 드롭존에 올립니다.',
        '고화질(문서·인쇄용), 균형(이메일·웹 제출용), 최대 압축(용량 제한 통과용) 중 원하는 프리셋을 선택합니다.',
        '압축 실행 후 원본 대비 절감 용량(%)을 확인하고 가벼워진 PDF를 즉시 다운로드합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '어떤 PDF 파일이 용량이 가장 많이 줄어드나요?',
          a: '스캔된 문서나 고해상도 사진·이미지가 많이 포함된 PDF일수록 압축 효과가 크며, 이미 최적화된 텍스트 전용 PDF는 절감 폭이 작을 수 있습니다.',
        },
        {
          q: '관공서·채용 사이트 첨부 제한(예: 5MB, 10MB)에 맞출 수 있나요?',
          a: '네. 균형 또는 최대 압축 프리셋을 사용하면 스캔 서류 용량을 크게 줄여 첨부 제한을 손쉽게 통과할 수 있습니다.',
        },
      ],
    },
    'pdf-watermark': {
      howToTitle: 'PDF 워터마크 · 페이지 번호 삽입 사용법',
      steps: [
        '워터마크나 쪽번호를 넣을 PDF 문서를 선택합니다.',
        '대각선으로 넣을 한글·영문 문구(예: 대외비, 사본, 회사명)와 투명도, 하단 중앙 페이지 번호 포함 여부를 설정합니다.',
        '적용 버튼을 누르면 모든 페이지에 워터마크와 쪽번호가 삽입된 PDF가 로컬에서 즉시 저장됩니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '한글 워터마크를 넣어도 글자가 깨지지 않나요?',
          a: '네. 브라우저 Canvas로 고해상도 투명 이미지 스탬프를 생성해 삽입하므로 한글·특수문자·이모지도 깨짐 없이 선명하게 표시됩니다.',
        },
        {
          q: '워터마크 없이 페이지 번호만 넣거나, 워터마크만 넣을 수도 있나요?',
          a: '네. 워터마크 입력칸을 비우면 페이지 번호만 들어가고, 페이지 번호 체크를 해제하면 워터마크만 깔끔하게 적용됩니다.',
        },
      ],
    },
    'image-merge': {
      howToTitle: '이미지 이어붙이기 · 사진 합치기 사용법',
      steps: [
        '합칠 사진이나 스크린샷 2장 이상을 드롭존에 올리거나 Ctrl+V로 붙여넣습니다.',
        '배치 방향(세로, 가로, 2열 그리드), 크기 맞춤, 이미지 간격(px), 배경색을 선택하고 파일 순서를 조정합니다.',
        '하단 실시간 미리보기를 확인한 뒤 합친 이미지 다운로드 버튼을 눌러 WebP·PNG·JPG로 저장합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '가로 크기가 다른 스크린샷들을 세로로 합쳐도 깔끔하게 맞나요?',
          a: '네. 기본 옵션인 "기준 너비/높이에 자동 맞춤"을 사용하면 서로 다른 해상도의 사진도 비율을 유지한 채 폭을 깔끔하게 통일해 이어붙입니다.',
        },
        {
          q: '합친 사진이 외부 서버에 저장되나요?',
          a: '아니요. 모든 합치기 작업은 브라우저 Canvas 메모리에서만 수행되므로 영수증이나 개인 스크린샷도 100% 안전합니다.',
        },
      ],
    },
    'word-counter': {
      howToTitle: '글자 수 세기 · 바이트 계산기 사용법',
      steps: [
        '자기소개서, 블로그 원고, 리포트 텍스트를 입력창에 작성하거나 붙여넣습니다.',
        '상단 카드에서 공백 포함/제외 글자 수, 한글 2바이트(EUC-KR) 및 UTF-8 바이트, 단어·문장 수, 예상 읽기 시간을 실시간 확인합니다.',
        '필요하면 중복 공백 정리 버튼으로 불필요한 여백을 정리한 뒤 복사 버튼으로 바로 사용합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '한글 2바이트(EUC-KR)와 UTF-8 바이트의 차이는 무엇인가요?',
          a: '국내 채용 사이트·자기소개서 양식은 한글 1자를 2바이트(EUC-KR)로 계산하는 경우가 많고, 웹·데이터베이스는 한글 1자를 3바이트(UTF-8)로 계산합니다. 두 기준을 동시에 확인할 수 있습니다.',
        },
        {
          q: '입력한 자기소개서 내용이 서버로 전송되나요?',
          a: '아니요. 입력한 텍스트는 외부 서버로 전혀 전송되지 않으며, 실수로 창을 닫아도 복구할 수 있도록 현재 브라우저의 localStorage에만 임시 보관됩니다.',
        },
      ],
    },
    'color-picker': {
      howToTitle: '이미지 색상 추출기 · 스포이드 사용법',
      steps: [
        '색상을 추출할 사진이나 디자인 시안을 드롭존에 올리거나 Ctrl+V로 붙여넣습니다.',
        '이미지 위에서 원하는 지점을 클릭(또는 터치)하면 좌측에 해당 픽셀의 HEX·RGB·HSL 색상 코드가 즉시 표시됩니다.',
        '복사 버튼을 누르거나 하단 자동 추출 대표 팔레트 8색을 클릭해 HEX 코드를 클립보드에 바로 복사합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '대표 색상 팔레트는 어떻게 추출되나요?',
          a: '이미지를 브라우저 메모리에서 분석해 픽셀 분포가 높으면서 서로 뚜렷하게 구분되는 대표 색상 최대 8개를 자동으로 추출합니다.',
        },
        {
          q: '모바일에서도 스포이드로 색상을 찍을 수 있나요?',
          a: '네. 스마트폰 화면에서 이미지의 원하는 부분을 손가락으로 터치하면 해당 픽셀의 HEX·RGB·HSL 코드가 바로 추출됩니다.',
        },
      ],
    },
    'id-photo': {
      howToTitle: '여권 · 증명사진 규격 자르기 사용법',
      steps: [
        '정면을 보고 촬영한 인물 사진을 드롭존에 올리거나 Ctrl+V로 붙여넣습니다.',
        '좌측에서 여권(3.5×4.5cm), 반명함판(3×4cm), 미국 비자(5×5cm) 등 원하는 규격을 선택합니다.',
        '사진을 드래그하고 확대/축소 슬라이더로 정수리와 턱을 가이드라인에 맞춘 뒤 낱장(온라인 제출용) 또는 4×6 인화지 배치판으로 저장합니다.',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        {
          q: '저장한 이미지에 파란색 가이드라인도 같이 찍히나요?',
          a: '아니요. 얼굴 가이드라인은 위치 맞춤을 돕기 위한 미리보기 전용이며, 실제 저장되는 낱장 사진과 4×6 인화판에는 포함되지 않습니다.',
        },
        {
          q: '4×6 인화지 배치판은 어떻게 인화하면 되나요?',
          a: '300 DPI 기준 정확한 4×6인치(1800×1200px) 크기로 생성되므로, 사진관이나 무인 사진 인화기(4×6 사이즈, 테두리 없음/원본 맞춤)로 출력한 뒤 연한 회색 재단선을 따라 자르시면 됩니다.',
        },
      ],
    },
  },
  en: {
    'image-optimizer': {
      howToTitle: 'How to Compress Images, Convert to WebP & Control EXIF',
      steps: [
        'Drop multiple photos into the dropzone or paste screenshots directly with Ctrl+V.',
        'Choose your output format (WebP, JPG, PNG), quality, optional max width, and whether to strip or keep EXIF/GPS metadata.',
        'Click Optimize All, inspect visual quality with the Before/After slider, and download individual files or a single ZIP archive.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Can I keep camera EXIF metadata when converting to JPG or WebP?',
          a: 'Yes. Uncheck the Remove EXIF option to preserve original EXIF metadata when exporting JPG or WebP files.',
        },
        {
          q: 'How much smaller are WebP files compared to JPG?',
          a: 'Converting camera JPGs to WebP at 80–85% quality typically cuts file size by 50–80% while keeping crisp visual detail.',
        },
      ],
    },
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
    'pdf-merge': {
      howToTitle: 'How to Merge PDF Files Locally',
      steps: [
        'Drop two or more PDF files into the dropzone or click to select them from your device.',
        'Check each file’s page count and use the Up/Down buttons to set the exact order.',
        'Click Merge & Download PDF to combine all files into one document directly in your browser.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Are my contracts or private PDFs uploaded to any server?',
          a: 'No. KitZero merges PDFs purely in your browser memory using pdf-lib, so your files never leave your device.',
        },
        {
          q: 'Are there watermarks or file count limits?',
          a: 'There are no watermarks, sign-ups, or paywalls. You can combine as many PDFs as your device memory comfortably handles.',
        },
      ],
    },
    'pdf-split': {
      howToTitle: 'How to Split & Extract PDF Pages',
      steps: [
        'Upload a PDF file to view its total page count.',
        'Enter specific page ranges (e.g., 1-3, 5, 8-10) to extract into one PDF, or choose Split All Pages into individual files.',
        'Click Run to immediately download the extracted PDF or ZIP archive.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Can I extract non-contiguous pages into a single new PDF?',
          a: 'Yes. Enter ranges separated by commas such as "1-2, 5, 9-11" to export just those pages into one clean PDF.',
        },
        {
          q: 'Does splitting modify my original PDF file?',
          a: 'No. Your original file remains untouched on your device and the result is saved as a brand-new file.',
        },
      ],
    },
    'pdf-to-image': {
      howToTitle: 'How to Convert PDF Pages to PNG or JPG',
      steps: [
        'Select the PDF document you want to render as images.',
        'Choose PNG or JPG format, resolution scale (1.5x to 3.0x), and an optional page range.',
        'Preview the rendered pages and download individual images or export everything in a ZIP file.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Which scale setting gives the sharpest text?',
          a: '2.0x is great for everyday sharing and slides, while 3.0x PNG produces ultra-crisp text for dense documents and print.',
        },
        {
          q: 'Can I stop a large PDF conversion partway through?',
          a: 'Yes. You can click Stop at any time or enter a specific page range before starting.',
        },
      ],
    },
    'image-to-pdf': {
      howToTitle: 'How to Convert Images to a Single PDF',
      steps: [
        'Drop multiple JPG, PNG, or WebP photos (such as receipts, IDs, or scans) into the dropzone.',
        'Reorder your images and pick A4 Fit or Original Image Size along with margin preferences.',
        'Click Create PDF to generate and download your combined document locally.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Is it safe to convert ID photos or receipts into a PDF here?',
          a: 'Yes. All processing happens locally inside your browser with zero server uploads.',
        },
        {
          q: 'When should I choose A4 Fit vs. Original Size?',
          a: 'Use A4 Fit for printable forms and email submissions, or Original Size to preserve each image’s exact native dimensions.',
        },
      ],
    },
    'pdf-organize': {
      howToTitle: 'How to Rotate, Delete & Reorder PDF Pages',
      steps: [
        'Load a PDF to preview every page as an interactive thumbnail card.',
        'Rotate individual pages 90° left or right, move pages forward/backward, or delete unwanted pages.',
        'Click Save Organized PDF to export your updated document locally.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Can I rotate just one upside-down scanned page?',
          a: 'Yes. Each thumbnail card has its own 90° left and right rotation controls so you can fix individual pages accurately.',
        },
        {
          q: 'Does organizing pages preserve selectable text and vector quality?',
          a: 'Yes. Pages are rearranged directly in the PDF structure without rasterizing, keeping text searchable and crisp.',
        },
      ],
    },
    'pdf-compress': {
      howToTitle: 'How to Compress PDF File Size Locally',
      steps: [
        'Select a heavy scanned or image-rich PDF file.',
        'Choose High Quality, Balanced, or Max Compression based on your target file size.',
        'Run compression to inspect the exact size reduction percentage and download the lighter PDF.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Which PDFs shrink the most?',
          a: 'Scanned documents and PDFs with high-resolution photos see the largest size reductions, while already-minimal text PDFs shrink less.',
        },
        {
          q: 'Is it good for email or portal upload size limits?',
          a: 'Yes. Balanced or Max Compression makes it easy to get large scans under 5MB or 10MB attachment limits.',
        },
      ],
    },
    'pdf-watermark': {
      howToTitle: 'How to Add Watermarks & Page Numbers to a PDF',
      steps: [
        'Upload the PDF file you want to stamp.',
        'Enter diagonal watermark text (supports English, Korean, and Unicode), adjust opacity, and toggle bottom page numbers.',
        'Click Apply to stamp every page locally and download the finished PDF.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Does it support non-Latin characters like Korean or Japanese?',
          a: 'Yes. Watermarks are rendered as crisp transparent canvas stamps before embedding, so Unicode text never garbles.',
        },
        {
          q: 'Can I add only page numbers without a watermark?',
          a: 'Yes. Leave the watermark text blank to add page numbers only, or uncheck page numbers to add only the watermark.',
        },
      ],
    },
    'image-merge': {
      howToTitle: 'How to Combine & Stitch Images Locally',
      steps: [
        'Drop two or more photos or screenshots into the dropzone, or paste directly with Ctrl+V.',
        'Choose Vertical Stack, Horizontal Row, or 2-Column Grid, adjust spacing and background color, and reorder files.',
        'Check the live preview and click Download Combined Image to export as WebP, PNG, or JPG.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'What if my screenshots have different widths?',
          a: 'With the default Auto-Fit alignment enabled, KitZero scales each image proportionally to a uniform width or height so seams look clean.',
        },
        {
          q: 'Are my combined images uploaded to any server?',
          a: 'Never. All stitching happens locally inside an HTML5 Canvas in your browser.',
        },
      ],
    },
    'word-counter': {
      howToTitle: 'How to Use the Local Word & Character Counter',
      steps: [
        'Type or paste your essay, resume, blog post, or copy into the editor.',
        'Monitor real-time character counts (with and without spaces), words, sentences, UTF-8 / 2-byte lengths, and reading time.',
        'Use Clean Extra Spaces to tidy up duplicate whitespace and copy your text with one click.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Why are both 2-Byte CJK and UTF-8 byte counts shown?',
          a: 'Some legacy application forms count CJK characters as 2 bytes (EUC-KR/CP949) while modern web APIs use 3-byte UTF-8. Showing both lets you meet either limit accurately.',
        },
        {
          q: 'Is my text sent to a remote server?',
          a: 'No. Everything is calculated locally in JavaScript, and drafts are only stored temporarily in your own browser localStorage.',
        },
      ],
    },
    'color-picker': {
      howToTitle: 'How to Pick Colors & Extract a Palette from an Image',
      steps: [
        'Upload an image or paste a screenshot with Ctrl+V.',
        'Click or tap any pixel on the image to inspect its exact HEX, RGB, and HSL values.',
        'Click any Copy button or tap a swatch in the auto-extracted 8-color dominant palette to copy its HEX code.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'How is the 8-color dominant palette generated?',
          a: 'The tool quantizes pixels locally in your browser and selects up to 8 visually distinct dominant colors.',
        },
        {
          q: 'Does the eyedropper work on mobile touchscreens?',
          a: 'Yes. Tap anywhere on the preview canvas on mobile or tablet to pick the exact pixel color.',
        },
      ],
    },
    'id-photo': {
      howToTitle: 'How to Crop Passport & ID Photos Locally',
      steps: [
        'Upload a front-facing portrait photo or paste one directly with Ctrl+V.',
        'Select your required standard (35×45mm Passport/EU/KR, 30×40mm Resume ID, US 2×2", or China Visa).',
        'Drag and zoom your photo to align your head and chin with the guide overlay, then download either a single 300 DPI image or a 4×6 print sheet.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Will the alignment guide lines appear in my downloaded photo?',
          a: 'No. The face guide overlay is strictly for preview alignment and is never baked into exported single photos or print sheets.',
        },
        {
          q: 'How do I print the 4×6 sheet?',
          a: 'The sheet is exported at exact 4×6 inch (1800×1200 px, 300 DPI) dimensions with subtle cut lines—simply print it on standard 4×6 photo paper without scaling.',
        },
      ],
    },
  },
};
