import Head from "next/head";
import NFTDetailContainer from "@Containers/NFTDetailContainer/NFTDetailContainer";
import LoadingPage from "@Components/LoadingPage/LoadingPage";
import { AppContext } from "@Store/index";
import { useContext } from "react";

export default function NFTDetailPage() {
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
          <NFTDetailContainer />
          {web3Context.state.web3.loading && <LoadingPage />}
        </>
      </main>
    </>
  );
}
