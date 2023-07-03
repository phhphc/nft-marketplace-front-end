import Head from "next/head";
import CreateCollectionContainer from "@Containers/CreateCollectionContainer/CreateCollectionContainer";
import LoadingPage from "@Components/LoadingPage/LoadingPage";
import { useContext } from "react";
import { AppContext } from "@Store/index";

export default function CreateCollectionPage() {
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
        <>
          <CreateCollectionContainer />
          {web3Context.state.web3.loading && <LoadingPage />}
        </>
      </main>
    </>
  );
}
