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

describe('return openGraphScraper', function () {
  describe('should be able to hit site and find OG title info', function () {
    it('with html', function () {
      const data = extractOpenGraph(basicHTML);
      expect(data.ogTitle).toEqual('test page');
    });

    it('when site is not on blacklist', function () {
      const data = extractOpenGraph(basicHTML);
      expect(data.ogTitle).toEqual('test page');
    });

    it('with encoding set to null (this has been deprecated, but should still work)', async function () {
      const data = extractOpenGraph(encodingHTML);
      // expect(data.charset).to.be.eql(null);
      expect(data.ogTitle).toEqual('тестовая страница');
      expect(data.ogDescription).toEqual('привет тестовая страница<');
    });

    it('when there is more then one image', function () {
      const data = extractOpenGraph(multipleImageHTML);
      expect(data.ogTitle).toEqual('test page');
      expect(data.ogImage).toEqual({
        url: 'test1.png',
        width: null,
        height: null,
        type: 'png',
      });
    });

    it('when meta description exist while og description does not should pass', function () {
      const data = extractOpenGraph(metaDescriptionHTML);
      expect(data.ogTitle).toEqual('test page');
      expect(data.ogDescription).toEqual('test description from meta');
    });

    it('as a browser should pass', function () {
      const data = extractOpenGraph(basicHTML);
      expect(data.ogTitle).toEqual('test page');
    });

    it('using onlyGetOpenGraphInfo should pass', function () {
      const data = extractOpenGraph(metaDescriptionHTML, { onlyGetOpenGraphInfo: true });
      expect(data.ogTitle).toBeUndefined();
      expect(data.describe).toBeUndefined();
    });

    it('when there is a og:image:secure_url tag should pass', function () {
      const secureUrlHTML = `
        <html>
          <head>
            <meta property="og:image:secure_url" content="test1.png">
          </head>
          <body></body>
        </html>`;
      const data = extractOpenGraph(secureUrlHTML);
      expect(data.ogImage).toEqual({
        url: 'test1.png',
        width: null,
        height: null,
        type: 'png',
      });
    });

    it('when there is a og:image:url tag should pass', function () {
      const secureUrlHTML = `
        <html>
          <head>
            <meta property="og:image:url" content="test1.png">
          </head>
          <body></body>
        </html>`;
      const data = extractOpenGraph(secureUrlHTML);
      expect(data.ogImage).toEqual({
        url: 'test1.png',
        width: null,
        height: null,
        type: 'png',
      });
    });

    it('when charset and chardet are unknown should pass', function () {
      const data = extractOpenGraph(basicHTML);
      expect(data.ogTitle).toEqual('test page');
    });

    it('when passing in a custom tag should pass', async function () {
      const data = extractOpenGraph(basicHTML, {
        customMetaTags: [
          {
            multiple: false,
            property: 'foo',
            fieldName: 'fooTag',
          },
        ],
      });
      expect(data.fooTag).toEqual('bar');
      expect(data.ogTitle).toEqual('test page');
    });
  });
});
