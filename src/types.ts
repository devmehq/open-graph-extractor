// Enhanced type definitions for the Open Graph Extractor

// Open Graph Types
export type OGType =
  | "article"
  | "book"
  | "books.author"
  | "books.book"
  | "books.genre"
  | "business.business"
  | "fitness.course"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "music.song"
  | "place"
  | "product"
  | "product.group"
  | "product.item"
  | "profile"
  | "restaurant.menu"
  | "restaurant.menu_item"
  | "restaurant.menu_section"
  | "restaurant.restaurant"
  | "video.episode"
  | "video.movie"
  | "video.other"
  | "video.tv_show"
  | "website";

// Twitter Card Types
export type TwitterCardType = "summary" | "summary_large_image" | "app" | "player";

// Image format types
export type ImageFormat = "jpeg" | "jpg" | "png" | "gif" | "webp" | "avif" | "svg" | "bmp" | "ico";

// Cache storage types
export type CacheStorage = "memory" | "redis" | "custom";

// Extraction confidence levels
export type ConfidenceLevel = "high" | "medium" | "low";

// Error severity levels
export type ErrorSeverity = "critical" | "error" | "warning" | "info";

// Structured Data Interfaces
export interface IStructuredData {
  jsonLD: any[];
  schemaOrg: any;
  microdata: any;
  rdfa: any;
  dublinCore: any;
}

// Cache Storage Interface
export interface ICacheStorage {
  get(key: string): Promise<unknown>;

  set(key: string, value: unknown, ttl?: number): Promise<void>;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;

  has(key: string): Promise<boolean>;
}

// Cache Options
export interface ICacheOptions {
  enabled: boolean;
  ttl: number; // Time-to-live in seconds
  storage: CacheStorage;
  maxSize: number; // Maximum cache entries
  keyGenerator?: (url: string) => string;
  customStorage?: ICacheStorage;
}

// Error Handling
export interface IError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  field?: string;
  suggestion?: string;
  timestamp: Date;
}

export interface IWarning {
  code: string;
  message: string;
  field?: string;
  suggestion?: string;
}

export interface IValidationResult {
  valid: boolean;
  errors: IError[];
  warnings: IWarning[];
  score: number; // 0-100
  recommendations: string[];
}

// Extraction Result
export interface IExtractionResult {
  data: IOGResult;
  structuredData: IStructuredData;
  errors: IError[];
  warnings: IWarning[];
  confidence: number; // 0-100
  confidenceLevel: ConfidenceLevel;
  fallbacksUsed: string[];
  metrics: IMetrics;
  validation?: IValidationResult;
  socialScore?: ISocialScore;
}

// Metrics
export interface IMetrics {
  extractionTime: number; // milliseconds
  htmlSize: number; // bytes
  metaTagsFound: number;
  structuredDataFound: number;
  imagesFound: number;
  videosFound: number;
  fallbacksUsed: string[];
  performance: IPerformanceMetrics;
}

export interface IPerformanceMetrics {
  htmlParseTime: number;
  metaExtractionTime: number;
  structuredDataExtractionTime: number;
  validationTime: number;
  totalTime: number;
}

// Video Metadata
export interface IVideoMetadata {
  url: string;
  secureUrl?: string;
  type?: string;
  width?: string | number;
  height?: string | number;
  duration?: number; // seconds
  thumbnails?: IThumbnail[];
  chapters?: IChapter[];
  captions?: ICaption[];
  embedUrl?: string;
  uploadDate?: string;
  views?: number;
  likes?: number;
}

export interface IThumbnail {
  url: string;
  width?: number;
  height?: number;
  format?: ImageFormat;
}

export interface IChapter {
  title: string;
  startTime: number;
  endTime?: number;
  thumbnail?: string;
}

export interface ICaption {
  language: string;
  url: string;
  kind: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
}

// Enhanced Image Metadata
export interface IImageMetadata {
  url: string;
  secureUrl?: string;
  type?: ImageFormat;
  width?: string | number;
  height?: string | number;
  alt?: string;
  caption?: string;
  srcset?: ISrcSetImage[];
  isLazyLoaded?: boolean;
  isResponsive?: boolean;
  dominantColor?: string;
  aspectRatio?: number;
}

export interface ISrcSetImage {
  url: string;
  width: number;
  descriptor: string;
}

// Bulk Processing
export interface IBulkOptions {
  urls: string[];
  concurrency?: number;
  rateLimit?: IRateLimit;
  onProgress?: (completed: number, total: number, url: string) => void;
  onError?: (url: string, error: Error) => void;
  continueOnError?: boolean;
}

export interface IRateLimit {
  requests: number;
  window: number; // milliseconds
}

// SEO & Social Scoring
export interface ISocialScore {
  overall: number; // 0-100
  openGraph: IScoreDetails;
  twitter: IScoreDetails;
  schema: IScoreDetails;
  seo: IScoreDetails;
  recommendations: string[];
  missingRequired: string[];
  missingRecommended: string[];
}

export interface IScoreDetails {
  score: number; // 0-100
  present: string[];
  missing: string[];
  issues: string[];
}

// Security Options
export interface ISecurityOptions {
  sanitizeHtml?: boolean;
  detectPII?: boolean;
  maskPII?: boolean;
  validateUrls?: boolean;
  maxRedirects?: number;
  timeout?: number;
  allowedDomains?: string[];
  blockedDomains?: string[];
}

// Enhanced Extraction Options
export interface IExtractOpenGraphOptions {
  customMetaTags?: Array<{
    multiple: boolean;
    property: string;
    fieldName: string;
  }>;
  allMedia?: boolean;
  onlyGetOpenGraphInfo?: boolean;
  ogImageFallback?: boolean;
  cache?: ICacheOptions;
  security?: ISecurityOptions;
  extractStructuredData?: boolean;
  validateData?: boolean;
  generateScore?: boolean;
  extractArticleContent?: boolean;
  detectLanguage?: boolean;
  normalizeUrls?: boolean;
}

// Main Result Interface
export interface IOGResult {
  // Basic Open Graph
  ogTitle?: string;
  ogType?: OGType;
  ogUrl?: string;
  ogDescription?: string;
  ogSiteName?: string;
  ogLocale?: string;
  ogLocaleAlternate?: string[];
  ogLogo?: string;
  ogDate?: string;

  // Enhanced Media
  ogImage?: IImageMetadata | IImageMetadata[] | string | string[];
  ogVideo?: IVideoMetadata | IVideoMetadata[] | string | string[];
  ogAudio?: string | string[];
  ogAudioSecureURL?: string;
  ogAudioType?: string;

  // Twitter Card
  twitterCard?: TwitterCardType;
  twitterSite?: string;
  twitterSiteId?: string;
  twitterCreator?: string;
  twitterCreatorId?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: IImageMetadata | IImageMetadata[] | string | string[];
  twitterImageAlt?: string | string[];
  twitterPlayer?: string | string[];
  twitterPlayerWidth?: string | string[];
  twitterPlayerHeight?: string | string[];
  twitterPlayerStream?: string | string[];

  // App Links
  alAndroidAppName?: string;
  alAndroidPackage?: string;
  alAndroidUrl?: string;
  alIosAppName?: string;
  alIosAppStoreId?: string;
  alIosUrl?: string;
  alWebUrl?: string;
  alWebShouldFallback?: string;

  // Article Metadata
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleExpirationTime?: string;
  articleAuthor?: string | string[];
  articleSection?: string;
  articleTag?: string | string[];
  articlePublisher?: string;

  // Product Metadata
  ogProductRetailerItemId?: string;
  ogProductPriceAmount?: string;
  ogProductPriceCurrency?: string;
  ogProductAvailability?: string;
  ogProductCondition?: string;

  // Music Metadata
  musicSong?: string | string[];
  musicSongUrl?: string | string[];
  musicMusician?: string | string[];
  musicAlbum?: string | string[];
  musicReleaseDate?: string;
  musicDuration?: number;

  // Book Metadata
  bookAuthor?: string | string[];
  bookIsbn?: string;
  bookReleaseDate?: string;
  bookTag?: string | string[];

  // Profile Metadata
  profileFirstName?: string;
  profileLastName?: string;
  profileUsername?: string;
  profileGender?: string;

  // Place Metadata
  placeLocationLatitude?: string;
  placeLocationLongitude?: string;

  // Restaurant Metadata
  restaurantMenu?: string;
  restaurantSection?: string;
  restaurantVariationPriceAmount?: string;
  restaurantVariationPriceCurrency?: string;

  // Dublin Core
  dcTitle?: string;
  dcCreator?: string;
  dcDescription?: string;
  dcPublisher?: string;
  dcDate?: string;
  dcType?: string;
  dcFormat?: string;
  dcIdentifier?: string;
  dcSource?: string;
  dcLanguage?: string;
  dcRelation?: string;
  dcCoverage?: string;
  dcRights?: string;

  // Additional Metadata
  favicon?: string;
  charset?: string;
  author?: string;
  keywords?: string[];
  robots?: string;
  viewport?: string;
  generator?: string;
  applicationName?: string;
  themeColor?: string;
  canonical?: string;
  ampUrl?: string;
  manifest?: string;
  maskIcon?: string;
  appleTouchIcon?: string;

  // Content Extraction
  articleContent?: string;
  readingTime?: number; // minutes
  wordCount?: number;
  language?: string;
  textDirection?: "ltr" | "rtl";

  // Custom fields
  [key: string]: any;
}

// Export helper types
export type ExtractorFunction = (
  html: string | Buffer,
  options?: IExtractOpenGraphOptions,
) => Promise<IExtractionResult>;
export type ValidatorFunction = (data: IOGResult) => IValidationResult;
export type ScorerFunction = (data: IOGResult) => ISocialScore;
