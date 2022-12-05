import { Menus } from './menus';
import { Breadcrumb, Space, Typography } from 'antd';
import { FundProjectionScreenOutlined } from '@ant-design/icons';
import { PropsWithoutRef, useCallback, useContext, useMemo } from "react";
import { Path, redirect, RequestContext, useRequestPath } from "@codixjs/codix";

export function Position(props: PropsWithoutRef<{ label?: string }>) {
  const path = useRequestPath<string>();
  const pathes = useContext(RequestContext).pathes as Record<string, Path>;
  const current = useMemo(() =>{
    const menu = Menus.find(menu => {
      const url = pathes[menu.code].toString();
      return url !== '/'
        ? path.startsWith(url)
        : url === path;
    });
    if (!menu) return;
    return menu;
  }, [path, pathes]);
  const currentHandler = useCallback(() => {
    if (!current) return;
    const url = pathes[current.code].toString();
    if (url !== path) {
      redirect(url);
    }
  }, [current, pathes]);
  return <Breadcrumb>
    <Breadcrumb.Item>
      <Space>
        <FundProjectionScreenOutlined />
        <span>控制台</span>
      </Space>
    </Breadcrumb.Item>
    <Breadcrumb.Item>
      <Typography.Link onClick={currentHandler}>{current.label}</Typography.Link>
    </Breadcrumb.Item>
    {!!props.label && <Breadcrumb.Item>{props.label}</Breadcrumb.Item>}
  </Breadcrumb>
}