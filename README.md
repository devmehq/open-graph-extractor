# Open Graph Extractor

[![Build Status](https://github.com/devmehq/open-graph-extractor/actions/workflows/ci.yml/badge.svg)](https://github.com/devmehq/open-graph-extractor/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@devmehq/open-graph-extractor.svg)](https://www.npmjs.com/package/@devmehq/open-graph-extractor)
[![Downloads](https://img.shields.io/npm/dm/@devmehq/open-graph-extractor.svg)](https://www.npmjs.com/package/@devmehq/open-graph-extractor)

A simple tools for scraping Open Graph and Twitter Card info off from html.

## API / Cloud Hosted Service

We offer this `URL Scrapping & Metadata Service` in our Scalable Cloud API Service Offering - You could try it here [URL Scrapping & Metadata Service](https://dev.me/products/url-scrapper)

## Self-hosting - installation and usage instructions

## Installation

Install the module through YARN:

```yarn
yarn add @devmehq/open-graph-extractor
```

Or NPM

```npm
npm insgall @devmehq/open-graph-extractor
```

## Examples

```typescript
// use your favorite request library, in this example i will use axios to get the html
import axios from "axios";
import { extractOpenGraph } from '@devmehq/open-graph-extractor';
const { data: html } = axios.get('https://ogp.me')
const openGraph = extractOpenGraph(html);
```

## Results JSON

```javascript
{
  ogTitle: 'Open Graph protocol',
  ogType: 'website',
  ogUrl: 'https://ogp.me/',
  ogDescription: 'The Open Graph protocol enables any web page to become a rich object in a social graph.',
  ogImage: {
    url: 'http://ogp.me/logo.png',
    width: '300',
    height: '300',
    type: 'image/png'
  }
} 
```

## Configuration options

### `customMetaTags`

Here you can define custom meta tags you want to scrape. Default: `[]`.

### `allMedia`

By default, OGS will only send back the first image/video it finds. Default: `false`.

### `onlyGetOpenGraphInfo`

Only fetch open graph info and don't fall back on anything else. Default: `false`.

### `ogImageFallback`

Fetch other images if no open graph ones are found. Default: `false`.

## Testing

```shell
yarn test
```

## Contributing

Please feel free to open an issue or create a pull request and fix bugs or add features, All contributions are welcome. Thank you!

## LICENSE [MIT](LICENSE.md)
