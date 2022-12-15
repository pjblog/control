import { useGetAsync } from '@pjblog/control-hooks';
import { Box } from './box';

interface IResponse {
  total: number,
  trashes: number,
}

export function Article() {
  const { data, execute, loading } = useGetAsync<IResponse>({
    id: 'home:article',
    url: '/-/article/total',
  })
  return <Box title="文章数" value={data.total} refresh={execute} loading={loading}>
    <Box.Item>
      回收站 {data.trashes} 篇
    </Box.Item>
  </Box>
}