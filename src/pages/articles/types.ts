interface Item {
  id: number,
  name: string,
}

export interface IMarkdownHeadingProps {
  level: number,
  text: string,
  id: string,
}

export interface IArticle {
  id: number,
  code: string,
  cover: string,
  ctime: string,
  mtime: string,
  readCount: number,
  summary: string,
  title: string,
  html: string,
  md5: string,
  headings: IMarkdownHeadingProps[],
  category?: Item,
  tags: Item[],
  user: {
    account: string,
    avatar: string,
    id: number,
    level: number,
    nickname: string,
  }
}

export interface ICategoryUnOutabled {
  count: number
  id: number
  name: string
  order: number
}