import { FsDiv, ReprtCode } from '@/types/dart';
import { customFetch } from '../utils/customFetch';

const API_KEY = process.env.API_KEY;

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

interface FinancialStatementItem {
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

export const fetchFinancialStatement = async ({ corpCode, bsnsYear, reprtCode, fsDiv }: FinancialStatementParams) => {
  const URL = `https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json?crtfc_key=${API_KEY}&corp_code=${corpCode}&bsns_year=${bsnsYear}&reprt_code=${reprtCode}&fs_div=${fsDiv}`;

  const data = await customFetch<FinancialStatementResponse>(URL);
  return parseFinancialStatement(data);
};

/**
 * 재무제표 구분 별로 쪼개기
 */
const parseFinancialStatement = (fs: FinancialStatementResponse) => {
  const list = fs.list;

  return {
    bs: [list.filter((item) => item.sjDiv === 'BS')],
    is: [list.filter((item) => item.sjDiv === 'IS')],
    cis: [list.filter((item) => item.sjDiv === 'CIS')],
    cf: [list.filter((item) => item.sjDiv === 'CF')],
    sce: [list.filter((item) => item.sjDiv === 'SCE')],
  };
};
