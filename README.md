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

## 📋 Complete API Reference

### Core Functions

#### `extractOpenGraph(html, options?)`
**Synchronous extraction** - Fast and lightweight for basic use cases.

```typescript
import { extractOpenGraph } from '@devmehq/open-graph-extractor';

const data = extractOpenGraph(html, {
  customMetaTags: [
    { multiple: false, property: 'article:author', fieldName: 'author' }
  ],
  allMedia: true,              // Extract all images/videos
  ogImageFallback: true,       // Fallback to page images
  onlyGetOpenGraphInfo: false  // Include fallback content
});
```

#### `extractOpenGraphAsync(html, options?)`
**Asynchronous extraction** - Full feature set with advanced capabilities.

```typescript
import { extractOpenGraphAsync } from '@devmehq/open-graph-extractor';

const result = await extractOpenGraphAsync(html, {
  // Core options
  extractStructuredData: true,    // JSON-LD, Schema.org, Microdata
  validateData: true,             // Data validation
  generateScore: true,            // SEO/social scoring
  extractArticleContent: true,    // Article text extraction
  detectLanguage: true,           // Language detection
  normalizeUrls: true,           // URL normalization
  
  // Advanced features
  cache: { enabled: true, ttl: 3600 },
  security: { sanitizeHtml: true, validateUrls: true }
});
```

### Configuration Options

#### `IExtractOpenGraphOptions` (Sync)
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customMetaTags` | Array | `[]` | Custom meta tags to extract |
| `allMedia` | boolean | `false` | Extract all images/videos instead of just the first |
| `onlyGetOpenGraphInfo` | boolean | `false` | Skip fallback content extraction |
| `ogImageFallback` | boolean | `false` | Enable image fallback from page content |

#### `IExtractOpenGraphOptions` (Async) - Extends Sync Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extractStructuredData` | boolean | `false` | Extract JSON-LD, Schema.org, Microdata |
| `validateData` | boolean | `false` | Validate extracted Open Graph data |
| `generateScore` | boolean | `false` | Generate SEO/social media score (0-100) |
| `extractArticleContent` | boolean | `false` | Extract main article text content |
| `detectLanguage` | boolean | `false` | Detect content language and text direction |
| `normalizeUrls` | boolean | `false` | Normalize and clean all URLs |
| `cache` | ICacheOptions | `undefined` | Caching configuration |
| `security` | ISecurityOptions | `undefined` | Security and validation settings |

#### `ICacheOptions`
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable caching |
| `ttl` | number | `3600` | Time-to-live in seconds |
| `storage` | string | `'memory'` | Storage type: 'memory', 'redis', 'custom' |
| `maxSize` | number | `1000` | Maximum cache entries (memory only) |
| `keyGenerator` | Function | - | Custom cache key generator |
| `customStorage` | ICacheStorage | - | Custom storage implementation |

#### `ISecurityOptions`
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sanitizeHtml` | boolean | `false` | Sanitize HTML content (XSS protection) |
| `detectPII` | boolean | `false` | Detect personally identifiable information |
| `maskPII` | boolean | `false` | Mask detected PII in results |
| `validateUrls` | boolean | `false` | Validate and filter URLs |
| `maxRedirects` | number | `5` | Maximum URL redirects to follow |
| `timeout` | number | `10000` | Request timeout in milliseconds |
| `allowedDomains` | string[] | `[]` | Allowed domains whitelist |
| `blockedDomains` | string[] | `[]` | Blocked domains blacklist |

### Return Types

#### `IOGResult` (Sync)
Basic extraction result with 60+ fields:

```typescript
{
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | string[] | IOgImage | IOgImage[];
  ogUrl?: string;
  ogType?: OGType;
  twitterCard?: TwitterCardType;
  favicon?: string;
  // ... 50+ more fields including:
  // Twitter Cards, App Links, Article metadata,
  // Product info, Music data, Dublin Core, etc.
}
```

#### `IExtractionResult` (Async)
Enhanced result with validation and metrics:

```typescript
{
  data: IOGResult;              // Extracted Open Graph data
  structuredData: {             // Structured data extraction
    jsonLD: any[];
    schemaOrg: any;
    microdata: any;
    rdfa: any;
    dublinCore: any;
  };
  errors: IError[];             // Validation errors
  warnings: IWarning[];        // Validation warnings
  confidence: number;           // Confidence score (0-100)
  confidenceLevel: 'high' | 'medium' | 'low';
  fallbacksUsed: string[];      // Which fallbacks were used
  metrics: IMetrics;            // Performance metrics
  validation?: IValidationResult;  // Validation details (if enabled)
  socialScore?: ISocialScore;      // Social media scoring (if enabled)
}
```

### Utility Functions

#### `validateOpenGraph(data)`
Validates Open Graph data against specifications.

```typescript
import { validateOpenGraph } from '@devmehq/open-graph-extractor';

const validation = validateOpenGraph(ogData);
console.log(validation);
// {
//   valid: boolean,
//   errors: IError[],
//   warnings: IWarning[],
//   score: number,
//   recommendations: string[]
// }
```

#### `generateSocialScore(data)`
Generates social media optimization score (0-100).

```typescript
import { generateSocialScore } from '@devmehq/open-graph-extractor';

const score = generateSocialScore(ogData);
console.log(score);
// {
//   overall: number,
//   openGraph: { score, present, missing, issues },
//   twitter: { score, present, missing, issues },
//   schema: { score, present, missing, issues },
//   seo: { score, present, missing, issues },
//   recommendations: string[]
// }
```

#### `extractOpenGraphBulk(options)`
Process multiple URLs concurrently with rate limiting.

```typescript
import { extractOpenGraphBulk } from '@devmehq/open-graph-extractor';

const results = await extractOpenGraphBulk({
  urls: ['url1', 'url2', 'url3'],
  concurrency: 5,                    // Process 5 URLs simultaneously
  rateLimit: {                       // Rate limiting
    requests: 100,                   // Max 100 requests
    window: 60000                    // Per 60 seconds
  },
  continueOnError: true,             // Don't stop on individual failures
  onProgress: (completed, total, url) => {
    console.log(`Progress: ${completed}/${total} - ${url}`);
  },
  onError: (url, error) => {
    console.error(`Failed to process ${url}:`, error);
  }
});

console.log(results.summary);
// {
//   total: number,
//   successful: number,
//   failed: number,
//   totalDuration: number,
//   averageDuration: number
// }
```

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

## 🌟 **Complete Feature Guide**

### **Core Extraction Features**

#### **Meta Tag Extraction (60+ Types)**
- **Open Graph**: Complete og:* tag support with type validation
- **Twitter Cards**: All twitter:* tags including player and app cards  
- **Dublin Core**: dc:* metadata extraction
- **App Links**: al:* tags for mobile app deep linking
- **Article Metadata**: Publishing dates, authors, sections, tags
- **Product Info**: Prices, availability, condition, retailer data
- **Music Metadata**: Albums, artists, songs, duration
- **Place/Location**: GPS coordinates and location data

```typescript
// Automatically extracts all supported meta types
const data = extractOpenGraph(html);
console.log(data.ogTitle, data.twitterCard, data.articleAuthor);
```

#### **Intelligent Fallbacks**
When meta tags are missing, the library intelligently falls back to:
- `<title>` tags for ogTitle
- Meta descriptions for ogDescription  
- Page images for ogImage
- Canonical URLs for ogUrl
- Page content analysis for missing data

```typescript
// Fallbacks work automatically
const data = extractOpenGraph(html, { ogImageFallback: true });
// Will find images even if og:image is missing
```

### **Advanced Extraction Features**

#### **Structured Data Extraction**
- **JSON-LD**: Parses all `<script type="application/ld+json">` blocks
- **Schema.org**: Extracts microdata with itemscope/itemprop
- **RDFa**: Resource Description Framework attributes
- **Microdata**: HTML5 microdata extraction

```typescript
const result = await extractOpenGraphAsync(html, {
  extractStructuredData: true
});

console.log(result.structuredData);
// {
//   jsonLD: [{ "@type": "Article", "headline": "..." }],
//   schemaOrg: { "Product": { "name": "...", "price": "..." }},
//   microdata: { "Review": { "rating": "5" }},
//   rdfa: { "Person": { "name": "John Doe" }}
// }
```

#### **Content Analysis**
- **Article Extraction**: Finds and extracts main article content
- **Reading Time**: Calculates estimated reading time  
- **Word Count**: Counts words in extracted content
- **Language Detection**: Auto-detects content language and text direction

```typescript
const result = await extractOpenGraphAsync(html, {
  extractArticleContent: true,
  detectLanguage: true
});

console.log(result.data.articleContent);  // Main article text
console.log(result.data.readingTime);     // 5 (minutes)
console.log(result.data.language);        // "en-US"
console.log(result.data.textDirection);   // "ltr"
```

### **Data Quality Features**

#### **Comprehensive Validation**
- **Open Graph Validation**: Checks required fields and formats
- **Twitter Card Validation**: Ensures proper card types and content
- **URL Validation**: Verifies image and video URLs
- **Content Validation**: Checks for reasonable field lengths

```typescript
const result = await extractOpenGraphAsync(html, {
  validateData: true
});

if (!result.validation.valid) {
  console.log("Issues found:");
  result.validation.errors.forEach(error => {
    console.log(`- ${error.field}: ${error.message}`);
  });
  
  console.log("Recommendations:");
  result.validation.recommendations.forEach(rec => {
    console.log(`- ${rec}`);
  });
}
```

#### **Social Media Scoring**
Generates SEO and social media optimization scores (0-100):

```typescript
const result = await extractOpenGraphAsync(html, {
  generateScore: true
});

console.log(`Overall Score: ${result.socialScore.overall}/100`);
console.log(`Open Graph: ${result.socialScore.openGraph.score}/100`);
console.log(`Twitter: ${result.socialScore.twitter.score}/100`);

// Get actionable recommendations
result.socialScore.recommendations.forEach(rec => {
  console.log(`💡 ${rec}`);
});
// 💡 Add og:image for better social sharing
// 💡 Include twitter:card for Twitter optimization
```

### **Performance Features**

#### **Smart Caching System**
- **Memory Cache**: Built-in LRU cache with tiny-lru
- **Redis Support**: Enterprise-ready Redis caching
- **Custom Storage**: Implement your own cache backend
- **TTL Control**: Configurable expiration times

```typescript
// Memory caching
const result = await extractOpenGraphAsync(html, {
  cache: {
    enabled: true,
    ttl: 3600,        // 1 hour
    maxSize: 1000,    // Max entries
    storage: 'memory'
  }
});

// Redis caching
const result = await extractOpenGraphAsync(html, {
  cache: {
    enabled: true,
    ttl: 7200,        // 2 hours  
    storage: 'redis'  // Requires Redis setup
  }
});
```

#### **Bulk Processing with Rate Limiting**
Process multiple URLs efficiently with concurrency control:

```typescript
const results = await extractOpenGraphBulk({
  urls: siteUrls,
  concurrency: 10,           // 10 simultaneous requests
  rateLimit: {
    requests: 100,           // Max 100 requests
    window: 60000           // Per minute
  },
  onProgress: (done, total, url) => {
    updateProgressBar(done / total);
  }
});

console.log(`Processed ${results.summary.successful}/${results.summary.total} URLs`);
```

#### **Performance Monitoring**
Detailed metrics for optimization:

```typescript
const result = await extractOpenGraphAsync(html);

console.log("Performance Metrics:");
console.log(`- Total time: ${result.metrics.performance.totalTime}ms`);
console.log(`- HTML parsing: ${result.metrics.performance.htmlParseTime}ms`);  
console.log(`- Meta extraction: ${result.metrics.performance.metaExtractionTime}ms`);
console.log(`- Found ${result.metrics.metaTagsFound} meta tags`);
console.log(`- Used fallbacks: ${result.fallbacksUsed.join(', ')}`);
```

### **Security Features**

#### **Content Sanitization**
- **XSS Protection**: Sanitizes HTML content using Cheerio
- **URL Validation**: Prevents SSRF attacks
- **Domain Control**: Allow/block specific domains
- **Content Filtering**: Remove malicious content

```typescript
const result = await extractOpenGraphAsync(html, {
  security: {
    sanitizeHtml: true,        // Clean HTML content
    validateUrls: true,        // Verify all URLs
    allowedDomains: [          // Only allow these domains
      'example.com',
      'cdn.example.com'
    ],
    blockedDomains: [          // Block these domains
      'malicious.com'
    ],
    maxRedirects: 3,          // Limit URL redirects
    timeout: 5000             // 5 second timeout
  }
});
```

#### **Privacy Protection**
- **PII Detection**: Automatically detects personal information
- **Data Masking**: Optional masking of sensitive content
- **Safe Extraction**: Removes potentially harmful data

```typescript
const result = await extractOpenGraphAsync(html, {
  security: {
    detectPII: true,    // Detect emails, phones, addresses
    maskPII: true       // Mask detected PII in results
  }
});

// PII will be masked in the output
// "Contact: j***@example.com" instead of "Contact: john@example.com"
```

### **Enhanced Media Support**

#### **Smart Image Processing**
- **Format Detection**: Supports JPG, PNG, GIF, WebP, AVIF, SVG
- **Size Optimization**: Automatically selects best image sizes
- **Responsive Images**: Handles srcset and multiple formats
- **Fallback Images**: Finds images when og:image is missing

```typescript
// Enhanced image extraction
const result = await extractOpenGraphAsync(html, {
  allMedia: true  // Extract all images, not just the first
});

console.log(result.data.ogImage);
// [
//   { url: 'image1.jpg', width: 1200, height: 630, type: 'jpg' },
//   { url: 'image2.png', width: 800, height: 600, type: 'png' }
// ]
```

#### **Video & Audio Metadata**
- **Video Information**: Duration, thumbnails, captions, chapters
- **Audio Metadata**: Track info, artists, albums, duration
- **Streaming Support**: Handles video players and streaming URLs

```typescript
const result = await extractOpenGraphAsync(videoPageHtml);

console.log(result.data.ogVideo);
// {
//   url: 'video.mp4',
//   duration: 300,
//   thumbnails: [{ url: 'thumb.jpg', width: 1280, height: 720 }],
//   captions: [{ language: 'en', url: 'captions.vtt' }]
// }
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