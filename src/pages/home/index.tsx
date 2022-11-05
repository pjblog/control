import React, { Suspense } from 'react';
import { useAsync } from '@codixjs/fetch';
import styles from './index.module.less';
import { Button, Col, Row } from 'antd';
import { Disk } from './disk';
import { getDiskInfo, useBaseRequestConfigs } from '../../service';
import { Loading } from '../../components';
export default function HomePage() {
  return <Row gutter={[24, 24]}>
    <Col span={24}>
      <Suspense fallback={<Loading />}>
        <Disk />
      </Suspense>
    </Col>
  </Row>
}