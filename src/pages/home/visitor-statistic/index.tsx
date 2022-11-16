import { useAsync } from '@codixjs/fetch';
import React from 'react';
import { getVisitorStatistic, useBaseRequestConfigs } from '../../../service';
import { Box } from '../box';

export function VisitorStatistic() {
  const configs = useBaseRequestConfigs();
  const { data, loading } = useAsync('module:statistic', () => getVisitorStatistic(configs));
  return <Box title="访客数" value={data.visitors} loading={loading}>
    当前在线 {data.onlines} 人
  </Box>
}