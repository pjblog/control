import { Button, Tooltip, Typography } from "antd";
import { ReadOutlined } from '@ant-design/icons';

export function Docs() {
  return <Tooltip title="文档">
    <Typography.Link href="https://docs.pjhome.net" target="_blank">
      <Button icon={<ReadOutlined />} />
    </Typography.Link>
  </Tooltip>
}