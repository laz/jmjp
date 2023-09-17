const customFetch = async (url: string, type: 'json' | 'blob' = 'json') => {
  const res = await fetch(url, { cache: 'no-cache' });
  const data = await (type === 'blob' ? res.blob() : res.json());

  return data;
};

export const fetchCorpCode = async () => {
  const API_KEY = process.env.API_KEY;
  // TODO: URL 분리
  const URL = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${API_KEY}`;

  return customFetch(URL, 'blob');
};
