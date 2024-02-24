const DART_API_KEY = process.env.DART_API_KEY;
const DART_DOMAIN = 'https://opendart.fss.or.kr';

const DART_API_URLS = {
  CORP_CODE: `${DART_DOMAIN}/api/corpCode.xml`,
  FINANCIAL_STATEMENT: `${DART_DOMAIN}/api/fnlttSinglAcntAll.json`,
};

export default DART_API_URLS;
