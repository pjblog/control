import { useGetAsync } from '@pjblog/control-hooks';
import { Divider } from 'antd';
import { Box } from './box';

interface IResponse {
  total: number,
  forbidens: number,
  admins: number,
}

export function User() {
  const { data, execute, loading } = useGetAsync<IResponse>({
    id: 'home:user',
    url: '/-/user/total',
  })
  return <Box title="用户数" value={data.total} refresh={execute} loading={loading}>
    <Box.Item>
      管理员 {data.admins} 人
      <Divider type="vertical" />
      禁止 {data.forbidens} 人
    </Box.Item>
  </Box>
}