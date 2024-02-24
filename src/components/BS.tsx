import { FinancialStatementItem } from '@/server/fetches/fetchFinancialStatement';
import { Table, Typography } from '@mui/joy';

interface Props {
  items: FinancialStatementItem[];
  explained: boolean;
}

/**
 * 재무상태표
 */
const BS = ({ items, explained }: Props) => {
  const caption = items[0].sjNm;
  const current = items[0].thstrmNm;
  const prev = items[0].frmtrmNm;

  return (
    <Table variant="outlined" borderAxis="bothBetween" hoverRow>
      <caption>{`${caption} ${explained ? 'explained' : ''}`}</caption>
      <thead>
        <tr>
          <th></th>
          <th>{current}</th>
          <th>{prev}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.ord}>
            <th scope="row">{`${item.accountNm} ${explained ? 'explained' : ''}`}</th>
            <td>
              <Typography noWrap>{item.thstrmAmount}</Typography>
            </td>
            <td>
              <Typography noWrap>{item.frmtrmAmount}</Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BS;
