import { Button, Tooltip, Popconfirm, message } from "antd";
import { LogoutOutlined } from '@ant-design/icons';
import { useAsyncCallback } from "@codixjs/fetch";
import { request } from "../request";
import { PropsWithoutRef, useCallback } from "react";
import { useAuthorizeReload } from "../authorize";

export function Exit(props: PropsWithoutRef<{}>) {
  const reload = useAuthorizeReload();
  const { execute, loading } = useAsyncCallback(async () => {
    const res = await request.delete('/logout');
    return res.data;
  })
  const submit = useCallback(() => {
    execute()
      .then(reload)
      .then(() => message.success('退出登录成功'))
      .catch(e => message.error(e.message));
  }, [execute]);
  return <Tooltip title="退出登录">
    <Popconfirm
      title="确定要退出登录？"
      onConfirm={submit}
      okText="退出"
      cancelText="留下"
      placement="bottomRight"
    ><Button icon={<LogoutOutlined />} danger loading={loading} /></Popconfirm>
  </Tooltip>
}