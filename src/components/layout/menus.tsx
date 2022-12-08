import { ReactNode } from "react";
import createRouters from '../../pages'
import { 
  HomeFilled, 
  SettingFilled,
  TagsFilled,
  FileTextFilled,
  RobotFilled,
  GiftFilled,
} from '@ant-design/icons';

export const Menus: {
  icon: ReactNode,
  code: keyof ReturnType<typeof createRouters>,
  label: string,
}[] = [
  {
    icon: <HomeFilled />,
    code: 'HOME',
    label: '大盘统计'
  },
  {
    icon: <SettingFilled />,
    code: 'CONFIGS',
    label: '全局设置'
  },
  {
    icon: <TagsFilled />,
    code: 'CATEGORIES',
    label: '分类管理'
  },
  {
    icon: <FileTextFilled />,
    code: 'ARTICLES',
    label: '文章列表'
  },
  {
    icon: <RobotFilled />,
    code: 'USERS',
    label: '成员列表'
  },
  {
    icon: <GiftFilled />,
    code: 'WIDGETS',
    label: '模块安装'
  }
]