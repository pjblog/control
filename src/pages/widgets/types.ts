import { TWidgetConfigProp } from "src/components/some/types";

export interface IPackageMeta {
  type: 'plugin' | 'theme',
  name: string,
  version: string,
  descriptions: string,
  repository: string,
  homepage: string,
  dictionary: string,
  extends?: Record<string, string>,
  icon: string,
  previews?: string[],
  advance?: string,
}

export interface IPackage<T = any> {
  rules: TWidgetConfigProp<T>[],
  values: T,
  meta: IPackageMeta,
}

export type IPackages = Record<string, IPackage>;