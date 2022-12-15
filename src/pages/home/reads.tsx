import { useGetAsync } from '@pjblog/control-hooks';
import { Box } from './box';

interface IResponse {
  dbcount: number,
  memocount: number,
}

export function Reads() {
  const { data, loading } = useGetAsync<IResponse>({
    id: 'home:read',
    url: '/-/article/reads',
  })
  return <Box title="阅读量" value={data.dbcount} loading={loading}>
    <Box.Item>
      内存存量 {data.memocount} 次
    </Box.Item>
  </Box>
}