import { fetchFinancialStatement } from '@/server/fetches/fetchFinancialStatement';

const Page = async () => {
  const fs = await fetchFinancialStatement({
    corpCode: '00671978', // 그리티,
    bsnsYear: '2023',
    reprtCode: '11013',
    fsDiv: 'OFS',
  });

  console.log('@@', fs);

  return <div>yee</div>;
};

export default Page;
