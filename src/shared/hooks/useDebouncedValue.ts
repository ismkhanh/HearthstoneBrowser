import { useEffect, useState } from 'react';

// avoids search api from firing on every keystroke
export function useDebouncedValue<T>(value: T, delayMs = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
