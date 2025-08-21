import type {
  ErrorSeverity,
  IError,
  IOGResult,
  IScoreDetails,
  ISocialScore,
  IValidationResult,
  IWarning,
  OGType,
  TwitterCardType,
} from "./types";

/**
 * Validate Open Graph data
 */
export function validateOpenGraph(data: IOGResult): IValidationResult {
  const errors: IError[] = [];
  const warnings: IWarning[] = [];
  const recommendations: string[] = [];

  // Check required Open Graph properties
  if (!data.ogTitle) {
    errors.push({
      code: "OG_MISSING_TITLE",
      message: "Missing required property: og:title",
      severity: "critical" as ErrorSeverity,
      field: "ogTitle",
      suggestion: "Add <meta property='og:title' content='Your Title'>",
      timestamp: new Date(),
    });
  }

  if (!data.ogType) {
    errors.push({
      code: "OG_MISSING_TYPE",
      message: "Missing required property: og:type",
      severity: "critical" as ErrorSeverity,
      field: "ogType",
      suggestion: "Add <meta property='og:type' content='website'>",
      timestamp: new Date(),
    });
  }

  if (!data.ogImage) {
    errors.push({
      code: "OG_MISSING_IMAGE",
      message: "Missing required property: og:image",
      severity: "critical" as ErrorSeverity,
      field: "ogImage",
      suggestion: "Add <meta property='og:image' content='https://example.com/image.jpg'>",
      timestamp: new Date(),
    });
  }

  if (!data.ogUrl) {
    errors.push({
      code: "OG_MISSING_URL",
      message: "Missing required property: og:url",
      severity: "critical" as ErrorSeverity,
      field: "ogUrl",
      suggestion: "Add <meta property='og:url' content='https://example.com/page'>",
      timestamp: new Date(),
    });
  }

  // Check recommended properties
  if (!data.ogDescription) {
    warnings.push({
      code: "OG_MISSING_DESCRIPTION",
      message: "Missing recommended property: og:description",
      field: "ogDescription",
      suggestion: "Add <meta property='og:description' content='Page description'>",
    });
  }

  if (!data.ogSiteName) {
    warnings.push({
      code: "OG_MISSING_SITE_NAME",
      message: "Missing recommended property: og:site_name",
      field: "ogSiteName",
      suggestion: "Add <meta property='og:site_name' content='Your Site Name'>",
    });
  }

  // Validate og:type value
  if (data.ogType && !isValidOGType(data.ogType)) {
    warnings.push({
      code: "OG_INVALID_TYPE",
      message: `Invalid og:type value: ${data.ogType}`,
      field: "ogType",
      suggestion: "Use a valid og:type value like 'website', 'article', 'video', etc.",
    });
  }

  // Validate image dimensions
  if (data.ogImage) {
    const images = Array.isArray(data.ogImage) ? data.ogImage : [data.ogImage];
    for (const image of images) {
      if (typeof image === "object") {
        if (!image.width || !image.height) {
          warnings.push({
            code: "OG_IMAGE_MISSING_DIMENSIONS",
            message: "Image missing width or height dimensions",
            field: "ogImage",
            suggestion: "Add og:image:width and og:image:height meta tags",
          });
        } else {
          const width = Number.parseInt(String(image.width), 10);
          const height = Number.parseInt(String(image.height), 10);
          if (width < 200 || height < 200) {
            warnings.push({
              code: "OG_IMAGE_TOO_SMALL",
              message: `Image dimensions too small: ${width}x${height}. Minimum recommended: 200x200`,
              field: "ogImage",
            });
          }
          if (width > 5000 || height > 5000) {
            warnings.push({
              code: "OG_IMAGE_TOO_LARGE",
              message: `Image dimensions too large: ${width}x${height}. Maximum recommended: 5000x5000`,
              field: "ogImage",
            });
          }
        }
      }
    }
  }

  // Add recommendations
  if (!data.twitterCard) {
    recommendations.push("Add Twitter Card meta tags for better Twitter sharing");
  }

  if (!data.favicon) {
    recommendations.push("Add a favicon for better branding");
  }

  if (!data.ogLocale) {
    recommendations.push("Add og:locale for language specification");
  }

  if (data.ogType === "article" && !data.articlePublishedTime) {
    recommendations.push("Add article:published_time for article pages");
  }

  if (!data.canonical) {
    recommendations.push("Add canonical URL to prevent duplicate content issues");
  }

  // Calculate score
  const score = calculateValidationScore(errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score,
    recommendations,
  };
}

/**
 * Validate Twitter Card data
 */
export function validateTwitterCard(data: IOGResult): IValidationResult {
  const errors: IError[] = [];
  const warnings: IWarning[] = [];
  const recommendations: string[] = [];

  if (!data.twitterCard) {
    warnings.push({
      code: "TWITTER_MISSING_CARD",
      message: "Missing Twitter Card type",
      field: "twitterCard",
      suggestion: "Add <meta name='twitter:card' content='summary_large_image'>",
    });
  } else if (!isValidTwitterCardType(data.twitterCard)) {
    errors.push({
      code: "TWITTER_INVALID_CARD_TYPE",
      message: `Invalid Twitter Card type: ${data.twitterCard}`,
      severity: "error" as ErrorSeverity,
      field: "twitterCard",
      suggestion: "Use a valid type: summary, summary_large_image, app, or player",
      timestamp: new Date(),
    });
  }

  if (!data.twitterTitle && !data.ogTitle) {
    warnings.push({
      code: "TWITTER_MISSING_TITLE",
      message: "Missing Twitter title (no twitter:title or og:title)",
      field: "twitterTitle",
    });
  }

  if (!data.twitterDescription && !data.ogDescription) {
    warnings.push({
      code: "TWITTER_MISSING_DESCRIPTION",
      message: "Missing Twitter description (no twitter:description or og:description)",
      field: "twitterDescription",
    });
  }

  if (!data.twitterImage && !data.ogImage) {
    warnings.push({
      code: "TWITTER_MISSING_IMAGE",
      message: "Missing Twitter image (no twitter:image or og:image)",
      field: "twitterImage",
    });
  }

  // Card-specific validation
  if (data.twitterCard === "summary_large_image") {
    if (data.twitterImage || data.ogImage) {
      const image = data.twitterImage || data.ogImage;
      const images = Array.isArray(image) ? image : [image];
      for (const img of images) {
        if (typeof img === "object" && img.width && img.height) {
          const width = Number.parseInt(String(img.width), 10);
          const height = Number.parseInt(String(img.height), 10);
          if (width < 300 || height < 157) {
            warnings.push({
              code: "TWITTER_IMAGE_TOO_SMALL",
              message: `Image too small for summary_large_image card. Minimum: 300x157, Current: ${width}x${height}`,
              field: "twitterImage",
            });
          }
        }
      }
    }
  }

  if (data.twitterCard === "player") {
    if (!data.twitterPlayer) {
      errors.push({
        code: "TWITTER_PLAYER_MISSING_URL",
        message: "Player card requires twitter:player URL",
        severity: "error" as ErrorSeverity,
        field: "twitterPlayer",
        timestamp: new Date(),
      });
    }
    if (!data.twitterPlayerWidth || !data.twitterPlayerHeight) {
      warnings.push({
        code: "TWITTER_PLAYER_MISSING_DIMENSIONS",
        message: "Player card should include width and height",
        field: "twitterPlayer",
      });
    }
  }

  const score = calculateValidationScore(errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score,
    recommendations,
  };
}

/**
 * Generate social sharing score
 */
export function generateSocialScore(data: IOGResult): ISocialScore {
  const ogValidation = validateOpenGraph(data);
  const twitterValidation = validateTwitterCard(data);

  // Calculate Open Graph score
  const ogScore: IScoreDetails = {
    score: ogValidation.score,
    present: [],
    missing: [],
    issues: [],
  };

  // Track present OG fields
  if (data.ogTitle) {
    ogScore.present.push("title");
  }
  if (data.ogDescription) {
    ogScore.present.push("description");
  }
  if (data.ogImage) {
    ogScore.present.push("image");
  }
  if (data.ogUrl) {
    ogScore.present.push("url");
  }
  if (data.ogType) {
    ogScore.present.push("type");
  }
  if (data.ogSiteName) {
    ogScore.present.push("site_name");
  }

  // Track missing OG fields
  if (!data.ogTitle) {
    ogScore.missing.push("title");
  }
  if (!data.ogDescription) {
    ogScore.missing.push("description");
  }
  if (!data.ogImage) {
    ogScore.missing.push("image");
  }
  if (!data.ogUrl) {
    ogScore.missing.push("url");
  }
  if (!data.ogType) {
    ogScore.missing.push("type");
  }

  // Add issues
  ogScore.issues = ogValidation.errors.map((e) => e.message);

  // Calculate Twitter score
  const twitterScore: IScoreDetails = {
    score: twitterValidation.score,
    present: [],
    missing: [],
    issues: [],
  };

  // Track present Twitter fields
  if (data.twitterCard) {
    twitterScore.present.push("card");
  }
  if (data.twitterTitle || data.ogTitle) {
    twitterScore.present.push("title");
  }
  if (data.twitterDescription || data.ogDescription) {
    twitterScore.present.push("description");
  }
  if (data.twitterImage || data.ogImage) {
    twitterScore.present.push("image");
  }
  if (data.twitterSite) {
    twitterScore.present.push("site");
  }

  // Track missing Twitter fields
  if (!data.twitterCard) {
    twitterScore.missing.push("card");
  }
  if (!data.twitterTitle && !data.ogTitle) {
    twitterScore.missing.push("title");
  }
  if (!data.twitterDescription && !data.ogDescription) {
    twitterScore.missing.push("description");
  }
  if (!data.twitterImage && !data.ogImage) {
    twitterScore.missing.push("image");
  }

  // Add issues
  twitterScore.issues = twitterValidation.errors.map((e) => e.message);

  // Calculate Schema.org score
  const schemaScore: IScoreDetails = {
    score: 0,
    present: [],
    missing: ["JSON-LD", "Microdata"],
    issues: ["No structured data found"],
  };

  // Calculate SEO score
  const seoScore: IScoreDetails = {
    score: 0,
    present: [],
    missing: [],
    issues: [],
  };

  if (data.ogTitle) {
    seoScore.score += 20;
  }
  if (data.ogDescription) {
    seoScore.score += 20;
  }
  if (data.canonical) {
    seoScore.score += 20;
    seoScore.present.push("canonical");
  } else {
    seoScore.missing.push("canonical");
  }
  if (data.favicon) {
    seoScore.score += 10;
    seoScore.present.push("favicon");
  } else {
    seoScore.missing.push("favicon");
  }
  if (data.robots) {
    seoScore.score += 10;
    seoScore.present.push("robots");
  }
  if (data.viewport) {
    seoScore.score += 10;
    seoScore.present.push("viewport");
  }
  if (data.charset) {
    seoScore.score += 10;
    seoScore.present.push("charset");
  }

  // Calculate overall score
  const overall = Math.round((ogScore.score + twitterScore.score + schemaScore.score + seoScore.score) / 4);

  // Generate recommendations
  const recommendations: string[] = [];
  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];

  // Add missing required fields
  if (!data.ogTitle) {
    missingRequired.push("og:title");
  }
  if (!data.ogType) {
    missingRequired.push("og:type");
  }
  if (!data.ogImage) {
    missingRequired.push("og:image");
  }
  if (!data.ogUrl) {
    missingRequired.push("og:url");
  }

  // Add missing recommended fields
  if (!data.ogDescription) {
    missingRecommended.push("og:description");
  }
  if (!data.ogSiteName) {
    missingRecommended.push("og:site_name");
  }
  if (!data.twitterCard) {
    missingRecommended.push("twitter:card");
  }
  if (!data.canonical) {
    missingRecommended.push("canonical URL");
  }

  // Generate recommendations based on score
  if (overall < 50) {
    recommendations.push("Critical: Add basic Open Graph meta tags immediately");
  }
  if (ogScore.score < 70) {
    recommendations.push("Improve Open Graph implementation for better social sharing");
  }
  if (twitterScore.score < 70) {
    recommendations.push("Add Twitter Card meta tags for better Twitter engagement");
  }
  if (schemaScore.score === 0) {
    recommendations.push("Implement JSON-LD structured data for better SEO");
  }
  if (!data.ogImage || (Array.isArray(data.ogImage) && data.ogImage.length === 0)) {
    recommendations.push("Add high-quality images (1200x630px recommended for Facebook)");
  }
  if (data.ogDescription && data.ogDescription.length < 50) {
    recommendations.push("Write longer, more descriptive meta descriptions (150-160 characters)");
  }

  return {
    overall,
    openGraph: ogScore,
    twitter: twitterScore,
    schema: schemaScore,
    seo: seoScore,
    recommendations,
    missingRequired,
    missingRecommended,
  };
}

/**
 * Check if a string is a valid Open Graph type
 */
function isValidOGType(type: string): type is OGType {
  const validTypes: OGType[] = [
    "article",
    "book",
    "books.author",
    "books.book",
    "books.genre",
    "business.business",
    "fitness.course",
    "music.album",
    "music.playlist",
    "music.radio_station",
    "music.song",
    "place",
    "product",
    "product.group",
    "product.item",
    "profile",
    "restaurant.menu",
    "restaurant.menu_item",
    "restaurant.menu_section",
    "restaurant.restaurant",
    "video.episode",
    "video.movie",
    "video.other",
    "video.tv_show",
    "website",
  ];
  return validTypes.includes(type as OGType);
}

/**
 * Check if a string is a valid Twitter Card type
 */
function isValidTwitterCardType(type: string): type is TwitterCardType {
  const validTypes: TwitterCardType[] = ["summary", "summary_large_image", "app", "player"];
  return validTypes.includes(type as TwitterCardType);
}

/**
 * Calculate validation score based on errors and warnings
 */
function calculateValidationScore(errors: IError[], warnings: IWarning[]): number {
  let score = 100;

  // Deduct points for errors
  for (const error of errors) {
    if (error.severity === "critical") {
      score -= 20;
    } else if (error.severity === "error") {
      score -= 10;
    } else {
      score -= 5;
    }
  }

  // Deduct points for warnings
  score -= warnings.length * 3;

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}
