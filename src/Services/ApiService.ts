import axios from "axios";
import { ethers } from "ethers";
import { erc721Abi, mkpAbi } from "@Constants/abi";
export interface IUploadNFTToMarketplaceServiceProps {
  ownerAddress: string;
  tokenId: number;
}

export interface IBuyTokenProps {
  listingId: number;
  listingPrice: number;
}

export const getNFTCollectionListService = async (
  owner?: string
): Promise<any> => {
  const params: { [k: string]: any } = {};
  if (owner) params.owner = owner;
  return axios
    .get("/nfts", { params })
    .then((response) => {
      return response.data.data || [];
    })
    .catch((err) => {});
};

export const uploadNFTToMarketplaceService = async ({
  ownerAddress,
  tokenId,
}: IUploadNFTToMarketplaceServiceProps) => {
  const erc721Address =
    process.env.NEXT_PUBLIC_ERC721_ADDRESS ??
    "0x29F46089d9CFCD121a9bb70DCFd04129ce9E5B7F";
  const mkpAddress =
    process.env.NEXT_PUBLIC_MKP_ADDRESS ??
    "0xF7E7948A19ab416df252337966262CF1C150Be3c";

  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner();

  // MKP_ADDR=0xF7E7948A19ab416df252337966262CF1C150Be3c
  // NFT_ADDR=0x29F46089d9CFCD121a9bb70DCFd04129ce9E5B7F

  const erc721Contract = new ethers.Contract(
    erc721Address,
    erc721Abi,
    provider
  );
  // const mkpContract = new ethers.Contract(toAddress, mkpAbi, provider);

  const erc721ContractWithSigner = erc721Contract.connect(signer);
  // const mkpContractWithSigner = mkpContract.connect(signer);

  const listingPrice = ethers.utils.parseUnits("1", "gwei");
  const listingData = ethers.utils.defaultAbiCoder.encode(
    ["int8", "uint256"],
    [0, listingPrice]
  );

  await erc721ContractWithSigner[
    "safeTransferFrom(address,address,uint256,bytes)"
  ](ownerAddress, mkpAddress, tokenId, listingData);
};

export const buyTokenService = async ({
  listingId,
  listingPrice,
}: IBuyTokenProps) => {
  const erc721Address =
    process.env.NEXT_PUBLIC_ERC721_ADDRESS ??
    "0x29F46089d9CFCD121a9bb70DCFd04129ce9E5B7F";
  const mkpAddress =
    process.env.NEXT_PUBLIC_MKP_ADDRESS ??
    "0xF7E7948A19ab416df252337966262CF1C150Be3c";

  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner();

  // MKP_ADDR=0xF7E7948A19ab416df252337966262CF1C150Be3c
  // NFT_ADDR=0x29F46089d9CFCD121a9bb70DCFd04129ce9E5B7F

  const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);
  // const mkpContract = new ethers.Contract(toAddress, mkpAbi, provider);

  const mkpContractWithSigner = mkpContract.connect(signer);
  await mkpContractWithSigner["buy(uint256)"](listingId, {
    value: listingPrice,
  });
};
