import { useAsync } from '@codixjs/fetch';
import React from 'react';
import { getArticleStatistic, useBaseRequestConfigs } from '../../../service';
import { Box } from '../box';

export function ArticleStatistic() {
  const configs = useBaseRequestConfigs();
  const { data, loading } = useAsync('article:statistic', () => getArticleStatistic(configs));
  return <Box title="文章数" value={data.total} loading={loading}>
    回收站 {data.trashes} 篇
  </Box>
}