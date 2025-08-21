import type { Cheerio, CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type { IStructuredData } from "./types";

/**
 * Extract all structured data from HTML
 */
export function extractStructuredData($: CheerioAPI): IStructuredData {
  return {
    jsonLD: extractJsonLD($),
    schemaOrg: extractSchemaOrg($),
    microdata: extractSchemaOrg($), // Using same function for now
    rdfa: extractRDFa($),
    dublinCore: extractDublinCore($),
  };
}

/**
 * Extract JSON-LD structured data
 */
export function extractJsonLD($: CheerioAPI): any[] {
  const jsonLDData: any[] = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const content = $(element).html();
      if (content) {
        const parsed = JSON.parse(content);
        jsonLDData.push(parsed);
      }
    } catch (_error) {
      // Invalid JSON-LD, skip
    }
  });

  return jsonLDData;
}

/**
 * Extract specific JSON-LD types
 */
export function extractJsonLDByType<T>(jsonLDData: any[], type: string): T | null {
  for (const item of jsonLDData) {
    if (item["@type"] === type) {
      return item as T;
    }
    // Check for array of types
    if (Array.isArray(item["@type"]) && item["@type"].includes(type)) {
      return item as T;
    }
    // Check for @graph
    if (item["@graph"] && Array.isArray(item["@graph"])) {
      for (const graphItem of item["@graph"]) {
        if (graphItem["@type"] === type) {
          return graphItem as T;
        }
      }
    }
  }
  return null;
}

/**
 * Extract Schema.org microdata
 */
export function extractSchemaOrg($: CheerioAPI): Record<string, any> {
  const schemaData: Record<string, any> = {};

  // Extract itemscope elements
  $("[itemscope]").each((_, element) => {
    const $element = $(element);
    const itemType = $element.attr("itemtype");
    if (itemType) {
      const type = itemType.split("/").pop();
      if (type) {
        if (!schemaData[type]) {
          schemaData[type] = [];
        }
        schemaData[type].push(extractItemProperties($, $element));
      }
    }
  });

  return schemaData;
}

/**
 * Extract properties from an itemscope element
 */
function extractItemProperties($: CheerioAPI, $element: Cheerio<Element>) {
  const properties: Record<string, any> = {};

  $element.find("[itemprop]").each((_, propElement) => {
    const $prop = $(propElement);
    const propName = $prop.attr("itemprop");
    if (propName) {
      let value: any;

      // Check for nested itemscope
      if ($prop.attr("itemscope") !== undefined) {
        value = extractItemProperties($, $prop);
      } else if ($prop.attr("content")) {
        value = $prop.attr("content");
      } else if ($prop.attr("href")) {
        value = $prop.attr("href");
      } else if ($prop.attr("src")) {
        value = $prop.attr("src");
      } else if ($prop.attr("datetime")) {
        value = $prop.attr("datetime");
      } else {
        value = $prop.text().trim();
      }

      if (properties[propName]) {
        // Convert to array if multiple values
        if (!Array.isArray(properties[propName])) {
          properties[propName] = [properties[propName]];
        }
        properties[propName].push(value);
      } else {
        properties[propName] = value;
      }
    }
  });

  return properties;
}

/**
 * Extract RDFa data
 */
export function extractRDFa($: CheerioAPI) {
  const rdfaData: Record<string, any[]> = {};

  $("[typeof]").each((_, element) => {
    const $element = $(element);
    const type = $element.attr("typeof");
    if (type) {
      if (!rdfaData[type]) {
        rdfaData[type] = [];
      }
      rdfaData[type].push(extractRDFaProperties($, $element));
    }
  });

  return rdfaData;
}

/**
 * Extract RDFa properties
 */
function extractRDFaProperties($: CheerioAPI, $element: Cheerio<Element>) {
  const properties: Record<string, string | string[]> = {};

  $element.find("[property]").each((_, propElement) => {
    const $prop = $(propElement);
    const propName = $prop.attr("property");
    if (propName) {
      let value: string | string[];

      if ($prop.attr("content")) {
        value = $prop.attr("content");
      } else if ($prop.attr("href")) {
        value = $prop.attr("href");
      } else if ($prop.attr("src")) {
        value = $prop.attr("src");
      } else if ($prop.attr("resource")) {
        value = $prop.attr("resource");
      } else {
        value = $prop.text().trim();
      }

      properties[propName] = value;
    }
  });

  return properties;
}

/**
 * Extract Dublin Core metadata
 */
export function extractDublinCore($: CheerioAPI): Record<string, string> {
  const dcData: Record<string, string> = {};

  // Standard DC meta tags
  $('meta[name^="DC."], meta[name^="dc."]').each((_, element) => {
    const $element = $(element);
    const name = $element.attr("name");
    const content = $element.attr("content");
    if (name && content) {
      const key = name.replace(/^(DC\.|dc\.)/, "");
      dcData[key] = content;
    }
  });

  // DCTERMS meta tags
  $('meta[name^="DCTERMS."], meta[name^="dcterms."]').each((_, element) => {
    const $element = $(element);
    const name = $element.attr("name");
    const content = $element.attr("content");
    if (name && content) {
      const key = name.replace(/^(DCTERMS\.|dcterms\.)/, "");
      dcData[key] = content;
    }
  });

  return dcData;
}

/**
 * Merge structured data with Open Graph data
 */
export function mergeStructuredDataWithOG(
  ogData: Record<string, unknown>,
  structuredData: IStructuredData,
): Record<string, unknown> {
  const merged = { ...ogData };

  // Try to extract basic info from JSON-LD
  const jsonLDItems = structuredData.jsonLD;
  for (const item of jsonLDItems) {
    if (item["@type"] === "Article" || item["@type"] === "NewsArticle" || item["@type"] === "BlogPosting") {
      if (!merged.ogTitle && item.headline) {
        merged.ogTitle = item.headline;
      }
      if (!merged.ogDescription && item.description) {
        merged.ogDescription = item.description;
      }
      if (!merged.articlePublishedTime && item.datePublished) {
        merged.articlePublishedTime = item.datePublished;
      }
      if (!merged.articleModifiedTime && item.dateModified) {
        merged.articleModifiedTime = item.dateModified;
      }
    }

    if (item["@type"] === "Product") {
      if (!merged.ogTitle && item.name) {
        merged.ogTitle = item.name;
      }
      if (!merged.ogDescription && item.description) {
        merged.ogDescription = item.description;
      }
    }

    if (item["@type"] === "VideoObject") {
      if (!merged.ogTitle && item.name) {
        merged.ogTitle = item.name;
      }
      if (!merged.ogDescription && item.description) {
        merged.ogDescription = item.description;
      }
    }
  }

  // Add Dublin Core metadata
  if (Object.keys(structuredData.dublinCore).length > 0) {
    Object.entries(structuredData.dublinCore).forEach(([key, value]) => {
      const dcKey = `dc${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (!merged[dcKey]) {
        merged[dcKey] = value;
      }
    });
  }

  return merged;
}
