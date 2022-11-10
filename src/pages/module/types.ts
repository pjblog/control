export interface TState {
  name: string,
  version: string,
  registry: string,
  error?: string,
  installing: -1 | 0 | 1 | 2,
  description: string,
  timestamp: number,
}