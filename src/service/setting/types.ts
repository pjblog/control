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
  options: TConfigsState[],
}
  

export interface TBlogSettingProps {
  blog_cache_namespace: string,
  blog_close: boolean,
  blog_description: string,
  blog_login_expires: number,
  blog_name: string,
  blog_theme: string,
  gmt_create: Date,
  gmt_modified: Date,
  id: number,
}

export interface TDiskState {
  Filesystem: string,
  Blocks: number,
  Used: number,
  Available: number,
  Capacity: string,
  Mounted: string,
}