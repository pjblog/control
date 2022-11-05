import { ColumnsType } from 'antd/lib/table';
import React from 'react';
export interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  editable: boolean,
  edittype: React.ReactNode,
  title: any;
  record: T;
  index: number;
  children: React.ReactNode;
}

export interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  temp: boolean,
}

export type TGetColumns<T> = (c: (props: React.PropsWithChildren<{ record: T }>) => JSX.Element, r: Function) => ColumnsType<T>;