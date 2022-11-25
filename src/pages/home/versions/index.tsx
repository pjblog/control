import styles from './index.module.less';
import { useAsync } from "@codixjs/fetch";
import { Card, Space } from "antd";
import { Flex } from "../../../components";
import { getVersions, useBaseRequestConfigs } from "../../../service";

export function Versions() {
  const configs = useBaseRequestConfigs()
  const { data, loading } = useAsync('versions', () => getVersions(configs));
  return <Card title="版本" size="small" loading={loading}>
    <Flex block>
      <Flex span={1}>
        <Space direction="vertical">
          <span className={styles.name}>服务端</span>
          <span>{data.server.name}@{data.server.version}</span>
        </Space>
      </Flex>
      <Flex span={1}>
        <Space direction="vertical">
          <span className={styles.name}>客户端</span>
          <span>{data.client.name}@{data.client.version}</span>
        </Space>
      </Flex>
      <Flex span={1}>
        <Space direction="vertical">
          <span className={styles.name}>主题</span>
          <span>{data.theme.name}@{data.theme.version}</span>
        </Space>
      </Flex>
    </Flex>
  </Card>
}