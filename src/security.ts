import * as cheerio from "cheerio";
import type { ISecurityOptions } from "./types";

/**
 * Sanitize HTML content using Cheerio (Node.js only, no browser dependencies)
 */
export function sanitizeHtml(html: string, options?: ISecurityOptions): string {
  if (!options?.sanitizeHtml) {
    return html;
  }

  // Load HTML with Cheerio
  const $ = cheerio.load(html);

  // Remove dangerous tags
  const dangerousTags = [
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "applet",
    "form",
    "input",
    "button",
    "textarea",
    "select",
  ];
  dangerousTags.forEach((tag) => {
    $(tag).remove();
  });

  // Remove dangerous attributes
  const dangerousAttrs = [
    "onabort",
    "onblur",
    "onchange",
    "onclick",
    "ondblclick",
    "onerror",
    "onfocus",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onload",
    "onmousedown",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onreset",
    "onresize",
    "onselect",
    "onsubmit",
    "onunload",
    "onafterprint",
    "onbeforeprint",
    "onbeforeunload",
    "onhashchange",
    "onmessage",
    "onoffline",
    "ononline",
    "onpagehide",
    "onpageshow",
    "onpopstate",
    "onstorage",
  ];

  $("*").each((_, element) => {
    const $element = $(element);
    dangerousAttrs.forEach((attr) => {
      $element.removeAttr(attr);
    });

    // Remove javascript: protocol from href and src
    const href = $element.attr("href");
    if (href?.toLowerCase().includes("javascript:")) {
      $element.removeAttr("href");
    }

    const src = $element.attr("src");
    if (src?.toLowerCase().includes("javascript:")) {
      $element.removeAttr("src");
    }
  });

  // Remove any inline styles that might contain javascript
  $("[style]").each((_, element) => {
    const $element = $(element);
    const style = $element.attr("style");
    if (style && (style.includes("javascript:") || style.includes("expression(") || style.includes("import("))) {
      $element.removeAttr("style");
    }
  });

  return $.html();
}

/**
 * Validate URL for security
 */
export function validateUrl(url: string, options?: ISecurityOptions): boolean {
  if (!options?.validateUrls) {
    return true;
  }

  try {
    const urlObj = new URL(url);

    // Check protocol
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // Check against blocked domains
    if (options.blockedDomains) {
      const domain = urlObj.hostname;
      if (options.blockedDomains.some((blocked) => domain.includes(blocked))) {
        return false;
      }
    }

    // Check against allowed domains
    if (options.allowedDomains && options.allowedDomains.length > 0) {
      const domain = urlObj.hostname;
      if (!options.allowedDomains.some((allowed) => domain.includes(allowed))) {
        return false;
      }
    }

    // Check for local/private IPs
    if (isPrivateIP(urlObj.hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if an IP address is private/local
 */
function isPrivateIP(hostname: string): boolean {
  // Check for localhost
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
    return true;
  }

  // Check for private IP ranges
  const privateRanges = [/^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./, /^169\.254\./, /^fc00:/i, /^fe80:/i];

  return privateRanges.some((range) => range.test(hostname));
}

/**
 * Common PII patterns
 */
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  // Basic patterns - in production, use more sophisticated detection
};

/**
 * Detect PII in text
 */
export function detectPII(text: string): {
  hasPII: boolean;
  types: string[];
  matches: Record<string, string[]>;
} {
  const types: string[] = [];
  const matches: Record<string, string[]> = {};

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const found = text.match(pattern);
    if (found && found.length > 0) {
      types.push(type);
      matches[type] = found;
    }
  }

  return {
    hasPII: types.length > 0,
    types,
    matches,
  };
}

/**
 * Mask PII in text
 */
export function maskPII(text: string, options?: ISecurityOptions): string {
  if (!options?.maskPII) {
    return text;
  }

  let masked = text;

  // Email addresses
  masked = masked.replace(PII_PATTERNS.email, (match) => {
    const parts = match.split("@");
    if (parts.length === 2) {
      const username = parts[0];
      const domain = parts[1];
      return `${username[0]}${"*".repeat(username.length - 1)}@${domain}`;
    }
    return match;
  });

  // Phone numbers
  masked = masked.replace(PII_PATTERNS.phone, (match) => {
    const digits = match.replace(/\D/g, "");
    if (digits.length >= 10) {
      return match.replace(/\d/g, "*").replace(/(\*{3})(\*{3})(\*{4})/, "$1-$2-$3");
    }
    return match;
  });

  // SSN
  masked = masked.replace(PII_PATTERNS.ssn, "***-**-****");

  // Credit cards
  masked = masked.replace(PII_PATTERNS.creditCard, (match) => {
    const digits = match.replace(/\D/g, "");
    if (digits.length === 16) {
      return `****-****-****-${digits.slice(-4)}`;
    }
    return match;
  });

  // IP addresses (keep first octet)
  masked = masked.replace(PII_PATTERNS.ipAddress, (match) => {
    const parts = match.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.*.*.*`;
    }
    return match;
  });

  return masked;
}

/**
 * Sanitize extracted data
 */
export function sanitizeExtractedData(
  data: Record<string, unknown>,
  options?: ISecurityOptions,
): Record<string, unknown> {
  if (!options?.sanitizeHtml && !options?.maskPII) {
    return data;
  }

  const sanitized = { ...data };

  // Recursively sanitize string values
  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === "string") {
      let result = value;
      if (options?.sanitizeHtml) {
        result = sanitizeHtml(result, options);
      }
      if (options?.maskPII) {
        result = maskPII(result, options);
      }
      return result;
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (value && typeof value === "object") {
      const obj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        obj[key] = sanitizeValue(val);
      }
      return obj;
    }
    return value;
  };

  return sanitizeValue(sanitized) as Record<string, unknown>;
}

/**
 * Normalize URLs for consistency and security
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    // Remove tracking parameters
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "ref",
      "source",
    ];

    for (const param of trackingParams) {
      urlObj.searchParams.delete(param);
    }

    // Remove fragment
    urlObj.hash = "";

    // Ensure HTTPS when possible
    if (urlObj.protocol === "http:" && !isPrivateIP(urlObj.hostname)) {
      urlObj.protocol = "https:";
    }

    return urlObj.toString();
  } catch {
    return url;
  }
}
