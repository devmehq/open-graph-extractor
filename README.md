# Open Graph Extractor 🚀

[![Build Status](https://github.com/devmehq/open-graph-extractor/actions/workflows/ci.yml/badge.svg)](https://github.com/devmehq/open-graph-extractor/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@devmehq/open-graph-extractor.svg)](https://www.npmjs.com/package/@devmehq/open-graph-extractor)
[![Downloads](https://img.shields.io/npm/dm/@devmehq/open-graph-extractor.svg)](https://www.npmjs.com/package/@devmehq/open-graph-extractor)

**Fast, lightweight, and comprehensive Open Graph extractor for Node.js with advanced features** 

Extract Open Graph tags, Twitter Cards, structured data, and 60+ meta tag types with built-in caching, validation, and bulk processing. Optimized for performance and security.

## ✨ Why Choose This Library?

- 🚀 **Lightning Fast**: Built-in caching with tiny-lru and optimized parsing
- 🎯 **Production Ready**: Comprehensive error handling, validation, and security features  
- 🏆 **Most Complete**: Extracts Open Graph, Twitter Cards, JSON-LD, Schema.org, and 60+ meta tags
- 📊 **Smart Analytics**: Built-in validation, social scoring, and performance metrics
- 🛡️ **Security First**: HTML sanitization, URL validation, and PII protection (Node.js only)
- 🔧 **Developer Friendly**: Full TypeScript support, modern async/await API

## 🌟 Key Features

### Core Extraction
- ✅ **60+ Meta Tags**: Open Graph, Twitter Cards, Dublin Core, App Links
- ✅ **JSON-LD Extraction**: Complete structured data parsing
- ✅ **Schema.org Support**: Microdata and RDFa extraction
- ✅ **Smart Fallbacks**: Intelligent content detection when tags are missing

### Advanced Features  
- 🖼️ **Smart Media**: Automatic format detection and best image selection
- 📹 **Rich Metadata**: Video, audio, and responsive image support
- 💾 **Smart Caching**: Built-in memory cache with tiny-lru
- 🚀 **Bulk Processing**: Concurrent extraction for multiple URLs

### Quality & Analytics
- ✨ **Data Validation**: Comprehensive Open Graph and Twitter Card validation  
- 📈 **Social Scoring**: 0-100 score for social media optimization
- 🎯 **SEO Insights**: Performance metrics and recommendations
- ⏱️ **Performance Tracking**: Detailed timing and statistics

### Security & Privacy
- 🛡️ **HTML Sanitization**: XSS protection using Cheerio (Node.js only)
- 🔐 **PII Protection**: Automatic detection and masking of sensitive data
- 🌐 **URL Security**: Domain filtering and validation
- 🚫 **Content Safety**: Malicious content detection

## 📦 Installation

```bash
# Using yarn (recommended)
yarn add @devmehq/open-graph-extractor

# Using npm
npm install @devmehq/open-graph-extractor
```

## 🚀 Quick Start

### Basic Usage (Synchronous)

```typescript
import axios from 'axios';
import { extractOpenGraph } from '@devmehq/open-graph-extractor';

// Fetch HTML and extract Open Graph data
const { data: html } = await axios.get('https://example.com');
const ogData = extractOpenGraph(html);

console.log(ogData);
// {
//   ogTitle: 'Example Title',
//   ogDescription: 'Example Description',
//   ogImage: 'https://example.com/image.jpg',
//   twitterCard: 'summary_large_image',
//   favicon: 'https://example.com/favicon.ico'
//   // ... 60+ more fields
// }
```

### Advanced Usage (Async with All Features)

```typescript
import { extractOpenGraphAsync } from '@devmehq/open-graph-extractor';

// Extract with validation, caching, and structured data
const result = await extractOpenGraphAsync(html, {
  extractStructuredData: true,
  validateData: true,
  generateScore: true,
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour
    storage: 'memory'
  },
  security: {
    sanitizeHtml: true,
    validateUrls: true
  }
});

console.log(result);
// {
//   data: { /* Complete Open Graph data */ },
//   structuredData: { /* JSON-LD, Schema.org, etc */ },
//   confidence: 95,
//   errors: [],
//   warnings: [],
//   metrics: { /* Performance data */ }
// }
```

## 🎯 Advanced Features

### JSON-LD & Structured Data Extraction

```typescript
const result = await extractOpenGraphAsync(html, {
  extractStructuredData: true
});

console.log(result.structuredData);
// {
//   jsonLD: [...],        // All JSON-LD scripts  
//   schemaOrg: {...},     // Schema.org microdata
//   dublinCore: {...},    // Dublin Core metadata
//   microdata: {...},     // Microdata
//   rdfa: {...}          // RDFa data
// }
```

### Bulk Processing

```typescript
import { extractOpenGraphBulk } from '@devmehq/open-graph-extractor';

const urls = ['url1', 'url2', 'url3'...];

const results = await extractOpenGraphBulk({
  urls,
  concurrency: 5,
  rateLimit: {
    requests: 100,
    window: 60000 // 1 minute
  },
  onProgress: (completed, total, url) => {
    console.log(`Processing ${completed}/${total}: ${url}`);
  }
});
```

### Validation & Scoring

```typescript
import { validateOpenGraph, generateSocialScore } from '@devmehq/open-graph-extractor';

// Validate Open Graph data
const validation = validateOpenGraph(ogData);
console.log(validation);
// {
//   valid: false,
//   errors: [...],
//   warnings: [...],
//   score: 75,
//   recommendations: [...]
// }

// Get social media score
const score = generateSocialScore(ogData);
console.log(score);
// {
//   overall: 82,
//   openGraph: { score: 90, ... },
//   twitter: { score: 75, ... },
//   recommendations: [...]
// }
```

### Security Features

```typescript
const result = await extractOpenGraphAsync(html, {
  security: {
    sanitizeHtml: true,      // XSS protection using Cheerio
    detectPII: true,         // PII detection
    maskPII: true,           // Mask sensitive data
    validateUrls: true,      // URL validation
    allowedDomains: ['example.com'],
    blockedDomains: ['malicious.com']
  }
});
```

### Caching

```typescript
// With built-in memory cache (tiny-lru)
const result = await extractOpenGraphAsync(html, {
  cache: {
    enabled: true,
    ttl: 3600,              // 1 hour
    storage: 'memory',
    maxSize: 1000
  }
});

// With custom cache (Redis example)
import Redis from 'ioredis';
const redis = new Redis();

const result = await extractOpenGraphAsync(html, {
  cache: {
    enabled: true,
    ttl: 3600,
    storage: 'custom',
    customStorage: {
      async get(key) {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
      },
      async set(key, value, ttl) {
        await redis.setex(key, ttl, JSON.stringify(value));
      },
      async delete(key) {
        await redis.del(key);
      },
      async clear() {
        await redis.flushdb();
      },
      async has(key) {
        return (await redis.exists(key)) === 1;
      }
    }
  }
});
```

### Enhanced Media Support

```typescript
const result = await extractOpenGraphAsync(html);

// Automatically detects and prioritizes best images
console.log(result.data.ogImage);
// {
//   url: 'https://example.com/image.jpg',
//   type: 'jpg',
//   width: '1200',
//   height: '630',
//   alt: 'Description'
// }

// For multiple images, set allMedia: true
const allMediaResult = extractOpenGraph(html, { allMedia: true });
console.log(allMediaResult.ogImage);
// [
//   { url: '...', width: '1200', height: '630', type: 'jpg' },
//   { url: '...', width: '800', height: '600', type: 'png' }
// ]
```

## 📊 Configuration Options

### IExtractOpenGraphOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customMetaTags` | Array | `[]` | Custom meta tags to extract |
| `allMedia` | boolean | `false` | Extract all images/videos |
| `onlyGetOpenGraphInfo` | boolean | `false` | Skip fallbacks |
| `ogImageFallback` | boolean | `false` | Fallback to page images |
| `cache` | ICacheOptions | - | Caching configuration |
| `security` | ISecurityOptions | - | Security settings |
| `extractStructuredData` | boolean | `false` | Extract JSON-LD, Schema.org |
| `validateData` | boolean | `false` | Validate extracted data |
| `generateScore` | boolean | `false` | Generate social score |
| `extractArticleContent` | boolean | `false` | Extract article text |
| `detectLanguage` | boolean | `false` | Detect content language |
| `normalizeUrls` | boolean | `false` | Normalize and clean URLs |

## 🎨 Custom Meta Tags

```typescript
// Extract custom meta tags
const result = extractOpenGraph(html, {
  customMetaTags: [
    {
      multiple: false,
      property: 'article:author',
      fieldName: 'articleAuthor'
    },
    {
      multiple: true,
      property: 'article:tag',
      fieldName: 'articleTags'
    }
  ]
});

console.log(result.articleAuthor); // Custom field
console.log(result.articleTags);   // Array of tags
```

## 📈 Metrics & Monitoring

```typescript
const result = await extractOpenGraphAsync(html);

console.log(result.metrics);
// {
//   extractionTime: 125,        // ms
//   htmlSize: 54321,           // bytes
//   metaTagsFound: 15,
//   structuredDataFound: 3,
//   imagesFound: 8,
//   videosFound: 1,
//   fallbacksUsed: ['title', 'description'],
//   performance: {
//     htmlParseTime: 20,
//     metaExtractionTime: 10,
//     structuredDataExtractionTime: 15,
//     validationTime: 5,
//     totalTime: 125
//   }
// }
```

## 🧪 Testing

```bash
# Run tests
yarn test

# Run with coverage
yarn test --coverage
```

## 🔧 Development

```bash
# Install dependencies
yarn install

# Build
yarn build

# Lint and format with Biome
yarn lint
yarn format

# Type check
yarn typecheck
```

## 🤝 API / Cloud Service

We offer this as a managed Cloud API Service. Try it here: [URL Scraping & Metadata Service](https://dev.me/products/url-scrapper)

## 📖 TypeScript Support

The library is fully typed with comprehensive TypeScript definitions:

- `IOGResult` - Main result interface with 60+ fields
- `IExtractionResult` - Async extraction result with metrics
- `IExtractOpenGraphOptions` - Configuration options
- `IStructuredData` - JSON-LD and structured data types
- `IValidationResult` - Data validation results
- `ISocialScore` - Social media scoring details
- `IMetrics` - Performance tracking metrics

All types are exported for your use in TypeScript projects.

## 🌟 Why Choose This Library?

| Feature | This Library | Others |
|---------|-------------|---------|
| Open Graph | ✅ Complete (60+ fields) | ✅ Basic |
| Twitter Cards | ✅ Complete | ⚠️ Partial |
| JSON-LD | ✅ Full Extraction | ❌ No |
| Schema.org | ✅ Microdata/RDFa | ❌ No |
| Caching | ✅ Built-in (tiny-lru) | ❌ No |
| Bulk Processing | ✅ Concurrent | ❌ No |
| Validation | ✅ Comprehensive | ❌ No |
| Security | ✅ Node.js optimized | ❌ No |
| TypeScript | ✅ Full Types | ⚠️ Partial |
| Performance | ✅ Optimized | ⚠️ Variable |
| Maintenance | ✅ Active | ⚠️ Variable |

## 🛡️ Security

- **HTML Sanitization**: Uses Cheerio for safe HTML parsing (Node.js only)
- **PII Detection**: Automatic detection and masking of sensitive data
- **URL Validation**: Prevents SSRF attacks with domain filtering
- **Content Security**: Malicious content detection and filtering

## 📈 Performance

- **Fast Extraction**: Sub-100ms for average pages
- **Smart Caching**: Built-in tiny-lru cache reduces repeated processing
- **Concurrent Processing**: Configurable concurrency for bulk operations
- **Optimized Parsing**: Cheerio-based parsing for Node.js performance

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE.md)

## 🙏 Acknowledgments

Built with:
- [Cheerio](https://cheerio.js.org/) - Fast, flexible & lean implementation of jQuery for Node.js
- [tiny-lru](https://github.com/avoidwork/tiny-lru) - Tiny LRU cache for high-performance caching
- [Biome](https://biomejs.dev/) - Fast formatter and linter for JavaScript and TypeScript

---

**Made with ❤️ by [DEV.ME](https://dev.me)**

*Need help or custom features? [Contact us](https://dev.me/contact)*