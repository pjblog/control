import { useAsync } from '@codixjs/fetch';
import { Divider } from 'antd';
import React from 'react';
import { getModuleStatistic, useBaseRequestConfigs } from '../../../service';
import { Box } from '../box';

export function ModuleStatistic() {
  const configs = useBaseRequestConfigs();
  const { data, loading } = useAsync('module:statistic', () => getModuleStatistic(configs));
  return <Box title="模块数" value={data.themes + data.plugins} loading={loading}>
    主题 {data.themes} 个
    <Divider type="vertical" />
    插件 {data.plugins} 个
  </Box>
}