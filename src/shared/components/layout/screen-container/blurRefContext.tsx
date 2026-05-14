import { PropsWithChildren, RefObject, createContext, useContext } from 'react';
import { View } from 'react-native';

const BlurRefContext = createContext<RefObject<View | null>>({
  current: null,
});

type BlurRefProviderProps = PropsWithChildren<{
  blurRef: RefObject<View | null>;
}>;

export const BlurRefProvider = ({ children, blurRef }: BlurRefProviderProps) => {
  return <BlurRefContext.Provider value={blurRef}>{children}</BlurRefContext.Provider>;
};

export const useBlurRefContext = () => useContext(BlurRefContext);
