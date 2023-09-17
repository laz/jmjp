import fs from 'node:fs';
import path from 'node:path';
import { fetchCorpCode } from '../fetches';

/**
 * https://opendart.fss.or.kr/api/corpCode.xml
 * 고유번호 전체 목록 받아서 파일로 저장
 * TODO: better name
 */
const parseCorpCode = async (corpCodeInBinary: Blob) => {
  // TODO: binary -> text
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
  let file;

  // 파일 존재하는지 체크
  try {
    file = readCorpCodeFromDisk();
  } catch {
    // TODO: chalk
    console.info('Corp code file does not exists.');

    // 없다면 새로 파일 가져오기
    try {
      const corpCodeInBinary = await fetchCorpCode();
      const corpCode = await parseCorpCode(corpCodeInBinary);
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
