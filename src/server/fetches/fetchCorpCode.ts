import DART_API_URLS from '../constants/apiUrls';
import { customFetchArrayBuffer } from '../utils/customFetch';
import { urlWithParameters } from '../utils/urls';

const fetchCorpCode = () => {
  const url = urlWithParameters({
    url: DART_API_URLS.CORP_CODE,
    parameters: {
      crtfc_key: process.env.DART_API_KEY,
    },
  });

  return customFetchArrayBuffer(url);
};

export default fetchCorpCode;
