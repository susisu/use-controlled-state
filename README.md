# @susisu/use-controlled-state

[![CI](https://github.com/susisu/use-controlled-state/workflows/CI/badge.svg)](https://github.com/susisu/use-controlled-state/actions?query=workflow%3ACI)

``` shell
npm i @susisu/use-controlled-state
# or
yarn add @susisu/use-controlled-state
```

## Motivation
Suppose we have the following React component.

``` tsx
const NumberInput: React.VFC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value.toString()}
      onChange={(event) => onChange(parseFloat(event.target.value))}
    />
  );
};

const MyForm: React.VFC = () => {
  const [number, setNumber] = useState(0);
  return <NumberInput value={number} onChange={setNumber} />;
};
```

Actually this component almost does not work. For example,

- `""` is parsed as `NaN` and then printed as `"NaN"`, so you cannot clear the input
- both `"0"` and `"0."` represents the same number `0`, so you cannot input like `"0.123"`

There are roughly two ways for solving this problem:

- change the parent (`MyForm`) so that it manages the state as a `string`
- change the child (`NumberInput`) so that it manages an additional `string` state and synchronize with `value`

Usually the latter is preferable, because it is completely local to the child input, and the parent does not need to know how the child behaves.

`@susisu/use-controlled-state` provides a utility for managing such local states. With this utility, the above component can be fixed like this:

``` tsx
import { createUseControlledState } from "@susisu/use-controlled-state";

// create a hook
const useControlledNumberString = createUseControlledState(
  (value: number) => value.toString(),
  (state: string) => parseFloat(state)
);

const NumberInput: React.VFC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  // use like useState
  const [string, setString] = useControlledNumberString(value, onChange);
  return (
    <input
      type="text"
      value={string}
      onChange={(event) => setString(event.target.value)}
    />
  );
};

const MyForm: React.VFC = () => {
  const [number, setNumber] = useState(0);
  return <NumberInput value={number} onChange={setNumber} />;
};
```

## Usage
`createUseControlledState(convert, invert, options?)`

- `convert`: The function that converts a parent value into a state.
- `invert` The function that converts a state into a value for the parent.
- `options.equalValue?` The equality function for values. Default is `Object.is`.
- `options.equalState?` The equality function for states. Default is `Object.is`.

### Examples
`number` and `string`

``` ts
const useControlledNumberString = createUseControlledState(
  (value: number) => value.toString(),
  (state: string) => parseFloat(state)
);
```

`Date` and `string`

``` ts
function stringify(date: Date): string {
  try {
    return date.toISOString();
  } catch {
    return "";
  }
}

function parse(text: string): Date {
  if (text === "") {
    return new Date(NaN);
  } else {
    return new Date(text);
  }
}

function equal(a: Date, b: Date): boolean {
  return Object.is(a.getTime(), b.getTime());
}

const useControlledDateString = createUseControlledState(
  stringify,
  parse,
  { equalValue: equal }
);
```

## License

[MIT License](http://opensource.org/licenses/mit-license.php)

## Author

Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
