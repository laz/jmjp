import { customFetchArrayBuffer } from '../utils/customFetch';

const API_KEY = process.env.API_KEY;

const fetchCorpCode = async () => {
  // TODO: URL 분리
  const URL = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${API_KEY}`;

  return customFetchArrayBuffer(URL);
};

export default fetchCorpCode;
