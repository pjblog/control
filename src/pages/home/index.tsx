import React, { Suspense } from 'react';
import styles from './index.module.less';
import { Col, Row } from 'antd';
import { Disk } from './disk';
import { Loading } from '../../components';

import { ArticleStatistic } from './article-statistic';
import { UserStatistic } from './user-statistic';
import { CommentStatistic } from './comment-statistic';
import { ModuleStatistic } from './module-statistic';

export default function HomePage() {
  return <Row gutter={[24, 24]}>
    <Col span={6}>
      <Suspense fallback={<Loading />}>
        <ArticleStatistic />
      </Suspense>
    </Col>
    <Col span={6}>
      <Suspense fallback={<Loading />}>
        <UserStatistic />
      </Suspense>
    </Col>
    <Col span={6}>
      <Suspense fallback={<Loading />}>
        <CommentStatistic />
      </Suspense>
    </Col>
    <Col span={6}>
    <Suspense fallback={<Loading />}>
        <ModuleStatistic />
      </Suspense>
    </Col>
    <Col span={24}>
      <Suspense fallback={<Loading />}>
        <Disk />
      </Suspense>
    </Col>
  </Row>
}