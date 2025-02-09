/* eslint-disable @typescript-eslint/no-explicit-any */
type DebounceFunction<T extends (...args: any[]) => void> = (
  func: T,
  delay: number
) => (...args: Parameters<T>) => void;

export const debounce: DebounceFunction<any> = (callback, delay) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
