import { useEffect, useState } from 'react';
import { useSocket } from '../../components';
import { TMeta } from '../types';
import { Avatar, List, Typography } from 'antd';
import { usePath } from '../../hooks';

export default function PluginPage() {
  const socket = useSocket();
  const [plugins, setPlugins] = useState<TMeta[]>([]);
  const MODULE_DETAIL = usePath('MODULE_DETAIL')
  
  useEffect(() => {
    if (socket) {
      const handler = (...plugins: TMeta[]) => setPlugins(plugins.filter(plugin => plugin.type === 'plugin'));
      socket.on('nodes', handler);
      socket.emit('nodes');
      return () => {
        socket.off('nodes', handler);
      }
    }
  }, [socket]);

  return <List
    itemLayout="horizontal"
    dataSource={plugins}
    renderItem={item => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={item.icon} />}
          title={<Typography.Link onClick={() => MODULE_DETAIL.redirect({ name: item.name })}>{item.name}@{item.version}</Typography.Link>}
          description={item.descriptions}
        />
      </List.Item>
    )}
  />
}