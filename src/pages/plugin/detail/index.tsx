import React, { useCallback, useMemo } from 'react';
import styles from './index.module.less';
import { useRequestParam } from '@codixjs/codix';
import { useAsync, useAsyncCallback } from '@codixjs/fetch';
import { Avatar, Col, Divider, Row, Space, Typography, Result, Button, message } from 'antd';
import { getPluginDetail, setPluginConfigs, useBaseRequestConfigs } from '../../../service';
import { Fields } from '../../../components';
import { UnInstall } from '../uninstall';
import { usePath } from '../../../hooks';
import { CheckUpdate } from '../../setting/update';
import { 
  FolderOutlined, 
  FilePptOutlined, 
  NodeIndexOutlined, 
  ReadOutlined, 
  SettingOutlined 
} from '@ant-design/icons';

export default function PluginDetail() {
  const Plugin = usePath('PLUGIN');
  const name = useRequestParam<string>('plugin');
  const configs = useBaseRequestConfigs();
  const { data, setData, error } = useAsync('plugin:' + name, () => getPluginDetail(name, configs), [name]);
  const save = useAsyncCallback(setPluginConfigs);
  const submit = useCallback((val: any) => {
    setData({
      ...data,
      configs: {
        rule: data.configs.rule,
        value: val
      }
    })
  }, [data])
  const deps = useMemo(() => {
    const pools: { label: string, value: string }[] = [];
    const target = data?.extends || {};
    for (const key in target) {
      pools.push({
        label: key,
        value: target[key],
      })
    }
    return pools;
  }, [data?.extends]);

  const onSave = useCallback(() => {
    save.execute(name, data.configs.value)
      .then(() => message.success('保存成功'))
      .catch(e => message.error(e.message));
  }, [name, data?.configs?.value])

  if (error?.code) return <Result
    status={error.code}
    title={error.code}
    subTitle={error.message}
    extra={<Button type="primary" onClick={() => Plugin.redirect()}>返回</Button>}
  />

  return <Row gutter={[24, 24]}>
    <Col span={24}>
      <Space size={16}>
        <Avatar src={data.icon} shape="square" size={40} />
        <div>
          <div className={styles.title}>{data.name.toUpperCase()}</div>
          <div className={styles.version}>
            <span>@{data.version}</span>
            <Divider type="vertical" />
            <UnInstall name={data.name} onDelete={() => Plugin.redirect()} />
            <Divider type="vertical" />
            <CheckUpdate name={data.name} />
          </div>
        </div>
      </Space>
    </Col>
    <Col span={24}>
      <Typography.Paragraph className={styles.description}>{data.description || '无插件描述'}</Typography.Paragraph>
    </Col>
    <Col span={24}>
      <ul className={styles.meta}>
        <li><FolderOutlined /> 文件夹：{data.dictionary}</li>
        <li><FilePptOutlined /> 元文件：{data.packageFile}</li>
        {!!deps.length && <li><NodeIndexOutlined /> 依赖项：<Space>
          {
            deps.map(dep => {
              const ver = `${dep.label.replace(/\-/g, '--')}-${dep.value.replace(/\-/g, '--')}`;
              return <Typography.Link href={'https://www.npmjs.com/package/' + dep.label} target="_blank" key={dep.label}>
                <img src={`https://img.shields.io/badge/${ver}-blue`} alt={dep.value} />
              </Typography.Link>
            })
          }
        </Space></li>}
      </ul>
    </Col>
    <Col span={24}>
      <Typography.Title level={5}>
        <Space>
          <ReadOutlined />
          插件文档
        </Space>
      </Typography.Title>
      <div dangerouslySetInnerHTML={{ __html: data.README || 'No README.md' }}></div>
    </Col>
    <Col span={24}>
      <Typography.Title level={5}>
        <Space>
          <SettingOutlined />
          变量配置
        </Space>
      </Typography.Title>
      <Fields dataSource={data.configs.value} schemas={data.configs.rule} gutter={[12, 12]} onChange={submit}>
        <Button type="primary" loading={save.loading} onClick={onSave}>保存</Button>
      </Fields>
    </Col>
  </Row>
}