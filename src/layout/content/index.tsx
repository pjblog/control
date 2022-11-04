import React, { Fragment, useContext, useMemo } from 'react';
import styles from './index.module.less';
import classnames from 'classnames';
import { Typography, Breadcrumb, Affix, Button, Tooltip } from 'antd';
import { Flex, CopyRight } from '../../components';
import { useRequestPath, RequestContext, Path } from '@codixjs/codix';
import { menus } from '../menus';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { usePath } from '../../hooks';

export function Content(props: React.PropsWithChildren<{ title?: string, wide?: boolean }>) {
  const path = useRequestPath<string>();
  const addNewArticle = usePath('NEW_ARTICLE');
  const pathes = useContext(RequestContext).pathes as Record<string, Path>;
  const current = useMemo(() => {
    const menu = menus.find(menu => {
      const url = pathes[menu.code].toString(menu.props);
      return url !== '/'
        ? path.startsWith(url)
        : url === path;
    });
    if (!menu) return;
    return menu.label;
  }, [path])
  const currentArray = useMemo(() => {
    return [current, props.title].filter(Boolean);
  }, [current, props.title]);
  if (props.wide) return props.children;
  return <div className={classnames(styles.container, {
    [styles.wide]: !!props.wide,
  })}>
    <Affix offsetTop={0}>
      <Flex className={styles.header} block align="between" valign="middle">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Typography.Link onClick={() => pathes?.HOME.redirect()}><HomeOutlined /> PJBlog Control</Typography.Link>
          </Breadcrumb.Item>
          {
            currentArray.map(menu => {
              return <Breadcrumb.Item key={menu}>{menu}</Breadcrumb.Item>
            })
          }
        </Breadcrumb>
        <span>
          <Tooltip title="新建文章">
            <Button type="primary" shape="circle" size="small" icon={<PlusOutlined />} onClick={() => addNewArticle.redirect()} />
          </Tooltip>
        </span>
      </Flex>
    </Affix>
    <div className={styles.content}>{props.children}</div>
    <CopyRight />
  </div>
}