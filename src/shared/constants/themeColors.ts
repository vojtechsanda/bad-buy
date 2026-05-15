import { rawVars } from '@providers/gluestack-ui-provider/config';

const rgb = (triplet: string) => `rgb(${triplet.replace(/ /g, ', ')})`;
const v = rawVars.light;

export const themeColor = {
  primary500: rgb(v['--color-primary-500']),
  typography400: rgb(v['--color-typography-400']),
  typography900: rgb(v['--color-typography-900']),
} as const;
