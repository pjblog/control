export interface TBlogPackageMarker {
  name: string,
  version: string,
  description: string,
  pjblog: {
    type: 'theme' | 'plugin',
    icon: string,
    plugins?: Record<string, string>, // 主题
    previews?: string[],
  }
}

export type TBlogPackageState = TBlogPackageMarker['pjblog'] & {
  dictionary: string,
  packageFile: string,
  version: string,
  name: string,
  description: string,
}