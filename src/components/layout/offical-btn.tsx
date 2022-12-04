import { Button, Tooltip, Typography } from "antd";
import { ChromeOutlined } from '@ant-design/icons';

export function Offical() {
  return <Tooltip title="官网">
    <Typography.Link href="https://www.pjhome.net" target="_blank">
      <Button icon={<ChromeOutlined />} />
    </Typography.Link>
  </Tooltip>
}