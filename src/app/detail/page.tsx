import BS from '@/components/BS';
import { getFinancialStatements } from '@/server/data/financialStatement';
import { Sheet, Grid } from '@mui/joy';

const Page = async () => {
  const fs = await getFinancialStatements({
    corpCode: '00671978', // 그리티,
    bsnsYear: '2023',
    reprtCode: '11013',
    fsDiv: 'OFS',
  });

  if (!fs) return <span>oops...</span>;

  return (
    <main>
      <Sheet variant="soft" sx={{ borderRadius: 'lg', p: 10 }}>
        <Grid container spacing={20} sx={{ flexGrow: 1 }}>
          <Grid xs={6}>
            <BS items={fs.bs} explained={false} />
          </Grid>
          <Grid xs={6}>
            <BS items={fs.bs} explained={true} />
          </Grid>
        </Grid>
      </Sheet>
    </main>
  );
};

export default Page;
