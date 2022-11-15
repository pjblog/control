import React, { useCallback, useMemo, useState } from 'react';
import styles from './index.module.less';
import { Col, Row, Button, message, Segmented } from 'antd';
import { useAsync, useAsyncCallback } from '@codixjs/fetch';
import { getConfigs, TBlogSettingProps, updateConfigs, useBaseRequestConfigs } from '../../service';
import { Flex, Fields } from '../../components';

export default function SettingPage() {
  const configs = useBaseRequestConfigs();
  const { data: { value, state }, setData } = useAsync('configs', () => getConfigs(configs));
  const [mark, setMark] = useState(state[0].name);
  const transform = useCallback((e: TBlogSettingProps) => setData({
    state,
    value: e,
  }), [state]);
  const marks = useMemo(() => {
    return state.map(s => {
      return {
        label: <Flex direction="vertical" align="center" valign="middle">
          <div>{s.title}</div>
          <div className={styles.subtitle}>{s.subTitle}</div>
        </Flex>,
        value: s.name,
      }
    })
  }, [state]);
  const columns = useMemo(() => {
    const chunks = state.find(s => s.name === mark);
    return chunks ? chunks.options : [];
  }, [state, mark])

  return <Row gutter={[0, 36]}>
    <Col span={24}>
      <Segmented options={marks} value={mark} onChange={e => setMark(e.toString())} />
    </Col>
    <Col span={24}>
      <Fields dataSource={value} schemas={columns as any} gutter={[24, 24]} onChange={transform} />
    </Col>
    <Col span={24}>
      <Save value={value} />
    </Col>
  </Row>
}

function Save(props: React.PropsWithoutRef<{ value: TBlogSettingProps }>) {
  const { loading, execute } = useAsyncCallback(() => updateConfigs(props.value))
  const submit = () => {
    execute()
      .then(() => message.success('保存成功'))
      .catch(e => message.error(e.message));
  }
  return <Button type="primary" loading={loading} onClick={submit}>保存</Button>
}
