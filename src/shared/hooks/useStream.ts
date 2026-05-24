import type { Stream } from '@shared/types/stream';
import { useEffect, useRef, useState } from 'react';

export type StreamState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export function useStream<T>(stream: Stream<T>): StreamState<T> {
  const [state, setState] = useState<StreamState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const streamRef = useRef(stream);
  streamRef.current = stream;

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const result = streamRef.current(
      (data) => {
        if (!cancelled) setState({ data, error: null, isLoading: false });
      },
      (error) => {
        if (!cancelled)
          setState((previousState) => ({ ...previousState, error, isLoading: false }));
      },
    );

    if (result instanceof Promise) {
      result.then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else cleanup = unsubscribe;
      });
    } else {
      cleanup = result;
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return state;
}
