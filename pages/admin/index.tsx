import Head from "next/head";
import CreateNFTContainer from "@Containers/CreateNFTContainer/CreateNFTContainer";
import LoadingPage from "@Components/LoadingPage/LoadingPage";
import { ReactElement, useContext } from "react";
import { AppContext } from "@Store/index";
import AdminLayout from "@Layouts/AdminLayout/AdminLayout";
import AdminContainer from "@Containers/AdminContainer/AdminContainer";

export default function AdminPage() {
  const web3Context = useContext(AppContext);
  return (
    <>
      <Head>
        <title>NFT Marketplace</title>
        <meta
          name="description"
          content="Non-Fungible Token (NFT) marketplace where you can buy, sell, or create NFTs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AdminContainer />
      </main>
    </>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
