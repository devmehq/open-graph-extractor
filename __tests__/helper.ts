import axios from 'axios';
import { extractOpenGraph, IExtractOpenGraphOptions } from '../src';

interface IOGSOptions extends IExtractOpenGraphOptions {
  url: string;
}

export async function ogs({ url, ...opt }: IOGSOptions) {
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    },
  });
  return extractOpenGraph(data, opt);
}
