import styles from './index.module.less';
import { Suspense } from 'react';
import { Loading } from '@pjblog/control-hooks';
import { Row, Col } from 'antd';
import { Article } from './article';
import { User } from './user';
import { Reads } from './reads';
import { Quick } from './quick';
import { Versions } from './versions';
import { News } from './news';
import { Activity } from './activity';
import { Changes } from './changes';
import { Hot } from './hot';
import { Themes } from './themes';
import { Plugins } from './plugins';
export default function Page() {
  return <div className={styles.container}>
    <Row gutter={[24, 24]}>
      <Col span={16}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Suspense fallback={<Loading />}><Article /></Suspense>
          </Col>
          <Col span={8}>
            <Suspense fallback={<Loading />}><User /></Suspense>
          </Col>
          <Col span={8}>
            <Suspense fallback={<Loading />}><Reads /></Suspense>
          </Col>
          <Col span={8}>
            <Quick />
          </Col>
          <Col span={16}>
            <Suspense fallback={<Loading />}><Versions /></Suspense>
          </Col>
          <Col span={12}>
            <Suspense fallback={<Loading />}><News /></Suspense>
          </Col>
          <Col span={12}>
            <Suspense fallback={<Loading />}><Hot /></Suspense>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}><Activity /></Col>
          <Col span={24}><Changes /></Col>
          <Col span={24}><Themes /></Col>
          <Col span={24}><Plugins /></Col>
        </Row>
      </Col>
    </Row>
  </div>
}