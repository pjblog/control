import React, { createContext, useContext } from 'react';
import { TUserInfo } from '../service'
export const AdminUserInfoContext = createContext<TUserInfo>(null);
export function useAdminInfo() {
  return useContext(AdminUserInfoContext);
}