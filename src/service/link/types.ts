export interface TLinkState {
  id: number,
  link_name: string,
  link_icon: string,
  link_url: string,
  link_status: boolean,
  link_topable: boolean,
  gmt_create: Date,
}

export function createNewLinkState(): TLinkState {
  return {
    id: 0,
    link_name: null,
    link_icon: null,
    link_url: null,
    link_status: false,
    link_topable: false,
    gmt_create: new Date()
  }
}

export interface TLinkPostState {
  name: string,
  icon: string,
  url: string,
}