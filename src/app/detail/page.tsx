import { fetchFinancialStatement } from '@/server/fetches/fetchFinancialStatement';

const Page = async () => {
  const fs = await fetchFinancialStatement({
    corpCode: '00671978', // 그리티,
    bsnsYear: '2023',
    reprtCode: '11013',
    fsDiv: 'OFS',
  });

  // 재무상태표
  return (
    <div>
      <table border={2}>
        {fs.bs.map((item) => (
          <tr key={item.ord}>
            <td>{item.accountNm}</td>
            <td>{item.thstrmAmount}</td>
            <td>{item.frmtrmAmount}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Page;
