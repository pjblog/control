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
  tags: TItem[],
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