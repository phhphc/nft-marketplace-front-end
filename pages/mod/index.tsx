import Head from "next/head";
import CreateNFTContainer from "@Containers/CreateNFTContainer/CreateNFTContainer";
import LoadingPage from "@Components/LoadingPage/LoadingPage";
import { ReactElement, useContext } from "react";
import { AppContext } from "@Store/index";
import ModLayout from "@Layouts/ModLayout/ModLayout";
import ModContainer from "@Containers/ModContainer/ModContainer";

export default function ModPage() {
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
        <ModContainer />
      </main>
    </>
  );
}

ModPage.getLayout = function getLayout(page: ReactElement) {
  return <ModLayout>{page}</ModLayout>;
};
