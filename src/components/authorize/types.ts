export interface IUserInfoState {
  id: number,
  account: string,
  nickname: string,
  email: string,
  avatar: string,
  forbiden: boolean,
  level: number,
  website: string,
  gmt_create: string | Date,
  gmt_modified: string | Date,
}