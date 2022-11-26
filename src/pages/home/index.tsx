import { Suspense } from 'react';
import styles from './index.module.less';
import { Card, Col, Row } from 'antd';
import { Disk } from './disk';
import { Flex, Loading } from '../../components';
import { PlusOutlined, CommentOutlined, WindowsOutlined } from '@ant-design/icons';

import { ArticleStatistic } from './article-statistic';
import { UserStatistic } from './user-statistic';
import { CommentStatistic } from './comment-statistic';
import { VisitorStatistic } from './visitor-statistic';
import { Versions } from './versions';
import { HotArticles } from './hot-articles';
import { CommentRecently } from './comment-recently';
import { ActivedUsers } from './user-active';
import { DaysStatistic } from './days-statistics';
import { usePath } from '../../hooks';

export default function HomePage() {
  const ARTICLE = usePath('NEW_ARTICLE');
  const COMMENT = usePath('COMMENT');
  const MODULE = usePath('MODULE');
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
        <VisitorStatistic />
      </Suspense>
    </Col>
    
    <Col span={8}>
      <Card title="快捷方式" size="small">
        <Row gutter={[8, 8]}>
          <Col span={8}>
            <Flex direction="vertical" className={styles.quickMemus} align="center" valign="middle" onClick={() => ARTICLE.redirect()}>
              <PlusOutlined className={styles.icon} />
              <span className={styles.name}>写文章</span>
            </Flex>
          </Col>
          <Col span={8}>
            <Flex direction="vertical" className={styles.quickMemus} align="center" valign="middle" onClick={() => COMMENT.redirect()}>
              <CommentOutlined className={styles.icon} />
              <span className={styles.name}>看评论</span>
            </Flex>
          </Col>
          <Col span={8}>
            <Flex direction="vertical" className={styles.quickMemus} align="center" valign="middle" onClick={() => MODULE.redirect()}>
              <WindowsOutlined className={styles.icon} />
              <span className={styles.name}>装模块</span>
            </Flex>
          </Col>
        </Row>
      </Card>
    </Col>
    <Col span={16}>
      <Suspense fallback={<Loading />}>
        <Versions />
      </Suspense>
    </Col>
    <Col span={8}>
      <Card title="7日内访客趋势" size="small">
        <Suspense fallback={<Loading />}>
          <DaysStatistic day={7} />
        </Suspense>
      </Card>
    </Col>
    <Col span={16}>
      <Suspense fallback={<Loading />}>
        <Disk />
      </Suspense>
    </Col>

    <Col span={6}>
      <Card title="官方资讯" size="small">
        暂无数据，敬请期待！
      </Card>
    </Col>

    <Col span={6}>
      <Card title="最高访问量文章" size="small">
        <Suspense fallback={<Loading />}>
          <HotArticles size={5} />
        </Suspense>
      </Card>
    </Col>

    <Col span={6}>
      <Card title="最新评论" size="small">
        <Suspense fallback={<Loading />}>
          <CommentRecently size={10} />
        </Suspense>
      </Card>
    </Col>

    <Col span={6}>
      <Card title="活跃用户" size="small">
        <Suspense fallback={<Loading />}>
          <ActivedUsers size={20} />
        </Suspense>
      </Card>
    </Col>
  </Row>
}