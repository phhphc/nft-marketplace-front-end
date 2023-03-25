import axios from "axios";
import { ethers } from "ethers";
import { erc721Abi, mkpAbi } from "@Constants/abi";
import FormData from "form-data";
import {
  getTestItem721,
  getItemETH,
  createOrder,
  transformDataRequestToSellNFT,
} from "@Utils/index";
import { CURRENCY } from "@Constants/index";
import { parseGwei, toBN, transformDataRequestToBuyNFT } from "@Utils/index";
import { Order } from "@Interfaces/index";
import { cloneDeep } from "lodash";
import { INFTCollectionItem } from "@Interfaces/index";

const { parseEther } = ethers.utils;

interface ISellNFTProps {
  toast: any;
  provider: any;
  myAddress: string;
  myWallet: any;
  tokenId: string;
  price: string;
  unit: string;
  isApprovedForAllNFTs?: boolean;
}

interface IGetOfferByTokenProps {
  tokenId: string;
  tokenAddress: string;
}

interface IBuyTokenServiceProps {
  toast: any;
  provider: any;
  myWallet: any;
  item: INFTCollectionItem;
}

interface IGetNFTCollectionListInfoServiceProps {
  toast: any;
  callback: any;
}

interface ICreateNFTServiceProps {
  featuredImage: any;
  name: string;
  url: string;
  desc: string;
  collection: string;
  supply: string;
  blockchain: string;
}

interface ICreateCollectionProps {
  logoImage: string;
  featuredImage: string;
  bannerImage: string;
  name: string;
  url: string;
  desc: string;
  category: string;
  link: string;
  blockchain: string;
  owner: string
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

export const getOfferByToken = async ({
  tokenId,
  tokenAddress,
}: IGetOfferByTokenProps): Promise<any> => {
  return axios
    .get("/api/v0.1/order/offer", {
      params: transformDataRequestToSellNFT({ tokenId, tokenAddress }),
    })
    .then((response) => {
      return response.data.data || [];
    })
    .catch((err) => {});
};

export const sellNFT = async ({
  toast,
  provider,
  myAddress,
  myWallet,
  tokenId,
  price,
  unit,
  isApprovedForAllNFTs = false,
}: ISellNFTProps) => {
  try {
    const erc721Address =
      process.env.NEXT_PUBLIC_ERC721_ADDRESS ??
      "0xc9c7e04c41a01c9072c2d074e1258a1f56d0603a";
    const mkpAddress =
      process.env.NEXT_PUBLIC_MKP_ADDRESS ??
      "0x5300EEEeA4751fDF9f32647B965599e8Ef7656DC";

    await provider.send("eth_requestAccounts", []);

    const erc721Contract = new ethers.Contract(
      erc721Address,
      erc721Abi,
      provider
    );

    const erc721ContractWithSigner = erc721Contract.connect(myWallet);

    if (!isApprovedForAllNFTs) {
      await erc721ContractWithSigner["setApprovalForAll(address,bool)"](
        mkpAddress,
        true
      );
    }

    const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);

    const mkpContractWithSigner = mkpContract.connect(myWallet);

    // await erc721ContractWithSigner["mint"](await signer.getAddress(), nftId, uri);
    const offer = [
      getTestItem721(
        tokenId,
        unit == CURRENCY.ETHER ? parseEther(price) : parseGwei(price),
        unit == CURRENCY.ETHER ? parseEther(price) : parseGwei(price)
      ),
    ];
    const consideration = [
      getItemETH(
        unit == CURRENCY.ETHER ? parseEther(price) : parseGwei(price),
        unit == CURRENCY.ETHER ? parseEther(price) : parseGwei(price),
        myAddress
      ),
    ];
    const { chainId } = await provider.getNetwork();
    const {
      order,
      orderHash,
      value,
      orderStatus,
      orderComponents,
      startTime,
      endTime,
      signature,
    } = await createOrder(
      mkpContractWithSigner,
      chainId,
      myWallet,
      undefined,
      offer,
      consideration,
      0 // FULL_OPEN
    );

    console.log(
      transformDataRequestToSellNFT({
        orderHash,
        offerer: myAddress,
        zone: orderComponents.zone,
        zone_hash: orderComponents.zoneHash,
        signature,
        offer,
        consideration,
        orderType: orderComponents.orderType,
        orderValue: value,
        startTime,
        endTime,
        salt: Number(orderComponents.salt),
        counter: orderComponents.counter,
      })
    );

    await axios.post(
      "/api/v0.1/order",
      transformDataRequestToSellNFT({
        orderHash,
        offerer: myAddress,
        zone: orderComponents.zone,
        zone_hash: orderComponents.zoneHash,
        signature,
        offer,
        consideration,
        orderType: orderComponents.orderType,
        orderValue: value,
        startTime,
        endTime,
        salt: Number(orderComponents.salt),
        counter: orderComponents.counter,
      })
    );
    toast.current &&
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Sell NFT successfully!",
        life: 15000,
      });
  } catch (err) {
    console.error(err);
  }
};

export const getNFTCollectionListInfoService = async (): Promise<
  INFTCollectionItem[]
> => {
  const data = await getNFTCollectionListService();
  console.log("🚀 ~ file: ApiService.ts:223 ~ data:", data);
  // if (data) {
  //   const newData = await Promise.all(
  //     data.nfts.map(async (item: any) => {
  //       const orderParameters = await getOfferByToken({
  //         tokenId: item.identifier,
  //         tokenAddress: item.token,
  //       });
  //       console.log(
  //         "🚀 ~ file: ApiService.ts:230 ~ data.nfts.map ~ orderParameters:",
  //         orderParameters
  //       );

  //       if (orderParameters?.length) {
  //         const latestOrderParameter = cloneDeep(
  //           orderParameters[orderParameters.length - 1]
  //         );
  //         const signature = latestOrderParameter.signature;
  //         delete latestOrderParameter.signature;
  //         delete latestOrderParameter.is_cancelled;
  //         delete latestOrderParameter.is_validated;
  //         return {
  //           ...item,
  //           order: {
  //             parameters: {
  //               ...latestOrderParameter,
  //               totalOriginalConsiderationItems:
  //                 latestOrderParameter.consideration.length,
  //             },
  //             signature,
  //           },
  //         };
  //       } else return item;
  //     })
  //   );
  console.log(data);
  return data.nfts;
  // } else return [];
};

export const buyTokenService = async ({
  toast,
  item,
  myWallet,
  provider,
}: IBuyTokenServiceProps) => {
  const erc721Address =
    process.env.NEXT_PUBLIC_ERC721_ADDRESS ??
    "0xc9c7e04c41a01c9072c2d074e1258a1f56d0603a";
  const mkpAddress =
    process.env.NEXT_PUBLIC_MKP_ADDRESS ??
    "0x5300EEEeA4751fDF9f32647B965599e8Ef7656DC";

  await provider.send("eth_requestAccounts", []);

  const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);

  const mkpContractWithSigner = mkpContract.connect(myWallet);

  const orderHashData = await axios.get("/api/v0.1/order/hash", {
    params: {
      offer_token: item.token,
      offer_identifier: toBN(item.identifier)._hex,
    },
  });
  console.log("🚀 ~ file: ApiService.ts:287 ~ orderHashData:", orderHashData);

  const orderHash =
    "0x21de1f62d2261c7f2a86f57cb2a5127cf0e0f2c8a12d6ae3375979c46d87da71";
  console.log("🚀 ~ file: ApiService.ts:290 ~ orderHash:", orderHash);

  const orderData = await axios.get("/api/v0.1/order", {
    params: {
      order_hash: orderHash,
    },
  });

  const signature = orderData.data.data.signature;
  orderData.data.data.totalOriginalConsiderationItems = 1;
  delete orderData.data.data.signature;

  console.log(
    transformDataRequestToBuyNFT({
      parameters: orderData.data.data,
      signature,
    })
  );

  const tx = await mkpContractWithSigner[
    "fulfillOrder(((address,address,(uint8,address,uint256,uint256,uint256)[],(uint8,address,uint256,uint256,uint256,address)[],uint8,uint256,uint256,bytes32,uint256,uint256),bytes))"
  ](
    transformDataRequestToBuyNFT({
      parameters: orderData.data.data,
      signature,
    }),

    { value: toBN(parseEther("10")), gasLimit: 1000000 }
  );
  console.log("🚀 ~ file: ApiService.ts:191 ~ tx:", tx);
  await tx.wait();

  toast.current &&
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Buy NFT successfully!",
      life: 3000,
    });

  // } catch (err) {
  //   console.dir(err);
  // }
};

const handleUploadImageToPinata = async (image: any) => {
  const imageFormData: any = new FormData();
  const imageBlob = new Blob([image]);
  imageFormData.append("file", imageBlob);

  const uploadImageConfig = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${imageFormData._boundary}`,
      Authorization: process.env.NEXT_PUBLIC_JWT_PINATA,
    },
    data: imageFormData,
  };

  const imageCid = await axios(uploadImageConfig);
  return imageCid.data.IpfsHash;
};

export const createNFTService = async ({
  featuredImage,
  name,
  url,
  desc,
  collection,
  supply,
  blockchain,
}: ICreateNFTServiceProps) => {
  const featuredImageCid = await handleUploadImageToPinata(featuredImage);

  const createNewNFTData = JSON.stringify({
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: `${name}`,
    },
    pinataContent: {
      featuredImage: featuredImageCid,
      name,
      url,
      desc,
      collection,
      supply,
      blockchain,
    },
  });

  const createNFTConfig = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_JWT_PINATA,
    },
    data: createNewNFTData,
  };

  const res = await axios(createNFTConfig);
  console.log("🚀 ~ file: ApiService.ts:338 ~ res:", res.data);
  // todo: mint NFT and send data to BE
};

export const createNFTCollectionService = async ({
  logoImage,
  featuredImage,
  bannerImage,
  name,
  url,
  desc,
  category,
  link,
  blockchain,
}: ICreateCollectionProps) => {
  const featuredImageCid = await handleUploadImageToPinata(featuredImage);
  const logoImageCid = await handleUploadImageToPinata(logoImage);
  const bannerImageCid = await handleUploadImageToPinata(bannerImage);

  const createNewCollectionData = JSON.stringify({
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: `${name}`,
    },
    pinataContent: {
      logoImage: logoImageCid,
      featuredImage: featuredImageCid,
      bannerImage: bannerImageCid,
      name,
      url,
      desc,
      category,
      link,
      blockchain,
    },
  });

  const createCollectionConfig = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_JWT_PINATA,
    },
    data: createNewCollectionData,
  };

  const res = await axios(createCollectionConfig);
  console.log("🚀 ~ file: ApiService.ts:338 ~ res:", res.data);

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // await provider.send("eth_requestAccounts", []);
  // const signer = provider.getSigner();
  // const newContract = new ethers.ContractFactory(
  //   erc721Abi,
  //   "0x60806040523480156200001157600080fd5b506040518060400160405280600781526020017f4d79546f6b656e000000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f4d544b0000000000000000000000000000000000000000000000000000000000815250816000908051906020019062000096929190620001a6565b508060019080519060200190620000af929190620001a6565b505050620000d2620000c6620000d860201b60201c565b620000e060201b60201c565b620002bb565b600033905090565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b828054620001b49062000285565b90600052602060002090601f016020900481019282620001d8576000855562000224565b82601f10620001f357805160ff191683800117855562000224565b8280016001018555821562000224579182015b828111156200022357825182559160200191906001019062000206565b5b50905062000233919062000237565b5090565b5b808211156200025257600081600090555060010162000238565b5090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200029e57607f821691505b60208210811415620002b557620002b462000256565b5b50919050565b6130c980620002cb6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063715018a6116100a2578063b88d4fde11610071578063b88d4fde146102cb578063c87b56dd146102e7578063d204c45e14610317578063e985e9c514610333578063f2fde38b1461036357610116565b8063715018a6146102695780638da5cb5b1461027357806395d89b4114610291578063a22cb465146102af57610116565b806323b872dd116100e957806323b872dd146101b557806342842e0e146101d157806342966c68146101ed5780636352211e1461020957806370a082311461023957610116565b806301ffc9a71461011b57806306fdde031461014b578063081812fc14610169578063095ea7b314610199575b600080fd5b61013560048036038101906101309190612075565b61037f565b60405161014291906120bd565b60405180910390f35b610153610461565b6040516101609190612171565b60405180910390f35b610183600480360381019061017e91906121c9565b6104f3565b6040516101909190612237565b60405180910390f35b6101b360048036038101906101ae919061227e565b610539565b005b6101cf60048036038101906101ca91906122be565b610651565b005b6101eb60048036038101906101e691906122be565b6106b1565b005b610207600480360381019061020291906121c9565b6106d1565b005b610223600480360381019061021e91906121c9565b61072d565b6040516102309190612237565b60405180910390f35b610253600480360381019061024e9190612311565b6107b4565b604051610260919061234d565b60405180910390f35b61027161086c565b005b61027b610880565b6040516102889190612237565b60405180910390f35b6102996108aa565b6040516102a69190612171565b60405180910390f35b6102c960048036038101906102c49190612394565b61093c565b005b6102e560048036038101906102e09190612509565b610952565b005b61030160048036038101906102fc91906121c9565b6109b4565b60405161030e9190612171565b60405180910390f35b610331600480360381019061032c919061262d565b6109c6565b005b61034d60048036038101906103489190612689565b6109ff565b60405161035a91906120bd565b60405180910390f35b61037d60048036038101906103789190612311565b610a93565b005b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061044a57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061045a575061045982610b17565b5b9050919050565b606060008054610470906126f8565b80601f016020809104026020016040519081016040528092919081815260200182805461049c906126f8565b80156104e95780601f106104be576101008083540402835291602001916104e9565b820191906000526020600020905b8154815290600101906020018083116104cc57829003601f168201915b5050505050905090565b60006104fe82610b81565b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006105448261072d565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156105b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105ac9061279c565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166105d4610bcc565b73ffffffffffffffffffffffffffffffffffffffff1614806106035750610602816105fd610bcc565b6109ff565b5b610642576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106399061282e565b60405180910390fd5b61064c8383610bd4565b505050565b61066261065c610bcc565b82610c8d565b6106a1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610698906128c0565b60405180910390fd5b6106ac838383610d22565b505050565b6106cc83838360405180602001604052806000815250610952565b505050565b6106e26106dc610bcc565b82610c8d565b610721576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610718906128c0565b60405180910390fd5b61072a8161101c565b50565b60008061073983611028565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156107ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107a29061292c565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610825576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161081c906129be565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610874611065565b61087e60006110e3565b565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600180546108b9906126f8565b80601f01602080910402602001604051908101604052809291908181526020018280546108e5906126f8565b80156109325780601f1061090757610100808354040283529160200191610932565b820191906000526020600020905b81548152906001019060200180831161091557829003601f168201915b5050505050905090565b61094e610947610bcc565b83836111a9565b5050565b61096361095d610bcc565b83610c8d565b6109a2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610999906128c0565b60405180910390fd5b6109ae84848484611316565b50505050565b60606109bf82611372565b9050919050565b6109ce611065565b60006109da6008611485565b90506109e66008611493565b6109f083826114a9565b6109fa81836114c7565b505050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610a9b611065565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610b0b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0290612a50565b60405180910390fd5b610b14816110e3565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610b8a8161153b565b610bc9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bc09061292c565b60405180910390fd5b50565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610c478361072d565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610c998361072d565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610cdb5750610cda81856109ff565b5b80610d1957508373ffffffffffffffffffffffffffffffffffffffff16610d01846104f3565b73ffffffffffffffffffffffffffffffffffffffff16145b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16610d428261072d565b73ffffffffffffffffffffffffffffffffffffffff1614610d98576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d8f90612ae2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610e08576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dff90612b74565b60405180910390fd5b610e15838383600161157c565b8273ffffffffffffffffffffffffffffffffffffffff16610e358261072d565b73ffffffffffffffffffffffffffffffffffffffff1614610e8b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e8290612ae2565b60405180910390fd5b6004600082815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a461101783838360016116a2565b505050565b611025816116a8565b50565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b61106d610bcc565b73ffffffffffffffffffffffffffffffffffffffff1661108b610880565b73ffffffffffffffffffffffffffffffffffffffff16146110e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110d890612be0565b60405180910390fd5b565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611218576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161120f90612c4c565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405161130991906120bd565b60405180910390a3505050565b611321848484610d22565b61132d848484846116fb565b61136c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161136390612cde565b60405180910390fd5b50505050565b606061137d82610b81565b600060066000848152602001908152602001600020805461139d906126f8565b80601f01602080910402602001604051908101604052809291908181526020018280546113c9906126f8565b80156114165780601f106113eb57610100808354040283529160200191611416565b820191906000526020600020905b8154815290600101906020018083116113f957829003601f168201915b505050505090506000611427611892565b905060008151141561143d578192505050611480565b60008251111561147257808260405160200161145a929190612d3a565b60405160208183030381529060405292505050611480565b61147b846118a9565b925050505b919050565b600081600001549050919050565b6001816000016000828254019250508190555050565b6114c3828260405180602001604052806000815250611911565b5050565b6114d08261153b565b61150f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161150690612dd0565b60405180910390fd5b80600660008481526020019081526020016000209080519060200190611536929190611f26565b505050565b60008073ffffffffffffffffffffffffffffffffffffffff1661155d83611028565b73ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600181111561169c57600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16146116105780600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116089190612e1f565b925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161461169b5780600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116939190612e53565b925050819055505b5b50505050565b50505050565b6116b18161196c565b60006006600083815260200190815260200160002080546116d1906126f8565b9050146116f8576006600082815260200190815260200160002060006116f79190611fac565b5b50565b600061171c8473ffffffffffffffffffffffffffffffffffffffff16611aba565b15611885578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611745610bcc565b8786866040518563ffffffff1660e01b81526004016117679493929190612efe565b602060405180830381600087803b15801561178157600080fd5b505af19250505080156117b257506040513d601f19601f820116820180604052508101906117af9190612f5f565b60015b611835573d80600081146117e2576040519150601f19603f3d011682016040523d82523d6000602084013e6117e7565b606091505b5060008151141561182d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161182490612cde565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161491505061188a565b600190505b949350505050565b606060405180602001604052806000815250905090565b60606118b482610b81565b60006118be611892565b905060008151116118de5760405180602001604052806000815250611909565b806118e884611add565b6040516020016118f9929190612d3a565b6040516020818303038152906040525b915050919050565b61191b8383611bb5565b61192860008484846116fb565b611967576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161195e90612cde565b60405180910390fd5b505050565b60006119778261072d565b905061198781600084600161157c565b6119908261072d565b90506004600083815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506002600083815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905581600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611ab68160008460016116a2565b5050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b606060006001611aec84611dd3565b01905060008167ffffffffffffffff811115611b0b57611b0a6123de565b5b6040519080825280601f01601f191660200182016040528015611b3d5781602001600182028036833780820191505090505b509050600082602001820190505b600115611baa578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a8581611b9457611b93612f8c565b5b0494506000851415611ba557611baa565b611b4b565b819350505050919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611c25576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c1c90613007565b60405180910390fd5b611c2e8161153b565b15611c6e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c6590613073565b60405180910390fd5b611c7c60008383600161157c565b611c858161153b565b15611cc5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cbc90613073565b60405180910390fd5b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611dcf6000838360016116a2565b5050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611e31577a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008381611e2757611e26612f8c565b5b0492506040810190505b6d04ee2d6d415b85acef81000000008310611e6e576d04ee2d6d415b85acef81000000008381611e6457611e63612f8c565b5b0492506020810190505b662386f26fc100008310611e9d57662386f26fc100008381611e9357611e92612f8c565b5b0492506010810190505b6305f5e1008310611ec6576305f5e1008381611ebc57611ebb612f8c565b5b0492506008810190505b6127108310611eeb576127108381611ee157611ee0612f8c565b5b0492506004810190505b60648310611f0e5760648381611f0457611f03612f8c565b5b0492506002810190505b600a8310611f1d576001810190505b80915050919050565b828054611f32906126f8565b90600052602060002090601f016020900481019282611f545760008555611f9b565b82601f10611f6d57805160ff1916838001178555611f9b565b82800160010185558215611f9b579182015b82811115611f9a578251825591602001919060010190611f7f565b5b509050611fa89190611fec565b5090565b508054611fb8906126f8565b6000825580601f10611fca5750611fe9565b601f016020900490600052602060002090810190611fe89190611fec565b5b50565b5b80821115612005576000816000905550600101611fed565b5090565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6120528161201d565b811461205d57600080fd5b50565b60008135905061206f81612049565b92915050565b60006020828403121561208b5761208a612013565b5b600061209984828501612060565b91505092915050565b60008115159050919050565b6120b7816120a2565b82525050565b60006020820190506120d260008301846120ae565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156121125780820151818401526020810190506120f7565b83811115612121576000848401525b50505050565b6000601f19601f8301169050919050565b6000612143826120d8565b61214d81856120e3565b935061215d8185602086016120f4565b61216681612127565b840191505092915050565b6000602082019050818103600083015261218b8184612138565b905092915050565b6000819050919050565b6121a681612193565b81146121b157600080fd5b50565b6000813590506121c38161219d565b92915050565b6000602082840312156121df576121de612013565b5b60006121ed848285016121b4565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000612221826121f6565b9050919050565b61223181612216565b82525050565b600060208201905061224c6000830184612228565b92915050565b61225b81612216565b811461226657600080fd5b50565b60008135905061227881612252565b92915050565b6000806040838503121561229557612294612013565b5b60006122a385828601612269565b92505060206122b4858286016121b4565b9150509250929050565b6000806000606084860312156122d7576122d6612013565b5b60006122e586828701612269565b93505060206122f686828701612269565b9250506040612307868287016121b4565b9150509250925092565b60006020828403121561232757612326612013565b5b600061233584828501612269565b91505092915050565b61234781612193565b82525050565b6000602082019050612362600083018461233e565b92915050565b612371816120a2565b811461237c57600080fd5b50565b60008135905061238e81612368565b92915050565b600080604083850312156123ab576123aa612013565b5b60006123b985828601612269565b92505060206123ca8582860161237f565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61241682612127565b810181811067ffffffffffffffff82111715612435576124346123de565b5b80604052505050565b6000612448612009565b9050612454828261240d565b919050565b600067ffffffffffffffff821115612474576124736123de565b5b61247d82612127565b9050602081019050919050565b82818337600083830152505050565b60006124ac6124a784612459565b61243e565b9050828152602081018484840111156124c8576124c76123d9565b5b6124d384828561248a565b509392505050565b600082601f8301126124f0576124ef6123d4565b5b8135612500848260208601612499565b91505092915050565b6000806000806080858703121561252357612522612013565b5b600061253187828801612269565b945050602061254287828801612269565b9350506040612553878288016121b4565b925050606085013567ffffffffffffffff81111561257457612573612018565b5b612580878288016124db565b91505092959194509250565b600067ffffffffffffffff8211156125a7576125a66123de565b5b6125b082612127565b9050602081019050919050565b60006125d06125cb8461258c565b61243e565b9050828152602081018484840111156125ec576125eb6123d9565b5b6125f784828561248a565b509392505050565b600082601f830112612614576126136123d4565b5b81356126248482602086016125bd565b91505092915050565b6000806040838503121561264457612643612013565b5b600061265285828601612269565b925050602083013567ffffffffffffffff81111561267357612672612018565b5b61267f858286016125ff565b9150509250929050565b600080604083850312156126a05761269f612013565b5b60006126ae85828601612269565b92505060206126bf85828601612269565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061271057607f821691505b60208210811415612724576127236126c9565b5b50919050565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b60006127866021836120e3565b91506127918261272a565b604082019050919050565b600060208201905081810360008301526127b581612779565b9050919050565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60008201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c000000602082015250565b6000612818603d836120e3565b9150612823826127bc565b604082019050919050565b600060208201905081810360008301526128478161280b565b9050919050565b7f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560008201527f72206f7220617070726f76656400000000000000000000000000000000000000602082015250565b60006128aa602d836120e3565b91506128b58261284e565b604082019050919050565b600060208201905081810360008301526128d98161289d565b9050919050565b7f4552433732313a20696e76616c696420746f6b656e2049440000000000000000600082015250565b60006129166018836120e3565b9150612921826128e0565b602082019050919050565b6000602082019050818103600083015261294581612909565b9050919050565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b60006129a86029836120e3565b91506129b38261294c565b604082019050919050565b600060208201905081810360008301526129d78161299b565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000612a3a6026836120e3565b9150612a45826129de565b604082019050919050565b60006020820190508181036000830152612a6981612a2d565b9050919050565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b6000612acc6025836120e3565b9150612ad782612a70565b604082019050919050565b60006020820190508181036000830152612afb81612abf565b9050919050565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000612b5e6024836120e3565b9150612b6982612b02565b604082019050919050565b60006020820190508181036000830152612b8d81612b51565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000612bca6020836120e3565b9150612bd582612b94565b602082019050919050565b60006020820190508181036000830152612bf981612bbd565b9050919050565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b6000612c366019836120e3565b9150612c4182612c00565b602082019050919050565b60006020820190508181036000830152612c6581612c29565b9050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b6000612cc86032836120e3565b9150612cd382612c6c565b604082019050919050565b60006020820190508181036000830152612cf781612cbb565b9050919050565b600081905092915050565b6000612d14826120d8565b612d1e8185612cfe565b9350612d2e8185602086016120f4565b80840191505092915050565b6000612d468285612d09565b9150612d528284612d09565b91508190509392505050565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b6000612dba602e836120e3565b9150612dc582612d5e565b604082019050919050565b60006020820190508181036000830152612de981612dad565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000612e2a82612193565b9150612e3583612193565b925082821015612e4857612e47612df0565b5b828203905092915050565b6000612e5e82612193565b9150612e6983612193565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612e9e57612e9d612df0565b5b828201905092915050565b600081519050919050565b600082825260208201905092915050565b6000612ed082612ea9565b612eda8185612eb4565b9350612eea8185602086016120f4565b612ef381612127565b840191505092915050565b6000608082019050612f136000830187612228565b612f206020830186612228565b612f2d604083018561233e565b8181036060830152612f3f8184612ec5565b905095945050505050565b600081519050612f5981612049565b92915050565b600060208284031215612f7557612f74612013565b5b6000612f8384828501612f4a565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b6000612ff16020836120e3565b9150612ffc82612fbb565b602082019050919050565b6000602082019050818103600083015261302081612fe4565b9050919050565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b600061305d601c836120e3565b915061306882613027565b602082019050919050565b6000602082019050818103600083015261308c81613050565b905091905056fea2646970667358221220465b4d844fb78010e6a4158f87b9f3a56e05a7cebc0cda31e5741b9617ffb65464736f6c63430008090033",
  //   signer
  // );
  // const contract = await newContract.deploy();
  // return contract.address;
};
