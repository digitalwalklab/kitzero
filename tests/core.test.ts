import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  extensionFromMime,
  extractJpegExifSegment,
  extractRawExifTiff,
  formatBytes,
  injectJpegExifSegment,
  isCanvasTooLarge,
  parsePageRanges,
  stripExtension,
  wrapTiffAsJpegApp1,
} from '../src/scripts/utils.ts';
import { getAlternatePath } from '../src/i18n/translations.ts';
import { getNavLabel, SITEMAP_PATHS, TOOL_REGISTRY } from '../src/i18n/toolRegistry.ts';

describe('parsePageRanges', () => {
  it('parses single pages, ranges, and deduplicates sorted 0-based indices', () => {
    assert.deepEqual(parsePageRanges('1-3, 5, 2', 10), [0, 1, 2, 4]);
    assert.deepEqual(parsePageRanges('5-3', 10), [2, 3, 4]);
  });

  it('rejects out-of-range or malformed inputs', () => {
    assert.deepEqual(parsePageRanges('', 10), []);
    assert.deepEqual(parsePageRanges('0-2', 10), []);
    assert.deepEqual(parsePageRanges('1-11', 10), []);
    assert.deepEqual(parsePageRanges('abc', 10), []);
  });
});

describe('file & canvas helpers', () => {
  it('formats byte sizes cleanly', () => {
    assert.equal(formatBytes(0), '0 B');
    assert.equal(formatBytes(512), '512 B');
    assert.equal(formatBytes(1024), '1.0 KB');
    assert.equal(formatBytes(1024 * 1024), '1.0 MB');
  });

  it('strips extensions and maps MIME types', () => {
    assert.equal(stripExtension('photo.test.jpg'), 'photo.test');
    assert.equal(stripExtension('noext'), 'noext');
    assert.equal(extensionFromMime('image/webp'), 'webp');
    assert.equal(extensionFromMime('image/jpeg'), 'jpg');
    assert.equal(extensionFromMime('image/png'), 'png');
  });

  it('enforces safe canvas dimension and pixel limits', () => {
    assert.equal(isCanvasTooLarge(4000, 3000), false);
    assert.equal(isCanvasTooLarge(17000, 1000), true);
    assert.equal(isCanvasTooLarge(12000, 12000), true);
  });
});

describe('JPEG EXIF binary extraction & injection', () => {
  it('round-trips a minimal EXIF APP1 segment cleanly', () => {
    const fakeTiff = new Uint8Array([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00]);
    const app1 = wrapTiffAsJpegApp1(fakeTiff);
    // Minimal JPEG: SOI (FF D8) + EOI (FF D9)
    const bareJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const withExif = injectJpegExifSegment(bareJpeg, app1);

    const extractedSeg = extractJpegExifSegment(withExif);
    assert.ok(extractedSeg);
    assert.deepEqual(extractedSeg, app1);

    const rawTiff = extractRawExifTiff(withExif);
    assert.deepEqual(rawTiff, fakeTiff);
  });

  it('returns null for non-JPEG or EXIF-less JPEG', () => {
    assert.equal(extractJpegExifSegment(new Uint8Array([0xff, 0xd8, 0xff, 0xd9])), null);
    assert.equal(extractJpegExifSegment(new Uint8Array([0x89, 0x50, 0x4e, 0x47])), null);
  });
});

describe('i18n routing & tool registry integrity', () => {
  it('maps KO and EN alternate paths accurately', () => {
    assert.equal(getAlternatePath('/', 'en'), '/en/');
    assert.equal(getAlternatePath('/en/', 'ko'), '/');
    assert.equal(getAlternatePath('/id-photo/', 'en'), '/en/id-photo/');
    assert.equal(getAlternatePath('/en/pdf-merge/', 'ko'), '/pdf-merge/');
  });

  it('maintains 21 unique tools with valid paths and bilingual labels', () => {
    assert.equal(TOOL_REGISTRY.length, 21);
    const ids = new Set(TOOL_REGISTRY.map((t) => t.id));
    assert.equal(ids.size, 21);
    for (const tool of TOOL_REGISTRY) {
      assert.ok(tool.path.startsWith('/') && tool.path.endsWith('/'));
      assert.ok(getNavLabel(tool.id, 'ko').length > 0);
      assert.ok(getNavLabel(tool.id, 'en').length > 0);
      assert.ok(SITEMAP_PATHS.includes(tool.path));
    }
  });
});
