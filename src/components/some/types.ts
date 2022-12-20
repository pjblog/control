export interface TWidgetConfigBase<U> {
  name: string,
  label: string,
  value: U,
  prefix?: string,
  suffix?: string,
}

export interface TInputBaseProps {
  placeholder?: string,
  allowClear?: boolean,
  maxLength?: number,
  showCount?: boolean,
  status?: 'error' | 'warning',
  size?: 'large' | 'middle' | 'small',
  style?: {
    width: string | number,
  }
}

export interface TInputNumberProps extends TInputBaseProps {
  decimalSeparator?: string,
  max?: number,
  min?: number,
  precision?: number,
  step?: number,
  stringMode?: boolean,
  unit?: string,
}

export interface TCheckboxProps {
  indeterminate?: boolean,
  name?: string,
  checkedChildren?: string,
  unCheckedChildren?: string,
}

export interface TCheckboxGroupProps {
  indeterminate?: boolean,
  options?: string[] | number[] | { label: string, value: any }[],
  name?: string,
}
export interface TTextareaProps extends TInputBaseProps {
  autoSize?: boolean | { minRows: number, maxRows: number }
}

export interface TRadioprops {
  buttonStyle?: 'outline' | 'solid',
  name?: string,
  options?: string[] | number[] | Array<{ label: string, value: any }>,
  direction?: "vertical" | "horizontal",
  size?: 'large' | 'middle' | 'small' | number | [number, number]
}

export interface TSelectProps {
  allowClear?: boolean,
  options?: { label: string, value: any }[],
  placeholder?: string,
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight',
  size?: 'large' | 'middle' | 'small',
  status?: 'error' | 'warning',
  virtual?: boolean,
  style?: {
    width: string | number
  }
}

export interface TSwitchProps {
  size?: 'default' | 'small',
  checkedChildren?: string,
  unCheckedChildren?: string,
}

export interface TTagsProps {
  direction?: 'horizontal' | 'vertical',
  text: string,
  placeholder?: string,
}

export interface TColor {

}

export interface TWidgetConfigProp<U> extends TWidgetConfigBase<U> {
  type: 'text' | 'number' | 'password' | 'checkbox' | 'checkgroup' | 'textarea' | 'radio' | 'select' | 'switch' | 'tags' | 'color',
  text?: TInputBaseProps,
  number?: TInputNumberProps,
  password?: TInputBaseProps,
  checkbox?: TCheckboxProps,
  checkgroup?: TCheckboxGroupProps,
  textarea?: TTextareaProps,
  radio?: TRadioprops,
  select?: TSelectProps,
  switch?: TSwitchProps,
  tags?: TTagsProps,
  color?: TColor,
}