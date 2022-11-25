import styles from './index.module.less';
import { PropsWithoutRef, useEffect, useState } from 'react';
import { Flex, useSocket } from '../../components';
import { TMeta } from '../types';
import { Checkbox, Typography, Card, Tag } from 'antd';
import { useAsync } from '@codixjs/fetch';
import { getTheme, useBaseRequestConfigs } from '../../service';
import { usePath } from '../../hooks';

const { Meta } = Card;

export default function ThemePage() {
  const socket = useSocket();
  const configs = useBaseRequestConfigs();
  const { data } = useAsync('theme', () => getTheme(configs));
  const [themes, setThemes] = useState<TMeta[]>([]);

  useEffect(() => {
    if (socket) {
      const handler = (...themes: TMeta[]) => setThemes(themes.filter(theme => theme.type === 'theme'));
      socket.on('nodes', handler);
      socket.emit('nodes');
      return () => {
        socket.off('nodes', handler);
      }
    }
  }, [socket]);

  return <Flex block wrap="wrap" gap={[24, 24]}>
    {themes.map(theme => <Item {...theme} current={data} key={theme.name} />)}
  </Flex>
}

function Item(props: PropsWithoutRef<TMeta & { current: string }>) {
  const theme = usePath('MODULE_DETAIL');
  return <Card
    className={styles.card}
    cover={<img alt={props.name} src={props.icon} />}
    onClick={() => theme.redirect({ name: props.name })}
  >
    <Meta 
      className={styles.meta}
      title={<Typography.Text title={props.name}>{props.name.toUpperCase()}</Typography.Text>} 
      description={<Checkbox checked={props.current === props.name} className={styles.checked} />}
    />
    <Flex block align="center" valign="middle" className={styles.version}><Tag>@{props.version}</Tag></Flex>
  </Card>
}