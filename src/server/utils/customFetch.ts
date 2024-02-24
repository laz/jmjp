import camelcaseKeys from 'camelcase-keys';

const _fetch = (url: string) => {
  return fetch(url, {
    cache: 'no-cache', // 응답 파일 크기때문에 캐싱 불가능
  });
};

export const customFetch = async <T extends Record<string, unknown>>(url: string) => {
  const res = await _fetch(url);

  const data = (await res.json()) as T;
  return camelcaseKeys(data, { deep: true });
};

export const customFetchArrayBuffer = async (url: string) => {
  const res = await _fetch(url);

  const data = await res.arrayBuffer();
  return data;
};
