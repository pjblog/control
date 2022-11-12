import { useAsync } from '@codixjs/fetch';
import React from 'react';
import { getCommentStatistic, useBaseRequestConfigs } from '../../../service';
import { Box } from '../box';

export function CommentStatistic() {
  const configs = useBaseRequestConfigs();
  const { data, loading } = useAsync('comment:statistic', () => getCommentStatistic(configs));
  return <Box title="评论数" value={data.total} loading={loading}>
    回复 {data.replies} 条
  </Box>
}