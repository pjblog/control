import { useAsync } from '@codixjs/fetch';
import { Divider } from 'antd';
import React from 'react';
import { getUserStatistic, useBaseRequestConfigs } from '../../../service';
import { Box } from '../box';

export function UserStatistic() {
  const configs = useBaseRequestConfigs();
  const { data, loading } = useAsync('user:statistic', () => getUserStatistic(configs));
  return <Box title="用户数" value={data.total} loading={loading}>
    管理员 {data.admins} 个
    <Divider type="vertical" />
    封禁 {data.forbidens} 个
  </Box>
}