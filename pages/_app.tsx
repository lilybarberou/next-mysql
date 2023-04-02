import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import RequireAuth from '@components/RequireAuth';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '@components/Navigations';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RequireAuth>
            <ThemeProvider theme={globalTheme}>
                <GlobalStyle />
                <ToastContainer position="bottom-right" theme="dark" />
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <Navigation />
                <Component {...pageProps} />
            </ThemeProvider>
        </RequireAuth>
    );
}

const globalTheme = {
    primary: '#2663de',
    primaryDark: '#2b1a97',
    background: '#1e1e1e',
    font: "'Poppins', sans-serif",
};

const GlobalStyle = createGlobalStyle<{ theme: { background: string; primary: string; font: string } }>`
    body {
        font-family: ${({ theme }) => theme.font};
        background: ${({ theme }) => theme.background};
        color: white;
        min-height: 100vh;

        #__next {
            height: 100vh;
        }
    }

    *::selection {
        color: #fff;
        background-color: ${({ theme }) => theme.primary};
    }

    * {
        margin: 0;
        padding: 0;
    }

    a {
        text-decoration: none;
        color: white;
    }

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #fff;
    }

    &::-webkit-scrollbar-track {
        border-radius: 0px;
        background-color: transparent;
    }
`;
