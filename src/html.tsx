import React from 'react';
import { Scripts, PreLoads, Css, THtmlProps } from '@codixjs/server';

export default function HTML(props: React.PropsWithChildren<THtmlProps<{}>>) {
  return <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="https://avatars.githubusercontent.com/u/108931726?s=200&v=4" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>PJBlog 情怀版 后台管理系统</title>
      <Scripts dataSource={props.assets.headerScripts} />
      <PreLoads dataSource={props.assets.headerPreloadScripts}/>
      <Css dataSource={props.assets.headerCsses} />
    </head>
    <body>
      <div id="root">{props.children}</div>
      <Scripts dataSource={props.assets.bodyScripts} />
    </body>
  </html>
}