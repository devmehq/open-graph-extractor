import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import { fields } from "./fields";
import type { ICaption, IImageMetadata, ImageFormat, ISrcSetImage, IThumbnail, IVideoMetadata, OGType } from "./types";
import { isUrlValid } from "./utils";

const mediaMapperTwitterImage = (item: string[]) => ({
  url: item[0],
  width: item[1] || null,
  height: item[2] || null,
  alt: item[3] || null,
});

const mediaMapperTwitterPlayer = (item: string[]) => ({
  url: item[0],
  width: item[1] || null,
  height: item[2] || null,
  stream: item[3] || null,
});

const mediaMapperMusicSong = (item: string[]) => ({
  url: item[0] || "",
  track: item[1] || "",
  disc: item[2] || "",
});

const mediaMapper = (item: string[]) => ({
  url: item[0],
  width: item[1] || null,
  height: item[2] || null,
  type: item[3] || null,
});

const mediaSorter = (
  a: { url: string; width: string | null; height: string | null },
  b: { url: string; width: string | null; height: string | null },
) => {
  if (!(a.url && b.url)) {
    return 0;
  }

  const aRes = a.url.match(/\.(\w{2,5})$/);
  const aExt = aRes?.[1].toLowerCase() || null;
  const bRes = b.url.match(/\.(\w{2,5})$/);
  const bExt = bRes?.[1].toLowerCase() || null;

  if (aExt === "gif" && bExt !== "gif") {
    return -1;
  }
  if (aExt !== "gif" && bExt === "gif") {
    return 1;
  }

  const aWidth = a.width ? Number.parseInt(a.width, 10) : 0;
  const aHeight = a.height ? Number.parseInt(a.height, 10) : 0;
  const bWidth = b.width ? Number.parseInt(b.width, 10) : 0;
  const bHeight = b.height ? Number.parseInt(b.height, 10) : 0;

  return Math.max(bWidth, bHeight) - Math.max(aWidth, aHeight);
};

const mediaSorterMusicSong = (a: { track: string; disc: string }, b: { track: string; disc: string }) => {
  if (!a.track || !b.track) {
    return 0;
  }
  const aDisc = Number.parseInt(a.disc || "0", 10);
  const bDisc = Number.parseInt(b.disc || "0", 10);
  const aTrack = Number.parseInt(a.track, 10);
  const bTrack = Number.parseInt(b.track, 10);

  if (aDisc > bDisc) {
    return 1;
  }
  if (aDisc < bDisc) {
    return -1;
  }
  return aTrack - bTrack;
};

// lodash zip replacement
const zip = (array: unknown[], ...args: unknown[][]) => {
  if (array === undefined) {
    return [];
  }
  return array.map((value, idx) => [value, ...args.map((arr) => arr[idx])]);
};

export interface IOgObjectMedia {
  [key: string]: unknown;
}

export interface IMediaOptions {
  allMedia?: boolean;
  customMetaTags?: ConcatArray<{
    multiple: boolean;
    property: string;
    fieldName: string;
  }>;
  onlyGetOpenGraphInfo?: unknown;
}

export interface IOgImage {
  url: string;
  width?: string | number;
  height?: string | number;
  type?: string;
}

export interface IOgVideo {
  url?: string;
  width?: string;
  height?: string;
  type?: string;
}

export interface ITwitterImage {
  url?: string;
  width?: string;
  height?: string;
  alt?: string;
}

export interface ITwitterPlayer {
  url?: string;
  width?: string;
  height?: string;
  stream?: string;
}

export interface IMusicSong {
  url?: string;
  track?: string;
  disc?: string;
}

export interface IOgObjectMedia {
  ogTitle?: string;
  ogType?: OGType;
  ogUrl?: string;
  ogDescription?: string;
  ogImage?: IOgImage | IOgImage[] | string | string[];
  ogImageWidth?: string[];
  ogImageHeight?: string[];
  ogImageType?: string[];
  ogVideo?: IOgVideo | IOgVideo[] | string | string[];
  ogVideoWidth?: string[];
  ogVideoHeight?: string[];
  ogVideoType?: string[];
  twitterImageSrc?: string[];
  twitterImage?: ITwitterImage | ITwitterImage[] | string | string[];
  twitterImageWidth?: string[];
  twitterImageHeight?: string[];
  twitterImageAlt?: string[];
  twitterPlayer?: ITwitterPlayer | ITwitterPlayer[] | string | string[];
  twitterPlayerWidth?: string[];
  twitterPlayerHeight?: string[];
  twitterPlayerStream?: string[];
  musicSong?: IMusicSong | IMusicSong[] | string | string[];
  musicSongTrack?: string[];
  musicSongDisc?: string[];
}

/*
 * media setup
 * @param string ogObject - return open graph info
 * @param string options - options the user has set
 * @param function callback
 */
export function mediaSetup(ogObject: IOgObjectMedia, options: IMediaOptions) {
  // sets ogImage image/width/height/type to null if one This exists
  if (ogObject.ogImage || ogObject.ogImageWidth || ogObject.twitterImageHeight || ogObject.ogImageType) {
    ogObject.ogImage = ogObject.ogImage ? ogObject.ogImage : [null];
    ogObject.ogImageWidth = ogObject.ogImageWidth ? ogObject.ogImageWidth : [null];
    ogObject.ogImageHeight = ogObject.ogImageHeight ? ogObject.ogImageHeight : [null];
    ogObject.ogImageType = ogObject.ogImageType ? ogObject.ogImageType : [null];
  }

  // format images
  const ogImages = zip(
    ogObject.ogImage as IOgImage[],
    ogObject.ogImageWidth,
    ogObject.ogImageHeight,
    ogObject.ogImageType,
  )
    .map(mediaMapper)
    .sort(mediaSorter);

  // sets ogVideo video/width/height/type to null if one this exists
  if (ogObject.ogVideo || ogObject.ogVideoWidth || ogObject.ogVideoHeight || ogObject.ogVideoType) {
    ogObject.ogVideo = ogObject.ogVideo ? ogObject.ogVideo : [null];
    ogObject.ogVideoWidth = ogObject.ogVideoWidth ? ogObject.ogVideoWidth : [null];
    ogObject.ogVideoHeight = ogObject.ogVideoHeight ? ogObject.ogVideoHeight : [null];
    ogObject.ogVideoType = ogObject.ogVideoType ? ogObject.ogVideoType : [null];
  }

  // format videos
  const ogVideos = zip(
    ogObject.ogVideo as IOgVideo[],
    ogObject.ogVideoWidth,
    ogObject.ogVideoHeight,
    ogObject.ogVideoType,
  )
    .map(mediaMapper)
    .sort(mediaSorter);

  // sets twitter image/width/height/type to null if one these exists
  if (
    ogObject.twitterImageSrc ||
    ogObject.twitterImage ||
    ogObject.twitterImageWidth ||
    ogObject.twitterImageHeight ||
    ogObject.twitterImageAlt
  ) {
    ogObject.twitterImageSrc = ogObject.twitterImageSrc ? ogObject.twitterImageSrc : [null];
    ogObject.twitterImage = ogObject.twitterImage ? ogObject.twitterImage : ogObject.twitterImageSrc; // deafult to twitterImageSrc
    ogObject.twitterImageWidth = ogObject.twitterImageWidth ? ogObject.twitterImageWidth : [null];
    ogObject.twitterImageHeight = ogObject.twitterImageHeight ? ogObject.twitterImageHeight : [null];
    ogObject.twitterImageAlt = ogObject.twitterImageAlt ? ogObject.twitterImageAlt : [null];
  }

  // format twitter images
  const twitterImages = zip(
    ogObject.twitterImage as ITwitterImage[],
    ogObject.twitterImageWidth,
    ogObject.twitterImageHeight,
    ogObject.twitterImageAlt,
  )
    .map(mediaMapperTwitterImage)
    .sort(mediaSorter);

  // sets twitter player/width/height/stream to null if one these exists
  if (
    ogObject.twitterPlayer ||
    ogObject.twitterPlayerWidth ||
    ogObject.twitterPlayerHeight ||
    ogObject.twitterPlayerStream
  ) {
    ogObject.twitterPlayer = ogObject.twitterPlayer ? ogObject.twitterPlayer : [null];
    ogObject.twitterPlayerWidth = ogObject.twitterPlayerWidth ? ogObject.twitterPlayerWidth : [null];
    ogObject.twitterPlayerHeight = ogObject.twitterPlayerHeight ? ogObject.twitterPlayerHeight : [null];
    ogObject.twitterPlayerStream = ogObject.twitterPlayerStream ? ogObject.twitterPlayerStream : [null];
  }

  // format twitter player
  const twitterPlayers = zip(
    ogObject.twitterPlayer as ITwitterPlayer[],
    ogObject.twitterPlayerWidth,
    ogObject.twitterPlayerHeight,
    ogObject.twitterPlayerStream,
  )
    .map(mediaMapperTwitterPlayer)
    .sort(mediaSorter);

  // sets music song/songTrack/songDisc to null if one This exists
  if (ogObject.musicSong || ogObject.musicSongTrack || ogObject.musicSongDisc) {
    ogObject.musicSong = ogObject.musicSong ? ogObject.musicSong : [null];
    ogObject.musicSongTrack = ogObject.musicSongTrack ? ogObject.musicSongTrack : [null];
    ogObject.musicSongDisc = ogObject.musicSongDisc ? ogObject.musicSongDisc : [null];
  }

  // format music songs
  const musicSongs = zip(ogObject.musicSong as IMusicSong[], ogObject.musicSongTrack, ogObject.musicSongDisc)
    .map(mediaMapperMusicSong)
    .sort(mediaSorterMusicSong);

  // remove old values since everything will live under the main property
  fields
    .filter((item) => item.multiple && item.fieldName && item.fieldName.match("(ogImage|ogVideo|twitter|musicSong).*"))
    .forEach((item) => {
      delete ogObject[item.fieldName as keyof IOgObjectMedia];
    });

  if (options?.allMedia) {
    if (ogImages.length) {
      ogObject.ogImage = ogImages;
    }
    if (ogVideos.length) {
      ogObject.ogVideo = ogVideos;
    }
    if (twitterImages.length) {
      ogObject.twitterImage = twitterImages;
    }
    if (twitterPlayers.length) {
      ogObject.twitterPlayer = twitterPlayers;
    }
    if (musicSongs.length) {
      ogObject.musicSong = musicSongs;
    }
  } else {
    if (ogImages.length) {
      [ogObject.ogImage] = ogImages;
    }
    if (ogVideos.length) {
      [ogObject.ogVideo] = ogVideos;
    }
    if (twitterImages.length) {
      [ogObject.twitterImage] = twitterImages;
    }
    if (twitterPlayers.length) {
      [ogObject.twitterPlayer] = twitterPlayers;
    }
    if (musicSongs.length) {
      [ogObject.musicSong] = musicSongs;
    }
  }

  return ogObject;
}

/**
 * Detect image format from URL or content type
 */
export function detectImageFormat(url: string, contentType?: string): ImageFormat | undefined {
  if (contentType) {
    const format = contentType.split("/")[1]?.toLowerCase();
    if (isValidImageFormat(format)) {
      return format as ImageFormat;
    }
  }

  // Try to detect from URL
  const urlLower = url.toLowerCase();
  const extensions: ImageFormat[] = ["jpeg", "jpg", "png", "gif", "webp", "avif", "svg", "bmp", "ico"];

  for (const ext of extensions) {
    if (urlLower.includes(`.${ext}`)) {
      return ext;
    }
  }

  return undefined;
}

/**
 * Check if format is a valid image format
 */
function isValidImageFormat(format: string | undefined): boolean {
  if (!format) {
    return false;
  }
  const validFormats: ImageFormat[] = ["jpeg", "jpg", "png", "gif", "webp", "avif", "svg", "bmp", "ico"];
  return validFormats.includes(format as ImageFormat);
}

/**
 * Parse srcset attribute into structured data
 */
export function parseSrcSet(srcset: string): ISrcSetImage[] {
  const images: ISrcSetImage[] = [];
  if (!srcset) {
    return images;
  }

  const parts = srcset.split(",").map((s) => s.trim());

  for (const part of parts) {
    const match = part.match(/^(.+?)\s+(\d+(?:\.\d+)?[wx])$/);
    if (match) {
      const [, url, descriptor] = match;
      const width = descriptor.endsWith("w")
        ? Number.parseInt(descriptor.slice(0, -1), 10)
        : Number.parseInt(descriptor.slice(0, -1), 10);

      images.push({
        url: url.trim(),
        width,
        descriptor,
      });
    }
  }

  return images.sort((a, b) => a.width - b.width);
}

/**
 * Extract enhanced image metadata
 */
export function extractImageMetadata($: CheerioAPI, element: Element): IImageMetadata {
  const $img = $(element);
  const src = $img.attr("src") || "";
  const srcset = $img.attr("srcset");
  const _sizes = $img.attr("sizes");
  const alt = $img.attr("alt");
  const title = $img.attr("title");
  const loading = $img.attr("loading");
  const width = $img.attr("width");
  const height = $img.attr("height");

  const metadata: IImageMetadata = {
    url: src,
    type: detectImageFormat(src),
    alt,
    caption: title,
    isLazyLoaded: loading === "lazy",
    isResponsive: !!srcset,
  };

  if (width) {
    metadata.width = width;
  }
  if (height) {
    metadata.height = height;
  }

  // Parse srcset if available
  if (srcset) {
    metadata.srcset = parseSrcSet(srcset);
  }

  // Calculate aspect ratio if dimensions are available
  if (width && height) {
    const w = Number.parseInt(String(width), 10);
    const h = Number.parseInt(String(height), 10);
    if (w > 0 && h > 0) {
      metadata.aspectRatio = w / h;
    }
  }

  // Check for WebP/AVIF support in picture element
  const $picture = $img.closest("picture");
  if ($picture.length > 0) {
    const sources = $picture.find("source");
    sources.each((_, source) => {
      const type = $(source).attr("type");
      if (type?.includes("webp") || type?.includes("avif")) {
        metadata.type = type.includes("webp") ? "webp" : "avif";
        const srcset = $(source).attr("srcset");
        if (srcset) {
          const parsed = parseSrcSet(srcset);
          if (parsed.length > 0) {
            metadata.url = parsed[0].url;
            if (parsed.length > 1) {
              metadata.srcset = parsed;
            }
          }
        }
      }
    });
  }

  return metadata;
}

/**
 * Extract all images with enhanced metadata
 */
export function extractAllImages($: CheerioAPI): IImageMetadata[] {
  const images: IImageMetadata[] = [];

  $("img").each((_, element) => {
    const metadata = extractImageMetadata($, element);
    if (isUrlValid(metadata.url)) {
      images.push(metadata);
    }
  });

  // Also extract images from meta tags
  $('meta[property="og:image"], meta[name="twitter:image"]').each((_, element) => {
    const content = $(element).attr("content");
    if (content && isUrlValid(content)) {
      const existing = images.find((img) => img.url === content);
      if (!existing) {
        images.push({
          url: content,
          type: detectImageFormat(content),
        });
      }
    }
  });

  return images;
}

/**
 * Extract video metadata
 */
export function extractVideoMetadata($: CheerioAPI, url?: string): IVideoMetadata | null {
  const metadata: Partial<IVideoMetadata> = {};

  // Try to get from og:video tags
  const ogVideo = $('meta[property="og:video"]').attr("content") || $('meta[property="og:video:url"]').attr("content");

  if (ogVideo) {
    metadata.url = ogVideo;
  } else if (url) {
    metadata.url = url;
  }

  // Get secure URL
  const ogVideoSecure = $('meta[property="og:video:secure_url"]').attr("content");
  if (ogVideoSecure) {
    metadata.secureUrl = ogVideoSecure;
  }

  // Get dimensions
  const width = $('meta[property="og:video:width"]').attr("content");
  const height = $('meta[property="og:video:height"]').attr("content");
  if (width) {
    metadata.width = width;
  }
  if (height) {
    metadata.height = height;
  }

  // Get type
  const type = $('meta[property="og:video:type"]').attr("content");
  if (type) {
    metadata.type = type;
  }

  // Get duration (Twitter)
  const duration = $('meta[name="twitter:player:stream:content_type"]').attr("content");
  if (duration) {
    const match = duration.match(/duration=(\d+)/);
    if (match) {
      metadata.duration = Number.parseInt(match[1], 10);
    }
  }

  // Extract thumbnails
  const thumbnails: IThumbnail[] = [];
  $('meta[property="og:image"]').each((_, element) => {
    const url = $(element).attr("content");
    if (url) {
      thumbnails.push({
        url,
        format: detectImageFormat(url),
      });
    }
  });
  if (thumbnails.length > 0) {
    metadata.thumbnails = thumbnails;
  }

  // Get embed URL
  const embedUrl =
    $('meta[property="og:video:embed_url"]').attr("content") || $('meta[name="twitter:player"]').attr("content");
  if (embedUrl) {
    metadata.embedUrl = embedUrl;
  }

  // Look for video elements in the page
  const $video = $("video").first();
  if ($video.length > 0) {
    if (!metadata.url) {
      metadata.url = $video.attr("src") || $video.find("source").first().attr("src") || "";
    }

    const poster = $video.attr("poster");
    if (poster && (!metadata.thumbnails || metadata.thumbnails.length === 0)) {
      metadata.thumbnails = [
        {
          url: poster,
          format: detectImageFormat(poster),
        },
      ];
    }

    // Try to get duration from video element
    const videoDuration = $video.attr("data-duration");
    if (videoDuration && !metadata.duration) {
      metadata.duration = Number.parseFloat(videoDuration);
    }
  }

  // Look for captions/subtitles
  const captions: ICaption[] = [];
  $("track").each((_, element) => {
    const $track = $(element);
    const src = $track.attr("src");
    const srclang = $track.attr("srclang");
    const kind = $track.attr("kind") as ICaption["kind"];

    if (src && srclang) {
      captions.push({
        language: srclang,
        url: src,
        kind: kind || "subtitles",
      });
    }
  });
  if (captions.length > 0) {
    metadata.captions = captions;
  }

  if (!metadata.url) {
    return null;
  }

  return metadata as IVideoMetadata;
}

/**
 * Find the best image from available options
 */
export function selectBestImage(images: IImageMetadata[]): IImageMetadata | null {
  if (images.length === 0) {
    return null;
  }
  if (images.length === 1) {
    return images[0];
  }

  // Prefer images with:
  // 1. Modern formats (WebP, AVIF)
  // 2. Proper dimensions (1200x630 for social media)
  // 3. Alt text
  // 4. Higher resolution

  const scored = images.map((img) => {
    let score = 0;

    // Modern format bonus
    if (img.type === "webp") {
      score += 10;
    }
    if (img.type === "avif") {
      score += 15;
    }

    // Dimension scoring
    if (img.width && img.height) {
      const width = Number.parseInt(String(img.width), 10);
      const height = Number.parseInt(String(img.height), 10);

      // Ideal social media dimensions
      if (width === 1200 && height === 630) {
        score += 20;
      } else if (width >= 1200 && height >= 630) {
        score += 15;
      } else if (width >= 600 && height >= 315) {
        score += 10;
      }

      // Aspect ratio close to 1.91:1 (Facebook's preferred)
      const aspectRatio = width / height;
      if (Math.abs(aspectRatio - 1.91) < 0.1) {
        score += 10;
      }
    }

    // Alt text bonus
    if (img.alt) {
      score += 5;
    }

    // Responsive image bonus
    if (img.isResponsive) {
      score += 5;
    }
    if (img.srcset && img.srcset.length > 0) {
      score += 5;
    }

    return { img, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].img;
}

/**
 * Extract audio metadata
 */
export function extractAudioMetadata($: CheerioAPI) {
  const metadata: {
    url?: string;
    secureUrl?: string;
    type?: string;
    duration?: number; // in seconds
  } = {};

  // Check for og:audio tags
  const ogAudio = $('meta[property="og:audio"]').attr("content") || $('meta[property="og:audio:url"]').attr("content");
  if (ogAudio) {
    metadata.url = ogAudio;
  }

  const ogAudioSecure = $('meta[property="og:audio:secure_url"]').attr("content");
  if (ogAudioSecure) {
    metadata.secureUrl = ogAudioSecure;
  }

  const ogAudioType = $('meta[property="og:audio:type"]').attr("content");
  if (ogAudioType) {
    metadata.type = ogAudioType;
  }

  // Check for audio elements
  const $audio = $("audio").first();
  if ($audio.length > 0) {
    if (!metadata.url) {
      metadata.url = $audio.attr("src") || $audio.find("source").first().attr("src");
    }

    const duration = $audio.attr("data-duration");
    if (duration) {
      metadata.duration = Number.parseFloat(duration);
    }
  }

  return Object.keys(metadata).length > 0 ? metadata : null;
}
