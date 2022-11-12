import 'react-photo-view/dist/react-photo-view.css';
import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Typography } from 'antd';

export function Preview(props: React.PropsWithoutRef<{ images: string[] }>) {
  return <PhotoProvider>
    {
      props.images.map((image, index) => {
        return <PhotoView src={image} key={image}>
          {
            index === 0 
              ? <Typography.Link>预览</Typography.Link>
              : null
          }
        </PhotoView>
      })
    }
  </PhotoProvider>
}