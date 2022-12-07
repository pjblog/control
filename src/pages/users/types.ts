export interface TUserSearchProps {
  page: number, 
  size: number, 
  keyword?: string, 
  admin?: number, 
  forbiden?: number,
}

export interface TActivedUser {
  id: number,
  nickname: string,
  account: string,
  avatar: string,
  count: number,
}