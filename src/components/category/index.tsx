import { Tag } from 'antd';
import React, { useMemo } from 'react';
import styles from './index.module.less';
import { Flex } from '../../components';
import { useAsync } from '@codixjs/fetch';
import { getCategoriesByShort, useBaseRequestConfigs } from '../../service';

export function Categories(props: React.PropsWithoutRef<{
  value: number,
  setValue: (val: number) => void,
}>) {
  const configs = useBaseRequestConfigs();
  const { data } = useAsync('categories:short', () => getCategoriesByShort(configs));
  const total = useMemo(() => data.reduce((prev, next) => prev + Number(next.count), 0), [data])
  return <Flex gap={16}>
    {/* <span className={styles.label}>分类</span> */}
    <Flex span={1}>
      <Tag.CheckableTag checked={props.value === 0} onClick={() => props.setValue(0)}>全部({total})</Tag.CheckableTag>
      {
        data.map(category => {
          return <Tag.CheckableTag 
            key={category.id} 
            checked={category.id === props.value}
            onClick={() => props.setValue(category.id)}
          >{category.name}({category.count})</Tag.CheckableTag>
        })
      }
    </Flex>
  </Flex>
}