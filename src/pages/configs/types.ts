export interface TBlogConfigsProps {
  blog_name: string,
  blog_domain: string,
  blog_favicon_url: string,
  blog_description: string,
  blog_keywords: string,
  blog_copyright: string,
  blog_icp: string,
  blog_close: boolean,
  blog_notice: string,
  blog_registable: boolean,
  blog_login_expires: number,
  blog_user_session_expire: number,
  blog_user_online_expire: number,
  blog_user_statistic_delay: number,
  blog_article_size: number,
  blog_article_search_mode: boolean,
  blog_article_order_mode: boolean,
  blog_article_prerender: boolean,
  blog_article_commentable: boolean,
  blog_comment_size: number,
  blog_use_npmmirror: boolean,
  gmt_create: Date,
  gmt_modified: Date,
  id: number,
}

export type InputType = 'button' 
  | 'checkbox' 
  | 'color' 
  | 'date' 
  | 'datetime-local' 
  | 'email' 
  | 'file' 
  | 'hidden' 
  | 'image' 
  | 'month' 
  | 'number' 
  | 'password' 
  | 'radio' 
  | 'range' 
  | 'reset' 
  | 'search' 
  | 'submit' 
  | 'tel' 
  | 'text' 
  | 'time' 
  | 'url' 
  | 'week';

export interface TInput {
  type?: InputType,
  style?: Record<string, any>,
  maxLength?: number,
  showCount?: boolean,
  allowClear?: boolean,
  placeholder?: string,
}

export interface TTextarea extends Omit<TInput, 'type'> {
  autoSize?: boolean | {
    minRows?: number,
    maxRows?: number,
  }
}

export interface TInputNumber {
  style?: Record<string, any>,
  min?: number,
  max?: number,
  step?: number,
  unit?: string,
}

export interface TSwitch {
  checkedChildren?: string,
  unCheckedChildren?: string,
  reverse?: boolean,
}

export interface TRadio<T extends string | number> {
  vertical?: boolean,
  options: {
    label: string,
    value: T
  }
}

export interface TSelect<T extends string | number> {
  width?: string | number,
  options: {
    label: string,
    value: T
  }
}

export interface TCheckbox {
  checkedText: string,
  uncheckedText: string,
  reverse?: boolean,
}

export interface TComponents {
  input: TInput,
  textarea: TTextarea,
  number: TInputNumber,
  switch: TSwitch,
  radio: TRadio<string | number>,
  select: TSelect<string | number>,
  checkbox: TCheckbox
}

export interface TConfigsState {
  name: string,
  title: string,
  component: keyof TComponents,
  prevfixText?: string,
  suffixText?: string,
  options: TComponents[keyof TComponents],
}

export interface TConfigsGroup {
  name: string,
  title: string,
  subTitle?: string,
  options: TConfigsState[],
}