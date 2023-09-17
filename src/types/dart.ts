/** 보고서 코드 */
// TODO: 이거 좀 직관적이지 않아서 convert 하는 함수 있으면 좋을듯
export type ReprtCode =
  | '11013' // 1분기
  | '11012' // 반기
  | '11014' // 3분기
  | '11011'; // 사업보고서

/** 개별/연결 구분 */
export type FsDiv =
  | 'OFS' // 재무제표
  | 'CFS'; // 연결재무제표