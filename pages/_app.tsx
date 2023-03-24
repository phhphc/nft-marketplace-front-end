import type { AppProps } from "next/app";
import MainLayout from "@Layouts/MainLayout/MainLayout";
import "@Styles/index.scss";
import { AppProvider } from "@Store/index";
import { QueryClient, QueryClientProvider } from "react-query";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AppProvider>
    </QueryClientProvider>
  );
}
