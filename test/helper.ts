import axios from 'axios';
import { extractOpenGraph } from '../src';

export async function ogs({ url, ...opt }: any) {
  return axios.get(url).then((res) => {
    return extractOpenGraph(res.data, opt);
  });
}
