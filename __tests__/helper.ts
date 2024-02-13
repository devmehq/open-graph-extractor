import axios from 'axios';
import { extractOpenGraph, IExtractOpenGraphOptions } from '../src';

interface IOGSOptions extends IExtractOpenGraphOptions {
  url: string;
}

export async function ogs({ url, ...opt }: IOGSOptions) {
  const { data } = await axios.get(url);
  return extractOpenGraph(data, opt);
}
