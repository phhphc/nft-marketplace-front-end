import type { AppProps } from "next/app";
import MainLayout from "@Layouts/MainLayout/MainLayout";
import "@Styles/index.scss";
import { AppProvider } from "@Store/index";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AppProvider>
  );
}
