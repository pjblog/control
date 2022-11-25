import styles from './index.module.less';
import classnames from 'classnames';
import { Typography, PageHeader, Divider, Space, Tag } from "antd";
import { Box, Configs } from "../../../components";
import { useAsync } from '@codixjs/fetch';
import { getModuleDetail, getTheme, useBaseRequestConfigs } from '../../../service';
import { useRequestParam } from '@codixjs/codix';
import { useMemo } from 'react';
import { Preview } from './preview';
import { Active } from './active';
import { UnInstall } from './uninstall';

const { List } = Box;
const size = 120;

export default function ThemeDetail() {
  const configs = useBaseRequestConfigs();
  const theme = useRequestParam<string>('name');
  const { data: current, setData } = useAsync('theme', () => getTheme(configs));
  const { data: info } = useAsync('theme:' + theme, () => getModuleDetail(theme, configs), [theme]);

  const deps = useMemo(() => {
    const pools: { label: string, value: string }[] = [];
    const target = info?.extends || {};
    for (const key in target) {
      pools.push({
        label: key,
        value: target[key],
      })
    }
    return pools;
  }, [info?.extends]);

  const isSelf = useMemo(() => {
    switch (info.type) {
      case 'theme': return current === info.name;
      case 'plugin': return false;
      default: return true
    }
  }, [info.type, current, info.name]);

  const items: React.ReactNode[] = [
    <Configs key="configs" disabled={!isSelf} rules={info.configs.rules} value={info.configs.value} name={info.name} />,
    info.type === 'theme' ? <Active key="active" name={info.name} disabled={isSelf} reload={() => setData(info.name)} /> : null,
    <UnInstall key="uninstall" name={info.name} disabled={isSelf} />,
  ].filter(Boolean);

  return <div className={styles.theme}>
    <PageHeader
      ghost={false}
      onBack={() => window.history.back()}
      title={info.name.toUpperCase()}
      tags={info.name === current ? <Tag color="blue">使用中</Tag> : null}
      extra={items}
    >
      <Box>
        <List title="版本" size={size}>{info.version}</List>
        <List title="描述" size={size}>{info.descriptions}</List>
        <List title="所在文件夹" size={size}>{info.dictionary}</List>
        <List title="仓库" size={size}>{info.repository ? <Typography.Link href={info.repository} target="_blank">{info.repository}</Typography.Link> : '-'}</List>
        <List title="主页" size={size}>{info.homepage ? <Typography.Link href={info.homepage} target="_blank"></Typography.Link> : '-'}</List>
        <List title="依赖插件" size={size}>
          {
            !!deps.length 
              ? <Space>
                {
                  deps.map(dep => {
                    const ver = `${dep.label.replace(/\-/g, '--')}-${dep.value.replace(/\-/g, '--')}`;
                    return <Typography.Link href={'https://www.npmjs.com/package/' + dep.label} target="_blank" key={dep.label}>
                      <img src={`https://img.shields.io/badge/${ver}-blue`} alt={dep.value} />
                    </Typography.Link>
                  })
                }
                </Space>
              : '-'
          }
        </List>
        {
          info.type === 'theme' && <List title="主题预览" size={size}>
            {
              !!info.previews && info.previews.length ? <Preview images={info.previews || []} /> : '-'
            }
          </List>
        }
      </Box>
    </PageHeader>
    <Divider orientation="left">文档</Divider>
    <div dangerouslySetInnerHTML={{ __html: info.readme }} className="mdhtml"></div>
  </div>
}