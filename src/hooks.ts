import { useRequestRouter, Path } from '@codixjs/codix';
import callback from './pages/index';
export type TCallbackReturnType = ReturnType<typeof callback>;
export function usePath<U extends keyof TCallbackReturnType>(id: U) {
  return useRequestRouter<TCallbackReturnType>(id) as TCallbackReturnType[U];
}