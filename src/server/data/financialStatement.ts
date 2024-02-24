import { FsDiv, ReprtCode } from '@/types/dart';
import { customFetch } from '../utils/customFetch';
import { urlWithParameters } from '../utils/urls';
import DART_API_URLS from '../constants/apiUrls';
import chalk from 'chalk';
import path from 'node:path';
import fs from 'node:fs';

interface FinancialStatementParams {
  /** 고유번호 */
  corpCode: string;
  /** 2015년 이후 */
  bsnsYear: string;
  /** 보고서 코드 */
  reprtCode: ReprtCode;
  /** 개별/연결 구분 */
  fsDiv: FsDiv;
}

export interface FinancialStatementItem {
  /** 접수번호 */
  recptNo: string;
  /** 보고서 코드 */
  reprtCode: ReprtCode;
  /** 사업 연도 */
  bsnsYear: string;
  /** 고유 번호 */
  corpCode: string;
  /** 재무제표구분 */
  sjDiv:
    | 'BS' // 재무상태표
    | 'IS' // 손익계산서
    | 'CIS' // 포괄손익계산서
    | 'CF' // 현금흐름표
    | 'SCE'; // 자본변동표
  /** 재무제표구분명 */
  sjNm: '재무상태표' | '손익계산서' | '포괄손익계산서' | '현금흐름표' | '자본변동표';
  /** 계정 ID */
  accountId: string;
  /** 계정명칭 (ex. '자본총계', '무형자산') */
  accountNm: string;
  /** 당기명 (ex. '제 25 기 1분기말')*/
  thstrmNm: string;
  /** 당기금액 */
  thstrmAmount: string;
  /** 당기누적금액 */
  thstrmAddAmount: string;
  /** 전기명 (ex. '제 25 기 1분기말')*/
  frmtrmNm: string;
  /** 전기금액 */
  frmtrmAmount: string;
  /** 전기명 (분/반기) */
  frmtrmQNm: string;
  /** 전기금액 (분/반기) */
  frmtrmQAmount: string;
  /** 전기누적금액 */
  frmtrmAddAmount: string;
  /** 전전기명 */
  bfefrmtrmNm: string;
  /** 전전기금액 */
  bfefrmtrmAmount: string;
  /** 계졍과목 정렬순서 */
  ord: number;
  /** 통화 단위 */
  currency: string;
}

type FinancialStatementResponse = {
  status: number;
  message: string;
  list: FinancialStatementItem[];
};

interface FinancialStatements {
  bs: FinancialStatementItem[];
  is: FinancialStatementItem[];
  cis: FinancialStatementItem[];
  cf: FinancialStatementItem[];
  sce: FinancialStatementItem[];
}

const FINANCIAL_STATEMENT_PATH = path.join(__dirname, process.env.FINANCIAL_STATEMENT_PATH);

const createFinancialStatementsFilename = ({ corpCode, bsnsYear, reprtCode, fsDiv }: FinancialStatementParams) => {
  return `fs_${corpCode}_${bsnsYear}_${reprtCode}_${fsDiv}.json`;
};

/**
 * 재무제표 구분 별로 쪼개기
 */
const parseFinancialStatementsResponse = (fs: FinancialStatementResponse): FinancialStatements => {
  const list = fs.list;

  return {
    bs: list.filter((item) => item.sjDiv === 'BS'),
    is: list.filter((item) => item.sjDiv === 'IS'),
    cis: list.filter((item) => item.sjDiv === 'CIS'),
    cf: list.filter((item) => item.sjDiv === 'CF'),
    sce: list.filter((item) => item.sjDiv === 'SCE'),
  };
};

export const fetchFinancialStatements = async ({ corpCode, bsnsYear, reprtCode, fsDiv }: FinancialStatementParams) => {
  const url = urlWithParameters({
    url: DART_API_URLS.FINANCIAL_STATEMENT,
    parameters: {
      crtfc_key: process.env.DART_API_KEY,
      corp_code: corpCode,
      bsns_year: bsnsYear,
      reprt_code: reprtCode,
      fs_div: fsDiv,
    },
  });

  const data = await customFetch<FinancialStatementResponse>(url);
  return parseFinancialStatementsResponse(data);
};

const readFinancialStatementsFromDisk = (filename: string) => {
  const targetFile = path.join(FINANCIAL_STATEMENT_PATH, filename);

  const file = fs.readFileSync(targetFile, { encoding: 'utf-8' });
  const data = JSON.parse(file) as FinancialStatements;
  return data;
};

const writeFinancialStatementsToDisk = (financialStatements: FinancialStatements, filename: string) => {
  const data = JSON.stringify(financialStatements, null, 2);
  fs.writeFileSync(`${FINANCIAL_STATEMENT_PATH}/${filename}`, data);
};

/**
 * @returns 고유번호 전체 목록
 */
export const getFinancialStatements = async (params: FinancialStatementParams) => {
  let financialStatements: FinancialStatements | undefined = undefined;

  const filename = createFinancialStatementsFilename(params);

  // 파일 존재하는지 체크
  try {
    console.log(chalk.greenBright('[FINANCECIAL_STATEMENT]'), 'Reading financial statement from disk...');
    financialStatements = readFinancialStatementsFromDisk(filename);
    console.log(chalk.greenBright('[FINANCECIAL_STATEMENT]'), 'Read financial statement from disk.');
  } catch {
    // 없다면 새로 파일 가져오기
    console.log(chalk.blueBright('[FINANCECIAL_STATEMENT]'), 'Financial statement does not exist in disk. Fetching financial statement...');

    try {
      financialStatements = await fetchFinancialStatements(params);
      writeFinancialStatementsToDisk(financialStatements, filename);
      console.log(chalk.greenBright('[FINANCECIAL_STATEMENT]'), 'Fetched financial statement.');
    } catch (error) {
      // TODO: 다 실패한 경우 확인 필요
      console.log(chalk.red('[FINANCECIAL_STATEMENT]'), 'Fetching financial statement failed!');
      console.error(error);
    }
  }

  return financialStatements;
};
