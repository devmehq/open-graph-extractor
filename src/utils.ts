/*
 * validates the url
 * @param string var - the url we want to scrape
 */

export function isUrlValid(url: string | string[]): boolean {
  return typeof url === "string" && url.length > 0 && url.indexOf("http") === 0 && url.indexOf(" ") === -1;
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
  let type = url.split(".").pop();
  [type] = type.split("?");
  return type;
}

/*
 * isImageTypeValid
 * @param string type - image type
 */
export function isImageTypeValid(type: string) {
  const validImageTypes = [
    "apng",
    "bmp",
    "gif",
    "ico",
    "cur",
    "jpg",
    "jpeg",
    "jfif",
    "pjpeg",
    "pjp",
    "png",
    "svg",
    "tif",
    "tiff",
    "webp",
  ];
  return validImageTypes.includes(type);
}

/*
 * removeNestedUndefinedValues
 * @param object - an object
 */
export function removeNestedUndefinedValues(object: Record<string, any>): Record<string, any> {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === "object") removeNestedUndefinedValues(value);
    else if (value === undefined) delete object[key];
  });
  return object;
}
