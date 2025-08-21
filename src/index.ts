import type { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";
import { type CacheManager, createCache } from "./cache";
import { fallback, type IFallbackOgObject } from "./fallback";
import { fields } from "./fields";
import {
  extractAllImages,
  extractAudioMetadata,
  extractVideoMetadata,
  type IOgObjectMedia,
  mediaSetup,
  selectBestImage,
} from "./media";
import { normalizeUrl, sanitizeExtractedData, sanitizeHtml, validateUrl } from "./security";
import { extractStructuredData, mergeStructuredDataWithOG } from "./structured-data";
import type {
  CacheStorage,
  ConfidenceLevel,
  IExtractOpenGraphOptions as IAsyncExtractOptions,
  IOGResult as IAsyncOGResult,
  IError,
  IExtractionResult,
  IMetrics,
  IPerformanceMetrics,
  ISocialScore,
  IValidationResult,
  IWarning,
} from "./types";
import { removeNestedUndefinedValues } from "./utils";
import { generateSocialScore, validateOpenGraph, validateTwitterCard } from "./validation";

export * from "./bulk";
export * from "./cache";
export * from "./media";
export * from "./security";
export * from "./structured-data";
// Re-export all types and utilities
export * from "./types";
export * from "./validation";

// Global cache instance
let globalCache: CacheManager | null = null;

// Enhanced interface that extends original for backward compatibility
export interface IOGResult extends IOgObjectMedia {
  ogLocale?: string;
  favicon?: string;
  ogDate?: string;
  alAndroidAppName?: string;
  alAndroidPackage?: string;
  alAndroidUrl?: string;
  alIosAppName?: string;
  alIosAppStoreId?: string;
  alIosUrl?: string;
  alWebShouldFallback?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterAppNameiPhone?: string;
  twitterAppIdiPhone?: string;
  twitterAppUrliPhone?: string;
  twitterAppNameiPad?: string;
  twitterAppIdiPad?: string;
  twitterAppUrliPad?: string;
  twitterAppNameGooglePlay?: string;
  twitterAppIdGooglePlay?: string;
  twitterAppUrlGooglePlay?: string;
  ogImageSecureURL?: string;
  ogImageURL?: string;
  ogSiteName?: string;
  charset?: string;
  error?: string;
  errorDetails?: string;

  [key: string]: unknown;
}

// Enhanced options interface that includes all new features while maintaining backward compatibility
export interface IExtractOpenGraphOptions {
  customMetaTags?: Array<{
    multiple: boolean;
    property: string;
    fieldName: string;
  }>;
  allMedia?: boolean;
  onlyGetOpenGraphInfo?: boolean;
  ogImageFallback?: boolean;
  // Enhanced features
  cache?: {
    enabled: boolean;
    ttl?: number;
    storage?: string;
    maxSize?: number;
    keyGenerator?: (url: string) => string;
  };
  security?: {
    sanitizeHtml?: boolean;
    detectPII?: boolean;
    maskPII?: boolean;
    validateUrls?: boolean;
    maxRedirects?: number;
    timeout?: number;
    allowedDomains?: string[];
    blockedDomains?: string[];
  };
  extractStructuredData?: boolean;
  validateData?: boolean;
  generateScore?: boolean;
  extractArticleContent?: boolean;
  detectLanguage?: boolean;
  normalizeUrls?: boolean;
  returnEnhanced?: boolean; // Flag to return enhanced result format
}

/**
 * Extract Open Graph data from HTML with optional enhanced features
 * @param input - HTML string or Buffer
 * @param options - extraction options
 */
export function extractOpenGraph(input: string | Buffer, options?: IExtractOpenGraphOptions): IOGResult {
  // Legacy extraction for backward compatibility
  let ogObject: IOGResult = {} as IOGResult;
  const $ = cheerio.load(input);
  const metaFields = fields.concat(options?.customMetaTags ?? []);

  // find all the open graph info in the meta tags
  $("meta").each((_index, meta) => {
    if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name)) return;
    const property = meta.attribs.property || meta.attribs.name || meta.attribs.itemprop || meta.attribs.itemProp;
    const content = meta.attribs.content || meta.attribs.value;
    metaFields.forEach((item) => {
      if (property.toLowerCase() === item.property.toLowerCase()) {
        if (!item.multiple) {
          ogObject[item.fieldName] = content;
        } else if (!ogObject[item.fieldName]) {
          ogObject[item.fieldName] = [content];
        } else if (Array.isArray(ogObject[item.fieldName])) {
          (ogObject[item.fieldName] as unknown[]).push(content);
        }
      }
    });
  });

  // set ogImage to ogImageSecureURL/ogImageURL if there is no ogImage
  if (!ogObject.ogImage && ogObject.ogImageSecureURL) {
    ogObject.ogImage = ogObject.ogImageSecureURL;
  } else if (!ogObject.ogImage && ogObject.ogImageURL) {
    ogObject.ogImage = ogObject.ogImageURL;
  }

  // formats the multiple media values
  ogObject = mediaSetup(ogObject, options);

  // if onlyGetOpenGraphInfo isn't set, run the open graph fallbacks
  if (!options?.onlyGetOpenGraphInfo) {
    ogObject = fallback(ogObject, options, $) as IOGResult;
  }

  // removes any undef
  ogObject = removeNestedUndefinedValues(ogObject);

  return ogObject;
}

/**
 * Extract Open Graph data with all features (async version)
 * @param input - HTML string, Buffer, or URL (URL fetching not implemented)
 * @param options - extraction options
 */
export async function extractOpenGraphAsync(
  input: string | Buffer,
  options?: IAsyncExtractOptions,
): Promise<IExtractionResult> {
  return extractOpenGraphAsyncImpl(input, options);
}

/**
 * Async extraction implementation (internal)
 */
async function extractOpenGraphAsyncImpl(
  input: string | Buffer,
  options?: IAsyncExtractOptions,
): Promise<IExtractionResult> {
  const startTime = Date.now();
  const metrics: Partial<IMetrics> = {
    metaTagsFound: 0,
    structuredDataFound: 0,
    imagesFound: 0,
    videosFound: 0,
    fallbacksUsed: [],
  };
  const errors: IError[] = [];
  const warnings: IWarning[] = [];
  const fallbacksUsed: string[] = [];
  let structuredData = { jsonLD: [], schemaOrg: {}, microdata: {}, rdfa: {}, dublinCore: {} };

  try {
    // Initialize cache if needed
    if (options?.cache?.enabled && !globalCache) {
      globalCache = createCache({
        enabled: options.cache.enabled,
        ttl: options.cache.ttl || 3600,
        storage: (options.cache.storage as CacheStorage) || "memory",
        maxSize: options.cache.maxSize || 1000,
        keyGenerator: options.cache.keyGenerator,
      });
    }

    let html: string;
    let url: string | undefined;

    // Check if input is URL or HTML
    if (typeof input === "string" && (input.startsWith("http://") || input.startsWith("https://"))) {
      url = input;

      // Validate URL if security is enabled
      if (options?.security?.validateUrls && !validateUrl(url, options.security)) {
        throw new Error(`Invalid or blocked URL: ${url}`);
      }

      // Normalize URL
      if (options?.normalizeUrls) {
        url = normalizeUrl(url);
      }

      // Check cache
      if (globalCache && options?.cache?.enabled) {
        const cached = await globalCache.get(url);
        if (cached) {
          return cached as IExtractionResult;
        }
      }

      // Fetch HTML - in production, you would use axios or another HTTP client
      // For this library, the user should provide HTML directly or use their own fetching
      throw new Error("URL fetching not implemented. Please fetch HTML and pass it directly.");
    }
    html = typeof input === "string" ? input : input.toString("utf8");
    metrics.htmlSize = Buffer.byteLength(html, "utf8");

    // Sanitize HTML if security is enabled
    if (options?.security?.sanitizeHtml) {
      html = sanitizeHtml(html, options.security);
    }

    const htmlParseStart = Date.now();
    const $ = cheerio.load(html);
    const htmlParseTime = Date.now() - htmlParseStart;

    // Extract basic Open Graph data
    const metaExtractionStart = Date.now();
    let ogObject: IAsyncOGResult = {} as IAsyncOGResult;
    const metaFields = fields.concat(options?.customMetaTags ?? []);

    // Extract meta tags
    $("meta").each((_index, meta) => {
      if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name)) return;
      const property = meta.attribs.property || meta.attribs.name || meta.attribs.itemprop || meta.attribs.itemProp;
      const content = meta.attribs.content || meta.attribs.value;
      metrics.metaTagsFound!++;

      metaFields.forEach((item) => {
        if (property.toLowerCase() === item.property.toLowerCase()) {
          if (!item.multiple) {
            ogObject[item.fieldName] = content;
          } else if (!ogObject[item.fieldName]) {
            ogObject[item.fieldName] = [content];
          } else if (Array.isArray(ogObject[item.fieldName])) {
            (ogObject[item.fieldName] as unknown[]).push(content);
          }
        }
      });
    });

    // Extract additional metadata
    ogObject.charset =
      $("meta[charset]").attr("charset") ||
      $('meta[http-equiv="Content-Type"]')
        .attr("content")
        ?.match(/charset=([^;]+)/)?.[1];
    ogObject.viewport = $('meta[name="viewport"]').attr("content");
    ogObject.robots = $('meta[name="robots"]').attr("content");
    ogObject.generator = $('meta[name="generator"]').attr("content");
    ogObject.themeColor = $('meta[name="theme-color"]').attr("content");
    ogObject.applicationName = $('meta[name="application-name"]').attr("content");
    ogObject.canonical = $('link[rel="canonical"]').attr("href");
    ogObject.ampUrl = $('link[rel="amphtml"]').attr("href");
    ogObject.manifest = $('link[rel="manifest"]').attr("href");
    ogObject.maskIcon = $('link[rel="mask-icon"]').attr("href");
    ogObject.appleTouchIcon = $('link[rel="apple-touch-icon"]').attr("href");

    const metaExtractionTime = Date.now() - metaExtractionStart;

    // Set URL if available
    if (url && !ogObject.ogUrl) {
      ogObject.ogUrl = url;
    }

    // Extract structured data if enabled
    const structuredDataStart = Date.now();
    if (options?.extractStructuredData) {
      structuredData = extractStructuredData($);
      metrics.structuredDataFound = structuredData.jsonLD?.length || 0;
      ogObject = mergeStructuredDataWithOG(ogObject, structuredData);
    }
    const structuredDataExtractionTime = Date.now() - structuredDataStart;

    // Extract enhanced media
    if (!options?.onlyGetOpenGraphInfo) {
      // Enhanced image extraction
      const images = extractAllImages($);
      metrics.imagesFound = images.length;
      if (images.length > 0 && !ogObject.ogImage) {
        const bestImage = selectBestImage(images);
        if (bestImage) {
          ogObject.ogImage = bestImage;
          fallbacksUsed.push("image-extraction");
        }
      }

      // Enhanced video extraction
      const video = extractVideoMetadata($, ogObject.ogVideo as string);
      if (video) {
        ogObject.ogVideo = video;
        metrics.videosFound = 1;
      }

      // Enhanced audio extraction
      const audio = extractAudioMetadata($);
      if (audio && !ogObject.ogAudio) {
        ogObject.ogAudio = audio.url;
        if (audio.secureUrl) ogObject.ogAudioSecureURL = audio.secureUrl;
        if (audio.type) ogObject.ogAudioType = audio.type;
      }
    }

    // Format media
    ogObject = mediaSetup(ogObject as IOgObjectMedia, options) as IAsyncOGResult;

    // Run fallbacks if not disabled
    if (!options?.onlyGetOpenGraphInfo) {
      const beforeFallback = { ...ogObject };
      ogObject = fallback(ogObject as IFallbackOgObject, options, $) as IAsyncOGResult;

      // Track which fallbacks were used
      for (const key of Object.keys(ogObject)) {
        if (!beforeFallback[key] && ogObject[key]) {
          fallbacksUsed.push(`fallback-${key}`);
        }
      }
    }

    // Extract article content if enabled
    if (options?.extractArticleContent) {
      const articleContent = extractArticleContent($);
      if (articleContent) {
        ogObject.articleContent = articleContent.content;
        ogObject.readingTime = articleContent.readingTime;
        ogObject.wordCount = articleContent.wordCount;
      }
    }

    // Detect language if enabled
    if (options?.detectLanguage) {
      const lang = $("html").attr("lang") || $('meta[http-equiv="content-language"]').attr("content");
      if (lang) {
        ogObject.language = lang;
        ogObject.textDirection = lang.startsWith("ar") || lang.startsWith("he") ? "rtl" : "ltr";
      }
    }

    // Clean up undefined values
    ogObject = removeNestedUndefinedValues(ogObject);

    // Sanitize data if security is enabled
    if (options?.security) {
      ogObject = sanitizeExtractedData(ogObject, options.security);
    }

    // Validate data if enabled
    const validationStart = Date.now();
    let validationResult: unknown = null;
    let socialScore: unknown = null;

    if (options?.validateData) {
      validationResult = validateOpenGraph(ogObject);
      const twitterValidation = validateTwitterCard(ogObject);

      // Add validation errors and warnings
      const validation = validationResult as IValidationResult;
      const twitterVal = twitterValidation as IValidationResult;
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
      errors.push(...twitterVal.errors);
      warnings.push(...twitterVal.warnings);
    }

    if (options?.generateScore) {
      socialScore = generateSocialScore(ogObject);
    }
    const validationTime = Date.now() - validationStart;

    // Calculate confidence score
    const confidence = calculateConfidence(ogObject, errors, warnings);
    const confidenceLevel = getConfidenceLevel(confidence);

    // Complete metrics
    metrics.fallbacksUsed = fallbacksUsed;
    metrics.performance = {
      htmlParseTime,
      metaExtractionTime,
      structuredDataExtractionTime,
      validationTime,
      totalTime: Date.now() - startTime,
    } as IPerformanceMetrics;

    const result: IExtractionResult = {
      data: ogObject,
      structuredData,
      errors,
      warnings,
      confidence,
      confidenceLevel,
      fallbacksUsed,
      metrics: metrics as IMetrics,
    };

    // Add validation and scoring results if generated
    if (validationResult) {
      result.validation = validationResult as IValidationResult;
    }
    if (socialScore) {
      result.socialScore = socialScore as ISocialScore;
    }

    // Cache the result if caching is enabled
    if (globalCache && options?.cache?.enabled && url) {
      await globalCache.set(url, result);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push({
      code: "EXTRACTION_ERROR",
      message: errorMessage,
      severity: "critical",
      timestamp: new Date(),
    });

    return {
      data: {} as IAsyncOGResult,
      structuredData,
      errors,
      warnings,
      confidence: 0,
      confidenceLevel: "low",
      fallbacksUsed,
      metrics: {
        ...metrics,
        performance: {
          htmlParseTime: 0,
          metaExtractionTime: 0,
          structuredDataExtractionTime: 0,
          validationTime: 0,
          totalTime: Date.now() - startTime,
        },
      } as IMetrics,
    };
  }
}

/**
 * Calculate confidence score based on extracted data
 */
function calculateConfidence(data: IAsyncOGResult, errors: IError[], warnings: IWarning[]): number {
  let score = 100;

  // Deduct for missing required fields
  if (!data.ogTitle) {
    score -= 20;
  }
  if (!data.ogType) {
    score -= 15;
  }
  if (!data.ogImage) {
    score -= 15;
  }
  if (!data.ogUrl) {
    score -= 10;
  }
  if (!data.ogDescription) {
    score -= 10;
  }

  // Deduct for errors
  score -= errors.filter((e) => e.severity === "critical").length * 10;
  score -= errors.filter((e) => e.severity === "error").length * 5;

  // Deduct for warnings
  score -= warnings.length * 2;

  // Bonus for additional metadata
  if (data.twitterCard) {
    score += 5;
  }
  if (data.articlePublishedTime) {
    score += 3;
  }
  if (data.canonical) {
    score += 3;
  }
  if (data.favicon) {
    score += 2;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Get confidence level from score
 */
function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 80) {
    return "high";
  }
  if (score >= 50) {
    return "medium";
  }
  return "low";
}

/**
 * Extract article content from HTML
 */
function extractArticleContent($: CheerioAPI): { content: string; readingTime: number; wordCount: number } | null {
  // Try to find main content area
  const selectors = [
    "article",
    '[role="main"]',
    "main",
    ".post-content",
    ".entry-content",
    ".article-content",
    ".content",
    "#content",
  ];

  let content = "";
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length > 0) {
      content = element.text().trim();
      break;
    }
  }

  if (!content) {
    // Fallback to largest text block
    let maxLength = 0;
    $("p").each((_, element) => {
      const text = $(element).text().trim();
      if (text.length > maxLength) {
        maxLength = text.length;
        content = text;
      }
    });
  }

  if (!content) {
    return null;
  }

  // Calculate reading time (average 200 words per minute)
  const words = content.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    content: content.substring(0, 5000), // Limit content length
    readingTime,
    wordCount,
  };
}
