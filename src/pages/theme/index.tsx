import React, { useEffect, useState } from 'react';
import { Flex, useSocket } from '../../components';
import styles from './index.module.less';
import { TBlogPackageState } from '../types';
import { Col, Row, Typography, Empty } from 'antd';

export default function ThemePage() {
  const socket = useSocket();
  const [themes, setThemes] = useState<TBlogPackageState[]>([]);
  console.log(themes);
  useEffect(() => {
    if (socket) {
      const handler = (...themes: TBlogPackageState[]) => setThemes(themes);
      socket.on('themes', handler);
      socket.emit('themes');
      return () => {
        socket.off('themes', handler);
      }
    }
  }, [socket]);
  return <Row gutter={[24, 24]}>
    {
      !themes.length
        ? <Col span={24}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Col>
        : themes.map(theme => {
          return <Col span={8} key={theme.name}>
            <Flex className={styles.theme} gap={12}>
              <img src={theme.icon} alt={theme.name} width={138} height={176} />
              <Flex scroll="hide" span={1} direction="vertical">
                <div className={styles.title}>{theme.name}</div>
                <div className={styles.desc}>{theme.description}</div>
              </Flex>
            </Flex>
          </Col>
        })
    }
    
  </Row>
}