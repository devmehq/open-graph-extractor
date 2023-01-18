import * as cheerio from 'cheerio';
import { expect } from 'chai';
import { fallback } from '../src/fallback';

describe('fallback', async function () {
  describe('ogTitle', async function () {
    it('title already found', async function () {
      let ogObject: any = { ogTitle: 'bar' };

      const $ = cheerio.load('<html><body><title>foo</title></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).to.be.eql('bar');
      expect(ogObject).to.have.all.keys('ogTitle');
    });
    it('when there is a title tag', async function () {
      let ogObject: any = {};
      const $ = cheerio.load('<html><body><title>foo</title></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogTitle');
    });
    it('when there are multiple title tags', async function () {
      let ogObject: any = {};
      const $ = cheerio.load('<html><head><title>foo</title></head><body><svg><title>bar</title></svg><svg><title>baz</title></svg></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogTitle');
    });
    it('when there is a meta title tag', async function () {
      const $ = cheerio.load('<html><head><meta name="title" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogTitle');
    });
    it('when there is a .post-title div tag', async function () {
      const $ = cheerio.load('<html><body><div class="post-title">foo</div></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogTitle');
    });
    it('when there is a .entry-title div tag', async function () {
      const $ = cheerio.load('<html><body><div class="entry-title">foo</div></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogTitle');
    });
    it('when there is a .title h1 a tag', async function () {
      const $ = cheerio.load('<html><body><h1 class="title"><a>foo</a></h1></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogTitle');
    });
    it('when there is a .title h1 tag', async function () {
      const $ = cheerio.load('<html><body><h1 class="title">foo</h1></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogTitle');
    });
    it('when there is no title', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).to.be.eql({});
    });
  });

  describe('ogDescription', async function () {
    it('description already found', async function () {
      let ogObject: any = { ogDescription: 'bar' };
      const $ = cheerio.load('<html><head><meta name="description" content="foo"></head></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogDescription).to.be.eql('bar');
      expect(ogObject).to.have.all.keys('ogDescription');
    });
    it('when there is a description meta tag using name', async function () {
      const $ = cheerio.load('<html><head><meta name="description" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDescription');
    });
    it('when there is a description meta tag using itemprop', async function () {
      const $ = cheerio.load('<html><head><meta itemprop="description" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDescription');
    });
    it('when there is a #description tag', async function () {
      const $ = cheerio.load('<html><body><div id="description">foo</div></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDescription');
    });
    it('when there is no description', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).to.be.eql({});
    });
  });

  describe('ogImage', async function () {
    it('image already found', async function () {
      let ogObject: any = { ogImage: { url: 'bar.png', type: 'png' } };
      const $ = cheerio.load('<html><body><image src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect(ogObject.ogImage.url).to.be.eql('bar.png');
      expect(ogObject.ogImage.type).to.be.eql('png');
      expect(ogObject).to.have.all.keys('ogImage');
    });
    it('when there is no og images found and ogImageFallback is set to false', async function () {
      const $ = cheerio.load('<html><body><image src="foo.png"></body></html>');
      const ogObject = fallback({}, { ogImageFallback: false }, $);
      expect(ogObject).to.be.eql({});
    });
    it('when there is a mix of valid and invalid images', async function () {
      const $ = cheerio.load('<html><body><image width=2 src="foo.png"><image src="bar.png"><image src="foo.bar"><image></body></html>');
      const ogObject = fallback({}, { ogImageFallback: true }, $);
      expect(ogObject.ogImage).to.be.eql([
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
      expect(ogObject).to.have.all.keys('ogImage');
    });
    it('when there is no og images found and no fallback images', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, { ogImageFallback: true }, $);
      expect(ogObject).to.be.eql({});
    });
    it('image already found but it has no type', async function () {
      let ogObject: any = { ogImage: { url: 'bar.png' } };
      const $ = cheerio.load('<html><body><image src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect(ogObject.ogImage.url).to.be.eql('bar.png');
      expect(ogObject.ogImage.type).to.be.eql('png');
      expect(ogObject).to.have.all.keys('ogImage');
    });
    it('image already found but it has no type but that type is invalid', async function () {
      let ogObject: any = { ogImage: { url: 'bar.foo' } };
      const $ = cheerio.load('<html><body><image src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect(ogObject.ogImage.url).to.be.eql('bar.foo');
      expect(ogObject.ogImage.type).to.be.eql(undefined);
      expect(ogObject).to.have.all.keys('ogImage');
    });
  });

  describe('ogAudioURL/ogAudioSecureURL', async function () {
    it('AudioURL already found', async function () {
      let ogObject: any = { ogAudioURL: 'bar.mp3' };
      const $ = cheerio.load('<html><body><audio src="foo.png"></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogAudioURL).to.be.eql('bar.mp3');
      expect(ogObject).to.have.all.keys('ogAudioURL');
    });
    it('AudioSecureURL already found', async function () {
      let ogObject: any = { ogAudioSecureURL: 'bar.mp3' };
      const $ = cheerio.load('<html><body><audio src="foo.png"></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogAudioSecureURL).to.be.eql('bar.mp3');
      expect(ogObject).to.have.all.keys('ogAudioSecureURL');
    });
    it('when there is a audio tag without HTTPS', async function () {
      const $ = cheerio.load('<html><body><audio src="foo.mp3"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioURL).to.be.eql('foo.mp3');
      expect(ogObject).to.have.all.keys('ogAudioURL');
    });
    it('when there is a audio tag with HTTPS', async function () {
      const $ = cheerio.load('<html><body><audio src="https://foo.mp3" type="mp3"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioSecureURL).to.be.eql('https://foo.mp3');
      expect(ogObject.ogAudioType).to.be.eql('mp3');
      expect(ogObject).to.have.all.keys('ogAudioSecureURL', 'ogAudioType');
    });
    it('when there is a audio source tag without HTTPS', async function () {
      const $ = cheerio.load('<html><body><audio><source src="foo.mp3" type="mp3"></audio></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioURL).to.be.eql('foo.mp3');
      expect(ogObject.ogAudioType).to.be.eql('mp3');
      expect(ogObject).to.have.all.keys('ogAudioURL', 'ogAudioType');
    });
    it('when there is a audio source tag with HTTPS', async function () {
      const $ = cheerio.load('<html><body><audio><source src="https://foo.mp3"></audio></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioSecureURL).to.be.eql('https://foo.mp3');
      expect(ogObject).to.have.all.keys('ogAudioSecureURL');
    });
    it('when there is no', async function () {
      const $ = cheerio.load('<html><body><audio></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).to.be.eql({});
    });
  });

  describe('ogLocale', async function () {
    it('locale already found', async function () {
      let ogObject: any = { ogLocale: 'bar' };
      const $ = cheerio.load('<html lang="foo"></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogLocale).to.be.eql('bar');
      expect(ogObject).to.have.all.keys('ogLocale');
    });
    it('when there is a html tag with lang', async function () {
      const $ = cheerio.load('<html lang="foo"></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLocale).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogLocale');
    });
    it('when there is a meta inLanguage tag', async function () {
      const $ = cheerio.load('<html><head><meta itemprop="inLanguage" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLocale).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogLocale');
    });
    it('when there is no ogLocale', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).to.be.eql({});
    });
  });

  describe('ogLogo', async function () {
    it('logo already found', async function () {
      let ogObject: any = { ogLogo: 'bar' };
      const $ = cheerio.load('<html><head><meta itemprop="logo" content="foo"></head></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogLogo).to.be.eql('bar');
      expect(ogObject).to.have.all.keys('ogLogo');
    });
    it('when there is a meta logo tag', async function () {
      const $ = cheerio.load('<html><head><meta itemprop="logo" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLogo).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogLogo');
    });
    it('when there is a img logo tag', async function () {
      const $ = cheerio.load('<html><body><img itemprop="logo" src="foo"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLogo).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogLogo');
    });
    it('when there is no ogLogo', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).to.be.eql({});
    });
  });

  describe('ogUrl', async function () {
    it('url already found', async function () {
      let ogObject: any = { ogUrl: 'bar' };
      const $ = cheerio.load('<html><head><link rel="canonical" href="foo"></head></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogUrl).to.be.eql('bar');
      expect(ogObject).to.have.all.keys('ogUrl');
    });
    it('when there is a link tag', async function () {
      const $ = cheerio.load('<html><head><link rel="canonical" href="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogUrl).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogUrl');
    });
    it('when there is a alt link tag', async function () {
      const $ = cheerio.load('<html><head><link rel="alternate" hreflang="x-default" href="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogUrl).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogUrl');
    });
    it('when there is no ogUrl', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).to.be.eql({});
    });
  });

  describe('ogDate', async function () {
    it('date already found', async function () {
      let ogObject: any = { ogDate: 'bar' };
      const $ = cheerio.load('<html><head><meta name="date" content="foo"></head></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogDate).to.be.eql('bar');
      expect(ogObject).to.have.all.keys('ogDate');
    });
    it('when there is a meta date tag', async function () {
      const $ = cheerio.load('<html><head><meta name="date" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDate');
    });
    it('when there is a meta datemodified tag', async function () {
      const $ = cheerio.load('<html><head><meta itemprop="datemodified" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDate');
    });
    it('when there is a meta datepublished tag', async function () {
      const $ = cheerio.load('<html><head><meta itemprop="datepublished" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDate');
    });
    it('when there is a meta date tag using itemprop', async function () {
      const $ = cheerio.load('<html><head><meta itemprop="date" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDate');
    });
    it('when there is a time date tag using itemprop', async function () {
      const $ = cheerio.load('<html><body><time itemprop="date" datetime="foo"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDate');
    });
    it('when there is a time date tag using datetime', async function () {
      const $ = cheerio.load('<html><body><time datetime="foo"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).to.be.eql('foo');
      expect(ogObject).to.have.all.keys('ogDate');
    });
    it('when there is no ogDate', async function () {
      const $ = cheerio.load('<html><body></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject).to.be.eql({});
    });
  });
});
