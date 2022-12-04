import classnames from 'classnames';
import styles from './index.module.less';
import { Flex } from '../flex';
import { User } from './user';
import { Menus } from './menus';
import { Tooltip } from 'antd';
import { redirect, useRequestPath } from '@codixjs/codix';
import { usePath } from '../../hooks';

export function Sidebar() {
  const pathname = useRequestPath<string>();
  return <Flex direction="vertical" gap={8} block full align="center">
    <User />
    <ul>
      {
        Menus.map(menu => {
          const code = menu.code;
          const url = usePath(code).toString();
          const active = url === '/'
            ? pathname === url
            : pathname.startsWith(url)
          return <Tooltip title={menu.label} placement="right" key={menu.code}>
            <li className={classnames({ [styles.active]: active })} onClick={() => redirect(url)}>{menu.icon}</li>
          </Tooltip>
        })
      }
    </ul>
  </Flex>
}