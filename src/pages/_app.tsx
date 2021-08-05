import { ThemeProvider } from 'styled-components';
import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import NextNprogress from 'nextjs-progressbar';

import { theme } from '../styles/theme';
import { GlobalStyles } from '../styles/global-styles';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <NextNprogress
          color={theme.colors.info}
          startPosition={0.3}
          stopDelayMs={200}
          height={10}
          showOnShallow={true}
        />
        <Component {...pageProps} />
        <GlobalStyles />
      </ThemeProvider>
    </NextAuthProvider>
  );
}

export default MyApp;
