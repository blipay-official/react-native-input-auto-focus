# react-native-input-auto-focus

A lightweight React Native hook for managing sequential TextInput focus. Automatically focuses the first input on mount and provides helpers to move focus forward as the user submits each field — great for login screens, forms, and multi-step flows.

Works with both standalone screens and [React Navigation](https://reactnavigation.org/) (waits for the screen transition to finish before focusing).

## Features

- Auto-focuses the first input on mount
- Moves focus to the next input on submit with a single function call
- Supports React Navigation's `transitionEnd` event to avoid focusing during screen animations
- Provides a shorthand `autoFocusProps` helper that bundles `ref`, `onSubmitEditing`, and `onPressIn` into one spread
- Exposes manual `focus`, `blur`, and `setCurrentFocus` for full programmatic control
- Written in TypeScript with full type definitions

## Installation

```bash
yarn add react-native-input-auto-focus
```

or

```bash
npm install react-native-input-auto-focus
```

### Peer dependencies

This library requires `react` (>= 17.0.2) and `react-native` (>= 0.67.1). These are listed as peer dependencies and are not installed automatically.

## Quick start

```tsx
import React from 'react';
import { TextInput, View } from 'react-native';
import useAutoFocus from 'react-native-input-auto-focus';

const LoginScreen = () => {
  const { getRef, nextFocus } = useAutoFocus();

  return (
    <View>
      <TextInput
        ref={getRef(0)}
        onSubmitEditing={nextFocus}
        returnKeyType="next"
        placeholder="Email (focused automatically on mount)"
      />

      <TextInput
        ref={getRef(1)}
        onSubmitEditing={nextFocus}
        returnKeyType="next"
        placeholder="Password (focused after first submit)"
      />

      <TextInput
        ref={getRef(2)}
        returnKeyType="done"
        placeholder="Confirm password (focused after second submit)"
      />
    </View>
  );
};
```

The first input (`getRef(0)`) is focused automatically when the component mounts. Each call to `nextFocus` advances focus to the next index.

## Usage with React Navigation

When navigating between screens, focusing an input before the transition finishes can cause visual glitches. Pass the `navigation` object to `useAutoFocus` and the first input will wait for the `transitionEnd` event before focusing.

```tsx
import React from 'react';
import { TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAutoFocus from 'react-native-input-auto-focus';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { getRef, nextFocus } = useAutoFocus(navigation);

  return (
    <View>
      <TextInput
        ref={getRef(0)}
        onSubmitEditing={nextFocus}
        returnKeyType="next"
        placeholder="Focused after the screen transition ends"
      />

      <TextInput
        ref={getRef(1)}
        onSubmitEditing={nextFocus}
        returnKeyType="next"
        placeholder="Focused after first submit"
      />

      <TextInput
        ref={getRef(2)}
        returnKeyType="done"
        placeholder="Focused after second submit"
      />
    </View>
  );
};
```

## Using `autoFocusProps`

`autoFocusProps` is a shorthand that returns `ref`, `inputRef`, `onSubmitEditing`, and `onPressIn` in a single object — reducing boilerplate when you have many inputs.

```tsx
import React from 'react';
import { TextInput, View } from 'react-native';
import useAutoFocus from 'react-native-input-auto-focus';

const ProfileForm = () => {
  const { autoFocusProps } = useAutoFocus();

  return (
    <View>
      <TextInput
        {...autoFocusProps(0)}
        returnKeyType="next"
        placeholder="First name"
      />

      <TextInput
        {...autoFocusProps(1)}
        returnKeyType="next"
        placeholder="Last name"
      />

      <TextInput
        {...autoFocusProps(2)}
        returnKeyType="done"
        placeholder="Bio"
      />
    </View>
  );
};
```

Spreading `autoFocusProps(index)` is equivalent to writing:

```tsx
<TextInput
  ref={getRef(index)}
  inputRef={getRef(index)}
  onPressIn={() => setCurrentFocus(index)}
  onSubmitEditing={nextFocus}
/>
```

The `onPressIn` handler keeps `currentFocus` in sync when the user taps an input directly (instead of reaching it through sequential submits).

## API Reference

### `useAutoFocus(navigation?)`

| Parameter | Type | Description |
|---|---|---|
| `navigation` | `object` (optional) | A React Navigation navigator. When provided, the first input focuses after the `transitionEnd` event instead of immediately on mount. |

#### Return value

| Property | Type | Description |
|---|---|---|
| `getRef(index)` | `(index: number) => (el: TextInput \| null) => void` | Returns a ref callback to assign to a TextInput at the given index. Index `0` triggers auto-focus on mount. |
| `nextFocus()` | `() => void` | Advances focus to the next input (increments `currentFocus` by 1). |
| `currentFocus` | `number` | The index of the currently focused input. |
| `setCurrentFocus(index)` | `Dispatch<SetStateAction<number>>` | Manually set which input is focused by index. |
| `focus(force?)` | `(force?: boolean) => void` | Programmatically focus the current input. Pass `true` to force focus even if the ref is missing. |
| `blur()` | `() => void` | Blur the currently focused input. |
| `refs` | `MutableRefObject<TextInput[]>` | The underlying array of TextInput refs, for advanced use cases. |
| `autoFocusProps(index)` | `(index: number) => AutoFocusProps` | Returns an object with `ref`, `inputRef`, `onPressIn`, and `onSubmitEditing` — ready to spread onto a TextInput. |

### `AutoFocusProps`

```typescript
interface AutoFocusProps {
  ref: (el: TextInput | null) => void;
  inputRef: (el: TextInput | null) => void;
  onPressIn: () => void;
  onSubmitEditing: () => void;
}
```

## Advanced usage

### Programmatic focus control

You can jump to any input or blur the current one programmatically:

```tsx
const { setCurrentFocus, blur, focus } = useAutoFocus();

// Jump to the third input
setCurrentFocus(2);

// Blur whatever input is currently focused
blur();

// Re-focus the current input
focus();
```

### Using with custom input components

If your custom input component forwards refs to the underlying TextInput, `getRef` works out of the box:

```tsx
const { getRef, nextFocus } = useAutoFocus();

return (
  <View>
      <CustomInput ref={getRef(0)} onSubmitEditing={nextFocus} />
      <CustomInput ref={getRef(1)} onSubmitEditing={nextFocus} />
  </View>
)
```

If your component uses a prop like `inputRef` instead of `ref`, use `autoFocusProps` which provides both:

```tsx
const { autoFocusProps } = useAutoFocus();

return (
  <CustomInput {...autoFocusProps(0)} />
)
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
