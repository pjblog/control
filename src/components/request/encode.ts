import MD5 from 'crypto-js/md5';
export function makeSign(timestamp: number, querys: Record<any, any>, body: Record<any, any>) {
  const queryString = encodeJSON(querys);
  const bodyString = encodeJSON(body, true);
  const str = `${timestamp}{#${queryString}#${bodyString}#}`;
  return MD5(str).toString();
}

export function encodeSign(...args: any[]) {
  const str = encodeArray(args);
  return MD5(str).toString();
}

function encodeJSON(state: Record<any, any>, strict?: boolean) {
  const pools: string[] = [];
  Object.keys(state).sort().forEach(key => {
    const value = state[key];
    if (value !== undefined) {
      if (value === null && !strict) return;
      pools.push(`${key}:${gernerator(value)}`);
    }
  })
  return '{' + pools.join(',') + '}';
}

function encodeArray(state: any[]) {
  return '[' + state.map(value => gernerator(value)).join(',') + ']';
}

function gernerator(value: any): string {
  if (typeof value === 'number') return value + '';
  if (typeof value === 'bigint') return value + '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === null) return '$<null>$';
  if (value === undefined) return '$<undefined>$';
  if (Array.isArray(value)) return encodeArray(value);
  if (typeof value === 'object') return encodeJSON(value);
  return String(value);
}
