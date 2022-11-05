export interface BlogCategoryEntity {
  id: number;
  cate_name: string;
  cate_order: number;
  cate_outable: boolean;
  cate_outlink: string;
  gmt_create: Date;
  gmt_modified: Date;
}

export function createNewBlogCategoryEntity(): BlogCategoryEntity {
  return {
    id: 0,
    cate_name: null,
    cate_order: 99,
    cate_outable: false,
    cate_outlink: null,
    gmt_create: new Date(),
    gmt_modified: new Date(),
  }
}

export interface TUnOutableCategoryState {
  id: number,
  name: string,
  count: number
}