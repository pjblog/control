import { Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { usePath } from '../../hooks';
export function PostArticle() {
  const path = usePath('POST_ARTICLE');
  return <Tooltip title="新建文章">
    <Button type="primary" onClick={() => path.redirect()} icon={<PlusOutlined />} />
  </Tooltip>
}