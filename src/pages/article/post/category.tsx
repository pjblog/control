import React, { useMemo } from 'react';
import { Select } from 'antd';
import { getCategoriesByShort, useBaseRequestConfigs } from '../../../service';
import { useAsync } from '@codixjs/fetch';

export function CategorySelect(props: React.PropsWithRef<{
  value: number,
  setValue: (val: number) => void,
}>) {
  const configs = useBaseRequestConfigs();
  const { data, loading } = useAsync('categories:short', () => getCategoriesByShort(configs));
  const options = useMemo(() => [{
    label: '请选择分类',
    value: 0,
  }].concat(data.map(dat => {
    return {
      label: dat.name + '(' + dat.count + ')',
      value: dat.id
    }
  })), [data])
  return <Select loading={loading} value={props.value} onChange={e => props.setValue(e)} options={options} />
}