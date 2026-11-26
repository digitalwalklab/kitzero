interface WordCounterLabels {
  copiedMsg: string;
  trimmedMsg: string;
  noKeywords: string;
  unitSec: string;
  unitMin: string;
}

const STORAGE_KEY = 'kitzero-word-counter-draft';

function calcEucKrBytes(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    bytes += code > 127 ? 2 : 1;
  }
  return bytes;
}

function calcUtf8Bytes(text: string): number {
  return new TextEncoder().encode(text).length;
}

export function initWordCounter(root: HTMLElement): void {
  const labels: WordCounterLabels = JSON.parse(root.dataset.labels || '{}');
  const textarea = root.querySelector<HTMLTextAreaElement>('[data-wc-input]')!;
  const statWithSpace = root.querySelector<HTMLElement>('[data-wc-with-space]')!;
  const statNoSpace = root.querySelector<HTMLElement>('[data-wc-no-space]')!;
  const statWords = root.querySelector<HTMLElement>('[data-wc-words]')!;
  const statSentences = root.querySelector<HTMLElement>('[data-wc-sentences]')!;
  const statLines = root.querySelector<HTMLElement>('[data-wc-lines]')!;
  const statBytesEuc = root.querySelector<HTMLElement>('[data-wc-bytes-euc]')!;
  const statBytesUtf8 = root.querySelector<HTMLElement>('[data-wc-bytes-utf8]')!;
  const statReadTime = root.querySelector<HTMLElement>('[data-wc-read-time]')!;
  const keywordsEl = root.querySelector<HTMLElement>('[data-wc-keywords]')!;
  const copyBtn = root.querySelector<HTMLButtonElement>('[data-wc-copy]')!;
  const trimBtn = root.querySelector<HTMLButtonElement>('[data-wc-trim]')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-wc-clear]')!;
  const statusEl = root.querySelector<HTMLElement>('[data-wc-status]')!;

  function showStatus(msg: string): void {
    statusEl.className = 'status-banner show success';
    statusEl.textContent = msg;
    window.setTimeout(() => {
      if (statusEl.textContent === msg) {
        statusEl.className = 'status-banner';
        statusEl.textContent = '';
      }
    }, 2200);
  }

  function updateStats(): void {
    const text = textarea.value;
    const withSpace = text.length;
    const noSpace = text.replace(/\s/g, '').length;
    const trimmed = text.trim();
    const wordsArr = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const sentencesArr = trimmed
      ? trimmed
          .split(/[.!?。\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const linesCount = text.length === 0 ? 0 : text.split(/\r?\n/).length;
    const eucBytes = calcEucKrBytes(text);
    const utf8Bytes = calcUtf8Bytes(text);

    // ~450 chars/min for mixed Korean/English reading speed
    const totalSec = noSpace === 0 ? 0 : Math.max(1, Math.round((noSpace / 450) * 60));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const readText =
      min > 0
        ? `${min}${labels.unitMin} ${sec}${labels.unitSec}`
        : `${sec}${labels.unitSec}`;

    statWithSpace.textContent = withSpace.toLocaleString();
    statNoSpace.textContent = noSpace.toLocaleString();
    statWords.textContent = wordsArr.length.toLocaleString();
    statSentences.textContent = sentencesArr.length.toLocaleString();
    statLines.textContent = linesCount.toLocaleString();
    statBytesEuc.textContent = eucBytes.toLocaleString();
    statBytesUtf8.textContent = utf8Bytes.toLocaleString();
    statReadTime.textContent = readText;

    // Top 5 frequent words (length >= 2)
    const freq = new Map<string, number>();
    for (const rawWord of wordsArr) {
      const clean = rawWord.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
      if (clean.length < 2) continue;
      freq.set(clean, (freq.get(clean) || 0) + 1);
    }
    const top = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    keywordsEl.innerHTML = '';
    if (top.length === 0) {
      const span = document.createElement('span');
      span.className = 'wc-keyword-empty';
      span.textContent = labels.noKeywords;
      keywordsEl.appendChild(span);
    } else {
      for (const [word, count] of top) {
        const chip = document.createElement('span');
        chip.className = 'wc-keyword-chip';
        chip.textContent = `${word} (${count})`;
        keywordsEl.appendChild(chip);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY, text.slice(0, 50000));
    } catch {}
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) textarea.value = saved;
  } catch {}

  textarea.addEventListener('input', updateStats);

  copyBtn.addEventListener('click', async () => {
    if (!textarea.value) return;
    try {
      await navigator.clipboard.writeText(textarea.value);
      showStatus(labels.copiedMsg);
    } catch {}
  });

  trimBtn.addEventListener('click', () => {
    if (!textarea.value) return;
    textarea.value = textarea.value
      .split(/\r?\n/)
      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    updateStats();
    showStatus(labels.trimmedMsg);
  });

  clearBtn.addEventListener('click', () => {
    textarea.value = '';
    updateStats();
    textarea.focus();
  });

  updateStats();
}
