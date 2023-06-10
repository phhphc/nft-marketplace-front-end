import type { AppProps } from "next/app";
import MainLayout from "@Layouts/MainLayout/MainLayout";
import "@Styles/index.scss";
import { AppProvider } from "@Store/index";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

declare global {
  interface Window {
    ethereum: any;
  }
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
    </QueryClientProvider>
  );
}
