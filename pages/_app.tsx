import type { AppProps } from "next/app";
import MainLayout from "@Layouts/MainLayout/MainLayout";
import "@Styles/index.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}
