import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TextInput } from 'react-native';

export interface AutoFocusProps {
  onPressIn: () => void;
  ref: () => (el: TextInput | null) => any;
  inputRef: () => (el: TextInput | null) => any;
  onSubmitEditing: () => void;
}

export interface AutoFocusState {
  /** Blur the current TextInput */
  blur: () => void;
  /** List or references */
  refs: MutableRefObject<never[]>;
  /** Get TextInput reference by index */
  getRef: (index: number) => (el: TextInput | null) => void;
  /** Focus the current TextInput */
  focus: (force?: boolean) => void;
  /** Change focus to the next TextInput */
  nextFocus: () => void;
  /** Current TextInput index */
  currentFocus: number;
  /** Set current TextInput by index */
  setCurrentFocus: Dispatch<SetStateAction<number>>;
  /** Returns TextInput props for web like auto focus*/
  autoFocusProps: (index: number) => AutoFocusProps;
}

function useAutoFocus(navigation?: any): AutoFocusState {
  const refs = useRef([]);
  const [currentFocus, setCurrentFocus] = useState(0);
  const mounted = useRef(false);

  const getRef = useCallback(
    (index: number) => {
      return (el: TextInput | null) => {
        (refs.current[index] as TextInput | null) = el;
        if (!mounted.current && el && index === 0) {
          if (navigation) {
            return navigation.addListener('transitionEnd' as any, () => {
              el.focus();
              mounted.current = true;
            });
          } else {
            el.focus();
            mounted.current = true;
          }
        }
      };
    },
    [navigation],
  );

  const nextFocus = () => {
    setCurrentFocus(prev => prev + 1);
  };

  const blur = useCallback(() => {
    const currentElement: TextInput = refs.current[currentFocus];
    if (currentElement) {
      currentElement.blur();
    }
  }, [currentFocus, refs]);

  const focus = useCallback(
    (force = false) => {
      const currentElement: TextInput = refs.current[currentFocus];
      if (currentElement || force) {
        currentElement.focus();
      }
    },
    [currentFocus, refs],
  );

  useEffect(() => {
    const nextElement: TextInput = refs.current[currentFocus];
    if (nextElement && mounted.current) {
      nextElement.focus();
    }
  }, [currentFocus]);

  const autoFocusProps = useCallback(
    index => ({
      onPressIn: () => setCurrentFocus(index),
      ref: () => getRef(index),
      inputRef: () => getRef(index),
      onSubmitEditing: nextFocus,
    }),
    [getRef],
  );

  return {
    refs,
    getRef,
    nextFocus,
    currentFocus,
    blur,
    setCurrentFocus,
    focus,
    autoFocusProps,
  };
}

export default useAutoFocus;
