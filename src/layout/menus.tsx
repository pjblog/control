import React from "react";
import { SettingFilled, SignalFilled, ReadFilled, SkinFilled, RobotFilled, HomeFilled, LayoutFilled, ContainerFilled, FlagFilled, PieChartFilled, FileTextFilled } from '@ant-design/icons';
import { TCallbackReturnType } from '../hooks';
import { Path } from '@codixjs/codix';

export type TMenu<T extends keyof TCallbackReturnType> = {
  label: string,
  icon: React.ReactNode,
  code?: T,
  props?: TCallbackReturnType[T] extends Path<infer U> ? U : unknown,
}

export type TMenus = [
  TMenu<'HOME'>,
  TMenu<'SETTING'>,
  TMenu<'CATEGORY'>,
  TMenu<'ARTICLE'>,
  TMenu<'COMMENT'>,
  TMenu<'PAGE'>,
  TMenu<'USER'>,
  TMenu<'LINK'>,
  TMenu<'MODULE'>,
  TMenu<'THEME'>,
  TMenu<'PLUGIN'>,
];

export const menus: TMenus = [
  {
    label: '首页',
    icon: <HomeFilled />,
    code: 'HOME',
  },
  {
    label: '设置',
    icon: <SettingFilled />,
    code: 'SETTING',
  },
  {
    label: '分类',
    icon: <SignalFilled />,
    code: 'CATEGORY',
  },
  {
    label: '文章',
    icon: <ReadFilled />,
    code: 'ARTICLE'
  },
  {
    label: '评论',
    icon: <FlagFilled />,
    code: 'COMMENT'
  },
  {
    label: '单页',
    icon: <FileTextFilled />,
    code: 'PAGE'
  },
  {
    label: '用户',
    icon: <SkinFilled />,
    code: 'USER'
  },
  {
    label: '友情链接',
    icon: <RobotFilled />,
    code: 'LINK'
  },
  {
    label: '模块安装',
    icon: <PieChartFilled />,
    code: 'MODULE'
  },
  {
    label: '主题',
    icon: <LayoutFilled />,
    code: 'THEME'
  },
  {
    label: '插件',
    icon: <ContainerFilled />,
    code: 'PLUGIN'
  }
]