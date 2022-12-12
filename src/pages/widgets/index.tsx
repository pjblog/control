import 'xterm/css/xterm.css';
import 'react-photo-view/dist/react-photo-view.css';
import styles from './index.module.less';
import classnames from 'classnames';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Terminal } from 'xterm';
import { loadMicroApp } from 'qiankun';
import { CanvasAddon } from 'xterm-addon-canvas';
import { FitAddon } from 'xterm-addon-fit';
import { Fields, Flex, IUserInfoState, request, useAuthorize, useGetAsync, useSocket } from '@pjblog/control-hooks';
import { Fragment, PropsWithChildren, PropsWithoutRef, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { colors } from './colors';
import { Button, Input, Select, Space, Popconfirm, Divider, Checkbox, Empty, Avatar, Typography, Drawer, message } from 'antd';
import { EnterOutlined, CloseOutlined, CodeSandboxOutlined, CaretDownOutlined, CaretUpOutlined, CheckOutlined } from '@ant-design/icons';
import { Socket } from 'socket.io-client';
import { IPackage, IPackages } from './types';
import { useAsyncCallback } from '@codixjs/fetch';

const banner = (admin: IUserInfoState) => `Hello \x1b[31;1m${admin.nickname}\x1b[0m:
  Logined with account \x1b[32m${admin.account}\x1b[0m.
  Now the module installer for PJBlog is running...
  You can enter the module name in the input box on the right to download and install,
  Information about the installation process will be shown \x1b[34mbelow\x1b[0m ...\n\n`;

const installTypes = [
  {
    value: 'theme',
    label: '主题',
  },
  {
    label: '插件',
    value: 'plugin'
  }
];

export default function Page() {
  const admin = useAuthorize();
  const socket = useSocket();
  const ref = useRef<HTMLDivElement>();
  const boxRef = useRef<HTMLDivElement>();
  const [installType, setInstallType] = useState<'theme' | 'plugin'>('theme');
  const [installName, setInstallName] = useState<string>(null);
  const [term, setTerm] = useState<Terminal>(null);
  const [running, setRunning] = useState(false);
  const [command, setCommand] = useState<string>(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [auto, setAuto] = useState(true);
  const [dataSource, setDataSource] = useState<IPackages>({});
  const [themes, setThemes] = useState<IPackage[]>([]);
  const [plugins, setPlugins] = useState<IPackage[]>([]);
  const [currentConfigs, setCurrentConfigs] = useState<IPackage>(null);
  const { data: { theme: _theme }, setData } = useGetAsync<{ theme: string }>({
    id: 'theme',
    url: '/theme',
  })

  const setTheme = useCallback((theme: string) => setData({ theme }), [setData]);

  const install = useCallback(() => {
    if (!installName) return;
    if (socket && installName) {
      socket.emit('install', 'pjblog-' + installType + '-' + installName, auto);
    }
  }, [installType, installName, socket, auto]);

  const cancel = useCallback(() => {
    if (socket) {
      socket.emit('cancel');
    }
  }, [socket]);

  const onConfisChange = useCallback((name: string, value: any) => {
    if (dataSource[name]) {
      setDataSource({
        ...dataSource,
        [name]: {
          meta: dataSource[name].meta,
          rules: dataSource[name].rules,
          values: value
        }
      })
    }
  }, [dataSource]);

  const saveConfigs = useCallback((name: string) => {
    if (socket && dataSource[name]) {
      socket.emit('save', name, dataSource[name].values);
    }
  }, [socket, dataSource]);

  useEffect(() => {
    const result = formatPackages(dataSource);
    setThemes(result.themes);
    setPlugins(result.plugins);
  }, [dataSource, setThemes, setPlugins]);

  useEffect(() => {
    if (ref.current && boxRef.current && admin.account) {
      const _term = new Terminal({
        rows: Math.floor(boxRef.current.clientHeight / 22) - 1,
        theme: colors,
        cursorBlink: false,
        cursorStyle: 'underline',
        convertEol: true,
        disableStdin: true,
        fontSize: 12,
        fontFamily: '"Cascadia Code", Menlo, monospace',
        lineHeight: 1.5
      });
      const fitAddon = new FitAddon();
      _term.loadAddon(fitAddon);
      _term.open(ref.current);
      _term.loadAddon(new CanvasAddon());
      fitAddon.fit();
      _term.write(banner(admin));
      setTerm(_term);
      return () => {
        _term.dispose();
      }
    }
  }, []);

  useEffect(() => {
    if (socket && term) {
      /**
       * 日志信息
       */
      const unBindLogger = createEvent(socket, 'log', (buf: any) => {
        term.write(buf);
        term.write('\n');
      });
      /**
       * 命令状态及正在运行的命令
       */
      const unBindRunning = createEvent(socket, 'running', (commander: string) => {
        setRunning(!!commander);
        setCommand(commander || null);
      })
      const unBindHistory = createEvent(socket, 'history', (...args: any[]) => args.forEach(arg => {
        term.write(arg);
        term.write('\n');
      }))
      const unBindPackages = createEvent(socket, 'packages', (data: IPackages) => setDataSource(data))

      socket.emit('running');
      socket.emit('history');
      socket.emit('packages');

      return () => {
        unBindPackages();
        unBindLogger();
        unBindRunning();
        unBindHistory();
      }
    }
  }, [socket, term]);

  return <Flex block full scroll='hide' direction="vertical">
    <Flex className={styles.installer} block scroll="hide" valign="middle" align="between">
      <Flex valign="middle">
        <span>安装</span>
        <Divider type="vertical" />
        <Checkbox checked={auto} onChange={e => setAuto(e.target.checked)}>自动安装依赖</Checkbox>
        <Divider type="vertical" />
        <Select value={installType} bordered={false} options={installTypes} onChange={e => setInstallType(e)} />
        <Divider type="vertical" />
        <span className={styles.installMarker}>PJBLOG-{installType.toUpperCase()}-</span>
        <Input 
          value={installName} 
          onChange={e => setInstallName(e.target.value)} 
          bordered={false} 
          placeholder="安装模块ID..." 
          suffix={<EnterOutlined style={{ cursor: 'pointer' }} onClick={install} />} 
          autoFocus 
          onPressEnter={install}
          style={{ width: 300 }}
        />
      </Flex>
      <div>
        <Flex className={styles.commander} block scroll="hide" align="between" valign="middle">
          <span>状态</span>
          <Divider type="vertical" />
          <Space size={16}>
            <span className={styles.status}>{running ? '运行中' : '已停止'}</span>
            <span>{command}</span>
          </Space>
          { 
            running && <Popconfirm
              title="确定放弃这个任务？"
              onConfirm={cancel}
              okText="放弃"
              cancelText="继续"
            ><Button type="text" danger icon={<CloseOutlined />} size="small" /></Popconfirm>
          }
        </Flex>
      </div>
    </Flex>
    <Flex span={1} block scroll="hide">
      <Channel title="主题" width={300}>
        {
          !themes.length
            ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            : themes.map(theme => <Theme
                current={theme.meta.name === _theme}
                key={theme.meta.name}
                value={theme}
                setTheme={setTheme}
                setConfigs={setCurrentConfigs}
                actived={!!currentConfigs && currentConfigs.meta.name === theme.meta.name} 
              />)
        }
      </Channel>
      <Channel 
        title={'配置' + (currentConfigs ? ' - ' + currentConfigs.meta.name.toUpperCase() : '')}
        extra={!!currentConfigs && <Button type="primary" size="middle" onClick={() => saveConfigs(currentConfigs.meta.name)}>保存</Button>}
      >
        <div className={styles.configs}>
        {
          !!currentConfigs && <Fields 
            dataSource={currentConfigs.values} 
            schemas={currentConfigs.rules}
            onChange={e => onConfisChange(currentConfigs.meta.name, e)}
          />
        }
        </div>
      </Channel>
      <Channel title="插件" width={500}>
        {
          !plugins.length
            ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            : plugins.map(plugin => <Plugin 
                value={plugin}
                key={plugin.meta.name} 
                setConfigs={setCurrentConfigs}
                actived={!!currentConfigs && currentConfigs.meta.name === plugin.meta.name} 
              />)
        }
      </Channel>
    </Flex>
    <div className={classnames(styles.xterm, {
      [styles.show]: showTerminal
    })}>
      <Flex className={styles.console} block valign="middle" align="between">
        <span><CodeSandboxOutlined className={styles.icon} /> TERMINAL</span>
        <div className={styles.toggle} onClick={() => setShowTerminal(!showTerminal)}>
          {showTerminal ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </div>
      </Flex>
      <div className={styles.box} ref={boxRef}>
        <div ref={ref}></div>
      </div>
    </div>
  </Flex>
}

function createEvent(socket: Socket, name: string, callback: (...args: any[]) => void) {
  socket.on(name, callback);
  return () => socket.off(name, callback);
}

function formatPackages(dataSource: IPackages = {}) {
  const themes: IPackage[] = [];
  const plugins: IPackage[] = [];
  for (const key in dataSource) {
    switch (dataSource[key].meta.type) {
      case 'plugin':
        plugins.push(dataSource[key]);
        break;
      case 'theme':
        themes.push(dataSource[key]);
        break;
    }
  }
  return {
    themes,
    plugins,
  }
}

function Channel(props: PropsWithChildren<{ title: string, width?: number, className?: string, extra?: ReactNode }>) {
  return <Flex className={classnames(styles.channel, props.className)} span={!props.width ? 1 : undefined} direction="vertical" full scroll="hide" style={{ width: props.width }}>
    <Flex block valign="middle" align="between" className={styles.title}>
      <span>{props.title}</span>
      <span>{props.extra}</span>
    </Flex>
    <Flex span={1} block scroll="y">
      <div className={styles.list}>{props.children}</div>
    </Flex>
  </Flex>
}

function Plugin(props: PropsWithoutRef<{ 
  value: IPackage,
  actived: boolean,
  setConfigs: React.Dispatch<React.SetStateAction<IPackage<any>>>,
}>) {
  const socket = useSocket()
  const uninstall = useCallback((name: string) => {
    if (socket) {
      socket.emit('uninstall', name);
    }
  }, [socket])
  return <Flex className={classnames(styles.plugin, {
    [styles.active]: props.actived
  })} direction="vertical" gap={[0, 8]} block>
    <Flex block gap={12} valign="middle">
      <Avatar src={props.value.meta.icon} shape="square" size={40} />
      <Flex span={1} scroll="hide" direction="vertical">
        <Typography.Text ellipsis className={styles.name}>{props.value.meta.name}</Typography.Text>
        <Typography.Text className={styles.version}>@{props.value.meta.version}</Typography.Text>
      </Flex>
    </Flex>
    <Typography.Paragraph className={styles.description}>{props.value.meta.descriptions}</Typography.Paragraph>
    <Space className={styles.tools}>
      {!!props.value.rules.length && <Typography.Link onClick={() => props.setConfigs(props.value)}>配置</Typography.Link>}
      {!!props.value.meta.advance && <Advance {...props.value} />}
      {!!props.value.meta.repository && <Typography.Link href={props.value.meta.repository} target="_blank" type="secondary">仓库</Typography.Link>}
      {!!props.value.meta.homepage && <Typography.Link href={props.value.meta.homepage} target="_blank" type="secondary">主页</Typography.Link>}
      <Popconfirm
        title="确定卸载此插件？"
        onConfirm={() => uninstall(props.value.meta.name)}
        okText="卸载"
        cancelText="放弃"
      ><Typography.Link type="danger">卸载</Typography.Link></Popconfirm>
    </Space>
  </Flex>
}

function Advance(props: PropsWithoutRef<IPackage>) {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current && opened) {
      const app = loadMicroApp({
        name: props.meta.name,
        entry: props.meta.advance,
        container: ref.current,
        props: props.values,
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
  }, [ref.current, opened, props.meta.name, props.meta.advance, props.values])

  return <Fragment>
    <Typography.Link onClick={() => setOpen(true)} type="success">高级</Typography.Link>
    <Drawer title={props.meta.name} placement="right" onClose={() => setOpen(false)} open={open} width="80%" afterOpenChange={e => setOpened(e)}>
      <div ref={ref}></div>
    </Drawer>
  </Fragment>
}

function Theme(props: PropsWithoutRef<{ 
  value: IPackage,
  actived: boolean,
  current: boolean,
  setTheme: (theme: string) => void,
  setConfigs: React.Dispatch<React.SetStateAction<IPackage<any>>>,
}>) {
  const socket = useSocket()
  const uninstall = useCallback((name: string) => {
    if (socket) {
      socket.emit('uninstall', name);
    }
  }, [socket])
  const { execute, loading } = useAsyncCallback(async (name: string) => {
    const res = await request.post('/theme', { theme: name });
    return res.data;
  })
  const use = useCallback(() => {
    if (props.current) return;
    execute(props.value.meta.name)
      .then(() => props.setTheme(props.value.meta.name))
      .then(() => message.success('主题启用成功'))
      .catch(e => message.error(e.message));
  }, [props.current, props.value.meta.name, props.setTheme])
  return <div className={classnames(styles.theme, {
    [styles.active]: props.actived,
    [styles.current]: props.current,
  })}>
    <div className={styles.checked}><CheckOutlined /></div>
    <div className={styles.wrap}>
      <Preview images={props.value.meta.previews}>
        <img className={styles.cover} src={props.value.meta.icon} alt={props.value.meta.name} />
      </Preview>
      <div className={styles.info}>
        <Typography.Paragraph className={styles.name} ellipsis={{ rows: 1 }}>{props.value.meta.name}</Typography.Paragraph>
        <Typography.Text className={styles.version}>@{props.value.meta.version}</Typography.Text>
        <Typography.Paragraph className={styles.description}>{props.value.meta.descriptions}</Typography.Paragraph>
        <Space className={styles.tools}>
          {!props.current && <Popconfirm
            title="确定启用此主题？"
            onConfirm={use}
            okText="启用"
            cancelText="取消"
            disabled={loading}
            placement="right"
          ><Typography.Link disabled={loading}>启用</Typography.Link></Popconfirm>}
          {!!props.value.rules.length && <Typography.Link onClick={() => props.setConfigs(props.value)}>配置</Typography.Link>}
          {!!props.value.meta.repository && <Typography.Link href={props.value.meta.repository} target="_blank" type="secondary">仓库</Typography.Link>}
          {!!props.value.meta.homepage && <Typography.Link href={props.value.meta.homepage} target="_blank" type="secondary">主页</Typography.Link>}
          {!props.current && <Popconfirm
            title="确定卸载此主题？"
            onConfirm={() => uninstall(props.value.meta.name)}
            okText="卸载"
            cancelText="放弃"
          ><Typography.Link type="danger">卸载</Typography.Link></Popconfirm>}
        </Space>
      </div>
    </div>
  </div>
}

function Preview(props: PropsWithChildren<{ images: string[] }>) {
  if (!props.images || !props.images.length) return;
  return <PhotoProvider>
    {
      props.images.map((image, index) => {
        return <PhotoView src={image} key={image}>
          {index === 0 ? props.children as JSX.Element : null}
        </PhotoView>
      })
    }
  </PhotoProvider>
}