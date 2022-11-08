export interface TCommentRawState {
  id: number,
  html: string,
  uid: number,
  nickname: string,
  account: string,
  avatar: string,
  level: number,
  rid: number,
  ip: string,
  ctime: string | Date,
  title: string,
  aid: number,
  code: string
}

export interface TCommentState {
  id: number,
  html: string,
  ip: string,
  ctime: string | Date,
  rid: number,
  user: {
    id: number,
    nickname: string,
    account: string,
    avatar: string,
    level: number,
  },
  article: {
    id: number,
    title: string,
    code: string,
  },
  replies?: TCommentState[],
}