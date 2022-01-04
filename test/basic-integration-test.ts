import { expect } from 'chai';
import { extractOpenGraph } from '../src';
import { readFileSync } from 'fs';
import { ogs } from './helper';

describe('basic', async function () {
  it('should return valid data', async function () {
    const result = await ogs({
      url: 'https://ogp.me/',
    });
    expect(result.ogTitle).to.be.eql('Open Graph protocol');
    expect(result.ogType).to.be.eql('website');
    expect(result.ogUrl).to.be.eql('https://ogp.me/');
    expect(result.ogDescription).to.be.eql('The Open Graph protocol enables any web page to become a rich object in a social graph.');
    expect(result.ogImage).to.be.eql({
      url: 'https://ogp.me/logo.png',
      width: '300',
      height: '300',
      type: 'image/png',
    });
    // expect(result.charset).to.be.eql('utf8');
    expect(result).to.have.all.keys(
      'ogTitle',
      'ogType',
      'ogUrl',
      'ogDescription',
      'ogImage',
      //'charset'
    );
  });
  it('Test Name Cheap Page That Dose Not Have content-type=text/html - Should Return correct Open Graph Info', async function () {
    const result = await ogs({
      url: 'https://www.namecheap.com/',
    });
    expect(result.ogDescription).to.be.an('string').and.to.not.be.empty;
    expect(result.ogLocale).to.be.eql('en');
    expect(result.favicon).to.be.eql('https://www.namecheap.com/assets/img/nc-icon/favicon.ico');
    expect(result.ogUrl).to.be.eql('https://www.namecheap.com/');
    expect(result.ogTitle).to.be.eql('Buy a domain name - Register cheap domain names from $0.99 - Namecheap');
    expect(result.ogDescription).to.be.eql('Register domain names at Namecheap. Buy cheap domain names and enjoy 24/7 support. With over 13 million domains under management, you know you’re in good hands.');
    // expect(result.ogImage).to.be.an('array').and.to.not.be.empty;
    // expect(result.charset).to.be.eql('utf8');
    expect(result).to.have.all.keys(
      'favicon',
      'ogTitle',
      'ogDescription',
      // 'ogImage',
      'ogLocale',
      'ogUrl',
      //'charset'
    );
  });
  it('vimeo.com should return open graph data', async function () {
    const result = await ogs({
      url: 'https://vimeo.com/232889838',
    });
    expect(result.alAndroidAppName).to.be.eql('Vimeo');
    expect(result.alAndroidPackage).to.be.eql('com.vimeo.android.videoapp');
    expect(result.alAndroidUrl).to.be.eql('vimeo://app.vimeo.com/videos/232889838');
    expect(result.alIosAppName).to.be.eql('Vimeo');
    expect(result.alIosAppStoreId).to.be.eql('425194759');
    expect(result.alIosUrl).to.be.eql('vimeo://app.vimeo.com/videos/232889838');
    expect(result.alWebShouldFallback).to.be.eql('true');
    expect(result.ogSiteName).to.be.eql('Vimeo');
    expect(result.ogUrl).to.be.eql('https://vimeo.com/232889838');
    expect(result.favicon.split('?')[0]).to.be.eql('https://f.vimeocdn.com/images_v6/favicon.ico');
    expect(result.ogType).to.be.eql('video.other');
    expect(result.ogTitle).to.be.eql('Heroin');
    expect(result.ogDescription).to.be.an('string').and.to.not.be.empty;
    expect(result.twitterCard).to.be.eql('player');
    expect(result.twitterSite).to.be.eql('@vimeo');
    expect(result.twitterTitle).to.be.eql('Heroin');
    expect(result.twitterDescription).to.be.an('string').and.to.not.be.empty;
    expect(result.twitterAppNameiPhone).to.be.eql('Vimeo');
    expect(result.twitterAppIdiPhone).to.be.eql('425194759');
    expect(result.twitterAppUrliPhone).to.be.eql('vimeo://app.vimeo.com/videos/232889838');
    expect(result.twitterAppNameiPad).to.be.eql('Vimeo');
    expect(result.twitterAppIdiPad).to.be.eql('425194759');
    expect(result.twitterAppUrliPad).to.be.eql('vimeo://app.vimeo.com/videos/232889838');
    expect(result.twitterAppNameGooglePlay).to.be.eql('Vimeo');
    expect(result.twitterAppIdGooglePlay).to.be.eql('com.vimeo.android.videoapp');
    expect(result.twitterAppUrlGooglePlay).to.be.eql('vimeo://app.vimeo.com/videos/232889838');
    expect(result.ogLocale).to.be.eql('en');
    expect(result.ogImage).to.be.eql({
      url: 'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F659221704-68d52ff1744d1c12605d1743d3ea6b031937d002d9373e5f6111a6aef986f3e5-d_1280x720&src1=https%3A%2F%2Ff.vimeocdn.com%2Fimages_v6%2Fshare%2Fplay_icon_overlay.png',
      width: '1280',
      height: '720',
      type: 'image/jpg',
    });
    // TODO: url keeps changing, this test case should move to static test suit
    // expect(result.ogVideo).to.be.eql({
    //   url: 'https://player.vimeo.com/video/232889838',
    //   width: '1280',
    //   height: '720',
    //   type: 'text/html',
    // });
    expect(result.twitterImage).to.be.eql({
      url: 'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F659221704-68d52ff1744d1c12605d1743d3ea6b031937d002d9373e5f6111a6aef986f3e5-d_1280x720&src1=https%3A%2F%2Ff.vimeocdn.com%2Fimages_v6%2Fshare%2Fplay_icon_overlay.png',
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
    expect(result).to.have.all.keys(
      'favicon',
      'alAndroidAppName',
      'alAndroidPackage',
      'alAndroidUrl',
      'alIosAppName',
      'alIosAppStoreId',
      'alIosUrl',
      'alWebShouldFallback',
      'ogDescription',
      'ogImage',
      'ogLocale',
      'ogSiteName',
      'ogTitle',
      'ogType',
      'ogUrl',
      'ogVideo',
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
      'twitterDescription',
      'twitterImage',
      'twitterPlayer',
      'twitterSite',
      'twitterTitle',
    );
  });
  it('mozilla.org should return open graph data with one title', async function () {
    const result = await ogs({
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString',
    });
    expect(result.ogTitle).to.be.eql('Date.prototype.toLocaleString() - JavaScript | MDN');
    expect(result.ogLocale).to.be.eql('en-US');
    expect(result.ogUrl).to.be.eql('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString');
    expect(result.ogDate).to.be.eql('2021-07-20T18:47:57.000Z');
    expect(result.favicon).to.be.eql('/favicon-48x48.97046865.png');
    // expect(result.charset).to.be.eql('utf8');
    expect(result.ogImage).to.be.eql({
      url: 'https://developer.mozilla.org/mdn-social-share.0ca9dbda.png',
      width: null,
      height: null,
      type: 'png',
    });
    expect(result.twitterCard).to.be.eql('summary_large_image');
    expect(result).to.have.all.keys(
      'favicon',
      'ogDate',
      'ogDescription',
      'ogImage',
      'ogLocale',
      'ogTitle',
      'ogUrl',
      'twitterCard',
      //'charset',
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
