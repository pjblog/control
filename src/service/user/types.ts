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

export interface TVisitor {
  id: number,
  code: string,
  gmt_create: string | Date,
  ip: string,
  user_agent: string,
}

export interface TActivedUser {
  id: number,
  nickname: string,
  account: string,
  avatar: string,
  count: number,
}