import styles from './index.module.less';
import { PropsWithChildren } from "react";
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';

export function Layout(props: PropsWithChildren<{ label?: string }>) {
  return <div className={styles.layout}>
    <div className={styles.sidebar}><Sidebar /></div>
    <div className={styles.main}>
      <div className={styles.navbar}><Navbar label={props.label} /></div>
      <div className={styles.body}>
        <div className={styles.content}>{props.children}</div>
      </div>
    </div>
  </div>
}