export function numberic(defaultValue?: number) {
  return (e: any) => {
    if (!e) return defaultValue || 0;
    return Number(e);
  }
}