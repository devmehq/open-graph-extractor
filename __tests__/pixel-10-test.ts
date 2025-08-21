import { readFileSync } from "node:fs";
import { extractOpenGraph } from "../src";

describe("Pixel 10 HTML extraction", () => {
  it("should extract all Open Graph data from Pixel 10 product page", async () => {
    const html = readFileSync(`${__dirname}/html/pixel-10.html`, "utf8");
    const result = extractOpenGraph(html);

    // Basic Open Graph tags
    expect(result.ogTitle).toEqual("Google Pixel 10 Pro - AI-Powered Photography");
    expect(result.ogType).toEqual("product");
    expect(result.ogUrl).toEqual("https://store.google.com/product/pixel_10_pro");
    expect(result.ogDescription).toEqual(
      "Experience the next generation of mobile photography with Google Pixel 10 Pro. Featuring advanced AI capabilities, 200MP camera, and Tensor G5 processor.",
    );
    expect(result.ogSiteName).toEqual("Google Store");
    expect(result.ogLocale).toEqual("en_US");

    // Open Graph Image
    expect(result.ogImage).toEqual({
      url: "https://storage.googleapis.com/pixel/pixel-10-pro-hero.jpg",
      width: "1200",
      height: "630",
      type: "image/jpeg",
    });

    // Twitter Card tags
    expect(result.twitterCard).toEqual("summary_large_image");
    expect(result.twitterSite).toEqual("@madebygoogle");
    expect(result.twitterCreator).toEqual("@google");
    expect(result.twitterTitle).toEqual("Google Pixel 10 Pro - Redefining Mobile Photography");
    expect(result.twitterDescription).toEqual(
      "200MP camera system, Tensor G5 processor, and Magic Eraser Pro. Pre-order the Pixel 10 Pro today.",
    );
    expect(result.twitterImage).toEqual({
      url: "https://storage.googleapis.com/pixel/pixel-10-pro-twitter.jpg",
      width: null,
      height: null,
      alt: "Google Pixel 10 Pro showcase",
    });

    // App Links
    expect(result.alAndroidAppName).toEqual("Google Store");
    expect(result.alAndroidPackage).toEqual("com.google.store");
    expect(result.alAndroidUrl).toEqual("googlestore://product/pixel_10_pro");
    expect(result.alIosAppName).toEqual("Google Store");
    expect(result.alIosAppStoreId).toEqual("123456789");
    expect(result.alIosUrl).toEqual("googlestore://product/pixel_10_pro");
    expect(result.alWebUrl).toEqual("https://store.google.com/product/pixel_10_pro");

    // Other meta tags
    expect(result.favicon).toEqual("/favicon.ico");
    expect(result.author).toEqual("Google");

    // Verify the keys we expect to be present
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        "ogTitle",
        "ogType",
        "ogUrl",
        "ogDescription",
        "ogImage",
        "ogSiteName",
        "ogLocale",
        "twitterCard",
        "twitterSite",
        "twitterCreator",
        "twitterTitle",
        "twitterDescription",
        "twitterImage",
        "alAndroidAppName",
        "alAndroidPackage",
        "alAndroidUrl",
        "alIosAppName",
        "alIosAppStoreId",
        "alIosUrl",
        "alWebUrl",
        "favicon",
        "author",
      ]),
    );
  });

  it("should extract structured data and merge with Open Graph data", async () => {
    const html = readFileSync(`${__dirname}/html/pixel-10.html`, "utf8");
    const result = extractOpenGraph(html, { extractStructuredData: true });

    // When extractStructuredData is enabled, Product data from JSON-LD is merged
    // The library merges Product name and description into ogTitle and ogDescription
    expect(result.ogTitle).toEqual("Google Pixel 10 Pro - AI-Powered Photography");
    expect(result.ogDescription).toEqual(
      "Experience the next generation of mobile photography with Google Pixel 10 Pro. Featuring advanced AI capabilities, 200MP camera, and Tensor G5 processor.",
    );
  });

  it("should extract all media with allMedia option enabled", async () => {
    const html = readFileSync(`${__dirname}/html/pixel-10.html`, "utf8");
    const result = extractOpenGraph(html, { allMedia: true });

    // When allMedia is true, ogImage should be an array
    expect(result.ogImage).toEqual([
      {
        url: "https://storage.googleapis.com/pixel/pixel-10-pro-hero.jpg",
        width: "1200",
        height: "630",
        type: "image/jpeg",
      },
    ]);

    // Twitter image should be an array with allMedia
    expect(result.twitterImage).toEqual([
      {
        url: "https://storage.googleapis.com/pixel/pixel-10-pro-twitter.jpg",
        width: null,
        height: null,
        alt: "Google Pixel 10 Pro showcase",
      },
    ]);
  });
});
