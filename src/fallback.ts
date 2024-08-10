import * as cheerio from 'cheerio';
import { findImageTypeFromUrl, isImageTypeValid, isUrlValid } from './utils';
import { IOgImage } from './media';
import Selector = cheerio.Selector;
import Element = cheerio.Element;

const doesElementExist = (selector: string | Element, attribute: string, $: Selector) => $(selector).attr(attribute) && $(selector).attr(attribute).length > 0;

interface IFallbackOptions {
  allMedia?: boolean;
  ogImageFallback?: boolean;
  customMetaTags?: ConcatArray<{
    multiple: boolean;
    property: string;
    fieldName: string;
  }>;
  onlyGetOpenGraphInfo?: boolean;
}

export interface IFallbackOgObject {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: IOgImage | IOgImage[] | string | string[];
  ogAudioURL?: string;
  ogAudioSecureURL?: string;
  ogAudioType?: string;
  ogLocale?: string;
  ogLogo?: string;
  ogUrl?: string;
  ogDate?: string;
  favicon?: string;
}

export function fallback(ogObject: IFallbackOgObject, options: IFallbackOptions, $: Selector) {
  // title fallback
  if (!ogObject.ogTitle) {
    if ($('title').text() && $('title').text().length > 0) {
      ogObject.ogTitle = $('title').first().text();
    } else if ($('head > meta[name="title"]').attr('content') && $('head > meta[name="title"]').attr('content').length > 0) {
      ogObject.ogTitle = $('head > meta[name="title"]').attr('content');
    } else if ($('.post-title').text() && $('.post-title').text().length > 0) {
      ogObject.ogTitle = $('.post-title').text();
    } else if ($('.entry-title').text() && $('.entry-title').text().length > 0) {
      ogObject.ogTitle = $('.entry-title').text();
    } else if ($('h1[class*="title" i] a').text() && $('h1[class*="title" i] a').text().length > 0) {
      ogObject.ogTitle = $('h1[class*="title" i] a').text();
    } else if ($('h1[class*="title" i]').text() && $('h1[class*="title" i]').text().length > 0) {
      ogObject.ogTitle = $('h1[class*="title" i]').text();
    }
  }

  // Get meta description tag if og description was not provided
  if (!ogObject.ogDescription) {
    if (doesElementExist('head > meta[name="description"]', 'content', $)) {
      ogObject.ogDescription = $('head > meta[name="description"]').attr('content');
    } else if (doesElementExist('head > meta[itemprop="description"]', 'content', $)) {
      ogObject.ogDescription = $('head > meta[itemprop="description"]').attr('content');
    } else if ($('#description').text() && $('#description').text().length > 0) {
      ogObject.ogDescription = $('#description').text();
    }
  }

  // Get all images if there is no og:image info
  if (!ogObject.ogImage && options?.ogImageFallback) {
    ogObject.ogImage = [];
    $('img').map((index, imageElement) => {
      if (doesElementExist(imageElement, 'src', $)) {
        const source = $(imageElement).attr('src');
        const type = findImageTypeFromUrl(source);
        if (!isUrlValid(source) || !isImageTypeValid(type)) return false;
        (ogObject.ogImage as IOgImage[]).push({
          url: source,
          width: $(imageElement).attr('width') || null,
          height: $(imageElement).attr('height') || null,
          type,
        });
      }
      return false;
    });
    if (ogObject.ogImage.length === 0) delete ogObject.ogImage;
  } else if (ogObject.ogImage) {
    // if there isn't a type, try to pull it from the URL
    if (Array.isArray(ogObject.ogImage)) {
      ogObject.ogImage.map((image) => {
        if (typeof image !== 'string' && image?.url && !image.type) {
          const type = findImageTypeFromUrl(image.url);
          if (isImageTypeValid(type)) image.type = type;
        }
        return false;
      });
    } else if (typeof ogObject.ogImage !== 'string' && ogObject.ogImage?.url && !ogObject.ogImage?.type) {
      const type = findImageTypeFromUrl(ogObject.ogImage.url);
      if (isImageTypeValid(type)) ogObject.ogImage.type = type;
    }
  }

  // audio fallback
  if (!ogObject.ogAudioURL && !ogObject.ogAudioSecureURL) {
    const audioElementValue = $('audio').attr('src');
    const audioSourceElementValue = $('audio > source').attr('src');
    if (doesElementExist('audio', 'src', $)) {
      if (audioElementValue.startsWith('https')) {
        ogObject.ogAudioSecureURL = audioElementValue;
      } else {
        ogObject.ogAudioURL = audioElementValue;
      }
      const audioElementTypeValue = $('audio').attr('type');
      if (!ogObject.ogAudioType && doesElementExist('audio', 'type', $)) ogObject.ogAudioType = audioElementTypeValue;
    } else if (doesElementExist('audio > source', 'src', $)) {
      if (audioSourceElementValue.startsWith('https')) {
        ogObject.ogAudioSecureURL = audioSourceElementValue;
      } else {
        ogObject.ogAudioURL = audioSourceElementValue;
      }
      const audioSourceElementTypeValue = $('audio > source').attr('type');
      if (!ogObject.ogAudioType && doesElementExist('audio > source', 'type', $)) ogObject.ogAudioType = audioSourceElementTypeValue;
    }
  }

  // locale fallback
  if (!ogObject.ogLocale) {
    if (doesElementExist('html', 'lang', $)) {
      ogObject.ogLocale = $('html').attr('lang');
    } else if (doesElementExist('head > meta[itemprop="inLanguage"]', 'content', $)) {
      ogObject.ogLocale = $('head > meta[itemprop="inLanguage"]').attr('content');
    }
  }

  // logo fallback
  if (!ogObject.ogLogo) {
    if (doesElementExist('meta[itemprop="logo"]', 'content', $)) {
      ogObject.ogLogo = $('meta[itemprop="logo"]').attr('content');
    } else if (doesElementExist('img[itemprop="logo"]', 'src', $)) {
      ogObject.ogLogo = $('img[itemprop="logo"]').attr('src');
    }
  }

  // url fallback
  if (!ogObject.ogUrl) {
    if (doesElementExist('link[rel="canonical"]', 'href', $)) {
      ogObject.ogUrl = $('link[rel="canonical"]').attr('href');
    } else if (doesElementExist('link[rel="alternate"][hreflang="x-default"]', 'href', $)) {
      ogObject.ogUrl = $('link[rel="alternate"][hreflang="x-default"]').attr('href');
    }
  }

  // date fallback
  if (!ogObject.ogDate) {
    if (doesElementExist('head > meta[name="date"]', 'content', $)) {
      ogObject.ogDate = $('head > meta[name="date"]').attr('content');
    } else if (doesElementExist('[itemprop*="datemodified" i]', 'content', $)) {
      ogObject.ogDate = $('[itemprop*="datemodified" i]').attr('content');
    } else if (doesElementExist('[itemprop="datepublished" i]', 'content', $)) {
      ogObject.ogDate = $('[itemprop="datepublished" i]').attr('content');
    } else if (doesElementExist('[itemprop*="date" i]', 'content', $)) {
      ogObject.ogDate = $('[itemprop*="date" i]').attr('content');
    } else if (doesElementExist('time[itemprop*="date" i]', 'datetime', $)) {
      ogObject.ogDate = $('time[itemprop*="date" i]').attr('datetime');
    } else if (doesElementExist('time[datetime]', 'datetime', $)) {
      ogObject.ogDate = $('time[datetime]').attr('datetime');
    }
  }

  // favicon fallback
  if (!ogObject.favicon) {
    if (doesElementExist('link[rel="shortcut icon"]', 'href', $)) {
      ogObject.favicon = $('link[rel="shortcut icon"]').attr('href');
    } else if (doesElementExist('link[rel="icon"]', 'href', $)) {
      ogObject.favicon = $('link[rel="icon"]').attr('href');
    } else if (doesElementExist('link[rel="mask-icon"]', 'href', $)) {
      ogObject.favicon = $('link[rel="mask-icon"]').attr('href');
    } else if (doesElementExist('link[rel="apple-touch-icon"]', 'href', $)) {
      ogObject.favicon = $('link[rel="apple-touch-icon"]').attr('href');
    } else if (doesElementExist('link[type="image/png"]', 'href', $)) {
      ogObject.favicon = $('link[type="image/png"]').attr('href');
    } else if (doesElementExist('link[type="image/ico"]', 'href', $)) {
      ogObject.favicon = $('link[type="image/ico"]').attr('href');
    } else if (doesElementExist('link[type="image/x-icon"]', 'href', $)) {
      ogObject.favicon = $('link[type="image/x-icon"]').attr('href');
    }
  }

  return ogObject;
}
