interface TItem {
  id: number,
  name: string,
}

export interface TArticle {
  id: number,
  title: string,
  summary: string,
  cover: string,
  ctime: string,
  mtime: string,
  category: TItem,
  commentable: boolean,
  tags: TItem[],
  readCount: number,
  comments: number,
  user: {
    id: number,
    account: string,
    nickname: string,
    avatar: string,
    level: number
  }
}

export interface TArticleProps {
  title: string, 
  content: string,
  category: number,
  tags: string[],
}

export interface TMarkdownCompileResult {
  html: string;
  summary?: string;
  cover?: string;
  headings: TMarkdownHeadingProps[];
}

export interface TMarkdownHeadingProps {
  level: number;
  text: string;
  id: string;
}

export interface TArticlePostData {
  title: string;
  category: number;
  tags: string[];
  content: string;
}

export interface TArticleEntity {
  article_category: number,
  article_code: string,
  article_commentable: boolean,
  article_content: string,
  article_cover: string,
  article_headings: { id: string, text: string, level: number }[],
  article_html: string,
  article_read_count: number,
  article_summary: string,
  article_title: string,
  article_user_id: number
  gmt_create: string | Date
  gmt_modified: string | Date
  id: number,
}