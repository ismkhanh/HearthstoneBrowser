import { renderHook, waitFor } from '@testing-library/react-native';

import { useDebouncedValue } from '../useDebouncedValue';

describe('useDebouncedValue', () => {
  it('returns the initial value immediately', async () => {
    const { result } = await renderHook(() => useDebouncedValue('fire', 50));

    expect(result.current).toBe('fire');
  });

  it('only emits the last value after the delay', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 50),
      { initialProps: { value: 'f' } },
    );

    await rerender({ value: 'fi' });
    await rerender({ value: 'fire' });
    expect(result.current).toBe('f');

    await waitFor(() => expect(result.current).toBe('fire'));
  });
});
