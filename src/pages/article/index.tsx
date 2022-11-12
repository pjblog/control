import React, { Fragment, useState, Suspense } from 'react';
import styles from './index.module.less';
import { getArticles, useBaseRequestConfigs } from '../../service';
import { numberic } from '../../utils';
import { useRequestQuery } from '@codixjs/codix';
import { useAsync } from '@codixjs/fetch';
import { Article } from './single';
import { Flex, Loading, Categories } from '../../components';
import { Col, Input, Row, Pagination, Spin, Empty, Space, Typography } from 'antd';
import { usePath } from '../../hooks';

export default function ArticlePage() {
  const configs = useBaseRequestConfigs();
  const path = usePath('ARTICLE');
  const [category, setCategory] = useState(-1);
  const [keyword, setkeyword] = useState('');
  const page = Number(useRequestQuery('page', numberic(1)));
  const size = Number(useRequestQuery('size', numberic(10)));
  const { data: { list, total }, loading, execute } = useAsync('articles', () => getArticles({
    category, keyword, page, size,
  }, configs), [category, keyword, page, size])
  return <Fragment>
    <div className={styles.conditions}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Typography.Paragraph style={{ fontWeight: 500 }}>分类筛选</Typography.Paragraph>
          <Suspense fallback={<Loading />}>
            <Categories value={category} setValue={setCategory} />
          </Suspense>
        </Col>
        <Col span={24}>
          <Space>
            <Pagination total={total} current={page} pageSize={size} onChange={(a, b) => path.redirect({}, {
              page: a + '',
              size: b + '',
            })} />
            <Flex gap={16}>
              <Input.Search onSearch={e => setkeyword(e)} style={{ width: 300 }} enterButton="搜索" placeholder="请输入搜索关键字" />
            </Flex>
          </Space>
        </Col>
      </Row>
    </div>
    <div className={styles.articles}>
      <Spin spinning={loading}>
        {!list.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        {!!list.length && list.map(article => <Article key={article.id} {...article} reload={execute} />)}
      </Spin>
    </div>
  </Fragment>
}