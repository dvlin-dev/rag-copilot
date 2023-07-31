import { useRef, useEffect } from 'react';

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, [callback]);
};

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export default useLatest;
