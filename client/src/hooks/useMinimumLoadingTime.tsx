import { useState, useEffect } from 'react';

const useMinimumLoadingTime = (isLoading, minLoadingTime = 1000) => {
  const [isLoadingWithMinTime, setIsLoadingWithMinTime] = useState(true);
  const [loadingStartTimestamp, setLoadingStartTimestamp] = useState(
    Date.now()
  );

  useEffect(() => {
    let timerId;

    if (isLoading) {
      setLoadingStartTimestamp(Date.now());
      setIsLoadingWithMinTime(true);
    } else {
      const timeElapsed = Date.now() - loadingStartTimestamp;
      const remainingTime = Math.max(minLoadingTime - timeElapsed, 0);

      timerId = setTimeout(() => {
        setIsLoadingWithMinTime(false);
      }, remainingTime);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [isLoading, minLoadingTime]);

  return isLoadingWithMinTime;
};

export default useMinimumLoadingTime;
