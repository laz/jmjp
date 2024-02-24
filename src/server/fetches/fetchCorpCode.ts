import DART_API_URLS from '../constants/apiUrls';
import { customFetchArrayBuffer } from '../utils/customFetch';

const fetchCorpCode = () => {
  return customFetchArrayBuffer(DART_API_URLS.CORP_CODE);
};

export default fetchCorpCode;
