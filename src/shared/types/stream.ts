export type Stream<T> = (
  onData: (data: T) => void,
  onError: (error: Error) => void,
) => (() => void) | Promise<() => void>;
