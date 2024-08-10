/*
 * validates the url
 * @param string var - the url we want to scrape
 */

export function isUrlValid(url: string | any[]) {
  // todo check image urls
  return true;
  return typeof url === 'string' && url.length > 0 && url.indexOf('http') === 0 && url.indexOf(' ') === -1;
}

/*
 * forces url to start with http://
 * @param string var - the url we want to scrape
 */

/*
 * validate timeout - how long should we wait for a request
 * @param number var - the time we want to wait
 */

/*
 * findImageTypeFromUrl
 * @param string url - image url
 */
export function findImageTypeFromUrl(url: string) {
  let type = url.split('.').pop();
  [type] = type.split('?');
  return type;
}

/*
 * isImageTypeValid
 * @param string type - image type
 */
export function isImageTypeValid(type: string) {
  const validImageTypes = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];
  return validImageTypes.includes(type);
}

/*
 * isThisANonHTMLPage
 * @param string url - url of site
 */
export function isThisANonHTMLUrl(url: any) {
  const invalidImageTypes = [
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.3gp',
    '.avi',
    '.mov',
    '.mp4',
    '.m4v',
    '.m4a',
    '.mp3',
    '.mkv',
    '.ogv',
    '.ogm',
    '.ogg',
    '.oga',
    '.webm',
    '.wav',
    '.bmp',
    '.gif',
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.zip',
    '.rar',
    '.tar',
    '.tar.gz',
    '.tgz',
    '.tar.bz2',
    '.tbz2',
    '.txt',
    '.pdf',
  ];
  const extension = findImageTypeFromUrl(url);
  return invalidImageTypes.some((type) => `.${extension}`.includes(type));
}

/*
 * removeNestedUndefinedValues
 * @param object - an object
 */
export function removeNestedUndefinedValues(object: any) {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === 'object') removeNestedUndefinedValues(value);
    else if (value === undefined) delete object[key];
  });
  return object;
}
