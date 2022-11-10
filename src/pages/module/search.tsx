import React, { useCallback, useState } from 'react';
import { Col, message, Row, Table, Input, Select } from 'antd';
const { Option } = Select;

export function Search(props: React.PropsWithoutRef<{
  onSearch: (e: string) => void
}>) {
  const [prefix, setPrefix] = useState<string>('pjblog-theme-');
  const submit = useCallback((e: string) => {
    if (!e || !e.trim()) return;
    props.onSearch(prefix + e.trim());
  }, [props.onSearch, prefix]);
  return <Input.Group compact>
    <Select value={prefix} onChange={e => setPrefix(e)}>
      <Option value="pjblog-theme-">pjblog-theme-</Option>
      <Option value="pjblog-plugin-">pjblog-plugin-</Option>
    </Select>
    <Input.Search placeholder="输入名称..." style={{ width: 300 }} enterButton="安装" onSearch={submit} />
  </Input.Group>
}