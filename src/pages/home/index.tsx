import React from 'react';
import { useAsync } from '@codixjs/fetch';
import styles from './index.module.less';
import { Button } from 'antd';
export default function HomePage() {
  const { data, success, error, execute, loading } = useAsync('test', () => new Promise<{ a: number }>((resolve, reject) => {
    setTimeout(() => resolve({
      a: Date.now()
    }), 5000);
  }))

  return <div className={styles.bg}>Welcome: 
    <p><Button type="primary" onClick={execute} loading={loading}>{ 
      loading
        ? 'load'
        : success
        ? data.a
        : error.message
    }</Button></p>
  </div>
}