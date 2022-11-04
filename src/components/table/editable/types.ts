import { ColumnsType } from 'antd/lib/table';
export interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: T;
  index: number;
  children: React.ReactNode;
}

export type TGetColumns<T> = (c: (props: React.PropsWithChildren<{ record: T }>) => JSX.Element, r: Function) => ColumnsType<T>;