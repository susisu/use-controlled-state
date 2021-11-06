import { act, renderHook } from "@testing-library/react-hooks";
import { UseControlledState, createUseControlledState } from ".";

describe("createUseControlledState", () => {
  describe("created hook", () => {
    type TestHook = (props: TestHookProps) => ReturnType<UseControlledState<number, string>>;
    type TestHookProps = Readonly<{ value: number; onChange: (value: number) => void }>;
    const convert = (value: number): string => value.toString();
    const invert = (state: string): number => parseFloat(state);
    const useNumberStringRaw = createUseControlledState(convert, invert);
    const useNumberString: TestHook = ({ value, onChange }) => useNumberStringRaw(value, onChange);

    it("updates the local state so that it reflects the parent value", () => {
      const onChange = jest.fn(() => {});
      const t = renderHook(useNumberString, {
        initialProps: {
          value: 1.23,
          onChange,
        },
      });
      expect(t.result.current[0]).toBe("1.23");
      expect(onChange).toHaveBeenCalledTimes(0);

      t.rerender({ value: 0.123, onChange });
      expect(t.result.current[0]).toBe("0.123");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(0.123);
    });

    it("notifies local state updates to the parent", () => {
      const onChange = jest.fn(() => {});
      const t = renderHook(useNumberString, {
        initialProps: {
          value: 1.23,
          onChange,
        },
      });
      expect(t.result.current[0]).toBe("1.23");
      expect(onChange).toHaveBeenCalledTimes(0);

      act(() => {
        t.result.current[1]("0.123");
      });
      expect(t.result.current[0]).toBe("0.123");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(0.123);
    });

    it("notifies but does not update if the local state and the parent value are synchronized", () => {
      const onChange = jest.fn(() => {});
      const t = renderHook(useNumberString, {
        initialProps: {
          value: 1.23,
          onChange,
        },
      });
      expect(t.result.current[0]).toBe("1.23");
      expect(onChange).toHaveBeenCalledTimes(0);

      act(() => {
        t.result.current[1]("1.230");
      });
      expect(t.result.current[0]).toBe("1.230");
      // notifies the local state update, even though the parent value is the same
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(1.23);

      t.rerender({ value: 1.23, onChange });
      // does not update the local state, because it represents the same value
      expect(t.result.current[0]).toBe("1.230");
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("calls equalValue and equalState to compare values and states", () => {
      const equalValue = jest.fn(Object.is);
      const equalState = jest.fn(Object.is);
      const useNumberStringRaw = createUseControlledState(convert, invert, {
        equalValue,
        equalState,
      });
      const useNumberString: TestHook = ({ value, onChange }) =>
        useNumberStringRaw(value, onChange);

      const t = renderHook(useNumberString, {
        initialProps: {
          value: 1.23,
          onChange: () => {},
        },
      });

      act(() => {
        t.result.current[1]("0.123");
      });
      expect(equalState).toHaveBeenCalledWith("0.123", "1.23");

      t.rerender({ value: 0.123, onChange: () => {} });
      expect(equalValue).toHaveBeenCalledWith(0.123, 1.23);
    });
  });
});
