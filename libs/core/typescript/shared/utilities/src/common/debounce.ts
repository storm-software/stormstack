export function debounce<T extends Function>(callback: T, wait = 20) {
  let timeout!: NodeJS.Timeout;
  let callable = (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
  return <T>(<any>callable);
}
