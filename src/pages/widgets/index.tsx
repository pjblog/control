import 'xterm/css/xterm.css';
import styles from './index.module.less';
import { Terminal } from 'xterm';
import { CanvasAddon } from 'xterm-addon-canvas';
import { FitAddon } from 'xterm-addon-fit';
import { Flex, IUserInfoState, useAuthorize, useSocket } from '@pjblog/control-hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { colors } from './colors';
import { Button, Input, Select, Space, Popconfirm } from 'antd';
import { EnterOutlined, CloseOutlined } from '@ant-design/icons';
import { Socket } from 'socket.io-client';

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

  const install = useCallback(() => {
    if (socket && installName) {
      socket.emit('install', 'pjblog-' + installType + '-' + installName);
    }
  }, [installType, installName, socket]);

  const cancel = useCallback(() => {
    if (socket) {
      socket.emit('cancel');
    }
  }, [socket]);

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

      socket.emit('running');
      socket.emit('history');

      return () => {
        unBindLogger();
        unBindRunning();
        unBindHistory();
      }
    }
  }, [socket, term]);

  return <Flex block full scroll='hide'>
    <Flex className={styles.xterm} direction="vertical" scroll='hide'>
      <Flex className={styles.installer} block scroll="hide" valign="middle">
        <Select value={installType} bordered={false} options={installTypes} onChange={e => setInstallType(e)} />
        <span className={styles.installMarker}>PJBLOG-{installType.toUpperCase()}-</span>
        <Flex span={1} scroll="hide">
          <Input 
            value={installName} 
            onChange={e => setInstallName(e.target.value)} 
            bordered={false} 
            placeholder="安装模块ID..." 
            suffix={<EnterOutlined />} 
            autoFocus 
            onPressEnter={install}
          />
        </Flex>
      </Flex>
      <Flex className={styles.commander} block scroll="hide" align="between" gap={8} valign="middle">
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
      <Flex span={1} scroll="hide" block>
        <div className={styles.box} ref={boxRef}>
          <div ref={ref}></div>
        </div>
      </Flex>
    </Flex>
  </Flex>
}

function createEvent(socket: Socket, name: string, callback: (...args: any[]) => void) {
  socket.on(name, callback);
  return () => socket.off(name, callback);
}