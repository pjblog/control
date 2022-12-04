import { Menus } from './menus';
import { Breadcrumb, Space, Typography } from 'antd';
import { FundProjectionScreenOutlined } from '@ant-design/icons';
import { useContext, useMemo } from "react";
import { Path, RequestContext, useRequestPath } from "@codixjs/codix";

export function Position() {
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
  return <Breadcrumb>
    <Breadcrumb.Item>
      <Space>
        <FundProjectionScreenOutlined />
        <span>控制台</span>
      </Space>
    </Breadcrumb.Item>
    <Breadcrumb.Item>
      <Typography.Link onClick={() => pathes[current.code].redirect()}>{current.label}</Typography.Link>
    </Breadcrumb.Item>
  </Breadcrumb>
}