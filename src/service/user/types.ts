export interface TUserInfo {
  id: number;
  account: string;
  nickname: string;
  email: string;
  avatar: string;
  level: number;
  forbiden: boolean;
  gmt_create: Date;
  gmt_modified: Date;
}

export interface TUserSearchProps {
  page: number, 
  size: number, 
  keyword?: string, 
  admin?: number, 
  forbiden?: number,
}