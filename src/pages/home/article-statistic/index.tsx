import { useAsync } from '@codixjs/fetch';
import { Divider } from 'antd';
import React from 'react';
import { getArticleStatistic, useBaseRequestConfigs } from '../../../service';
import { Box } from '../box';

export function ArticleStatistic() {
  const configs = useBaseRequestConfigs();
  const { data, loading } = useAsync('article:statistic', () => getArticleStatistic(configs));
  return <Box title="文章数" value={data.total} loading={loading}>
    阅读量 {data.reads}次
    <Divider type="vertical" />
    回收站 {data.trashes} 篇
  </Box>
}