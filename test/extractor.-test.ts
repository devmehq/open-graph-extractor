import { expect } from 'chai';
import { extractOpenGraph } from '../src';

const basicHTML = `
  <html>
    <head>
      <meta charset="utf-8">
      <meta property="og:description" content="test description">
      <meta property="og:title" content="test page">
      <meta property="foo" content="bar">
    </head>
    <body>
      <h1>hello test page</h1>
      <img width="360" src="test.png" alt="test">
      <img width="360" alt="test2">
    </body>
  </html>`;

const multipleImageHTML = `
  <html>
    <head>
      <title>test page</title>
      <meta property="og:image" content="test1.png">
      <meta property="og:image" content="test2.png">
    </head>
    <body>
      <h1>hello test page</h1>
    </body>
  </html>`;

const metaDescriptionHTML = `
  <html>
    <head>
      <title>test page</title>
      <meta name="description" content="test description from meta">
    </head>
    <body>
      <h1>hello test page</h1>
    </body>
  </html>`;

const encodingHTML = `
  <html>
    <head>
      <title>тестовая страница</title>
      <meta property="og:description" content="привет тестовая страница<">
    </head>
    <body>
      <h1>привет тестовая страница<</h1>
    </body>
  </html>`;

describe('return openGraphScraper', async function () {
  describe('should be able to hit site and find OG title info', async function () {
    describe('with html', async function () {
      const data = extractOpenGraph(basicHTML);
      expect(data.ogTitle).to.be.eql('test page');
    });

    describe('when site is not on blacklist', async function () {
      const data = extractOpenGraph(basicHTML);
      expect(data.ogTitle).to.be.eql('test page');
    });

    describe('with encoding set to null (this has been deprecated, but should still work)', async function () {
      const data = extractOpenGraph(encodingHTML);
      // expect(data.charset).to.be.eql(null);
      expect(data.ogTitle).to.be.eql('тестовая страница');
      expect(data.ogDescription).to.be.eql('привет тестовая страница<');
    });

    describe('when there is more then one image', async function () {
      const data = extractOpenGraph(multipleImageHTML);
      expect(data.ogTitle).to.be.eql('test page');
      expect(data.ogImage).to.be.eql({
        url: 'test1.png',
        width: null,
        height: null,
        type: 'png',
      });
    });

    describe('when meta description exist while og description does not', async function () {
      it('should pass', async function () {
        const data = extractOpenGraph(metaDescriptionHTML);
        expect(data.ogTitle).to.be.eql('test page');
        expect(data.ogDescription).to.be.eql('test description from meta');
      });
    });

    describe('as a browser', async function () {
      it('should pass', async function () {
        const data = extractOpenGraph(basicHTML);
        expect(data.ogTitle).to.be.eql('test page');
      });
    });

    describe('using onlyGetOpenGraphInfo', async function () {
      it('should pass', async function () {
        const data = extractOpenGraph(metaDescriptionHTML, { onlyGetOpenGraphInfo: true });
        expect(data.ogTitle).to.be.eql(undefined);
        expect(data.describe).to.be.eql(undefined);
      });
    });

    describe('when there is a og:image:secure_url tag', async function () {
      const secureUrlHTML = `
        <html>
          <head>
            <meta property="og:image:secure_url" content="test1.png">
          </head>
          <body></body>
        </html>`;
      it('should pass', async function () {
        const data = extractOpenGraph(secureUrlHTML);
        expect(data.ogImage).to.be.eql({
          url: 'test1.png',
          width: null,
          height: null,
          type: 'png',
        });
      });
    });

    describe('when there is a og:image:url tag', async function () {
      const secureUrlHTML = `
        <html>
          <head>
            <meta property="og:image:url" content="test1.png">
          </head>
          <body></body>
        </html>`;
      it('should pass', async function () {
        const data = extractOpenGraph(secureUrlHTML);
        expect(data.ogImage).to.be.eql({
          url: 'test1.png',
          width: null,
          height: null,
          type: 'png',
        });
      });
    });

    describe('when charset and chardet are unknown', async function () {
      it('should pass', async function () {
        const data = extractOpenGraph(basicHTML);
        expect(data.ogTitle).to.be.eql('test page');
      });
    });

    it('when passing in a custom tag', async function () {
      it('should pass', async function () {
        const data = extractOpenGraph(basicHTML, {
          customMetaTags: [
            {
              multiple: false,
              property: 'foo',
              fieldName: 'fooTag',
            },
          ],
        });
        expect(data.fooTag).to.be.eql('bar');
        expect(data.ogTitle).to.be.eql('test page');
      });
    });
  });
});
