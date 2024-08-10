import * as cheerio from 'cheerio';
import { fallback } from '../src/fallback';

describe('fallback', function () {
  describe('ogTitle', function () {
    it('title already found', async function () {
      let ogObject: any = { ogTitle: 'bar' };

      const $ = cheerio.load('<html><body><title>foo</title></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).toEqual('bar');
      expect(Object.keys(ogObject)).toContain('ogTitle');
    });
    it('when there is a title tag', async function () {
      let ogObject: any = {};
      const $ = cheerio.load('<html><body><title>foo</title></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogTitle');
    });
    it('when there are multiple title tags', async function () {
      let ogObject: any = {};
      const $ = cheerio.load(
        '<html><head><title>foo</title></head><body><svg><title>bar</title></svg><svg><title>baz</title></svg></body></html>',
      );
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogTitle');
    });
    it('when there is a meta title tag', async function () {
      const $ = cheerio.load(
        '<html><head><meta name="title" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogTitle');
    });
    it('when there is a .post-title div tag', async function () {
      const $ = cheerio.load(
        '<html><body><div class="post-title">foo</div></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogTitle');
    });
    it('when there is a .entry-title div tag', async function () {
      const $ = cheerio.load(
        '<html><body><div class="entry-title">foo</div></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogTitle');
    });
    it('when there is a .title h1 a tag', async function () {
      const $ = cheerio.load(
        '<html><body><h1 class="title"><a>foo</a></h1></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogTitle');
    });
    it('when there is a .title h1 tag', async function () {
      const $ = cheerio.load(
        '<html><body><h1 class="title">foo</h1></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogTitle');
    });
    it('when there is no title', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe('ogDescription', function () {
    it('description already found', function () {
      let ogObject: any = { ogDescription: 'bar' };
      const $ = cheerio.load(
        '<html><head><meta name="description" content="foo"></head></html>',
      );
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogDescription).toEqual('bar');
      expect(Object.keys(ogObject)).toContain('ogDescription');
    });
    it('when there is a description meta tag using name', async function () {
      const $ = cheerio.load(
        '<html><head><meta name="description" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDescription');
    });
    it('when there is a description meta tag using itemprop', async function () {
      const $ = cheerio.load(
        '<html><head><meta itemprop="description" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDescription');
    });
    it('when there is a #description tag', async function () {
      const $ = cheerio.load(
        '<html><body><div id="description">foo</div></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDescription');
    });
    it('when there is no description', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe('ogImage', function () {
    it('image already found', function () {
      let ogObject: any = { ogImage: { url: 'bar.png', type: 'png' } };
      const $ = cheerio.load('<html><body><image src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect(ogObject.ogImage.url).toEqual('bar.png');
      expect(ogObject.ogImage.type).toEqual('png');
      expect(Object.keys(ogObject)).toContain('ogImage');
    });
    it('when there is no og images found and ogImageFallback is set to false', async function () {
      const $ = cheerio.load('<html><body><image src="foo.png"></body></html>');
      const ogObject = fallback({}, { ogImageFallback: false }, $);
      expect(ogObject).toEqual({});
    });
    it('when there is a mix of valid and invalid images', async function () {
      const $ = cheerio.load(
        '<html><body><image width=2 src="foo.png"><image src="bar.png"><image src="foo.bar"><image></body></html>',
      );
      const ogObject = fallback({}, { ogImageFallback: true }, $);
      expect(ogObject.ogImage).toEqual([
        {
          height: null,
          type: 'png',
          url: 'foo.png',
          width: '2',
        },
        {
          height: null,
          type: 'png',
          url: 'bar.png',
          width: null,
        },
      ]);
      expect(Object.keys(ogObject)).toContain('ogImage');
    });
    it('when there is no og images found and no fallback images', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, { ogImageFallback: true }, $);
      expect(ogObject).toEqual({});
    });
    it('image already found but it has no type', async function () {
      let ogObject: any = { ogImage: { url: 'bar.png' } };
      const $ = cheerio.load('<html><body><image src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect(ogObject.ogImage.url).toEqual('bar.png');
      expect(ogObject.ogImage.type).toEqual('png');
      expect(Object.keys(ogObject)).toContain('ogImage');
    });
    it('image already found but it has no type but that type is invalid', async function () {
      let ogObject: any = { ogImage: { url: 'bar.foo' } };
      const $ = cheerio.load('<html><body><image src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect(ogObject.ogImage.url).toEqual('bar.foo');
      expect(ogObject.ogImage.type).toBeUndefined();
      expect(Object.keys(ogObject)).toContain('ogImage');
    });
  });

  describe('ogAudioURL/ogAudioSecureURL', function () {
    it('AudioURL already found', async function () {
      let ogObject: any = { ogAudioURL: 'bar.mp3' };
      const $ = cheerio.load('<html><body><audio src="foo.png"></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogAudioURL).toEqual('bar.mp3');
      expect(Object.keys(ogObject)).toContain('ogAudioURL');
    });
    it('AudioSecureURL already found', async function () {
      let ogObject: any = { ogAudioSecureURL: 'bar.mp3' };
      const $ = cheerio.load('<html><body><audio src="foo.png"></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogAudioSecureURL).toEqual('bar.mp3');
      expect(Object.keys(ogObject)).toContain('ogAudioSecureURL');
    });
    it('when there is a audio tag without HTTPS', async function () {
      const $ = cheerio.load('<html><body><audio src="foo.mp3"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioURL).toEqual('foo.mp3');
      expect(Object.keys(ogObject)).toContain('ogAudioURL');
    });
    it('when there is a audio tag with HTTPS', async function () {
      const $ = cheerio.load(
        '<html><body><audio src="https://foo.mp3" type="mp3"></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioSecureURL).toEqual('https://foo.mp3');
      expect(ogObject.ogAudioType).toEqual('mp3');
      expect(Object.keys(ogObject)).toEqual(
        expect.arrayContaining(['ogAudioSecureURL', 'ogAudioType']),
      );
    });
    it('when there is a audio source tag without HTTPS', async function () {
      const $ = cheerio.load(
        '<html><body><audio><source src="foo.mp3" type="mp3"></audio></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioURL).toEqual('foo.mp3');
      expect(ogObject.ogAudioType).toEqual('mp3');
      expect(Object.keys(ogObject)).toEqual(
        expect.arrayContaining(['ogAudioURL', 'ogAudioType']),
      );
    });
    it('when there is a audio source tag with HTTPS', async function () {
      const $ = cheerio.load(
        '<html><body><audio><source src="https://foo.mp3"></audio></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioSecureURL).toEqual('https://foo.mp3');
      expect(Object.keys(ogObject)).toContain('ogAudioSecureURL');
    });
    it('when there is no', async function () {
      const $ = cheerio.load('<html><body><audio></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe('ogLocale', function () {
    it('locale already found', async function () {
      let ogObject: any = { ogLocale: 'bar' };
      const $ = cheerio.load('<html lang="foo"></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogLocale).toEqual('bar');
      expect(Object.keys(ogObject)).toContain('ogLocale');
    });
    it('when there is a html tag with lang', async function () {
      const $ = cheerio.load('<html lang="foo"></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLocale).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogLocale');
    });
    it('when there is a meta inLanguage tag', async function () {
      const $ = cheerio.load(
        '<html><head><meta itemprop="inLanguage" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLocale).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogLocale');
    });
    it('when there is no ogLocale', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe('ogLogo', function () {
    it('logo already found', async function () {
      let ogObject: any = { ogLogo: 'bar' };
      const $ = cheerio.load(
        '<html><head><meta itemprop="logo" content="foo"></head></html>',
      );
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogLogo).toEqual('bar');
      expect(Object.keys(ogObject)).toContain('ogLogo');
    });
    it('when there is a meta logo tag', async function () {
      const $ = cheerio.load(
        '<html><head><meta itemprop="logo" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLogo).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogLogo');
    });
    it('when there is a img logo tag', async function () {
      const $ = cheerio.load(
        '<html><body><img itemprop="logo" src="foo"></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLogo).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogLogo');
    });
    it('when there is no ogLogo', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe('ogUrl', function () {
    it('url already found', async function () {
      let ogObject: any = { ogUrl: 'bar' };
      const $ = cheerio.load(
        '<html><head><link rel="canonical" href="foo"></head></html>',
      );
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogUrl).toEqual('bar');
      expect(Object.keys(ogObject)).toContain('ogUrl');
    });
    it('when there is a link tag', async function () {
      const $ = cheerio.load(
        '<html><head><link rel="canonical" href="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogUrl).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogUrl');
    });
    it('when there is a alt link tag', async function () {
      const $ = cheerio.load(
        '<html><head><link rel="alternate" hreflang="x-default" href="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogUrl).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogUrl');
    });
    it('when there is no ogUrl', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe('ogDate', function () {
    it('date already found', async function () {
      let ogObject: any = { ogDate: 'bar' };
      const $ = cheerio.load(
        '<html><head><meta name="date" content="foo"></head></html>',
      );
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogDate).toEqual('bar');
      expect(Object.keys(ogObject)).toContain('ogDate');
    });
    it('when there is a meta date tag', async function () {
      const $ = cheerio.load(
        '<html><head><meta name="date" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDate');
    });
    it('when there is a meta datemodified tag', async function () {
      const $ = cheerio.load(
        '<html><head><meta itemprop="datemodified" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDate');
    });
    it('when there is a meta datepublished tag', async function () {
      const $ = cheerio.load(
        '<html><head><meta itemprop="datepublished" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDate');
    });
    it('when there is a meta date tag using itemprop', async function () {
      const $ = cheerio.load(
        '<html><head><meta itemprop="date" content="foo"></head></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDate');
    });
    it('when there is a time date tag using itemprop', async function () {
      const $ = cheerio.load(
        '<html><body><time itemprop="date" datetime="foo"></body></html>',
      );
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDate');
    });
    it('when there is a time date tag using datetime', async function () {
      const $ = cheerio.load('<html><body><time datetime="foo"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual('foo');
      expect(Object.keys(ogObject)).toContain('ogDate');
    });
    it('when there is no ogDate', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });
});
