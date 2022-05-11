import { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationProp, NavigationState } from '@react-navigation/core';
import { TextInput } from 'react-native';

const useAutoFocus = (navigation: NavigationProp<NavigationState, any>) => {
  const refs = useRef([]);
  const [currentFocus, setCurrentFocus] = useState(0);
  const mounted = useRef(false);

  const getRef = (index: number) => {
    return (el: TextInput | null) => {
      (refs.current[index] as TextInput | null) = el;
    };
  };

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
    const firstElement: TextInput = refs.current[0];
    if (firstElement) {
      if (navigation) {
        return navigation.addListener('transitionEnd' as any, () => {
          firstElement.focus();
          mounted.current = true;
        });
      } else {
        firstElement.focus();
      }
    }
  }, [refs, navigation]);

  useEffect(() => {
    const nextElement: TextInput = refs.current[currentFocus];
    if (nextElement && mounted.current) {
      nextElement.focus();
    }
  }, [currentFocus]);

  return {
    refs,
    getRef,
    nextFocus,
    currentFocus,
    blur,
    setCurrentFocus,
    focus,
  };
};

export default useAutoFocus;
