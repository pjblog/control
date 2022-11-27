import styles from './index.module.less';
import { useRequestParam } from "@codixjs/codix";
import { useAsync } from "@codixjs/fetch";
import { useEffect, useRef } from "react";
import { getModuleDetail, useBaseRequestConfigs } from "../../../service";
import { loadMicroApp } from 'qiankun';
import { Loading } from "../../../components";
import { Col, Result, Row, PageHeader } from 'antd';
import { usePath } from "../../../hooks";

export default function AdvancePage() {
  const configs = useBaseRequestConfigs();
  const MODULE = usePath('MODULE_DETAIL');
  const name = useRequestParam<string>('name');
  const ref = useRef<HTMLDivElement>();
  const { data, error, loading } = useAsync('theme:' + name, () => getModuleDetail(name, configs), [name]);

  useEffect(() => {
    if (ref.current && data && data.name && !error && !loading) {
      const app = loadMicroApp({
        name: data.name,
        entry: '/__plugin__/' + data.name,
        container: ref.current,
        props: data.configs.value,
      }, {
        sandbox: {
          experimentalStyleIsolation: true,
        },
        singular: true
      });
      app.mount().catch(e => console.warn(e))
      return () => {
        app.unmount().catch(e => console.warn(e))
      }
    }
  }, [ref.current, data.name, error, loading])

  if (loading) return <Loading />
  if (error) return <Result
    status="error"
    title="Fetch Error"
    subTitle={error.message}
  />

  return <Row gutter={[24, 24]}>
    <Col span={24}>
    <PageHeader
      className={styles.banner}
      onBack={() => MODULE.redirect({ name: data.name })}
      title={data.name}
      subTitle={data.descriptions}
    />
    </Col>
    <Col span={24}>
      <div ref={ref}></div>
    </Col>
  </Row>
}