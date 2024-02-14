import { ogs } from './helper';

describe('basic', function () {
  it('should return valid data', async function () {
    const result = await ogs({
      url: 'https://ogp.me/',
    });
    expect(result.ogTitle).toEqual('Open Graph protocol');
    expect(result.ogType).toEqual('website');
    expect(result.ogUrl).toEqual('https://ogp.me/');
    expect(result.ogDescription).toEqual('The Open Graph protocol enables any web page to become a rich object in a social graph.');
    expect(result.ogImage).toEqual({
      url: 'https://ogp.me/logo.png',
      width: '300',
      height: '300',
      type: 'image/png',
    });
    // expect(result.charset).to.be.eql('utf8');
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'ogTitle',
        'ogType',
        'ogUrl',
        'ogDescription', //'charset'
        'ogImage',
      ]),
    );
  });
  it('Test Name Cheap Page That Dose Not Have content-type=text/html - Should Return correct Open Graph Info', async function () {
    const result = await ogs({
      url: 'https://www.namecheap.com/',
    });
    expect(typeof result.ogDescription).not.toHaveLength(0);
    expect(result.ogLocale).toEqual('en');
    expect(result.favicon).toEqual('https://www.namecheap.com/assets/img/nc-icon/favicon.ico');
    expect(result.ogUrl).toEqual('https://www.namecheap.com/');
    expect(result.ogTitle).toEqual('Buy a domain name - Register cheap domain names from $0.99 - Namecheap');
    expect(result.ogDescription).toEqual('Register domain names at Namecheap. Buy cheap domain names and enjoy 24/7 support. With over 16 million domains under management, you know you’re in good hands.');
    // expect(result.ogImage).to.be.an('array').and.to.not.be.empty;
    // expect(result.charset).to.be.eql('utf8');
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'favicon',
        'ogTitle',
        'ogDescription', // 'ogImage',
        'ogLocale', //'charset'
        'ogUrl',
      ]),
    );
  });
  it('vimeo.com should return open graph data', async function () {
    const result = await ogs({
      url: 'https://vimeo.com/232889838',
    });
    expect(result.alAndroidAppName).toEqual('Vimeo');
    expect(result.alAndroidPackage).toEqual('com.vimeo.android.videoapp');
    expect(result.alAndroidUrl).toEqual('vimeo://app.vimeo.com/videos/232889838');
    expect(result.alIosAppName).toEqual('Vimeo');
    expect(result.alIosAppStoreId).toEqual('425194759');
    expect(result.alIosUrl).toEqual('vimeo://app.vimeo.com/videos/232889838');
    expect(result.alWebShouldFallback).toEqual('true');
    expect(result.ogSiteName).toEqual('Vimeo');
    expect(result.ogUrl).toEqual('https://vimeo.com/232889838');
    expect(result.favicon.split('?')[0]).toEqual('https://f.vimeocdn.com/images_v6/favicon.ico');
    expect(result.ogType).toEqual('video.other');
    expect(result.ogTitle).toEqual('Heroin');
    expect(typeof result.ogDescription).not.toHaveLength(0);
    expect(result.twitterCard).toEqual('player');
    expect(result.twitterSite).toEqual('@vimeo');
    expect(result.twitterTitle).toEqual('Heroin');
    expect(typeof result.twitterDescription).not.toHaveLength(0);
    expect(result.twitterAppNameiPhone).toEqual('Vimeo');
    expect(result.twitterAppIdiPhone).toEqual('425194759');
    expect(result.twitterAppUrliPhone).toEqual('vimeo://app.vimeo.com/videos/232889838');
    expect(result.twitterAppNameiPad).toEqual('Vimeo');
    expect(result.twitterAppIdiPad).toEqual('425194759');
    expect(result.twitterAppUrliPad).toEqual('vimeo://app.vimeo.com/videos/232889838');
    expect(result.twitterAppNameGooglePlay).toEqual('Vimeo');
    expect(result.twitterAppIdGooglePlay).toEqual('com.vimeo.android.videoapp');
    expect(result.twitterAppUrlGooglePlay).toEqual('vimeo://app.vimeo.com/videos/232889838');
    expect(result.ogLocale).toEqual('en');
    expect(result.ogImage).toEqual({
      url: 'https://i.vimeocdn.com/video/659221704-68d52ff1744d1c12605d1743d3ea6b031937d002d9373e5f6111a6aef986f3e5-d?f=webp',
      width: '1280',
      height: '720',
      type: 'image/webp',
    });
    // TODO: url keeps changing, this test case should move to static test suit
    // expect(result.ogVideo).to.be.eql({
    //   url: 'https://player.vimeo.com/video/232889838',
    //   width: '1280',
    //   height: '720',
    //   type: 'text/html',
    // });
    expect(result.twitterImage).toEqual({
      url: 'https://i.vimeocdn.com/video/659221704-68d52ff1744d1c12605d1743d3ea6b031937d002d9373e5f6111a6aef986f3e5-d?f=webp',
      width: null,
      height: null,
      alt: null,
    });
    // TODO: url keeps changing, this test case should move to static test suit
    // expect(result.twitterPlayer).to.be.eql({
    //   url: 'https://player.vimeo.com/video/232889838',
    //   width: '1280',
    //   height: '720',
    //   stream: null,
    // });
    // expect(result.charset).to.be.eql('utf8');
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'ogSiteName',
        'ogUrl',
        'ogType',
        'ogTitle',
        'ogDescription',
        'alIosAppName',
        'alIosAppStoreId',
        'alIosUrl',
        'alAndroidAppName',
        'alAndroidPackage',
        'alAndroidUrl',
        'alWebShouldFallback',
        'twitterCard',
        'twitterSite',
        'twitterTitle',
        'twitterDescription',
        'twitterAppNameiPhone',
        'twitterAppIdiPhone',
        'twitterAppUrliPhone',
        'twitterAppNameiPad',
        'twitterAppIdiPad',
        'twitterAppUrliPad',
        'twitterAppNameGooglePlay',
        'twitterAppIdGooglePlay',
        'twitterAppUrlGooglePlay',
        'ogImage',
        'twitterImage',
        'twitterPlayer',
        'ogLocale',
        'favicon',
      ]),
    );
  });
  it('mozilla.org should return open graph data with one title', async function () {
    const result = await ogs({
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString',
    });
    expect(result.ogTitle).toEqual('Date.prototype.toLocaleString() - JavaScript | MDN');
    expect(result.ogLocale).toEqual('en_US');
    expect(result.ogUrl).toEqual('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString');
    expect(result.ogDate).toEqual('2023-12-11T08:18:44.000Z');
    expect(result.favicon).toEqual('/favicon-48x48.cbbd161b.png');
    // expect(result.charset).to.be.eql('utf8');
    expect(result.ogImage).toEqual({
      url: 'https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png',
      width: '1920',
      height: '1080',
      type: 'image/png',
    });
    expect(result.twitterCard).toEqual('summary_large_image');
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'favicon',
        'ogDate',
        'ogDescription',
        'ogImage',
        'ogLocale',
        'ogTitle',
        'ogUrl',
        //'charset',
        'twitterCard',
      ]),
    );
  });
  xit('net-a-porter should return open graph data with one title', async function () {
    const result = await ogs({
      url: 'https://www.net-a-porter.com/en-ca/shop/product/gucci/shoes/mid-heel/plastique-logo-embossed-rubber-mules/1647597276126997',
    });
    expect(result.ogTitle).toEqual('Ivory Plastique logo-embossed rubber mules | GUCCI | NET-A-PORTER');
    expect(result.ogLocale).toEqual('en');
    expect(result.ogUrl).toEqual('https://www.net-a-porter.com/en-ca/shop/product/gucci/shoes/mid-heel/plastique-logo-embossed-rubber-mules/1647597276126997');
    expect(result.ogDate).toBeUndefined();
    expect(result.favicon).toEqual('/favicon.png');
    // expect(result.charset).to.be.eql('utf8');
    expect(result.ogImage).toEqual({
      url: '//www.net-a-porter.com/variants/images/1647597276126997/in/w2000_q60.jpg',
      width: null,
      height: null,
      type: 'jpg',
    });
    expect(result.twitterCard).toEqual('summary_large_image');
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'author',
        'favicon',
        'ogDescription',
        'ogImage',
        'ogLocale',
        'ogLogo',
        'ogTitle',
        'ogType',
        'ogUrl',
        'twitterCard',
        //'charset',
        'twitterImage',
      ]),
    );
  });
  // it('should error out if the page is too large', async function () {
  //   const result = await ogs({
  //     url: 'https://releases.ubuntu.com/20.04.3/ubuntu-20.04.3-desktop-amd64.iso',
  //   });
  //   expect(result.error).to.eql('Exceeded the download limit of 1000000 bytes');
  //   expect(result.errorDetails.toString()).to.eql('Error: Exceeded the download limit of 1000000 bytes');
  //   expect(result).to.have.all.keys('error', 'errorDetails');
  // });
});
