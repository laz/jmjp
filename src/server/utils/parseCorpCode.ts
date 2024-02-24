import fs from 'node:fs';
import path from 'node:path';

import AdmZip from 'adm-zip';
import fetchCorpCode from '../fetches/fetchCorpCode';

/**
 * 고유번호 전체 목록 파일 저장
 * TODO: 에러 처리?
 */
const writeCorpCodeToDisk = (corpCodeZipFile: AdmZip) => {
  // ...data/${process.env.CORP_CODE_FILENAME}
  const targetPath = path.join(__dirname, '../../../data');
  corpCodeZipFile.extractAllTo(targetPath);
};

/**
 * https://opendart.fss.or.kr/api/corpCode.xml
 * 고유번호 전체 파일 저장 및 문자열로 리턴
 */
const parseCorpCode = async (corpCodeArrayBuffer: ArrayBuffer) => {
  const corpCodeZipFile = new AdmZip(Buffer.from(corpCodeArrayBuffer));

  writeCorpCodeToDisk(corpCodeZipFile);

  const data = corpCodeZipFile.readAsText(process.env.CORP_CODE_FILENAME ?? '', 'utf-8');
  return data;
};

/**
 * 저장된 고유번호 목록 파일 읽기
 * binary에서 변환된 상태
 */
const readCorpCodeFromDisk = () => {
  // TODO: 위치 변경
  const targetFile = path.join(__dirname, '../../../data', process.env.CORP_CODE_FILENAME ?? '');

  const file = fs.readFileSync(targetFile, {
    encoding: 'utf-8',
  });

  return file;
};

/**
 * @returns 고유번호 전체 목록
 */
export const getCorpCode = async () => {
  let file: string = '';

  // 파일 존재하는지 체크
  try {
    file = readCorpCodeFromDisk();
  } catch {
    // TODO: chalk
    console.info('Corp code file does not exists.');

    // 없다면 새로 파일 가져오기
    try {
      const corpCodeArrayBuffer = await fetchCorpCode();
      const corpCode = await parseCorpCode(corpCodeArrayBuffer);
      // TODO:  파일 디스크에 저장

      file = corpCode;
    } catch (error) {
      console.info('Fetching corp code failed.');
      console.error(error);

      // TODO: 다 실패한 경우 어떻게 처리할까?
    }
  }

  return file;
};
