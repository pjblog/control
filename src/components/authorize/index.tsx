import { createContext, PropsWithChildren, useContext } from "react";
import { useGetAsync } from '../request';
import { IUserInfoState } from './types';
import { Login } from './login';
import { Result } from 'antd';

const AuthorizeContext = createContext<IUserInfoState>(null);
const AuthorizeReloadContext = createContext<() => void>(() => {});

export function Authorize(props: PropsWithChildren<{}>) {
  const { data, error, execute } = useGetAsync<IUserInfoState>({
    id: 'authorize',
    url: '/-/me'
  })

  if (error) {
    if (error?.code === 401) {
      return <Login reload={execute} />
    }
    return <Result
      status="500"
      title="500"
      subTitle={error.message}
    />
  }

  return <AuthorizeContext.Provider value={data}>
    <AuthorizeReloadContext.Provider value={execute}>
      {props.children}
    </AuthorizeReloadContext.Provider>
  </AuthorizeContext.Provider>
}

export function useAuthorize() {
  return useContext(AuthorizeContext);
}

export function useAuthorizeReload() {
  return useContext(AuthorizeReloadContext);
}