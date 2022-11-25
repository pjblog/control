import styles from './index.module.less';
import 'react-photo-view/dist/react-photo-view.css';
import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Space, Typography } from 'antd';

export function Preview(props: React.PropsWithoutRef<{ images: string[] }>) {
  return <PhotoProvider>
    <Space>
    {
      props.images.map(image => {
        return <PhotoView src={image} key={image}>
          <img src={image} alt="" className={styles.preview} />
        </PhotoView>
      })
    }
    </Space>
  </PhotoProvider>
}