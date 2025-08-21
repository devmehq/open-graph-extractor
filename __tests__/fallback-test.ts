import * as cheerio from "cheerio";
import { fallback, type IFallbackOgObject } from "../src/fallback";
import type { IOgImage } from "../src/media";

describe("fallback", () => {
  describe("ogTitle", () => {
    it("title already found", async () => {
      let ogObject: IFallbackOgObject = { ogTitle: "bar" };

      const $ = cheerio.load("<html><body><title>foo</title></body></html>");
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).toEqual("bar");
      expect(Object.keys(ogObject)).toContain("ogTitle");
    });
    it("when there is a title tag", async () => {
      let ogObject: IFallbackOgObject = {};
      const $ = cheerio.load("<html><body><title>foo</title></body></html>");
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogTitle");
    });
    it("when there are multiple title tags", async () => {
      let ogObject: IFallbackOgObject = {};
      const $ = cheerio.load(
        "<html><head><title>foo</title></head><body><svg><title>bar</title></svg><svg><title>baz</title></svg></body></html>",
      );
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogTitle).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogTitle");
    });
    it("when there is a meta title tag", async () => {
      const $ = cheerio.load('<html><head><meta name="title" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogTitle");
    });
    it("when there is a .post-title div tag", async () => {
      const $ = cheerio.load('<html><body><div class="post-title">foo</div></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogTitle");
    });
    it("when there is a .entry-title div tag", async () => {
      const $ = cheerio.load('<html><body><div class="entry-title">foo</div></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogTitle");
    });
    it("when there is a .title h1 a tag", async () => {
      const $ = cheerio.load('<html><body><h1 class="title"><a>foo</a></h1></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogTitle");
    });
    it("when there is a .title h1 tag", async () => {
      const $ = cheerio.load('<html><body><h1 class="title">foo</h1></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogTitle).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogTitle");
    });
    it("when there is no title", async () => {
      const $ = cheerio.load("<html><body></body></html>");
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe("ogDescription", () => {
    it("description already found", () => {
      let ogObject: IFallbackOgObject = { ogDescription: "bar" };
      const $ = cheerio.load('<html><head><meta name="description" content="foo"></head></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogDescription).toEqual("bar");
      expect(Object.keys(ogObject)).toContain("ogDescription");
    });
    it("when there is a description meta tag using name", async () => {
      const $ = cheerio.load('<html><head><meta name="description" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDescription");
    });
    it("when there is a description meta tag using itemprop", async () => {
      const $ = cheerio.load('<html><head><meta itemprop="description" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDescription");
    });
    it("when there is a #description tag", async () => {
      const $ = cheerio.load('<html><body><div id="description">foo</div></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDescription).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDescription");
    });
    it("when there is no description", async () => {
      const $ = cheerio.load("<html><body></body></html>");
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe("ogImage", () => {
    it("image already found", () => {
      let ogObject: IFallbackOgObject = { ogImage: { url: "bar.png", type: "png" } };
      const $ = cheerio.load('<html><body><img src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect((ogObject.ogImage as IOgImage).url).toEqual("bar.png");
      expect((ogObject.ogImage as IOgImage).type).toEqual("png");
      expect(Object.keys(ogObject)).toContain("ogImage");
    });
    it("when there is no og images found and ogImageFallback is set to false", async () => {
      const $ = cheerio.load('<html><body><img src="foo.png"></body></html>');
      const ogObject = fallback({}, { ogImageFallback: false }, $);
      expect(ogObject).toEqual({});
    });
    it("when there is a mix of valid and invalid images", async () => {
      const $ = cheerio.load(
        '<html><body><img width=2 src="foo.png"><img src="bar.png"><img src="foo.bar"><img></body></html>',
      );
      const ogObject = fallback({}, { ogImageFallback: true }, $);
      expect(ogObject.ogImage).toEqual([
        {
          height: null,
          type: "png",
          url: "foo.png",
          width: "2",
        },
        {
          height: null,
          type: "png",
          url: "bar.png",
          width: null,
        },
      ]);
      expect(Object.keys(ogObject)).toContain("ogImage");
    });
    it("when there is no og images found and no fallback images", async () => {
      const $ = cheerio.load("<html><body></body></html>");
      const ogObject = fallback({}, { ogImageFallback: true }, $);
      expect(ogObject).toEqual({});
    });
    it("image already found but it has no type", async () => {
      let ogObject: IFallbackOgObject = { ogImage: { url: "bar.png" } };
      const $ = cheerio.load('<html><body><img src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect((ogObject.ogImage as IOgImage).url).toEqual("bar.png");
      expect((ogObject.ogImage as IOgImage).type).toEqual("png");
      expect(Object.keys(ogObject)).toContain("ogImage");
    });
    it("image already found but it has no type but that type is invalid", async () => {
      let ogObject: IFallbackOgObject = { ogImage: { url: "bar.foo" } };
      const $ = cheerio.load('<html><body><img src="foo.png"></body></html>');
      ogObject = fallback(ogObject, { ogImageFallback: true }, $);
      expect((ogObject.ogImage as IOgImage).url).toEqual("bar.foo");
      expect((ogObject.ogImage as IOgImage).type).toBeUndefined();
      expect(Object.keys(ogObject)).toContain("ogImage");
    });
  });

  describe("ogAudioURL/ogAudioSecureURL", () => {
    it("AudioURL already found", async () => {
      let ogObject: IFallbackOgObject = { ogAudioURL: "bar.mp3" };
      const $ = cheerio.load('<html><body><audio src="foo.png"></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogAudioURL).toEqual("bar.mp3");
      expect(Object.keys(ogObject)).toContain("ogAudioURL");
    });
    it("AudioSecureURL already found", async () => {
      let ogObject: IFallbackOgObject = { ogAudioSecureURL: "bar.mp3" };
      const $ = cheerio.load('<html><body><audio src="foo.png"></body></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogAudioSecureURL).toEqual("bar.mp3");
      expect(Object.keys(ogObject)).toContain("ogAudioSecureURL");
    });
    it("when there is a audio tag without HTTPS", async () => {
      const $ = cheerio.load('<html><body><audio src="foo.mp3"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioURL).toEqual("foo.mp3");
      expect(Object.keys(ogObject)).toContain("ogAudioURL");
    });
    it("when there is a audio tag with HTTPS", async () => {
      const $ = cheerio.load('<html><body><audio src="https://foo.mp3" type="mp3"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioSecureURL).toEqual("https://foo.mp3");
      expect(ogObject.ogAudioType).toEqual("mp3");
      expect(Object.keys(ogObject)).toEqual(expect.arrayContaining(["ogAudioSecureURL", "ogAudioType"]));
    });
    it("when there is a audio source tag without HTTPS", async () => {
      const $ = cheerio.load('<html><body><audio><source src="foo.mp3" type="mp3"></audio></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioURL).toEqual("foo.mp3");
      expect(ogObject.ogAudioType).toEqual("mp3");
      expect(Object.keys(ogObject)).toEqual(expect.arrayContaining(["ogAudioURL", "ogAudioType"]));
    });
    it("when there is a audio source tag with HTTPS", async () => {
      const $ = cheerio.load('<html><body><audio><source src="https://foo.mp3"></audio></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogAudioSecureURL).toEqual("https://foo.mp3");
      expect(Object.keys(ogObject)).toContain("ogAudioSecureURL");
    });
    it("when there is no", async () => {
      const $ = cheerio.load("<html><body><audio></body></html>");
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe("ogLocale", () => {
    it("locale already found", async () => {
      let ogObject: IFallbackOgObject = { ogLocale: "bar" };
      const $ = cheerio.load('<html lang="foo"></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogLocale).toEqual("bar");
      expect(Object.keys(ogObject)).toContain("ogLocale");
    });
    it("when there is a html tag with lang", async () => {
      const $ = cheerio.load('<html lang="foo"></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLocale).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogLocale");
    });
    it("when there is a meta inLanguage tag", async () => {
      const $ = cheerio.load('<html><head><meta itemprop="inLanguage" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLocale).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogLocale");
    });
    it("when there is no ogLocale", async () => {
      const $ = cheerio.load("<html><body></body></html>");
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe("ogLogo", () => {
    it("logo already found", async () => {
      let ogObject: IFallbackOgObject = { ogLogo: "bar" };
      const $ = cheerio.load('<html><head><meta itemprop="logo" content="foo"></head></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogLogo).toEqual("bar");
      expect(Object.keys(ogObject)).toContain("ogLogo");
    });
    it("when there is a meta logo tag", async () => {
      const $ = cheerio.load('<html><head><meta itemprop="logo" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLogo).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogLogo");
    });
    it("when there is a img logo tag", async () => {
      const $ = cheerio.load('<html><body><img itemprop="logo" src="foo"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogLogo).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogLogo");
    });
    it("when there is no ogLogo", async () => {
      const $ = cheerio.load("<html><body></body></html>");
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe("ogUrl", () => {
    it("url already found", async () => {
      let ogObject: IFallbackOgObject = { ogUrl: "bar" };
      const $ = cheerio.load('<html><head><link rel="canonical" href="foo"></head></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogUrl).toEqual("bar");
      expect(Object.keys(ogObject)).toContain("ogUrl");
    });
    it("when there is a link tag", async () => {
      const $ = cheerio.load('<html><head><link rel="canonical" href="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogUrl).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogUrl");
    });
    it("when there is a alt link tag", async () => {
      const $ = cheerio.load('<html><head><link rel="alternate" hreflang="x-default" href="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogUrl).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogUrl");
    });
    it("when there is no ogUrl", async () => {
      const $ = cheerio.load("<html><body></body></html>");
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });

  describe("ogDate", () => {
    it("date already found", async () => {
      let ogObject: IFallbackOgObject = { ogDate: "bar" };
      const $ = cheerio.load('<html><head><meta name="date" content="foo"></head></html>');
      ogObject = fallback(ogObject, {}, $);
      expect(ogObject.ogDate).toEqual("bar");
      expect(Object.keys(ogObject)).toContain("ogDate");
    });
    it("when there is a meta date tag", async () => {
      const $ = cheerio.load('<html><head><meta name="date" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDate");
    });
    it("when there is a meta datemodified tag", async () => {
      const $ = cheerio.load('<html><head><meta itemprop="datemodified" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDate");
    });
    it("when there is a meta datepublished tag", async () => {
      const $ = cheerio.load('<html><head><meta itemprop="datepublished" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDate");
    });
    it("when there is a meta date tag using itemprop", async () => {
      const $ = cheerio.load('<html><head><meta itemprop="date" content="foo"></head></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDate");
    });
    it("when there is a time date tag using itemprop", async () => {
      const $ = cheerio.load('<html><body><time itemprop="date" datetime="foo"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDate");
    });
    it("when there is a time date tag using datetime", async () => {
      const $ = cheerio.load('<html><body><time datetime="foo"></body></html>');
      const ogObject = fallback({}, {}, $);
      expect(ogObject.ogDate).toEqual("foo");
      expect(Object.keys(ogObject)).toContain("ogDate");
    });
    it("when there is no ogDate", async () => {
      const $ = cheerio.load("<html><body></body></html>");
      const ogObject = fallback({}, {}, $);
      expect(ogObject).toEqual({});
    });
  });
});
