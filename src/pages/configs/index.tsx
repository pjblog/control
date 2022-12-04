import styles from './index.module.less';
import { Flex, useGetAsync, Fields, request } from '@pjblog/control-hooks';
import { Button, message, Tabs } from 'antd';
import { TBlogConfigsProps, TConfigsGroup } from './types';
import { useCallback, useMemo, useState } from 'react';
import { useAsyncCallback } from '@codixjs/fetch';
const css = {
  width: 217,
  marginTop: 8
}
export default function Page() {
  const { data: { value, state }, setData } = useGetAsync<{
    value: TBlogConfigsProps,
    state: TConfigsGroup[],
  }>({ url: '/-/configs' });
  const [name, setName] = useState<string>(state[0].name);
  const columns = useMemo(() => {
    const chunks = state.find(s => s.name === name);
    return chunks ? chunks.options : [];
  }, [state, name]);
  const transform = useCallback((e: TBlogConfigsProps) => setData({
    state,
    value: e,
  }), [state]);
  const { execute, loading } = useAsyncCallback(async () => {
    const res = await request.post('/-/configs', value)
    return res.data;
  })
  const submit = useCallback(() => {
    execute()
      .then(() => message.success('保存成功'))
      .catch(e => message.error(e.message));
  }, [execute]);
  return <Flex className="container">
    <Tabs
      activeKey={name}
      tabPosition="left"
      centered={false}
      type="card"
      onChange={e => setName(e)}
      tabBarExtraContent={{
        right: <Button onClick={submit} type="primary" loading={loading} style={css}>保存</Button>
      }}
      items={state.map(group => {
        return {
          label: <Flex align="right" direction="vertical" className={styles.channel}>
            <span>{group.title}</span>
            <span className={styles.tip}>{group.subTitle}</span>
          </Flex>,
          key: group.name
        }
      })}
    />
    <Flex span={1}>
      <Fields dataSource={value} schemas={columns as any} gutter={[24, 24]} onChange={transform} />
    </Flex>
  </Flex>
}