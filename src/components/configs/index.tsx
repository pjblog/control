import { Fragment, PropsWithoutRef, useCallback, useEffect, useState } from "react";
import { TWidgetConfigProp } from "../some/types";
import { Button, Drawer, message } from 'antd';
import { Fields } from '../fields';
import { useAsyncCallback } from "@codixjs/fetch";
import { setModuleConfigs } from "../../service";

export function Configs<T extends object = object>(props: PropsWithoutRef<{
  disabled?: boolean,
  name: string,
  rules: TWidgetConfigProp<T>[],
  value: T
}>) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(props.value);
  const transform = useCallback((e: T) => setData(e), [setData]);
  const { loading, execute } = useAsyncCallback(setModuleConfigs);
  const submit = useCallback(() => {
    execute(props.name, data)
    .then(() => message.success('更新成功'))
    .catch(e => message.error(e.message));
  }, [props.name, execute, data]);
  useEffect(() => setData(props.value), [props.value]);
  if (!props.rules || !props.rules.length) return;
  return <Fragment>
    <Button onClick={() => setOpen(true)}>配置</Button>
    <Drawer 
      title="变量配置" 
      placement="right" 
      onClose={() => setOpen(false)} 
      open={open} 
      width={500} 
      footer={<Button onClick={submit} type="primary" loading={loading}>保存</Button>}
    >
      <Fields dataSource={props.value} schemas={props.rules as any} gutter={[24, 24]} onChange={transform} />
    </Drawer>
  </Fragment>
}