import Head from "next/head";
import UserProfileContainer from "@Containers/UserProfileContainer/UserProfileContainer";

export default function UserProfilePage() {
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
      <div>
        <>
          <UserProfileContainer />
        </>
      </div>
    </>
  );
}
