import * as cheerio from 'cheerio';
import { fields } from './fields';
import { mediaSetup } from './media';
import { removeNestedUndefinedValues } from './utils';
import { fallback } from './fallback';

import Root = cheerio.Root;
import TagElement = cheerio.TagElement;

/*
 * extract meta tags from html string
 * @param string body - html string
 * @param string options - options the user has set
 */
export function extractOpenGraph(
  body: string | Buffer,
  options?: {
    customMetaTags?: ConcatArray<{ multiple: boolean; property: string; fieldName: string }>;
    allMedia?: boolean;
    onlyGetOpenGraphInfo?: boolean;
    ogImageFallback?: boolean;
  },
) {
  let ogObject: any = {};
  const $: Root = cheerio.load(body);
  const metaFields = fields.concat(options?.customMetaTags ?? []);

  // find all the open graph info in the meta tags
  $('meta').each((index, meta: TagElement) => {
    if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name)) return;
    const property = meta.attribs.property || meta.attribs.name;
    const content = meta.attribs.content || meta.attribs.value;
    metaFields.forEach((item) => {
      if (property.toLowerCase() === item.property.toLowerCase()) {
        if (!item.multiple) {
          ogObject[item.fieldName] = content;
        } else if (!ogObject[item.fieldName]) {
          ogObject[item.fieldName] = [content];
        } else if (Array.isArray(ogObject[item.fieldName])) {
          ogObject[item.fieldName].push(content);
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
    ogObject = fallback(ogObject, options, $);
  }

  // removes any undef
  ogObject = removeNestedUndefinedValues(ogObject);

  return ogObject;
}
