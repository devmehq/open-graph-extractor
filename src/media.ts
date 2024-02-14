import { fields } from './fields';

const mediaMapperTwitterImage = (item: any[]) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  alt: item[3],
});

const mediaMapperTwitterPlayer = (item: any[]) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  stream: item[3],
});

const mediaMapperMusicSong = (item: any[]) => ({
  url: item[0],
  track: item[1],
  disc: item[2],
});

const mediaMapper = (item: any[]) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  type: item[3],
});

const mediaSorter = (a: { url: string; width: number; height: number }, b: { url: string; width: number; height: number }) => {
  if (!(a.url && b.url)) {
    return 0;
  }

  const aRes = a.url.match(/\.(\w{2,5})$/);
  const aExt = (aRes && aRes[1].toLowerCase()) || null;
  const bRes = b.url.match(/\.(\w{2,5})$/);
  const bExt = (bRes && bRes[1].toLowerCase()) || null;

  if (aExt === 'gif' && bExt !== 'gif') {
    return -1;
  }
  if (aExt !== 'gif' && bExt === 'gif') {
    return 1;
  }
  return Math.max(b.width, b.height) - Math.max(a.width, a.height);
};

const mediaSorterMusicSong = (a: { track: number; disc: number }, b: { track: number; disc: number }) => {
  if (!(a.track && b.track)) {
    return 0;
  }
  if (a.disc > b.disc) {
    return 1;
  }
  if (a.disc < b.disc) {
    return -1;
  }
  return a.track - b.track;
};

// lodash zip replacement
const zip = (array: any[], ...args: any[]) => {
  if (array === undefined) return [];
  return array.map((value, idx) => [value, ...args.map((arr) => arr[idx])]);
};

export interface IMediaOptions {
  allMedia?: boolean;
  customMetaTags?: ConcatArray<{ multiple: boolean; property: string; fieldName: string }>;
  onlyGetOpenGraphInfo?: any;
}
export interface IOgImage {
  url?: string;
  width?: string;
  height?: string;
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
  ogType?: string;
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
  const ogImages = zip(ogObject.ogImage as IOgImage[], ogObject.ogImageWidth, ogObject.ogImageHeight, ogObject.ogImageType)
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
  const ogVideos = zip(ogObject.ogVideo as IOgVideo[], ogObject.ogVideoWidth, ogObject.ogVideoHeight, ogObject.ogVideoType)
    .map(mediaMapper)
    .sort(mediaSorter);

  // sets twitter image/width/height/type to null if one these exists
  if (ogObject.twitterImageSrc || ogObject.twitterImage || ogObject.twitterImageWidth || ogObject.twitterImageHeight || ogObject.twitterImageAlt) {
    ogObject.twitterImageSrc = ogObject.twitterImageSrc ? ogObject.twitterImageSrc : [null];
    ogObject.twitterImage = ogObject.twitterImage ? ogObject.twitterImage : ogObject.twitterImageSrc; // deafult to twitterImageSrc
    ogObject.twitterImageWidth = ogObject.twitterImageWidth ? ogObject.twitterImageWidth : [null];
    ogObject.twitterImageHeight = ogObject.twitterImageHeight ? ogObject.twitterImageHeight : [null];
    ogObject.twitterImageAlt = ogObject.twitterImageAlt ? ogObject.twitterImageAlt : [null];
  }

  // format twitter images
  const twitterImages = zip(ogObject.twitterImage as ITwitterImage[], ogObject.twitterImageWidth, ogObject.twitterImageHeight, ogObject.twitterImageAlt)
    .map(mediaMapperTwitterImage)
    .sort(mediaSorter);

  // sets twitter player/width/height/stream to null if one these exists
  if (ogObject.twitterPlayer || ogObject.twitterPlayerWidth || ogObject.twitterPlayerHeight || ogObject.twitterPlayerStream) {
    ogObject.twitterPlayer = ogObject.twitterPlayer ? ogObject.twitterPlayer : [null];
    ogObject.twitterPlayerWidth = ogObject.twitterPlayerWidth ? ogObject.twitterPlayerWidth : [null];
    ogObject.twitterPlayerHeight = ogObject.twitterPlayerHeight ? ogObject.twitterPlayerHeight : [null];
    ogObject.twitterPlayerStream = ogObject.twitterPlayerStream ? ogObject.twitterPlayerStream : [null];
  }

  // format twitter player
  const twitterPlayers = zip(ogObject.twitterPlayer as ITwitterPlayer[], ogObject.twitterPlayerWidth, ogObject.twitterPlayerHeight, ogObject.twitterPlayerStream)
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
    .filter((item) => item.multiple && item.fieldName && item.fieldName.match('(ogImage|ogVideo|twitter|musicSong).*'))
    .forEach((item) => {
      delete ogObject[item.fieldName as keyof IOgObjectMedia];
    });

  if (options?.allMedia) {
    if (ogImages.length) ogObject.ogImage = ogImages;
    if (ogVideos.length) ogObject.ogVideo = ogVideos;
    if (twitterImages.length) ogObject.twitterImage = twitterImages;
    if (twitterPlayers.length) ogObject.twitterPlayer = twitterPlayers;
    if (musicSongs.length) ogObject.musicSong = musicSongs;
  } else {
    if (ogImages.length) [ogObject.ogImage] = ogImages;
    if (ogVideos.length) [ogObject.ogVideo] = ogVideos;
    if (twitterImages.length) [ogObject.twitterImage] = twitterImages;
    if (twitterPlayers.length) [ogObject.twitterPlayer] = twitterPlayers;
    if (musicSongs.length) [ogObject.musicSong] = musicSongs;
  }

  return ogObject;
}
