import { expect } from 'chai';
import { extractOpenGraph } from '../src';
import { readFileSync } from 'fs';

describe('allMedia', async function () {
  it('if more then one media tags are found, return the first one', async function () {
    const result = extractOpenGraph(readFileSync(__dirname + '/html/yelp.html', 'utf8'), { allMedia: false });
    expect(result.alIosAppName).to.be.eql('Yelp');
    expect(result.alIosAppStoreId).to.be.eql('284910350');
    expect(result.alIosUrl).to.be.eql('https://www.yelp.com/biz/boba-guys-san-francisco-4?utm_campaign=biz_details&utm_medium=organic&utm_source=apple');
    expect(result.ogDescription).to.be.eql(
      'Specialties: High-quality bubble milk teas made with next-level quality ingredients like organic milk, homemade syrup, and homemade almond jelly. Home of the original Horchata Boba and Tea Frescas. Established in 2011.  We started Boba Guys…',
    );
    expect(result.ogSiteName).to.be.eql('Yelp');
    expect(result.ogTitle).to.be.eql('Boba Guys - Mission - San Francisco, CA');
    expect(result.ogType).to.be.eql('yelpyelp:business');
    expect(result.ogDate).to.be.eql('2016-10-09');
    expect(result.ogUrl).to.be.eql('https://www.yelp.com/biz/boba-guys-san-francisco-4');
    expect(result.favicon).to.be.eql('//s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/118ff475a341/assets/img/logos/favicon.ico');
    expect(result.twitterCard).to.be.eql('summary');
    expect(result.twitterSite).to.be.eql('@yelp');
    expect(result.twitterAppNameiPhone).to.be.eql('Yelp');
    expect(result.twitterAppNameiPad).to.be.eql('Yelp');
    expect(result.twitterAppNameGooglePlay).to.be.eql('Yelp');
    expect(result.twitterAppIdiPhone).to.be.eql('id284910350');
    expect(result.twitterAppIdiPad).to.be.eql('id284910350');
    expect(result.twitterAppIdGooglePlay).to.be.eql('com.yelp.android');
    expect(result.twitterAppUrliPhone).to.be.eql('yelp:///biz/18TtLS_JtiS2OH30FLqNrw?utm_campaign=default&utm_source=twitter-card');
    expect(result.twitterAppUrliPad).to.be.eql('yelp:///biz/18TtLS_JtiS2OH30FLqNrw?utm_campaign=default&utm_source=twitter-card');
    expect(result.twitterAppUrlGooglePlay).to.be.eql('intent://yelp.com/biz/18TtLS_JtiS2OH30FLqNrw?utm_source=twitter-card#Intent;scheme=http;package=com.yelp.android;end;');
    expect(result.ogLocale).to.be.eql('en');
    expect(result.ogImage).to.be.eql({
      url: 'https://s3-media2.fl.yelpcdn.com/bphoto/FE1lCskaigmVupQGk86T4g/o.jpg',
      width: '2000',
      height: '1300',
      type: 'jpg',
    });
    expect(result.twitterImage).to.be.eql({
      url: 'https://s3-media1.fl.yelpcdn.com/bphoto/FE1lCskaigmVupQGk86T4g/258s.jpg',
      width: null,
      height: null,
      alt: null,
    });
    // expect(result.charset).to.be.eql('utf8');
    expect(result).to.have.all.keys(
      'favicon',
      'alIosAppName',
      'alIosAppStoreId',
      'alIosUrl',
      'ogDate',
      'ogDescription',
      'ogImage',
      'ogLocale',
      'ogSiteName',
      'ogTitle',
      'ogType',
      'ogUrl',
      // 'charset',
      'twitterAppIdGooglePlay',
      'twitterAppIdiPad',
      'twitterAppIdiPhone',
      'twitterAppNameGooglePlay',
      'twitterAppNameiPad',
      'twitterAppNameiPhone',
      'twitterAppUrlGooglePlay',
      'twitterAppUrliPad',
      'twitterAppUrliPhone',
      'twitterCard',
      'twitterImage',
      'twitterSite',
    );
  });
  it('if more then one media tags are found, return all of them', async function () {
    const result = extractOpenGraph(readFileSync(__dirname + '/html/yelp.html', 'utf8'), { allMedia: true });
    expect(result.alIosAppName).to.be.eql('Yelp');
    expect(result.alIosAppStoreId).to.be.eql('284910350');
    expect(result.alIosUrl).to.be.eql('https://www.yelp.com/biz/boba-guys-san-francisco-4?utm_campaign=biz_details&utm_medium=organic&utm_source=apple');
    expect(result.ogDescription).to.be.eql(
      'Specialties: High-quality bubble milk teas made with next-level quality ingredients like organic milk, homemade syrup, and homemade almond jelly. Home of the original Horchata Boba and Tea Frescas. Established in 2011.  We started Boba Guys…',
    );
    expect(result.ogSiteName).to.be.eql('Yelp');
    expect(result.ogTitle).to.be.eql('Boba Guys - Mission - San Francisco, CA');
    expect(result.ogType).to.be.eql('yelpyelp:business');
    expect(result.ogDate).to.be.eql('2016-10-09');
    expect(result.ogUrl).to.be.eql('https://www.yelp.com/biz/boba-guys-san-francisco-4');
    expect(result.favicon).to.be.eql('//s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/118ff475a341/assets/img/logos/favicon.ico');
    expect(result.twitterCard).to.be.eql('summary');
    expect(result.twitterSite).to.be.eql('@yelp');
    expect(result.twitterAppNameiPhone).to.be.eql('Yelp');
    expect(result.twitterAppNameiPad).to.be.eql('Yelp');
    expect(result.twitterAppNameGooglePlay).to.be.eql('Yelp');
    expect(result.twitterAppIdiPhone).to.be.eql('id284910350');
    expect(result.twitterAppIdiPad).to.be.eql('id284910350');
    expect(result.twitterAppIdGooglePlay).to.be.eql('com.yelp.android');
    expect(result.twitterAppUrliPhone).to.be.eql('yelp:///biz/18TtLS_JtiS2OH30FLqNrw?utm_campaign=default&utm_source=twitter-card');
    expect(result.twitterAppUrliPad).to.be.eql('yelp:///biz/18TtLS_JtiS2OH30FLqNrw?utm_campaign=default&utm_source=twitter-card');
    expect(result.twitterAppUrlGooglePlay).to.be.eql('intent://yelp.com/biz/18TtLS_JtiS2OH30FLqNrw?utm_source=twitter-card#Intent;scheme=http;package=com.yelp.android;end;');
    expect(result.ogLocale).to.be.eql('en');
    expect(result.ogImage).to.be.eql([
      {
        url: 'https://s3-media2.fl.yelpcdn.com/bphoto/FE1lCskaigmVupQGk86T4g/o.jpg',
        width: '2000',
        height: '1300',
        type: 'jpg',
      },
      {
        url: 'https://s3-media2.fl.yelpcdn.com/assets/srv0/seo_metadata/e98ed5a1460f/assets/img/logos/yelp_og_image.png',
        width: '576',
        height: '576',
        type: 'png',
      },
    ]);
    expect(result.twitterImage).to.be.eql([
      {
        url: 'https://s3-media1.fl.yelpcdn.com/bphoto/FE1lCskaigmVupQGk86T4g/258s.jpg',
        width: null,
        height: null,
        alt: null,
      },
    ]);
    // expect(result.charset).to.be.eql('utf8');
    expect(result).to.have.all.keys(
      'favicon',
      'alIosAppName',
      'alIosAppStoreId',
      'alIosUrl',
      'ogDate',
      'ogDescription',
      'ogImage',
      'ogLocale',
      'ogSiteName',
      'ogTitle',
      'ogType',
      'ogUrl',
      // 'charset',
      'twitterAppIdGooglePlay',
      'twitterAppIdiPad',
      'twitterAppIdiPhone',
      'twitterAppNameGooglePlay',
      'twitterAppNameiPad',
      'twitterAppNameiPhone',
      'twitterAppUrlGooglePlay',
      'twitterAppUrliPad',
      'twitterAppUrliPhone',
      'twitterCard',
      'twitterImage',
      'twitterSite',
    );
  });
});
