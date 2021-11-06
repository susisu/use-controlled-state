import { useEffect, useRef, useState } from "react";

export type UseControlledState<V, S> = (
  value: V,
  onChange: (value: V) => void
) => [state: S, setState: (state: S | ((state: S) => S)) => void];

/**
 * createUseControlledState creates a hook that manages a controlled local state.
 * The local state always reflects the parent value, usually in an asymmetric way.
 * Any state updates will be notified to the parent.
 * @param convert The function that converts a parent value into a state.
 * @param invert The function that converts a state into a value for the parent.
 * @param options.equalValue The equality function for values. Default is `Object.is`.
 * @param options.equalState The equality function for states. Default is `Object.is`.
 * @returns The created hook.
 */
export function createUseControlledState<V, S>(
  convert: (value: V) => S,
  invert: (state: S) => V,
  options?: Readonly<{
    equalValue?: (valueA: V, valueB: V) => boolean;
    equalState?: (stateA: S, stateB: S) => boolean;
  }>
): UseControlledState<V, S> {
  const equalValue = options?.equalValue ?? Object.is;
  const equalState = options?.equalState ?? Object.is;

  const useControlledState: UseControlledState<V, S> = (value, onChange) => {
    const [state, setState] = useState(() => convert(value));

    const valueRef = useRef(value);
    const stateRef = useRef(state);

    useEffect(() => {
      const prevValue = valueRef.current;
      const prevState = stateRef.current;
      valueRef.current = value;
      stateRef.current = state;

      // Check the local state first to give higher priority to it.
      if (!equalState(state, prevState)) {
        // Always notify, because the parent value is not necessarily updated synchronously.
        onChange(invert(state));
        // If we do this, some local state updates may be lost.
        // if (!equalState(convert(value), state)) {
        //   onChange(invert(state));
        // }
      } else if (!equalValue(value, prevValue)) {
        // Update only if the local state does not reflect the parent value.
        if (!equalValue(invert(state), value)) {
          setState(() => convert(value));
        }
      }
    }, [value, onChange, state]);

    return [state, setState];
  };

  return useControlledState;
}
