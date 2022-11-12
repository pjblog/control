import React, { Fragment, useCallback, useContext, useMemo } from 'react';
import styles from './index.module.less';
import classnames from 'classnames';
import { Typography, Breadcrumb, Affix, Button, Tooltip, Space, ButtonProps, message, Popconfirm } from 'antd';
import { Flex, CopyRight } from '../../components';
import { useRequestPath, RequestContext, Path } from '@codixjs/codix';
import { menus } from '../menus';
import { HomeOutlined, PlusOutlined, ChromeOutlined, LogoutOutlined, ReadOutlined } from '@ant-design/icons';
import { usePath } from '../../hooks';
import { useAsyncCallback } from '@codixjs/fetch';
import { doLogout } from '../../service';

export function Content(props: React.PropsWithChildren<{ title?: string, wide?: boolean }>) {
  const path = useRequestPath<string>();
  const addNewArticle = usePath('NEW_ARTICLE');
  const pathes = useContext(RequestContext).pathes as Record<string, Path>;
  const { loading, execute } = useAsyncCallback(doLogout);
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
  const logout = useCallback(() => {
    execute()
      .then(() => window.location.reload())
      .catch(e => message.error(e.message));
  }, [execute])
  if (props.wide) return props.children as JSX.Element;
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
        <Space>
          <Tooltip title="新建文章">
            <Abutton onClick={() => addNewArticle.redirect()}><PlusOutlined /></Abutton>
          </Tooltip>
          <Tooltip title="官网 / 论坛">
            <Abutton>
              <Typography.Link href="https://www.pjhome.net" target="_blank">
                <ChromeOutlined />
              </Typography.Link>
            </Abutton>
          </Tooltip>
          <Tooltip title="文档">
            <Abutton>
              <Typography.Link href="https://docs.pjhome.net" target="_blank">
                <ReadOutlined />
              </Typography.Link>
            </Abutton>
          </Tooltip>
          
          <Tooltip title="退出登录">
            <Popconfirm
              title="确定要退出登录？"
              onConfirm={logout}
              okText="退出"
              cancelText="留下"
              placement="leftBottom"
            >
              <Abutton loading={loading}><LogoutOutlined /></Abutton>
            </Popconfirm>
          </Tooltip>
        </Space>
      </Flex>
    </Affix>
    <div className={styles.content}>{props.children}</div>
    <CopyRight />
  </div>
}

function Abutton(props: React.PropsWithChildren<ButtonProps>) {
  return <Button {...props} type="text" className={styles.actionButton}>
    {props.children}
  </Button>
}