import { expect } from 'chai';
import { mediaSetup } from '../src/media';

describe('media', async function () {
  it('has images and twitter images', async function () {
    const ogMedia = mediaSetup(
      {
        ogImage: ['http://test.com/logo.png'],
        ogImageType: ['image/png'],
        ogImageWidth: ['300'],
        ogImageHeight: ['300'],
        twitterImage: ['http://test.com/logo.png'],
        twitterImageAlt: ['image/png'],
        twitterImageWidth: ['300'],
        twitterImageHeight: ['300'],
      },
      {},
    );

    expect(ogMedia.ogImage).to.eql({
      url: 'http://test.com/logo.png',
      width: '300',
      height: '300',
      type: 'image/png',
    });

    expect(ogMedia.twitterImage).to.eql({
      url: 'http://test.com/logo.png',
      width: '300',
      height: '300',
      alt: 'image/png',
    });
  });
  it('has many images and twitter images', async function () {
    const ogMedia = mediaSetup(
      {
        ogImage: ['http://test.com/logo_one.png', 'http://test.com/logo_two.png', 'http://test.com/logo_two.png', ''],
        ogImageType: ['image/png'],
        ogImageWidth: ['300'],
        ogImageHeight: ['300'],
        twitterImage: ['http://test.com/logo_one.png', 'http://test.com/logo_two.png', 'http://test.com/logo_two.png', ''],
        twitterImageAlt: ['image/png'],
        twitterImageWidth: ['300'],
        twitterImageHeight: ['300'],
      },
      {},
    );

    expect(ogMedia.ogImage).to.eql({
      url: 'http://test.com/logo_one.png',
      width: '300',
      height: '300',
      type: 'image/png',
    });

    expect(ogMedia.twitterImage).to.eql({
      url: 'http://test.com/logo_one.png',
      width: '300',
      height: '300',
      alt: 'image/png',
    });
  });
  it('has a .gif images and twitter images', async function () {
    const ogMedia = mediaSetup(
      {
        ogImage: ['http://test.com/logo_one.png', 'http://test.com/logo_two.gif'],
        ogImageType: ['image/png', 'image/gif'],
        ogImageWidth: ['300', '600'],
        ogImageHeight: ['300', '600'],
        twitterImage: ['http://test.com/logo_two.gif', 'http://test.com/logo_one.png'],
        twitterImageAlt: ['image/gif', 'image/png'],
        twitterImageWidth: ['300', '600'],
        twitterImageHeight: ['300', '600'],
      },
      {},
    );

    expect(ogMedia.ogImage).to.eql({
      url: 'http://test.com/logo_two.gif',
      type: 'image/gif',
      width: '600',
      height: '600',
    });

    expect(ogMedia.twitterImage).to.eql({
      url: 'http://test.com/logo_two.gif',
      alt: 'image/gif',
      width: '300',
      height: '300',
    });
  });
  it('has no image or video', async function () {
    const ogMedia = mediaSetup(
      {
        ogTitle: 'test site',
        ogType: 'website',
        ogUrl: 'http://test.com/',
        ogDescription: 'stuff',
      },
      {},
    );

    expect(ogMedia.ogImage).to.eql(undefined);
    expect(ogMedia.twitterImage).to.eql(undefined);
    expect(ogMedia.ogVideo).to.eql(undefined);
    expect(ogMedia.twitterPlayer).to.eql(undefined);
  });
  it('has video and twitter video', async function () {
    const ogMedia = mediaSetup(
      {
        ogVideo: ['http://test.com/logo.png'],
        ogVideoType: ['image/png'],
        ogVideoWidth: ['300'],
        ogVideoHeight: ['300'],
        twitterPlayer: ['http://test.com/logo.png'],
        twitterPlayerStream: ['image/png'],
        twitterPlayerWidth: ['300'],
        twitterPlayerHeight: ['300'],
      },
      {},
    );

    expect(ogMedia.ogVideo).to.eql({
      url: 'http://test.com/logo.png',
      width: '300',
      height: '300',
      type: 'image/png',
    });

    expect(ogMedia.twitterPlayer).to.eql({
      url: 'http://test.com/logo.png',
      width: '300',
      height: '300',
      stream: 'image/png',
    });
  });
  it('has music:song', async function () {
    const ogMedia = mediaSetup(
      {
        musicSong: ['http://test.com/songurl'],
        musicSongTrack: ['1'],
        musicSongDisc: ['1'],
      },
      {},
    );

    expect(ogMedia.musicSong).to.eql({
      url: 'http://test.com/songurl',
      track: '1',
      disc: '1',
    });
  });
  it('has multiple music:songs with allMedia set to true', async function () {
    const ogMedia = mediaSetup(
      {
        musicSong: ['http://test.com/songurl', 'http://test.com/songurl3', 'http://test.com/songurl2', ''],
        musicSongTrack: ['1', '2', '4', ''],
        musicSongDisc: ['1', '2', '1', ''],
      },
      {
        allMedia: true,
      },
    );

    expect(ogMedia.musicSong).to.eql([
      {
        url: 'http://test.com/songurl',
        track: '1',
        disc: '1',
      },
      {
        url: 'http://test.com/songurl2',
        track: '4',
        disc: '1',
      },
      {
        url: 'http://test.com/songurl3',
        track: '2',
        disc: '2',
      },
      {
        url: '',
        track: '',
        disc: '',
      },
    ]);
  });
  it('allMedia set to true', async function () {
    const ogMedia = mediaSetup(
      {
        ogImage: ['http://test.com/logo.png'],
        ogImageType: ['image/png'],
        ogImageWidth: ['300'],
        ogImageHeight: ['300'],
        twitterImage: ['http://test.com/logo.png'],
        twitterImageAlt: ['image/png'],
        twitterImageWidth: ['300'],
        twitterImageHeight: ['300'],
        ogVideo: ['http://test.com/logo.png'],
        ogVideoType: ['image/png'],
        ogVideoWidth: ['300'],
        ogVideoHeight: ['300'],
        twitterPlayer: ['http://test.com/logo.png'],
        twitterPlayerStream: ['image/png'],
        twitterPlayerWidth: ['300'],
        twitterPlayerHeight: ['300'],
      },
      {
        allMedia: true,
      },
    );

    expect(ogMedia.ogImage).to.eql([
      {
        url: 'http://test.com/logo.png',
        width: '300',
        height: '300',
        type: 'image/png',
      },
    ]);

    expect(ogMedia.twitterImage).to.eql([
      {
        url: 'http://test.com/logo.png',
        width: '300',
        height: '300',
        alt: 'image/png',
      },
    ]);

    expect(ogMedia.ogVideo).to.eql([
      {
        url: 'http://test.com/logo.png',
        width: '300',
        height: '300',
        type: 'image/png',
      },
    ]);

    expect(ogMedia.twitterPlayer).to.eql([
      {
        url: 'http://test.com/logo.png',
        width: '300',
        height: '300',
        stream: 'image/png',
      },
    ]);
  });
});
