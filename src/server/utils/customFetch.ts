import camelcaseKeys from 'camelcase-keys';

const _fetch = (url: string) => {
  // TODO: case conversion
  return fetch(url, {
    cache: 'no-cache',
  });
};

export const customFetch = async <T extends Record<string, unknown>>(url: string) => {
  const res = await _fetch(url);

  const data = (await res.json()) as T;
  return camelcaseKeys(data, { deep: true });
};

export const customFetchArrayBuffer = async (url: string) => {
  const res = await fetch(url);

  const data = await res.arrayBuffer();
  return data;
};
