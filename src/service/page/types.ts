import { TMarkdownHeadingProps } from "../article";

export interface TPage {
  id: number,
  page_code: string,
  page_content: string,
  page_html: string,
  page_headings: TMarkdownHeadingProps,
  gmt_create: string | Date,
  gmt_modified: string | Date,
}

export interface TPageState {
  id: number,
  code: string,
  content: string,
}