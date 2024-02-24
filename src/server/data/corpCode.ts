import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';
import chalk from 'chalk';
import DART_API_URLS from '../constants/apiUrls';
import { customFetchArrayBuffer } from '../utils/customFetch';
import { urlWithParameters } from '../utils/urls';

const CORP_CODE_PATH = path.join(__dirname, process.env.CORP_CODE_PATH);

const fetchCorpCode = () => {
  const url = urlWithParameters({
    url: DART_API_URLS.CORP_CODE,
    parameters: {
      crtfc_key: process.env.DART_API_KEY,
    },
  });

  return customFetchArrayBuffer(url);
};

const writeCorpCodeToDisk = (corpCodeZipFile: AdmZip) => {
  corpCodeZipFile.extractAllTo(CORP_CODE_PATH);
};

const parseAndWriteCorpCode = async (corpCodeArrayBuffer: ArrayBuffer) => {
  const corpCodeZipFile = new AdmZip(Buffer.from(corpCodeArrayBuffer));

  writeCorpCodeToDisk(corpCodeZipFile);

  const data = corpCodeZipFile.readAsText(process.env.CORP_CODE_FILENAME, 'utf-8');
  return data;
};

/**
 * 저장된 고유번호 목록 파일 읽기
 * binary에서 변환된 상태
 */
const readCorpCodeFromDisk = () => {
  const targetFile = path.join(CORP_CODE_PATH, process.env.CORP_CODE_FILENAME);

  const file = fs.readFileSync(targetFile, {
    encoding: 'utf-8',
  });

  return file;
};

/**
 * @returns 고유번호 전체 목록
 */
export const getCorpCode = async () => {
  let corpCode: string = '';

  // 파일 존재하는지 체크
  try {
    console.log(chalk.greenBright('[CORPCODE]'), 'Reading corpcode from disk...');
    corpCode = readCorpCodeFromDisk();
    console.log(chalk.greenBright('[CORPCODE]'), 'Read corpcode from disk.');
  } catch {
    // 없다면 새로 파일 가져오기
    console.log(chalk.blueBright('[CORPCODE]'), 'Corpcode does not exist in disk. Fetching corpcode...');

    try {
      const corpCodeArrayBuffer = await fetchCorpCode();
      corpCode = await parseAndWriteCorpCode(corpCodeArrayBuffer);
      console.log(chalk.greenBright('[CORPCODE]'), 'Fetched corpcode.');
    } catch (error) {
      // TODO: 다 실패한 경우 확인 필요
      console.log(chalk.red('[CORPCODE]'), 'Fetching corpcode failed!');
      console.error(error);
    }
  }

  return corpCode;
};
