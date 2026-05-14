import { ScreenContainerProps } from './ScreenContainer';

export function getBackgroundClass(background: NonNullable<ScreenContainerProps['background']>) {
  const backgroundClass = {
    bg: 'bg-background-50',
    surface: 'bg-background-0',
    transparent: 'bg-transparent',
  };

  return backgroundClass[background];
}
