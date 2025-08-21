import { readFileSync } from "node:fs";
import { extractOpenGraph } from "../src";

describe("allMedia", () => {
  it("if more then one media tags are found, return the first one", async () => {
    const result = extractOpenGraph(readFileSync(`${__dirname}/html/yelp.html`, "utf8"), { allMedia: false });
    expect(result.alIosAppName).toEqual("Yelp");
    expect(result.alIosAppStoreId).toEqual("284910350");
    expect(result.alIosUrl).toEqual(
      "https://www.yelp.com/biz/boba-guys-san-francisco-4?utm_campaign=biz_details&utm_medium=organic&utm_source=apple",
    );
    expect(result.ogDescription).toEqual(
      "Specialties: High-quality bubble milk teas made with next-level quality ingredients like organic milk, homemade syrup, and homemade almond jelly. Home of the original Horchata Boba and Tea Frescas. Established in 2011.  We started Boba Guys…",
    );
    expect(result.ogSiteName).toEqual("Yelp");
    expect(result.ogTitle).toEqual("Boba Guys - Mission - San Francisco, CA");
    expect(result.ogType).toEqual("yelpyelp:business");
    expect(result.ogDate).toEqual("2016-10-09");
    expect(result.ogUrl).toEqual("https://www.yelp.com/biz/boba-guys-san-francisco-4");
    expect(result.favicon).toEqual(
      "//s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/118ff475a341/assets/img/logos/favicon.ico",
    );
    expect(result.twitterCard).toEqual("summary");
    expect(result.twitterSite).toEqual("@yelp");
    expect(result.twitterAppNameiPhone).toEqual("Yelp");
    expect(result.twitterAppNameiPad).toEqual("Yelp");
    expect(result.twitterAppNameGooglePlay).toEqual("Yelp");
    expect(result.twitterAppIdiPhone).toEqual("id284910350");
    expect(result.twitterAppIdiPad).toEqual("id284910350");
    expect(result.twitterAppIdGooglePlay).toEqual("com.yelp.android");
    expect(result.twitterAppUrliPhone).toEqual(
      "yelp:///biz/18TtLS_JtiS2OH30FLqNrw?utm_campaign=default&utm_source=twitter-card",
    );
    expect(result.twitterAppUrliPad).toEqual(
      "yelp:///biz/18TtLS_JtiS2OH30FLqNrw?utm_campaign=default&utm_source=twitter-card",
    );
    expect(result.twitterAppUrlGooglePlay).toEqual(
      "intent://yelp.com/biz/18TtLS_JtiS2OH30FLqNrw?utm_source=twitter-card#Intent;scheme=http;package=com.yelp.android;end;",
    );
    expect(result.ogLocale).toEqual("en");
    expect(result.ogImage).toEqual({
      url: "https://s3-media2.fl.yelpcdn.com/bphoto/FE1lCskaigmVupQGk86T4g/o.jpg",
      width: "2000",
      height: "1300",
      type: "jpg",
    });
    expect(result.twitterImage).toEqual({
      url: "https://s3-media1.fl.yelpcdn.com/bphoto/FE1lCskaigmVupQGk86T4g/258s.jpg",
      width: null,
      height: null,
      alt: null,
    });
    // expect(result.charset).to.be.eql('utf8');
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        "favicon",
        "alIosAppName",
        "alIosAppStoreId",
        "alIosUrl",
        "ogDate",
        "ogDescription",
        "ogImage",
        "ogLocale",
        "ogSiteName",
        "ogTitle",
        "ogType",
        "ogUrl",
        // 'charset',
        "twitterAppIdGooglePlay",
        "twitterAppIdiPad",
        "twitterAppIdiPhone",
        "twitterAppNameGooglePlay",
        "twitterAppNameiPad",
        "twitterAppNameiPhone",
        "twitterAppUrlGooglePlay",
        "twitterAppUrliPad",
        "twitterAppUrliPhone",
        "twitterCard",
        "twitterImage",
        "twitterSite",
      ]),
    );
  });
  it("if more then one media tags are found, return all of them", async () => {
    const result = extractOpenGraph(readFileSync(`${__dirname}/html/yelp.html`, "utf8"), { allMedia: true });
    expect(result.alIosAppName).toEqual("Yelp");
    expect(result.alIosAppStoreId).toEqual("284910350");
    expect(result.alIosUrl).toEqual(
      "https://www.yelp.com/biz/boba-guys-san-francisco-4?utm_campaign=biz_details&utm_medium=organic&utm_source=apple",
    );
    expect(result.ogDescription).toEqual(
      "Specialties: High-quality bubble milk teas made with next-level quality ingredients like organic milk, homemade syrup, and homemade almond jelly. Home of the original Horchata Boba and Tea Frescas. Established in 2011.  We started Boba Guys…",
    );
    expect(result.ogSiteName).toEqual("Yelp");
    expect(result.ogTitle).toEqual("Boba Guys - Mission - San Francisco, CA");
    expect(result.ogType).toEqual("yelpyelp:business");
    expect(result.ogDate).toEqual("2016-10-09");
    expect(result.ogUrl).toEqual("https://www.yelp.com/biz/boba-guys-san-francisco-4");
    expect(result.favicon).toEqual(
      "//s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/118ff475a341/assets/img/logos/favicon.ico",
    );
    expect(result.twitterCard).toEqual("summary");
    expect(result.twitterSite).toEqual("@yelp");
    expect(result.twitterAppNameiPhone).toEqual("Yelp");
    expect(result.twitterAppNameiPad).toEqual("Yelp");
    expect(result.twitterAppNameGooglePlay).toEqual("Yelp");
    expect(result.twitterAppIdiPhone).toEqual("id284910350");
    expect(result.twitterAppIdiPad).toEqual("id284910350");
    expect(result.twitterAppIdGooglePlay).toEqual("com.yelp.android");
    expect(result.twitterAppUrliPhone).toEqual(
      "yelp:///biz/18TtLS_JtiS2OH30FLqNrw?utm_campaign=default&utm_source=twitter-card",
    );
    expect(result.twitterAppUrliPad).toEqual(
      "yelp:///biz/18TtLS_JtiS2OH30FLqNrw?utm_campaign=default&utm_source=twitter-card",
    );
    expect(result.twitterAppUrlGooglePlay).toEqual(
      "intent://yelp.com/biz/18TtLS_JtiS2OH30FLqNrw?utm_source=twitter-card#Intent;scheme=http;package=com.yelp.android;end;",
    );
    expect(result.ogLocale).toEqual("en");
    expect(result.ogImage).toEqual([
      {
        url: "https://s3-media2.fl.yelpcdn.com/bphoto/FE1lCskaigmVupQGk86T4g/o.jpg",
        width: "2000",
        height: "1300",
        type: "jpg",
      },
      {
        url: "https://s3-media2.fl.yelpcdn.com/assets/srv0/seo_metadata/e98ed5a1460f/assets/img/logos/yelp_og_image.png",
        width: "576",
        height: "576",
        type: "png",
      },
    ]);
    expect(result.twitterImage).toEqual([
      {
        url: "https://s3-media1.fl.yelpcdn.com/bphoto/FE1lCskaigmVupQGk86T4g/258s.jpg",
        width: null,
        height: null,
        alt: null,
      },
    ]);
    // expect(result.charset).to.be.eql('utf8');
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        "favicon",
        "alIosAppName",
        "alIosAppStoreId",
        "alIosUrl",
        "ogDate",
        "ogDescription",
        "ogImage",
        "ogLocale",
        "ogSiteName",
        "ogTitle",
        "ogType",
        "ogUrl",
        // 'charset',
        "twitterAppIdGooglePlay",
        "twitterAppIdiPad",
        "twitterAppIdiPhone",
        "twitterAppNameGooglePlay",
        "twitterAppNameiPad",
        "twitterAppNameiPhone",
        "twitterAppUrlGooglePlay",
        "twitterAppUrliPad",
        "twitterAppUrliPhone",
        "twitterCard",
        "twitterImage",
        "twitterSite",
      ]),
    );
  });
});
