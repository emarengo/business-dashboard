import '@emotion/react';
import { Fonts, Colors, Icons } from '@thebeatapp/beat-ui';

type CustomTheme = {
  colors: typeof Colors;
  fonts: typeof Fonts;
  icons: typeof Icons;
};

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends CustomTheme {}
}
