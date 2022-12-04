import { Flex } from "../flex";
import { Space } from 'antd';
import { Position } from './position';
import { PostArticle } from './post-article-btn';
import { Offical } from './offical-btn';
import { Docs } from './docs-btn';
import { Exit } from './exit-btn';
import { PropsWithoutRef } from "react";

export function Navbar(props: PropsWithoutRef<{}>) {
  return <Flex align="between" block valign="middle" scroll="hide">
    <Position />
    <Space>
      <PostArticle />
      <Offical />
      <Docs />
      <Exit />
    </Space>
  </Flex>
}