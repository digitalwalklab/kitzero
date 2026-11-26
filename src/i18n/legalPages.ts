import type { Locale } from './translations';

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageContent {
  metaTitle: string;
  metaDesc: string;
  title: string;
  subtitle: string;
  updatedLabel: string;
  sections: LegalSection[];
}

interface AboutPageContent extends LegalPageContent {
  highlights: { title: string; desc: string }[];
  contactHeading: string;
  contactDesc: string;
  contactCta: string;
  contactUrl: string;
}

export const legalPages: Record<Locale, { terms: LegalPageContent; about: AboutPageContent }> = {
  ko: {
    terms: {
      metaTitle: '이용약관 | KitZero(킷제로)',
      metaDesc: 'KitZero(킷제로)의 서버 업로드 없는 무료 로컬 이미지·PDF·유틸리티 웹 도구 서비스 이용약관, 파일 보안 원칙 및 책임 범위를 안내합니다.',
      title: '이용약관',
      subtitle: 'KitZero(킷제로)의 모든 도구는 회원가입 없이 무료로 이용할 수 있으며, 모든 파일 처리는 사용자의 브라우저 안에서만 수행됩니다.',
      updatedLabel: '최종 업데이트: 2026-11-26',
      sections: [
        {
          heading: '1. 서비스 개요 및 로컬 처리 원칙',
          body: 'KitZero(킷제로, kitzero.jokerx04.com)는 이미지 압축·변환·편집, PDF 병합·분할·압축·서명, QR 코드 및 파비콘 생성 등 파일 유틸리티를 웹 브라우저 내에서 100% 클라이언트 사이드로 제공합니다. 사용자가 선택한 파일은 외부 서버로 전송, 수집 또는 보관되지 않습니다.',
        },
        {
          heading: '2. 이용 조건 및 금지 행위',
          body: '본 서비스는 개인 및 상업적 업무 보조 목적으로 자유롭게 이용할 수 있습니다. 다만 저작권·초상권 등 타인의 권리를 침해하는 파일 처리, 불법 콘텐츠 제작, 사이트의 정상적인 운영을 방해하는 자동화 공격 또는 악용 행위는 금지됩니다.',
        },
        {
          heading: '3. 파일 보관 및 데이터 손실에 대한 면책',
          body: '모든 변환 및 편집 작업은 브라우저 메모리에서만 일시적으로 수행되므로 페이지를 새로고침하거나 닫으면 작업 중인 데이터가 즉시 사라집니다. 중요한 원본 파일은 반드시 사용자의 기기에 별도 백업한 후 이용해 주시기 바라며, 로컬 기기 환경·브라우저 메모리 한계·예기치 못한 오류로 인한 데이터 손실에 대해 KitZero는 책임을 지지 않습니다.',
        },
        {
          heading: '4. 결과물 정확성 및 보증의 부인',
          body: 'KitZero는 "있는 그대로(AS-IS)" 제공됩니다. 브라우저별 코덱 차이, PDF 내부 구조, 대용량 파일 처리 한계 등으로 인해 일부 파일에서 의도하지 않은 변환 결과가 발생할 수 있으므로, 계약서·관공서 제출 서류 등 중요 문서는 다운로드 후 반드시 최종 결과물을 직접 확인하시기 바랍니다.',
        },
        {
          heading: '5. 지식재산권 및 오픈소스',
          body: '사용자가 변환·생성한 결과물의 모든 권리는 전적으로 사용자 본인에게 귀속됩니다. KitZero 웹사이트의 디자인, UI, 소스 코드 및 브랜드 표시는 관련 법령의 보호를 받으며, 내부적으로 사용되는 모든 서드파티 라이브러리는 MIT·Apache-2.0 등 허용적 오픈소스 라이선스를 준수합니다.',
        },
        {
          heading: '6. 약관 변경 및 문의',
          body: '본 약관은 서비스 기능 추가 또는 관련 법령 변경에 따라 사전 고지 후 수정될 수 있습니다. 서비스 이용과 관련된 문의나 오류 제보는 소개·문의 페이지의 공식 채널을 통해 전달해 주시면 확인 후 반영하겠습니다.',
        },
      ],
    },
    about: {
      metaTitle: '소개 · 문의 | KitZero(킷제로)',
      metaDesc: '서버 업로드 0% 철학으로 만든 무료 로컬 이미지·PDF 도구 모음 KitZero(킷제로) 소개 및 버그 제보·기능 제안 안내입니다.',
      title: 'KitZero(킷제로) 소개 · 문의',
      subtitle: '민감한 신분증·계약서·사진을 낯선 클라우드 서버에 올리지 않고도 빠르고 깔끔하게 변환할 수 있도록 만든 100% 브라우저 로컬 도구 모음입니다.',
      updatedLabel: '운영 도메인: kitzero.jokerx04.com',
      highlights: [
        {
          title: '서버 업로드 0%',
          desc: 'Canvas, WebAssembly, pdf-lib, pdf.js 기반으로 모든 변환을 내 기기 브라우저 메모리에서만 처리합니다.',
        },
        {
          title: '21종 올인원 로컬 도구',
          desc: '이미지 압축·EXIF 제어·모자이크·여권사진·합치기·HEIC부터 PDF 8종, 글자 수 세기·색상 추출·QR·파비콘·SVG까지 한곳에서 지원합니다.',
        },
        {
          title: '오프라인 PWA & 무료 이용',
          desc: '회원가입·워터마크·유료 결제 유도 없이 깔끔하게 사용할 수 있으며, 방문한 도구는 오프라인에서도 동작합니다.',
        },
      ],
      sections: [
        {
          heading: '왜 KitZero를 만들었나요?',
          body: '일상과 업무에서 이미지 용량을 줄이거나 PDF 계약서를 합치고 서명할 때마다, 파일을 외부 서버에 업로드해야 하는 온라인 변환기들이 늘 불안했습니다. KitZero는 "내 파일은 내 기기 밖으로 나가지 않는다"는 단순하고 명확한 원칙으로 설계되었습니다.',
        },
        {
          heading: '어떻게 검증할 수 있나요?',
          body: '브라우저 개발자 도구(F12)의 Network 탭을 열어둔 상태에서 파일을 변환해 보시면, 파일 데이터가 외부 서버로 전송되는 요청이 단 한 건도 발생하지 않음을 직접 확인하실 수 있습니다. 심지어 인터넷 연결을 끊은 상태에서도 이미 불러온 도구는 그대로 작동합니다.',
        },
        {
          heading: '지원 환경 안내',
          body: 'Chrome, Edge, Safari, Firefox 등 최신 데스크톱·모바일 브라우저를 모두 지원합니다. 모든 연산이 사용자 기기의 CPU와 RAM에서 실행되므로, 수백 MB 이상의 초대용량 파일은 데스크톱 환경에서 나누어 처리하는 것을 권장합니다.',
        },
      ],
      contactHeading: '버그 제보 · 기능 제안 · 문의',
      contactDesc: '사용 중 오류가 발생했거나 추가되었으면 하는 로컬 도구가 있다면 GitHub Issues를 통해 언제든 의견을 남겨 주세요.',
      contactCta: 'GitHub Issues로 문의하기',
      contactUrl: 'https://github.com/digitalwalklab/kitzero/issues',
    },
  },
  en: {
    terms: {
      metaTitle: 'Terms of Service | KitZero',
      metaDesc: 'Terms of Service and usage guidelines for KitZero, the 100% browser-local image, PDF, and web utility suite.',
      title: 'Terms of Service',
      subtitle: 'All KitZero tools are free to use without sign-up, and every file is processed strictly inside your local browser.',
      updatedLabel: 'Last updated: 2026-11-26',
      sections: [
        {
          heading: '1. Service Scope & Local Processing',
          body: 'KitZero (kitzero.jokerx04.com) provides client-side web utilities for image optimization, editing, PDF merging/splitting/compression/signing, QR code generation, and favicon creation. Files you select are processed exclusively in your browser and are never uploaded, collected, or stored on external servers.',
        },
        {
          heading: '2. Acceptable Use',
          body: 'You may use KitZero freely for personal and commercial workflows. You agree not to use the service to process unlawful material, infringe third-party intellectual property or privacy rights, or disrupt site availability through automated abuse.',
        },
        {
          heading: '3. Local Memory & Data Loss Disclaimer',
          body: 'Because all processing occurs transiently in browser memory, refreshing or closing the tab immediately discards unsaved work. Always keep backups of important original files. KitZero is not liable for data loss caused by browser crashes, memory limits, or local device issues.',
        },
        {
          heading: '4. No Warranty (AS-IS)',
          body: 'KitZero is provided "as is" without warranties of any kind. Output may vary depending on browser codecs, complex PDF structures, or device hardware. Always verify exported files—especially contracts, forms, and official documents—before submission.',
        },
        {
          heading: '5. Ownership & Open Source',
          body: 'You retain 100% ownership and rights to every file you process or generate. KitZero’s interface, branding, and original code remain protected by applicable laws, while third-party dependencies are used in compliance with permissive open-source licenses (MIT / Apache-2.0).',
        },
        {
          heading: '6. Changes & Contact',
          body: 'These terms may be updated as new features are added or legal requirements evolve. For questions or feedback, please reach out via the contact channel listed on our About & Contact page.',
        },
      ],
    },
    about: {
      metaTitle: 'About & Contact | KitZero',
      metaDesc: 'Learn about KitZero’s zero-upload local processing philosophy, 21 privacy-first browser tools, and how to report bugs or suggest features.',
      title: 'About & Contact',
      subtitle: 'A 100% browser-local image, PDF, and web utility suite built so you never have to upload sensitive documents or photos to unknown servers.',
      updatedLabel: 'Official domain: kitzero.jokerx04.com',
      highlights: [
        {
          title: '0% Server Uploads',
          desc: 'Powered by HTML5 Canvas, WebAssembly, pdf-lib, and pdf.js—every conversion stays strictly in your browser memory.',
        },
        {
          title: '21 All-in-One Tools',
          desc: 'From image compression, EXIF control, blur redaction, ID photos & stitching to 8 PDF tools, Word Counter, Color Picker, QR, Favicon & SVG.',
        },
        {
          title: 'Offline-Ready & Free',
          desc: 'No accounts, no watermarks, and no upload wait times. Visited tools even keep working offline via PWA caching.',
        },
      ],
      sections: [
        {
          heading: 'Why We Built KitZero',
          body: 'Whenever we needed to compress photos, redact personal info, or merge and sign a PDF contract, uploading private files to remote cloud converters felt unnecessarily risky. KitZero was built around one simple rule: your files never leave your device.',
        },
        {
          heading: 'How to Verify Zero Uploads',
          body: 'Open your browser Developer Tools (F12) → Network tab while converting any image or PDF. You will see zero file-upload requests leaving your machine—and once loaded, tools continue to work even if you disconnect from the internet.',
        },
        {
          heading: 'Browser Compatibility',
          body: 'KitZero works across modern desktop and mobile browsers including Chrome, Edge, Safari, and Firefox. Because processing runs on your device CPU and RAM, we recommend using a desktop browser for very large multi-hundred-MB batches.',
        },
      ],
      contactHeading: 'Bug Reports, Feature Requests & Contact',
      contactDesc: 'Spotted a bug or want to request a new 100% local tool? Open an issue on our GitHub repository anytime.',
      contactCta: 'Contact via GitHub Issues',
      contactUrl: 'https://github.com/digitalwalklab/kitzero/issues',
    },
  },
};
