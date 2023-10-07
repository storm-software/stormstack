export function throttle<T extends Array<any>>(
  callback: (...args: T) => unknown,
  wait: number
) {
  let isCalled = false;

  return (...args: T) => {
    if (!isCalled) {
      callback(...args);
      isCalled = true;
      setTimeout(function () {
        isCalled = false;
      }, wait);
    }
  };
}
