import useAutoFocus from '..';
import { renderHook } from '@testing-library/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { act } from 'react-test-renderer';

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: jest.fn(),
}));

describe('useAutoFocus', () => {
  let mockAddListener = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockImplementation(() => ({
      addListener: mockAddListener,
    }));
  });

  it('should set the ref', () => {
    const { result } = renderHook(() => useAutoFocus());
    const { getRef, refs, currentFocus } = result.current;
    const mockEl = {
      focus: jest.fn(),
    };
    act(() => getRef(0)(mockEl as any));

    expect(refs.current[0]).toBe(mockEl);
    expect(currentFocus).toBe(0);
  });

  it('should set nextFocus', () => {
    const { result } = renderHook(() => useAutoFocus());
    const { getRef, refs, nextFocus } = result.current;
    const mockEl0 = {
      focus: jest.fn(),
    };
    const mockEl1 = {
      focus: jest.fn(),
    };
    getRef(0)(mockEl0 as any);
    getRef(1)(mockEl1 as any);
    expect(refs.current[0]).toBe(mockEl0);
    expect(refs.current[1]).toBe(mockEl1);

    const { currentFocus: beforeFocus } = result.current;
    expect(beforeFocus).toBe(0);

    act(() => nextFocus());

    const { currentFocus } = result.current;

    expect(currentFocus).toBe(1);
    expect(mockEl0.focus).toHaveBeenCalledTimes(1);
    expect(mockEl1.focus).toHaveBeenCalledTimes(1);
  });

  it('should set nextFocus with react-navigation', () => {
    (useNavigation as jest.Mock).mockImplementation(() => ({
      addListener: (event: string, callback: Function) => {
        if (event === 'transitionEnd') {
          callback();
        }
      },
    }));
    const navigation = useNavigation();
    const { result } = renderHook(() => useAutoFocus(navigation));
    const { getRef, refs, nextFocus } = result.current;
    const mockEl0 = {
      focus: jest.fn(),
    };
    const mockEl1 = {
      focus: jest.fn(),
    };
    getRef(0)(mockEl0 as any);
    getRef(1)(mockEl1 as any);
    expect(refs.current[0]).toBe(mockEl0);
    expect(refs.current[1]).toBe(mockEl1);

    const { currentFocus: beforeFocus } = result.current;
    expect(beforeFocus).toBe(0);

    act(() => nextFocus());

    const { currentFocus } = result.current;

    expect(currentFocus).toBe(1);
    expect(mockEl0.focus).toHaveBeenCalledTimes(1);
    expect(mockEl1.focus).toHaveBeenCalledTimes(1);
  });

  it('should blur', () => {
    const { result } = renderHook(() => useAutoFocus());
    const { getRef, refs, blur } = result.current;
    const mockEl = {
      focus: jest.fn(),
      blur: jest.fn(),
    };
    getRef(0)(mockEl as any);
    expect(refs.current[0]).toBe(mockEl);

    act(() => blur());

    const { currentFocus } = result.current;

    expect(currentFocus).toBe(0);
    expect(mockEl.blur).toHaveBeenCalledTimes(1);
  });

  it('should not call blur', () => {
    const { result } = renderHook(() => useAutoFocus());
    const { getRef, refs, blur } = result.current;
    const mockEl = null;
    getRef(0)(mockEl as any);
    expect(refs.current[0]).toBe(mockEl);

    act(() => blur());

    const { currentFocus } = result.current;

    expect(currentFocus).toBe(0);
  });

  it('should set currentFocus', () => {
    (useNavigation as jest.Mock).mockImplementation(() => ({
      addListener: (event: string, callback: Function) => {
        if (event === 'transitionEnd') {
          callback();
        }
      },
    }));
    const { result } = renderHook(() => useAutoFocus());

    const { getRef, refs, setCurrentFocus } = result.current;
    const mockEl0 = {
      focus: jest.fn(),
      blur: jest.fn(),
    };
    const mockEl1 = {
      focus: jest.fn(),
      blur: jest.fn(),
    };
    getRef(0)(mockEl0 as any);
    getRef(1)(mockEl1 as any);
    expect(refs.current[0]).toBe(mockEl0);
    expect(refs.current[1]).toBe(mockEl1);

    act(() => setCurrentFocus(1));

    const { currentFocus } = result.current;

    expect(currentFocus).toBe(1);
    expect(mockEl1.focus).toHaveBeenCalledTimes(1);
    expect(mockEl0.focus).toHaveBeenCalledTimes(1);
  });

  it('should not call focus until transitionEnd', () => {
    (useNavigation as jest.Mock).mockImplementation(() => ({
      addListener: (event: string) => {
        if (event === 'transitionEnd') {
          // callback();
        }
      },
    }));
    const navigation = useNavigation();
    const { result } = renderHook(() => useAutoFocus(navigation));

    const { getRef, refs, setCurrentFocus } = result.current;
    const mockEl0 = {
      focus: jest.fn(),
      blur: jest.fn(),
    };
    const mockEl1 = {
      focus: jest.fn(),
      blur: jest.fn(),
    };
    getRef(0)(mockEl0 as any);
    getRef(1)(mockEl1 as any);
    expect(refs.current[0]).toBe(mockEl0);
    expect(refs.current[1]).toBe(mockEl1);

    act(() => setCurrentFocus(1));

    const { currentFocus } = result.current;

    expect(currentFocus).toBe(1);
    expect(mockEl0.focus).toHaveBeenCalledTimes(0);
    expect(mockEl1.focus).toHaveBeenCalledTimes(0);
  });

  it('should call focus', () => {
    const { result } = renderHook(() => useAutoFocus());
    const { getRef, refs, focus } = result.current;
    const mockEl = {
      focus: jest.fn(),
      blur: jest.fn(),
    };
    getRef(0)(mockEl as any);
    expect(refs.current[0]).toBe(mockEl);

    act(() => focus());

    const { currentFocus } = result.current;

    expect(currentFocus).toBe(0);
    expect(mockEl.focus).toHaveBeenCalledTimes(2);
  });

  it('should not call focus', () => {
    const { result } = renderHook(() => useAutoFocus());
    const { getRef, refs, focus } = result.current;
    const mockEl = null;
    getRef(0)(mockEl as any);
    expect(refs.current[0]).toBe(mockEl);

    act(() => focus());

    const { currentFocus } = result.current;

    expect(currentFocus).toBe(0);
  });

  it('should return autoFocusProps', () => {
    const { result } = renderHook(() => useAutoFocus());
    const { autoFocusProps } = result.current;
    const props = autoFocusProps(0);

    expect(props).toHaveProperty('onPressIn');
    expect(props).toHaveProperty('ref');
    expect(props).toHaveProperty('inputRef');
    expect(props).toHaveProperty('onSubmitEditing');
  });
});
