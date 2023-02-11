import axios from "axios";
import { ethers } from "ethers";
import { erc721Abi, mkpAbi } from "@Constants/abi";

export interface IUploadNFTToMarketplaceServiceProps {
  ownerAddress: string;
  tokenId: number;
}

export interface IBuyTokenProps {
  listingId: number;
  listingPrice: Number;
}

export const getNFTCollectionListService = async (
  owner?: string
): Promise<any> => {
  const params: { [k: string]: any } = {};
  if (owner) params.owner = owner;
  return axios
    .get("/api/v0.1/nft", { params })
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

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const erc721Contract = new ethers.Contract(
    erc721Address,
    erc721Abi,
    provider
  );

  const erc721ContractWithSigner = erc721Contract.connect(signer);

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
    "0xc9c7e04c41a01c9072c2d074e1258a1f56d0603a";
  const mkpAddress =
    process.env.NEXT_PUBLIC_MKP_ADDRESS ??
    "0x60f63bb3084c8e3e55c0072813a0efc696a3c50e";
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);

  const mkpContractWithSigner = mkpContract.connect(signer);

  await mkpContractWithSigner["buy(uint256)"](listingId, {
    value: listingPrice.toString(),
  });
};
