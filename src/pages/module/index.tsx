import 'xterm/css/xterm.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { useSocket } from '../../components';
import { TState } from './types';
import { Col, Row, Typography, Empty } from 'antd';
import { Terminal } from 'xterm';
import { CanvasAddon } from 'xterm-addon-canvas';
import { FitAddon } from 'xterm-addon-fit';
import { colors } from './colors';
import { Search } from './search';
import { Box } from './box';
import { Item } from './item';
import { useAdminInfo } from '../../layout/context';
import { TUserInfo } from '../../service';

const banner = (admin: TUserInfo) => `Hello \x1b[31;1m${admin.nickname}\x1b[0m:
  Logined with account \x1b[32m${admin.account}\x1b[0m.
  Now the module installer for PJBlog is running...
  You can enter the module name in the input box on the right to download and install,
  Information about the installation process will be shown \x1b[34mbelow\x1b[0m ...\n\n`

export default function ModulePage() {
  const socket = useSocket();
  const admin = useAdminInfo();
  const ref = useRef<HTMLDivElement>();
  const [term, setTerm] = useState(null);
  const [current, setCurrent] = useState<TState>(null);
  const [queues, setQueues] = useState<TState[]>([]);

  const onAddone = useCallback((name: string) => {
    socket.emit('addone', name);
  }, [socket]);

  useEffect(() => {
    if (ref.current && admin.account) {
      const _term = new Terminal({
        rows: 40,
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
  }, [ref.current, admin]);

  useEffect(() => {
    if (socket && term) {
      // 进行中的模块绑定
      const installing = (chunk: TState) => setCurrent(chunk || null);
      socket.on('installing', installing);
      socket.emit('installing');

      // 队列
      const queue = (...chunks: TState[]) => setQueues(chunks || []);
      socket.on('queues', queue);
      socket.emit('queues');

      // 消息
      const messageHandler = (...args: any[]) => args.forEach(arg => term.write(arg));
      socket.on('message', messageHandler);

      return () => {
        socket.off('message', messageHandler);
        socket.off('installing', installing);
        socket.off('queues', queue);
      }
    }
  }, [socket, term]);

  return <Row gutter={[24, 24]}>
    <Col span={24}>

    </Col>
    <Col span={12}>
      <Box title="日志信息">
        <div className={styles.xterm} ref={ref}></div>
      </Box>
    </Col>
    <Col span={12}>
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <Box title="安装模块">
            <Search onSearch={onAddone} />
            <ul style={{ marginTop: 12 }} className={styles.tip}>
              <li>注意：</li>
              <li>1. `pjblog-theme-` 前缀表示安装主题</li>
              <li>2. `pjblog-plugin-` 前缀表示安装插件</li>
              <li>3. 可以指定版本，比如填写`default@2.0.1`，表示安装`pjblog-theme-default@2.0.1`</li>
              <li>4. 可以指定`dist-tag`，比如`default@next`，表示安装`pjblog-theme-default@next`</li>
              <li>5. 更多规范，参考 <Typography.Link href="https://docs.npmjs.com/packages-and-modules/updating-and-managing-your-published-packages" target="_blank">这里</Typography.Link></li>
            </ul>
          </Box>
        </Col>
        <Col span={24}>
          <Box title="安装中的模块">
            {
              !!current
                ? <Item {...current} />
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
          </Box>
        </Col>
        <Col span={24}>
          <Box title="等待的队列">
            {
              !!queues.length
                ? <div className={styles.items}>
                    {
                      queues.map(chunk => {
                        return <div className={styles.item} key={chunk.timestamp}>
                          <Item {...chunk} />
                        </div>
                      })
                    }
                  </div>
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
          </Box>
        </Col>
      </Row>
    </Col>
  </Row>
}