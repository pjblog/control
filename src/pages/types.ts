export interface TBlogPackageMarker {
  name: string,
  version: string,
  description: string,
  pjblog: {
    type: 'theme' | 'plugin',
    icon: string,
    extends?: Record<string, string>, // 主题
    previews?: string[],
  }
}

export type TBlogPackageState = TBlogPackageMarker['pjblog'] & {
  dictionary: string,
  packageFile: string,
  version: string,
  name: string,
  description: string,
  README: string,
}

export interface TMeta {
  type: 'plugin' | 'theme',
  name: string,
  version: string,
  descriptions: string,
  repository: string,
  homepage: string,
  dictionary: string,
  readme: string,
  extends?: Record<string, string>,
  icon: string,
  previews?: string[],
  advance?: {
    index: string,
    public: string,
  }
}