import axios from "axios";
import { ethers } from "ethers";
import { erc721Abi } from "@Constants/erc721Abi";
import { erc20Abi } from "@Constants/erc20Abi";
import { mkpAbi } from "@Constants/mkpAbi";
import { erc721CollectionAbi } from "@Constants/erc721CollectionAbi";
import FormData from "form-data";
import { SiweMessage } from "siwe";
import {
  getTestItem721,
  getItemETH,
  createOrder,
  transformDataRequestToSellNFT,
  randomBN,
  getTestItem20,
  toFixed,
} from "@Utils/index";
import {
  BACKEND_URL_VERSION,
  CHAIN_ID,
  CURRENCY,
  ERC20_ADDRESS,
  MKP_ADDRESS,
} from "@Constants/index";
import { parseGwei, toBN, transformDataRequestToBuyNFT } from "@Utils/index";
import {
  ICollectionItem,
  IListing,
  INFTActivity,
  INotification,
  IOfferItem,
  IProfile,
} from "@Interfaces/index";
import { flatten } from "lodash";
import { INFTCollectionItem } from "@Interfaces/index";
import { IOfferMadeListProps } from "@Components/OfferMadeList/OfferMadeList";

const { parseEther } = ethers.utils;

interface ISellNFTProps {
  provider: any;
  myAddress: string;
  myWallet: any;
  item: INFTCollectionItem[];
  price: string;
  unit: string;
  beforeApprove?: () => void;
  afterApprove?: () => void;
  startDate: Date | null;
  endDate: Date | null;
  chainId: number;
  authToken: string;
}

interface IMakeOfferProps {
  provider: any;
  myAddress: string;
  myWallet: any;
  item: INFTCollectionItem;
  price: string;
  unit: string;
  startDate: Date | null;
  endDate: Date | null;
  chainId: number;
  authToken: string;
}

interface IGetOfferListProps {
  owner?: string;
  from?: string;
  chainId: number;
}

interface ITransferTETHToEthProps {
  provider: any;
  myWallet: any;
  price: string;
  unit: string;
  chainId: number;
}

interface IGetOfferByTokenProps {
  tokenId: string;
  tokenAddress: string;
  chainId: number;
}

interface IBuyTokenProps {
  provider: any;
  myWallet: any;
  orderHashes: string[];
  price: string[];
  chainId: number;
}

interface IFulfillMakeOfferProps {
  provider: any;
  myWallet: any;
  orderHash: string;
  price: string;
  myAddress: string;
  beforeApprove?: () => void;
  afterApprove?: () => void;
  chainId: number;
}

interface ICancelOrderProps {
  provider: any;
  myWallet: any;
  orderHashes: string[];
  myAddress: string;
  chainId: number;
}

interface ICreateNFTServiceProps {
  featuredImage: any;
  name: string;
  url: string;
  description: string;
  collection: string;
  supply: string;
  blockchain: string;
  provider: any;
  myWallet: any;
}

interface ICreateCollectionProps {
  logoImage: string;
  featuredImage: string;
  bannerImage: string;
  name: string;
  url: string;
  description: string;
  category: string;
  link: string;
  blockchain: string;
  owner: string;
  chainId: number;
  authToken: string;
}

interface ISaveProfileProps {
  profileImage?: string;
  profileBanner?: string;
  username?: string;
  bio?: string;
  email?: string;
  address: string;
  signature: string;
  chainId: number;
  authToken: string;
}

interface IIsApprovedForAllProps {
  myAddress: string;
  myWallet: any;
  provider: any;
  contractAddress: string;
  contractAbi: any;
  mkpAddress: string;
}

interface ISetApprovedForAllProps {
  myWallet: any;
  provider: any;
  contractAddress: string;
  contractAbi: any;
  mkpAddress: string;
  isApproved: boolean;
}

interface IHideNFTProps {
  token: string;
  identifier: string;
  isHidden: boolean;
  chainId: number;
  authToken: string;
}

interface ISetViewdNotifProps {
  eventName: string;
  orderHash: string;
  chainId: number;
  authToken: string;
}

interface IGetSaleEventByAddrMthYrProps {
  month: number;
  year: number;
  address: string;
  chainId: number;
}

export interface ICreateEthereumSignedAuthTokenProps {
  provider: any;
  myAddress: string;
  chainId: number;
}

export interface ISignMessageProps {
  provider: any;
  myAddress: string;
  chainId: number;
}
export interface ILoginWithEthereumProps {
  provider: any;
  myAddress: string;
  chainId: number;
}

export interface IFetchNonceProps {
  address: string;
  chainId: number;
}

export interface ICreateMessageProps {
  address: string;
  chainId: number;
  nonce: any;
}

export interface ICreateSignatureProps {
  address: string;
  chainId: number;
  nonce: any;
}

export interface IAuthSignatureProps {
  address: string;
  chainId: number;
  message: any;
  signature: any;
}

export interface ISignEIP191Props {
  provider: any;
  myAddress: string;
  chainId: number;
}

interface IGetUserProps {
  address: string;
  chainId: number;
}

interface IGetAllUsersProps {
  chainId: number;
}

interface ISetBlockAccountProps {
  chainId: number;
  authToken: string;
  isBlock: boolean;
  address: string;
}

interface ISetRoleProps {
  chainId: number;
  authToken: string;
  roleId: number;
  address: string;
}

interface IDeleteRoleProps {
  chainId: number;
  authToken: string;
  roleId: number;
  address: string;
}

interface IEditMkpInfoProps {
  chainId: number;
  authToken: string;
  royalty: number;
  beneficiary: string;
}

interface IGetMkpInfoProps {
  chainId: number;
}

export const getNFTCollectionListService = async (
  additionalParams: {
    [k: string]: any;
  },
  provider: any,
  myWallet: any,
  chainId: number
): Promise<any> => {
  let offset = 0;

  let result: any = [];

  const version = BACKEND_URL_VERSION.get(chainId)!;

  while (true) {
    const params: { [k: string]: any } = {
      limit: 100,
      offset,
      ...additionalParams,
    };

    const res = await axios.get(`/api/${version}/nft`, { params });
    if (!res.data.data.nfts?.length) break;

    result = result.concat(res.data.data.nfts);

    offset += 100;
  }

  const res = await Promise.all(
    result.map(async (nft: INFTCollectionItem) => {
      if (nft.name !== "" || !provider || !myWallet) {
        return nft;
      } else {
        try {
          const erc721Address = nft.token;
          const erc721Contract = new ethers.Contract(
            erc721Address,
            erc721Abi,
            provider
          );

          const erc721ContractWithSigner = erc721Contract.connect(myWallet);
          const uri = await erc721ContractWithSigner.tokenURI(nft.identifier);
          console.log("🚀 ~ file: ApiService.ts:156 ~ result.map ~ uri:", uri);
          const metadataRes = await fetch(uri);
          const metadata = await metadataRes.json();
          console.log(
            "🚀 ~ file: ApiService.ts:158 ~ result.map ~ metadata:",
            metadata
          );

          return {
            ...nft,
            name: metadata.name,
            image: metadata.image,
            description: metadata.description,
          };
        } catch (e) {
          return nft;
        }
      }
    })
  );
  return res;
};

export const getOfferByToken = async ({
  tokenId,
  tokenAddress,
  chainId,
}: IGetOfferByTokenProps): Promise<any> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  return axios
    .get(`/api/${version}/order/offer`, {
      params: transformDataRequestToSellNFT({ tokenId, tokenAddress }),
    })
    .then((response) => {
      return response.data.data || [];
    })
    .catch((err) => {});
};

export const makeOffer = async ({
  provider,
  myAddress,
  myWallet,
  item,
  price,
  unit,
  startDate,
  endDate,
  chainId,
  authToken,
}: IMakeOfferProps) => {
  const erc20Address = ERC20_ADDRESS.get(chainId)!;
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const mkpAddress = MKP_ADDRESS.get(chainId)!;
  const mkpMoneyAddress = process.env.NEXT_PUBLIC_MKP_MONEY_ADDRESS!;

  const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, provider);

  const erc20ContractWithSigner = erc20Contract.connect(myWallet);

  let mkpInfo;

  try {
    const res = await getMkpInfo({ chainId });
    mkpInfo = res;
  } catch (err) {
    mkpInfo = {
      id: 1,
      marketplace: mkpAddress,
      beneficiary: mkpMoneyAddress,
      royalty: 0.01,
    };
  }

  const buyTx = await erc20ContractWithSigner.buy({
    value: parseEther(
      toFixed(Number(price) * (1 + mkpInfo.royalty)).toString()
    ),
  });

  await buyTx.wait();

  const increaseTx = await erc20ContractWithSigner.increaseAllowance(
    mkpAddress,
    parseEther(toFixed(Number(price) * (1 + mkpInfo.royalty)).toString())
  );

  await increaseTx.wait();

  const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);

  const mkpContractWithSigner = mkpContract.connect(myWallet);

  const offer = [
    getTestItem20(
      0,
      parseEther(toFixed(Number(price) * (1 + mkpInfo.royalty)).toString()),
      parseEther(toFixed(Number(price) * (1 + mkpInfo.royalty)).toString()),
      undefined,
      erc20Address
    ),
  ];

  const consideration = [
    getTestItem721(item.identifier, 1, 1, myAddress, item.token),
    getTestItem20(
      0,
      parseEther(toFixed(Number(price) * mkpInfo.royalty).toString()),
      parseEther(toFixed(Number(price) * mkpInfo.royalty).toString()),
      mkpInfo.beneficiary,
      erc20Address
    ),
  ];

  const { orderHash, value, orderComponents, startTime, endTime, signature } =
    await createOrder(
      mkpContractWithSigner,
      chainId,
      myWallet,
      offer,
      consideration,
      startDate,
      endDate
    );

  console.log(
    transformDataRequestToSellNFT({
      orderHash,
      offerer: myAddress,
      signature,
      offer,
      consideration,
      orderValue: value,
      startTime,
      endTime,
      salt: orderComponents.salt,
      counter: orderComponents.counter,
    })
  );

  await axios.post(
    `/api/${version}/order`,
    transformDataRequestToSellNFT({
      orderHash,
      offerer: myAddress,
      signature,
      offer,
      consideration,
      orderValue: value,
      startTime,
      endTime,
      salt: orderComponents.salt,
      counter: orderComponents.counter,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const transferCurrency = async ({
  provider,
  myWallet,
  price,
  unit,
  chainId,
}: ITransferTETHToEthProps) => {
  const erc20Address = ERC20_ADDRESS.get(chainId)!;

  const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, provider);

  const erc20ContractWithSigner = erc20Contract.connect(myWallet);

  const tx =
    unit === CURRENCY.TETHER || unit === CURRENCY.TATIC
      ? await erc20ContractWithSigner.sell(parseEther(price))
      : await erc20ContractWithSigner.buy({
          value: parseEther(price),
        });

  await tx.wait();
};

export const sellNFT = async ({
  provider,
  myAddress,
  myWallet,
  item,
  price,
  unit,
  beforeApprove,
  afterApprove,
  startDate,
  endDate,
  chainId,
  authToken,
}: ISellNFTProps) => {
  const erc721Address = item[0].token;
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const mkpAddress = MKP_ADDRESS.get(chainId)!;

  const mkpMoneyAddress = process.env.NEXT_PUBLIC_MKP_MONEY_ADDRESS!;

  const erc721Contract = new ethers.Contract(
    erc721Address,
    erc721Abi,
    provider
  );

  const erc721ContractWithSigner = erc721Contract.connect(myWallet);

  const isApproved = await isApprovedForAll({
    contractAddress: erc721Address,
    myAddress,
    myWallet,
    provider,
    contractAbi: erc721Abi,
    mkpAddress,
  });
  console.log("🚀 ~ file: ApiService.ts:270 ~ isApproved:", isApproved);

  if (!isApproved) {
    beforeApprove && beforeApprove();
    const approvalForAll = await erc721ContractWithSigner.setApprovalForAll(
      mkpAddress,
      true
    );

    await approvalForAll.wait();
    afterApprove && afterApprove();
  }

  await cancelOrder({
    orderHashes: item[0].listings.map(
      (listing: IListing) => listing.order_hash
    ),
    myWallet,
    provider,
    myAddress,
    chainId,
  });

  const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);

  const mkpContractWithSigner = mkpContract.connect(myWallet);

  let mkpInfo;

  try {
    const res = await getMkpInfo({ chainId });
    mkpInfo = res;
  } catch (err) {
    mkpInfo = {
      id: 1,
      marketplace: mkpAddress,
      beneficiary: mkpMoneyAddress,
      royalty: 0.01,
    };
  }

  const offer = item.map((nft) =>
    getTestItem721(nft.identifier, 1, 1, undefined, nft.token)
  );
  const consideration = [
    getItemETH(
      unit == CURRENCY.ETHER || unit == CURRENCY.MATIC
        ? parseEther(toFixed(Number(price) * (1 - mkpInfo.royalty)).toString())
        : parseGwei(toFixed(Number(price) * (1 - mkpInfo.royalty)).toString()),
      unit == CURRENCY.ETHER || unit == CURRENCY.MATIC
        ? parseEther(toFixed(Number(price) * (1 - mkpInfo.royalty)).toString())
        : parseGwei(toFixed(Number(price) * (1 - mkpInfo.royalty)).toString()),
      myAddress
    ),
    getItemETH(
      unit == CURRENCY.ETHER || unit == CURRENCY.MATIC
        ? parseEther(toFixed(Number(price) * mkpInfo.royalty).toString())
        : parseGwei(toFixed(Number(price) * mkpInfo.royalty).toString()),
      unit == CURRENCY.ETHER || unit == CURRENCY.MATIC
        ? parseEther(toFixed(Number(price) * mkpInfo.royalty).toString())
        : parseGwei(toFixed(Number(price) * mkpInfo.royalty).toString()),
      mkpInfo.beneficiary
    ),
  ];

  const { orderHash, value, orderComponents, startTime, endTime, signature } =
    await createOrder(
      mkpContractWithSigner,
      chainId,
      myWallet,
      offer,
      consideration,
      startDate,
      endDate
    );

  console.log(
    transformDataRequestToSellNFT({
      orderHash,
      offerer: myAddress,
      signature,
      offer,
      consideration,
      orderValue: value,
      startTime,
      endTime,
      salt: orderComponents.salt,
      counter: orderComponents.counter,
    })
  );

  await axios.post(
    `/api/${version}/order`,
    transformDataRequestToSellNFT({
      orderHash,
      offerer: myAddress,
      signature,
      offer,
      consideration,
      orderValue: value,
      startTime,
      endTime,
      salt: orderComponents.salt,
      counter: orderComponents.counter,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const isApprovedForAll = async ({
  contractAddress,
  contractAbi,
  myAddress,
  myWallet,
  provider,
  mkpAddress,
}: IIsApprovedForAllProps) => {
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);

  const contractWithSigner = contract.connect(myWallet);

  const isApproved = await contractWithSigner.isApprovedForAll(
    myAddress,
    mkpAddress
  );

  return isApproved;
};

export const setApprovedForAll = async ({
  contractAddress,
  contractAbi,
  myWallet,
  provider,
  mkpAddress,
  isApproved,
}: ISetApprovedForAllProps) => {
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);

  const contractWithSigner = contract.connect(myWallet);

  const tx = await contractWithSigner.setApprovalForAll(mkpAddress, isApproved);
  await tx.wait();
};

export const fulfillMakeOffer = async ({
  orderHash,
  price,
  myWallet,
  provider,
  myAddress,
  beforeApprove,
  afterApprove,
  chainId,
}: IFulfillMakeOfferProps) => {
  const mkpAddress = MKP_ADDRESS.get(chainId)!;
  const erc20Address = ERC20_ADDRESS.get(chainId)!;
  const version = BACKEND_URL_VERSION.get(chainId)!;

  const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, provider);

  const erc20ContractWithSigner = erc20Contract.connect(myWallet);

  const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);

  const mkpContractWithSigner = mkpContract.connect(myWallet);

  const mkpMoneyAddress = process.env.NEXT_PUBLIC_MKP_MONEY_ADDRESS!;

  let mkpInfo;

  try {
    const res = await getMkpInfo({ chainId });
    mkpInfo = res;
  } catch (err) {
    mkpInfo = {
      id: 1,
      marketplace: mkpAddress,
      beneficiary: mkpMoneyAddress,
      royalty: 0.01,
    };
  }

  const buyTx = await erc20ContractWithSigner.buy({
    value: Math.round(Number(price) / (100 + mkpInfo.royalty * 100)).toString(),
  });

  await buyTx.wait();

  const increaseTx = await erc20ContractWithSigner.increaseAllowance(
    mkpAddress,
    Math.round(Number(price) / (100 + mkpInfo.royalty * 100)).toString()
  );

  await increaseTx.wait();

  const orderData = await axios.get(`/api/${version}/order`, {
    params: {
      orderHash,
      isCancelled: false,
      isFulfilled: false,
      isInvalid: false,
    },
  });

  const erc721Address = orderData.data.data.content[0].consideration[0].token;

  const erc721Contract = new ethers.Contract(
    erc721Address,
    erc721Abi,
    provider
  );

  const erc721ContractWithSigner = erc721Contract.connect(myWallet);

  const isApproved = await isApprovedForAll({
    contractAddress: erc721Address,
    myAddress,
    myWallet,
    provider,
    contractAbi: erc721Abi,
    mkpAddress,
  });

  if (!isApproved) {
    beforeApprove && beforeApprove();
    const approvalForAll = await erc721ContractWithSigner.setApprovalForAll(
      mkpAddress,
      true
    );

    await approvalForAll.wait();
    afterApprove && afterApprove();
  }

  const signature = orderData.data.data.content[0].signature;

  delete orderData.data.data.content[0].status;
  delete orderData.data.data.content[0].orderHash;
  delete orderData.data.data.content[0].signature;

  console.log(
    transformDataRequestToBuyNFT({
      parameters: orderData.data.data.content[0],
      signature: signature,
    })
  );

  const tx = await mkpContractWithSigner.fulfillOrder(
    transformDataRequestToBuyNFT({
      parameters: orderData.data.data.content[0],
      signature: signature,
    }),

    {
      value: toBN(price),
    }
  );

  console.log("🚀 ~ file: ApiService.ts:191 ~ tx:", tx);
  await tx.wait();
};

export const buyToken = async ({
  orderHashes,
  price,
  myWallet,
  provider,
  chainId,
}: IBuyTokenProps) => {
  const mkpAddress = MKP_ADDRESS.get(chainId)!;
  const version = BACKEND_URL_VERSION.get(chainId);

  await provider.send("eth_requestAccounts", []);

  const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);

  const mkpContractWithSigner = mkpContract.connect(myWallet);

  const orderData = await Promise.all(
    orderHashes.map((item) =>
      axios.get(`/api/${version}/order`, {
        params: {
          orderHash: item,
          isCancelled: false,
          isFulfilled: false,
          isInvalid: false,
        },
      })
    )
  );

  const signatures = orderData.map(
    (item) => item.data.data.content[0].signature
  );

  orderData.forEach((item) => {
    delete item.data.data.content[0].status;
    delete item.data.data.content[0].orderHash;
    delete item.data.data.content[0].signature;
  });

  let tx;

  if (orderData.length === 1) {
    tx = await mkpContractWithSigner.fulfillOrder(
      transformDataRequestToBuyNFT({
        parameters: orderData[0].data.data.content[0],
        signature: signatures[0],
      }),

      {
        value: toBN(price[0]),
        // gasLimit: 100000,
      }
    );
  } else {
    const realPrice = price.reduce((acc, cur) => {
      return acc.add(cur);
    }, toBN(0));

    tx = await mkpContractWithSigner.fulfillOrderBatch(
      orderData.map((item, index) =>
        transformDataRequestToBuyNFT({
          parameters: item.data.data.content[0],
          signature: signatures[index],
        })
      ),
      { value: toBN(realPrice) }
    );
  }
  console.log("🚀 ~ file: ApiService.ts:191 ~ tx:", tx);

  await tx.wait();
};

export const cancelOrder = async ({
  orderHashes,
  myWallet,
  provider,
  myAddress,
  chainId,
}: ICancelOrderProps) => {
  if (!orderHashes?.length) return;
  const mkpAddress = MKP_ADDRESS.get(chainId)!;
  const version = BACKEND_URL_VERSION.get(chainId);

  const mkpContract = new ethers.Contract(mkpAddress, mkpAbi, provider);

  const mkpContractWithSigner = mkpContract.connect(myWallet);

  const orderData = await Promise.all(
    orderHashes.map((item) =>
      axios.get(`/api/${version}/order`, {
        params: {
          orderHash: item,
          isCancelled: false,
          isFulfilled: false,
          isInvalid: false,
        },
      })
    )
  );

  const counter = await mkpContractWithSigner.getCounter(myAddress);

  orderData.forEach((item) => {
    delete item.data.data.content[0].status;
    delete item.data.data.content[0].orderHash;
    delete item.data.data.content[0].signature;
    item.data.data.content[0].counter = counter;
  });

  console.log(
    transformDataRequestToBuyNFT(
      orderData.map((item: any) => item.data.data.content[0])
    )
  );

  const tx = await mkpContractWithSigner.cancel(
    transformDataRequestToBuyNFT(
      orderData.map((item: any) => item.data.data.content[0])
    )
  );

  console.log("🚀 ~ file: ApiService.ts:191 ~ tx:", tx);
  await tx.wait();
};

export const getOfferMadeList = async (myAddress: string, chainId: number) => {
  const version = BACKEND_URL_VERSION.get(chainId);
  let offset = 0;
  let nfts: any = [];

  while (true) {
    const params: { [k: string]: any } = {
      limit: 100,
      offset,
    };
    const nftRes = await axios.get(`/api/${version}/nft`, { params });
    if (!nftRes.data.data.nfts?.length) break;
    nfts = nfts.concat(nftRes.data.data.nfts);
    offset += 100;
  }
  if (!nfts.length) return [];

  let offerMadeList: any = [];
  const offerRes = await axios.get(`/api/${version}/order`, {
    params: {
      offerer: myAddress,
      isCancelled: false,
      isFulfilled: false,
      isInvalid: false,
    },
  });
  offerMadeList = offerRes.data.data.content;

  const flattenResult = flatten(offerMadeList);
  return flattenResult
    .filter((item: any) => {
      return item.offer[0].itemType === 1;
    })
    .map((item: any) => {
      const itemInfo = nfts.find(
        (nft: INFTCollectionItem) =>
          nft.identifier === item.consideration[0].identifier
      );
      return {
        ...item,
        itemName: itemInfo?.name,
        itemImage: itemInfo?.image,
      };
    });
};

export const getOfferReceivedList = async (
  myAddress: string,
  chainId: number
) => {
  const version = BACKEND_URL_VERSION.get(chainId);
  const params: { [k: string]: any } = {
    limit: 100,
    offset: 0,
    owner: myAddress,
  };

  const myNftsRes = await axios.get(`/api/${version}/nft`, { params });

  const myNfts = myNftsRes.data.data.nfts;

  if (!myNfts.length) return [];

  const myMakeOffersList = await Promise.all(
    myNfts.map((item: INFTCollectionItem) =>
      axios.get(`/api/${version}/order`, {
        params: {
          considerationIdentifier: item.identifier,
          isCancelled: false,
          isFulfilled: false,
          isInvalid: false,
        },
      })
    )
  );

  const result = myMakeOffersList.map((item) => item.data.data.content);

  const flattenResult = flatten(result);

  return flattenResult
    .filter((item: any) => {
      return item.offer[0].itemType === 1;
    })
    .map((item: any) => {
      const itemInfo = myNfts.find(
        (nft: INFTCollectionItem) =>
          nft.identifier === item.consideration[0].identifier
      );
      return {
        ...item,
        itemName: itemInfo?.name,
        itemImage: itemInfo?.image,
      };
    });
};

export const getOfferList = async ({
  owner,
  from,
  chainId,
}: IGetOfferListProps): Promise<IOfferItem[]> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  return axios
    .get(`/api/${version}/profile/offer`, {
      params: { owner, from },
    })
    .then((response) => {
      return response.data.data.offer_list || [];
    })
    .catch((err) => {
      console.log(err);
    });
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
  // url,
  description,
  collection,
  supply,
  // blockchain,
  provider,
  myWallet,
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
      image: "https://gateway.pinata.cloud/ipfs/" + featuredImageCid,
      name,
      description: description,
      collection,
      supply,
      // blockchain,
      // url,
      metadata: {
        name: `${name}`,
        image: "https://gateway.pinata.cloud/ipfs/" + featuredImageCid,
        description: description,
      },
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

  const metaDataIPFS = await axios(createNFTConfig);

  // mint NFT and send data to BE
  await provider.send("eth_requestAccounts", []);
  const myNftContract = new ethers.Contract(
    collection,
    erc721CollectionAbi,
    provider
  );
  const myNftContractWithSigner = myNftContract.connect(myWallet);
  const tokenUri =
    "https://gateway.pinata.cloud/ipfs/" + metaDataIPFS.data.IpfsHash;

  console.log("tokenUri", tokenUri);

  while (true) {
    try {
      await fetch(tokenUri);
      break;
    } catch (error) {
      console.log(error);
      await new Promise((r) => setTimeout(r, 20000));
    }
  }

  const nftId = randomBN();
  console.log("nftId", nftId);
  const tx = await myNftContractWithSigner.mint(
    await myWallet.getAddress(),
    nftId,
    tokenUri
    // {
    //   gasLimit: 1000000,
    // }
  );
  await tx.wait();
  await new Promise((r) => setTimeout(r, 5000));
};

export const createNFTCollectionService = async ({
  logoImage,
  // featuredImage,
  bannerImage,
  category,
  // blockchain,
  owner,
  name,
  // url,
  description,
  chainId,
  authToken,
}: ICreateCollectionProps) => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  // const featuredImageCid = await handleUploadImageToPinata(featuredImage);
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
      // featuredImage: featuredImageCid,
      bannerImage: bannerImageCid,
      name,
      // url,
      description,
      category,
      // link,
      // blockchain,
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

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  try {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const newContract = new ethers.ContractFactory(
      erc721CollectionAbi,
      "0x60806040523480156200001157600080fd5b5060405162003b8b38038062003b8b8339818101604052810190620000379190620002fb565b828281600090816200004a9190620005ff565b5080600190816200005c9190620005ff565b5050506200007f620000736200009a60201b60201c565b620000a260201b60201c565b8060099081620000909190620005ff565b50505050620006e6565b600033905090565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001d18262000186565b810181811067ffffffffffffffff82111715620001f357620001f262000197565b5b80604052505050565b60006200020862000168565b9050620002168282620001c6565b919050565b600067ffffffffffffffff82111562000239576200023862000197565b5b620002448262000186565b9050602081019050919050565b60005b838110156200027157808201518184015260208101905062000254565b60008484015250505050565b6000620002946200028e846200021b565b620001fc565b905082815260208101848484011115620002b357620002b262000181565b5b620002c084828562000251565b509392505050565b600082601f830112620002e057620002df6200017c565b5b8151620002f28482602086016200027d565b91505092915050565b60008060006060848603121562000317576200031662000172565b5b600084015167ffffffffffffffff81111562000338576200033762000177565b5b6200034686828701620002c8565b935050602084015167ffffffffffffffff8111156200036a576200036962000177565b5b6200037886828701620002c8565b925050604084015167ffffffffffffffff8111156200039c576200039b62000177565b5b620003aa86828701620002c8565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200040757607f821691505b6020821081036200041d576200041c620003bf565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620004877fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000448565b62000493868362000448565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620004e0620004da620004d484620004ab565b620004b5565b620004ab565b9050919050565b6000819050919050565b620004fc83620004bf565b620005146200050b82620004e7565b84845462000455565b825550505050565b600090565b6200052b6200051c565b62000538818484620004f1565b505050565b5b8181101562000560576200055460008262000521565b6001810190506200053e565b5050565b601f821115620005af57620005798162000423565b620005848462000438565b8101602085101562000594578190505b620005ac620005a38562000438565b8301826200053d565b50505b505050565b600082821c905092915050565b6000620005d460001984600802620005b4565b1980831691505092915050565b6000620005ef8383620005c1565b9150826002028217905092915050565b6200060a82620003b4565b67ffffffffffffffff81111562000626576200062562000197565b5b620006328254620003ee565b6200063f82828562000564565b600060209050601f83116001811462000677576000841562000662578287015190505b6200066e8582620005e1565b865550620006de565b601f198416620006878662000423565b60005b82811015620006b1578489015182556001820191506020850194506020810190506200068a565b86831015620006d15784890151620006cd601f891682620005c1565b8355505b6001600288020188555050505b505050505050565b61349580620006f66000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c80638da5cb5b116100b8578063d204c45e1161007c578063d204c45e14610338578063d3fc986414610354578063d9ce2f6d14610370578063e8a3d4851461038e578063e985e9c5146103ac578063f2fde38b146103dc57610137565b80638da5cb5b1461029457806395d89b41146102b2578063a22cb465146102d0578063b88d4fde146102ec578063c87b56dd1461030857610137565b806342842e0e116100ff57806342842e0e146101f257806342966c681461020e5780636352211e1461022a57806370a082311461025a578063715018a61461028a57610137565b806301ffc9a71461013c57806306fdde031461016c578063081812fc1461018a578063095ea7b3146101ba57806323b872dd146101d6575b600080fd5b61015660048036038101906101519190612180565b6103f8565b60405161016391906121c8565b60405180910390f35b6101746104da565b6040516101819190612273565b60405180910390f35b6101a4600480360381019061019f91906122cb565b61056c565b6040516101b19190612339565b60405180910390f35b6101d460048036038101906101cf9190612380565b6105b2565b005b6101f060048036038101906101eb91906123c0565b6106c9565b005b61020c600480360381019061020791906123c0565b610729565b005b610228600480360381019061022391906122cb565b610749565b005b610244600480360381019061023f91906122cb565b6107a5565b6040516102519190612339565b60405180910390f35b610274600480360381019061026f9190612413565b61082b565b604051610281919061244f565b60405180910390f35b6102926108e2565b005b61029c6108f6565b6040516102a99190612339565b60405180910390f35b6102ba610920565b6040516102c79190612273565b60405180910390f35b6102ea60048036038101906102e59190612496565b6109b2565b005b6103066004803603810190610301919061260b565b6109c8565b005b610322600480360381019061031d91906122cb565b610a2a565b60405161032f9190612273565b60405180910390f35b610352600480360381019061034d919061272f565b610a3c565b005b61036e6004803603810190610369919061278b565b610a75565b005b610378610a96565b6040516103859190612273565b60405180910390f35b610396610b24565b6040516103a39190612273565b60405180910390f35b6103c660048036038101906103c191906127fa565b610bb6565b6040516103d391906121c8565b60405180910390f35b6103f660048036038101906103f19190612413565b610c4a565b005b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806104c357507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806104d357506104d282610ccd565b5b9050919050565b6060600080546104e990612869565b80601f016020809104026020016040519081016040528092919081815260200182805461051590612869565b80156105625780601f1061053757610100808354040283529160200191610562565b820191906000526020600020905b81548152906001019060200180831161054557829003601f168201915b5050505050905090565b600061057782610d37565b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006105bd826107a5565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361062d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106249061290c565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1661064c610d82565b73ffffffffffffffffffffffffffffffffffffffff16148061067b575061067a81610675610d82565b610bb6565b5b6106ba576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106b19061299e565b60405180910390fd5b6106c48383610d8a565b505050565b6106da6106d4610d82565b82610e43565b610719576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161071090612a30565b60405180910390fd5b610724838383610ed8565b505050565b610744838383604051806020016040528060008152506109c8565b505050565b61075a610754610d82565b82610e43565b610799576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161079090612a30565b60405180910390fd5b6107a2816111d1565b50565b6000806107b1836111dd565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610822576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161081990612a9c565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361089b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161089290612b2e565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6108ea61121a565b6108f46000611298565b565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606001805461092f90612869565b80601f016020809104026020016040519081016040528092919081815260200182805461095b90612869565b80156109a85780601f1061097d576101008083540402835291602001916109a8565b820191906000526020600020905b81548152906001019060200180831161098b57829003601f168201915b5050505050905090565b6109c46109bd610d82565b838361135e565b5050565b6109d96109d3610d82565b83610e43565b610a18576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a0f90612a30565b60405180910390fd5b610a24848484846114ca565b50505050565b6060610a3582611526565b9050919050565b610a4461121a565b6000610a506008611638565b9050610a5c6008611646565b610a66838261165c565b610a70818361167a565b505050565b610a7d61121a565b610a87838361165c565b610a91828261167a565b505050565b60098054610aa390612869565b80601f0160208091040260200160405190810160405280929190818152602001828054610acf90612869565b8015610b1c5780601f10610af157610100808354040283529160200191610b1c565b820191906000526020600020905b815481529060010190602001808311610aff57829003601f168201915b505050505081565b606060098054610b3390612869565b80601f0160208091040260200160405190810160405280929190818152602001828054610b5f90612869565b8015610bac5780601f10610b8157610100808354040283529160200191610bac565b820191906000526020600020905b815481529060010190602001808311610b8f57829003601f168201915b5050505050905090565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610c5261121a565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610cc1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cb890612bc0565b60405180910390fd5b610cca81611298565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610d40816116e7565b610d7f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d7690612a9c565b60405180910390fd5b50565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610dfd836107a5565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610e4f836107a5565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610e915750610e908185610bb6565b5b80610ecf57508373ffffffffffffffffffffffffffffffffffffffff16610eb78461056c565b73ffffffffffffffffffffffffffffffffffffffff16145b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16610ef8826107a5565b73ffffffffffffffffffffffffffffffffffffffff1614610f4e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f4590612c52565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610fbd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fb490612ce4565b60405180910390fd5b610fca8383836001611728565b8273ffffffffffffffffffffffffffffffffffffffff16610fea826107a5565b73ffffffffffffffffffffffffffffffffffffffff1614611040576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161103790612c52565b60405180910390fd5b6004600082815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a46111cc838383600161184e565b505050565b6111da81611854565b50565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b611222610d82565b73ffffffffffffffffffffffffffffffffffffffff166112406108f6565b73ffffffffffffffffffffffffffffffffffffffff1614611296576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161128d90612d50565b60405180910390fd5b565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036113cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113c390612dbc565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516114bd91906121c8565b60405180910390a3505050565b6114d5848484610ed8565b6114e1848484846118a7565b611520576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161151790612e4e565b60405180910390fd5b50505050565b606061153182610d37565b600060066000848152602001908152602001600020805461155190612869565b80601f016020809104026020016040519081016040528092919081815260200182805461157d90612869565b80156115ca5780601f1061159f576101008083540402835291602001916115ca565b820191906000526020600020905b8154815290600101906020018083116115ad57829003601f168201915b5050505050905060006115db611a2e565b905060008151036115f0578192505050611633565b60008251111561162557808260405160200161160d929190612eaa565b60405160208183030381529060405292505050611633565b61162e84611a45565b925050505b919050565b600081600001549050919050565b6001816000016000828254019250508190555050565b611676828260405180602001604052806000815250611aad565b5050565b611683826116e7565b6116c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116b990612f40565b60405180910390fd5b806006600084815260200190815260200160002090816116e2919061310c565b505050565b60008073ffffffffffffffffffffffffffffffffffffffff16611709836111dd565b73ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600181111561184857600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16146117bc5780600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546117b4919061320d565b925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16146118475780600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461183f9190613241565b925050819055505b5b50505050565b50505050565b61185d81611b08565b600060066000838152602001908152602001600020805461187d90612869565b9050146118a4576006600082815260200190815260200160002060006118a391906120b7565b5b50565b60006118c88473ffffffffffffffffffffffffffffffffffffffff16611c56565b15611a21578373ffffffffffffffffffffffffffffffffffffffff1663150b7a026118f1610d82565b8786866040518563ffffffff1660e01b815260040161191394939291906132ca565b6020604051808303816000875af192505050801561194f57506040513d601f19601f8201168201806040525081019061194c919061332b565b60015b6119d1573d806000811461197f576040519150601f19603f3d011682016040523d82523d6000602084013e611984565b606091505b5060008151036119c9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119c090612e4e565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614915050611a26565b600190505b949350505050565b606060405180602001604052806000815250905090565b6060611a5082610d37565b6000611a5a611a2e565b90506000815111611a7a5760405180602001604052806000815250611aa5565b80611a8484611c79565b604051602001611a95929190612eaa565b6040516020818303038152906040525b915050919050565b611ab78383611d47565b611ac460008484846118a7565b611b03576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611afa90612e4e565b60405180910390fd5b505050565b6000611b13826107a5565b9050611b23816000846001611728565b611b2c826107a5565b90506004600083815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506002600083815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905581600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611c5281600084600161184e565b5050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b606060006001611c8884611f64565b01905060008167ffffffffffffffff811115611ca757611ca66124e0565b5b6040519080825280601f01601f191660200182016040528015611cd95781602001600182028036833780820191505090505b509050600082602001820190505b600115611d3c578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a8581611d3057611d2f613358565b5b04945060008503611ce7575b819350505050919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611db6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611dad906133d3565b60405180910390fd5b611dbf816116e7565b15611dff576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611df69061343f565b60405180910390fd5b611e0d600083836001611728565b611e16816116e7565b15611e56576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e4d9061343f565b60405180910390fd5b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611f6060008383600161184e565b5050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611fc2577a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008381611fb857611fb7613358565b5b0492506040810190505b6d04ee2d6d415b85acef81000000008310611fff576d04ee2d6d415b85acef81000000008381611ff557611ff4613358565b5b0492506020810190505b662386f26fc10000831061202e57662386f26fc10000838161202457612023613358565b5b0492506010810190505b6305f5e1008310612057576305f5e100838161204d5761204c613358565b5b0492506008810190505b612710831061207c57612710838161207257612071613358565b5b0492506004810190505b6064831061209f576064838161209557612094613358565b5b0492506002810190505b600a83106120ae576001810190505b80915050919050565b5080546120c390612869565b6000825580601f106120d557506120f4565b601f0160209004906000526020600020908101906120f391906120f7565b5b50565b5b808211156121105760008160009055506001016120f8565b5090565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61215d81612128565b811461216857600080fd5b50565b60008135905061217a81612154565b92915050565b6000602082840312156121965761219561211e565b5b60006121a48482850161216b565b91505092915050565b60008115159050919050565b6121c2816121ad565b82525050565b60006020820190506121dd60008301846121b9565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561221d578082015181840152602081019050612202565b60008484015250505050565b6000601f19601f8301169050919050565b6000612245826121e3565b61224f81856121ee565b935061225f8185602086016121ff565b61226881612229565b840191505092915050565b6000602082019050818103600083015261228d818461223a565b905092915050565b6000819050919050565b6122a881612295565b81146122b357600080fd5b50565b6000813590506122c58161229f565b92915050565b6000602082840312156122e1576122e061211e565b5b60006122ef848285016122b6565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000612323826122f8565b9050919050565b61233381612318565b82525050565b600060208201905061234e600083018461232a565b92915050565b61235d81612318565b811461236857600080fd5b50565b60008135905061237a81612354565b92915050565b600080604083850312156123975761239661211e565b5b60006123a58582860161236b565b92505060206123b6858286016122b6565b9150509250929050565b6000806000606084860312156123d9576123d861211e565b5b60006123e78682870161236b565b93505060206123f88682870161236b565b9250506040612409868287016122b6565b9150509250925092565b6000602082840312156124295761242861211e565b5b60006124378482850161236b565b91505092915050565b61244981612295565b82525050565b60006020820190506124646000830184612440565b92915050565b612473816121ad565b811461247e57600080fd5b50565b6000813590506124908161246a565b92915050565b600080604083850312156124ad576124ac61211e565b5b60006124bb8582860161236b565b92505060206124cc85828601612481565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61251882612229565b810181811067ffffffffffffffff82111715612537576125366124e0565b5b80604052505050565b600061254a612114565b9050612556828261250f565b919050565b600067ffffffffffffffff821115612576576125756124e0565b5b61257f82612229565b9050602081019050919050565b82818337600083830152505050565b60006125ae6125a98461255b565b612540565b9050828152602081018484840111156125ca576125c96124db565b5b6125d584828561258c565b509392505050565b600082601f8301126125f2576125f16124d6565b5b813561260284826020860161259b565b91505092915050565b600080600080608085870312156126255761262461211e565b5b60006126338782880161236b565b94505060206126448782880161236b565b9350506040612655878288016122b6565b925050606085013567ffffffffffffffff81111561267657612675612123565b5b612682878288016125dd565b91505092959194509250565b600067ffffffffffffffff8211156126a9576126a86124e0565b5b6126b282612229565b9050602081019050919050565b60006126d26126cd8461268e565b612540565b9050828152602081018484840111156126ee576126ed6124db565b5b6126f984828561258c565b509392505050565b600082601f830112612716576127156124d6565b5b81356127268482602086016126bf565b91505092915050565b600080604083850312156127465761274561211e565b5b60006127548582860161236b565b925050602083013567ffffffffffffffff81111561277557612774612123565b5b61278185828601612701565b9150509250929050565b6000806000606084860312156127a4576127a361211e565b5b60006127b28682870161236b565b93505060206127c3868287016122b6565b925050604084013567ffffffffffffffff8111156127e4576127e3612123565b5b6127f086828701612701565b9150509250925092565b600080604083850312156128115761281061211e565b5b600061281f8582860161236b565b92505060206128308582860161236b565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061288157607f821691505b6020821081036128945761289361283a565b5b50919050565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b60006128f66021836121ee565b91506129018261289a565b604082019050919050565b60006020820190508181036000830152612925816128e9565b9050919050565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60008201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c000000602082015250565b6000612988603d836121ee565b91506129938261292c565b604082019050919050565b600060208201905081810360008301526129b78161297b565b9050919050565b7f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560008201527f72206f7220617070726f76656400000000000000000000000000000000000000602082015250565b6000612a1a602d836121ee565b9150612a25826129be565b604082019050919050565b60006020820190508181036000830152612a4981612a0d565b9050919050565b7f4552433732313a20696e76616c696420746f6b656e2049440000000000000000600082015250565b6000612a866018836121ee565b9150612a9182612a50565b602082019050919050565b60006020820190508181036000830152612ab581612a79565b9050919050565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b6000612b186029836121ee565b9150612b2382612abc565b604082019050919050565b60006020820190508181036000830152612b4781612b0b565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000612baa6026836121ee565b9150612bb582612b4e565b604082019050919050565b60006020820190508181036000830152612bd981612b9d565b9050919050565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b6000612c3c6025836121ee565b9150612c4782612be0565b604082019050919050565b60006020820190508181036000830152612c6b81612c2f565b9050919050565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000612cce6024836121ee565b9150612cd982612c72565b604082019050919050565b60006020820190508181036000830152612cfd81612cc1565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000612d3a6020836121ee565b9150612d4582612d04565b602082019050919050565b60006020820190508181036000830152612d6981612d2d565b9050919050565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b6000612da66019836121ee565b9150612db182612d70565b602082019050919050565b60006020820190508181036000830152612dd581612d99565b9050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b6000612e386032836121ee565b9150612e4382612ddc565b604082019050919050565b60006020820190508181036000830152612e6781612e2b565b9050919050565b600081905092915050565b6000612e84826121e3565b612e8e8185612e6e565b9350612e9e8185602086016121ff565b80840191505092915050565b6000612eb68285612e79565b9150612ec28284612e79565b91508190509392505050565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b6000612f2a602e836121ee565b9150612f3582612ece565b604082019050919050565b60006020820190508181036000830152612f5981612f1d565b9050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302612fc27fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82612f85565b612fcc8683612f85565b95508019841693508086168417925050509392505050565b6000819050919050565b6000613009613004612fff84612295565b612fe4565b612295565b9050919050565b6000819050919050565b61302383612fee565b61303761302f82613010565b848454612f92565b825550505050565b600090565b61304c61303f565b61305781848461301a565b505050565b5b8181101561307b57613070600082613044565b60018101905061305d565b5050565b601f8211156130c05761309181612f60565b61309a84612f75565b810160208510156130a9578190505b6130bd6130b585612f75565b83018261305c565b50505b505050565b600082821c905092915050565b60006130e3600019846008026130c5565b1980831691505092915050565b60006130fc83836130d2565b9150826002028217905092915050565b613115826121e3565b67ffffffffffffffff81111561312e5761312d6124e0565b5b6131388254612869565b61314382828561307f565b600060209050601f8311600181146131765760008415613164578287015190505b61316e85826130f0565b8655506131d6565b601f19841661318486612f60565b60005b828110156131ac57848901518255600182019150602085019450602081019050613187565b868310156131c957848901516131c5601f8916826130d2565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061321882612295565b915061322383612295565b925082820390508181111561323b5761323a6131de565b5b92915050565b600061324c82612295565b915061325783612295565b925082820190508082111561326f5761326e6131de565b5b92915050565b600081519050919050565b600082825260208201905092915050565b600061329c82613275565b6132a68185613280565b93506132b68185602086016121ff565b6132bf81612229565b840191505092915050565b60006080820190506132df600083018761232a565b6132ec602083018661232a565b6132f96040830185612440565b818103606083015261330b8184613291565b905095945050505050565b60008151905061332581612154565b92915050565b6000602082840312156133415761334061211e565b5b600061334f84828501613316565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b60006133bd6020836121ee565b91506133c882613387565b602082019050919050565b600060208201905081810360008301526133ec816133b0565b9050919050565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b6000613429601c836121ee565b9150613434826133f3565b602082019050919050565b600060208201905081810360008301526134588161341c565b905091905056fea2646970667358221220786641d1c01af81e5103eac1743d9e6fc96e70291c6d766afeabe08aebaf613c64736f6c63430008110033",
      signer
    );
    const contract = await newContract.deploy(
      name,
      name.slice(0, 2),
      "https://abc.com"
    );

    await contract.deployed();

    const params = JSON.stringify({
      token: contract.address,
      owner: owner,
      name: name,
      description: description,
      metadata: {
        description: description,
        logo: "https://gateway.pinata.cloud/ipfs/" + logoImageCid,
        banner: "https://gateway.pinata.cloud/ipfs/" + bannerImageCid,
      },
      category: category,
      // url: url,
      // featured_image_cid: featuredImageCid,
      // external_link: link,
      logo_image_cid: logoImageCid,
      banner_image_cid: bannerImageCid,
    });

    axios
      .post(`api/${version}/collection`, params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(function (response) {})
      .catch(function (error) {
        console.log("err", error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const getAllCollectionListService = async (
  category: string,
  chainId: number
): Promise<ICollectionItem[]> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  console.log("🚀 ~ file: ApiService.ts:1106 ~ version:", version);
  const url =
    category === "All"
      ? `/api/${version}/collection`
      : `/api/${version}/collection/${category}`;
  console.log("🚀 ~ file: ApiService.ts:1108 ~ url:", url);
  return axios
    .get(url)
    .then((response) => {
      return response.data.data.collections || [];
    })
    .catch((err) => {});
};

export const getCollectionByTokenService = async (
  token: string,
  chainId: number
): Promise<ICollectionItem[]> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  return axios
    .get(`/api/${version}/collection`, {
      params: { token: token },
    })
    .then((response) => {
      return response.data.data.collections || [];
    })
    .catch((err) => {});
};

export const getCollectionByOwnerService = async (
  owner: string,
  chainId: number
): Promise<ICollectionItem[]> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  return axios
    .get(`/api/${version}/collection`, {
      params: { owner: owner },
    })
    .then((response) => {
      return response.data.data.collections || [];
    })
    .catch((err) => {});
};

export const saveProfileService = async ({
  profileImage,
  profileBanner,
  username,
  bio,
  email,
  address,
  signature,
  chainId,
  authToken,
}: ISaveProfileProps) => {
  try {
    const version = BACKEND_URL_VERSION.get(chainId)!;
    const metadata: { [k: string]: string } = {};

    if (bio) {
      metadata.bio = bio;
    }
    if (email) {
      metadata.email = email;
    }

    if (profileImage) {
      typeof profileImage === "string"
        ? (metadata.image_url = profileImage)
        : (metadata.image_url =
            "https://gateway.pinata.cloud/ipfs/" +
            (await handleUploadImageToPinata(profileImage)));
    }

    if (profileBanner) {
      typeof profileBanner === "string"
        ? (metadata.banner_url = profileBanner)
        : (metadata.banner_url =
            "https://gateway.pinata.cloud/ipfs/" +
            (await handleUploadImageToPinata(profileBanner)));
    }

    const params = JSON.stringify({
      username: username,
      address: address,
      signature:
        "0x528c15b2906218f648a19ec8967303d45cb0ef4165dd0e0d83f95d09ba175db361e3f90e24d1d5854c",
      metadata: metadata,
    });

    await axios.post(`api/${version}/profile`, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getProfileService = async (
  owner: string,
  chainId: number
): Promise<IProfile> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  if (owner)
    return axios
      .get(`/api/${version}/profile/${owner}`)
      .then((response) => {
        return response.data.data || { address: "", username: "" };
      })
      .catch((err) => ({ address: "", username: "" }));
  else return { address: "", username: "" };
};

export const getEventNFTService = async ({
  token,
  token_id,
  name,
  chainId,
}: any): Promise<INFTActivity[]> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  return axios
    .get(`/api/${version}/event`, {
      params: { token, token_id, name },
    })
    .then((response) => {
      const res = response.data.data.events.sort(
        (a: INFTActivity, b: INFTActivity) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      );
      return res || [];
    })
    .catch((err) => {});
};

export const getEventNFTByOwnerService = async (
  owner: string,
  chainId: number
): Promise<INFTActivity[]> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  return axios
    .get(`/api/${version}/event`, {
      params: { address: owner },
    })
    .then((response) => {
      const res = response.data.data.events.sort(
        (a: INFTActivity, b: INFTActivity) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      );
      return res || [];
    })
    .catch((err) => {});
};

export const hideNFTService = async ({
  token,
  identifier,
  isHidden,
  chainId,
  authToken,
}: IHideNFTProps) => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const params = JSON.stringify({
    isHidden: isHidden,
  });

  await axios.patch(`/api/${version}/nft/${token}/${identifier}`, params, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const getNotificationByOwnerService = async (
  owner: string,
  chainId: number,
  authToken: string
): Promise<INotification[]> => {
  if (!chainId) return [];
  const version = BACKEND_URL_VERSION.get(chainId)!;
  return axios
    .get(`/api/${version}/notification`, {
      params: { address: owner },

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => {
      const res = response.data.data.notifications.sort(
        (a: INotification, b: INotification) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      );
      return res || [];
    })
    .catch((err) => {});
};

export const setViewedNotifService = async ({
  eventName,
  orderHash,
  chainId,
  authToken,
}: ISetViewdNotifProps) => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const params = JSON.stringify({
    event_name: eventName,
    order_hash: orderHash,
  });

  await axios.post(`/api/${version}/notification`, params, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const getSaleEventByAddrMthYrService = async ({
  address,
  month,
  year,
  chainId,
}: IGetSaleEventByAddrMthYrProps): Promise<INFTActivity[]> => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  return axios
    .get(`/api/${version}/event`, {
      params: { month, year, address, name: "sale" },
    })
    .then((response) => {
      const res = response.data.data.events.sort(
        (a: INFTActivity, b: INFTActivity) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      );
      return res || [];
    })
    .catch((err) => {});
};

export const createEthereumSignedAuthToken = async ({
  provider,
  myAddress,
  chainId,
}: ICreateEthereumSignedAuthTokenProps) => {
  const typedData = JSON.stringify({
    domain: {
      chainId,
      name: "Lover",
      version: "1.0",
    },
    message: {
      marketplace: "0x1aE99B75dC4F5Fd9B3cb191b31dde7eB7dA9D0Bb",
      admin: myAddress,
      signer: "0x6b9FE9aE37908e1d80796139132B77c9c671e0C6",
      royalty: "0.001",
      createdAt: `${Date.now()}`,
    },
    primaryType: "MarketplaceSettings",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
      ],
      MarketplaceSettings: [
        { name: "marketplace", type: "address" },
        { name: "admin", type: "address" },
        { name: "signer", type: "address" },
        { name: "royalty", type: "string" },
        { name: "createdAt", type: "uint256" },
      ],
    },
  });

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  var from = accounts[0];

  var params = [from, typedData];
  var method = "eth_signTypedData_v4";

  const signature = await window.ethereum.request({ method, params });

  return {
    typed_data: btoa(typedData),
    signature,
  };
};

const signMessage = async ({
  provider,
  myAddress,
  chainId,
}: ISignMessageProps) => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const data = await createEthereumSignedAuthToken({
    provider,
    myAddress,
    chainId,
  });
  console.log(data);
  axios({
    method: "post",
    url: `/api/${version}/marketplace-settings`,
    data: data,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log("Some error happened, check the backend...");
    });
};

const loginWithEthereum = async ({
  provider,
  myAddress,
  chainId,
}: ILoginWithEthereumProps) => {
  var nonce = await fetchNonce({ address: myAddress, chainId });
  //const message = createMessage(signer.address, nonce)
  const data = await createSignature({
    address: myAddress,
    nonce,
    chainId,
  });
  return data;
};

export const fetchNonce = async ({ address, chainId }: IFetchNonceProps) => {
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const res = await axios({
    method: "get",
    url: `/api/${version}/auth/${address}/nonce`,
  });

  console.log(res.data.data.nonce);
  return res.data.data.nonce;
};

export const createMessage = ({
  address,
  chainId,
  nonce,
}: ICreateMessageProps) => {
  console.log(address);
  const domain = window.location.host;
  const origin = window.location.host;
  const statement =
    "Welcome to Clover Marketplace. Please sign this message to login.";
  const siweMessage = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId,
    nonce,
  });
  return siweMessage.prepareMessage();
  return (
    "clover.com wants to sign in with your Ethereum account:\n" +
    address +
    "\n" +
    "\n" +
    "Log in to Clover Marketplace" +
    "\n" +
    "\n" +
    "URI: https://clover.com/login\n" +
    "Version: 1\n" +
    "Nonce: " +
    nonce +
    "\n"
    // "Chain ID: " + chainId +"\n" +
    // "Issued At: " + issuedAt + "\n" +
    // "Expiration Time: " + expiresAt + "\n"
  );
};

const createSignature = async ({
  address,
  chainId,
  nonce,
}: ICreateSignatureProps) => {
  const message = createMessage({ address, nonce, chainId });
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  var from = accounts[0];
  const sign = await window.ethereum.request({
    method: "personal_sign",
    params: [message, from],
  });
  console.log(sign);
  const data = await authSignature({
    address: from,
    message,
    signature: sign,
    chainId,
  });
  return data;
};

const authSignature = async ({
  address,
  chainId,
  message,
  signature,
}: IAuthSignatureProps) => {
  //setVerified(false)
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const res = await axios({
    method: "post",
    url: `/api/${version}/auth/login`,
    data: {
      address: address,
      message: message,
      signature: signature,
    },
  });

  return res;
};

export const signEIP191 = async ({
  provider,
  myAddress,
  chainId,
}: ISignEIP191Props) => {
  const data = await loginWithEthereum({ provider, myAddress, chainId });
  return data.data.data;

  // const createSignature = async (nonce) => {
  //   const message = createMessage(address, nonce)
  //   const signedMessage = await signMessageAsync({message})
  //   authSignature(message, signedMessage)
  // }
};

export const getUser = async ({ address, chainId }: IGetUserProps) => {
  if (!chainId) return null;
  const version = BACKEND_URL_VERSION.get(chainId)!;

  const res = await axios.get(`/api/${version}/user/${address}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data.data.user;
};

export const getAllUsers = async ({ chainId }: IGetAllUsersProps) => {
  if (!chainId) return [];
  const version = BACKEND_URL_VERSION.get(chainId)!;

  const res = await axios.get(`/api/${version}/user?offset=0&limit=100`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data.data.users;
};

// export const setBlockAccount = async ({
//   authToken,
//   address,
//   chainId,
//   isBlock,
// }: ISetBlockAccountProps) => {
//   const version = BACKEND_URL_VERSION.get(chainId)!;

//   await axios.patch(
//     `/api/${version}/user/${address}/block?is_block=${isBlock}`,
//     {},
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authToken}`,
//       },
//     }
//   );
// };

export const setBlockAccount = async ({
  authToken,
  address,
  chainId,
  isBlock,
}: ISetBlockAccountProps) => {
  const version = BACKEND_URL_VERSION.get(chainId)!;

  await axios.patch(
    `/api/${version}/user/block`,
    { address: address, is_block: isBlock },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const setRole = async ({
  authToken,
  address,
  chainId,
  roleId,
}: ISetRoleProps) => {
  const version = BACKEND_URL_VERSION.get(chainId)!;

  await axios.post(
    `/api/${version}/user/role`,
    {
      address: address,
      role_id: roleId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const deleteRole = async ({
  authToken,
  address,
  chainId,
  roleId,
}: IDeleteRoleProps) => {
  const version = BACKEND_URL_VERSION.get(chainId)!;

  await axios.delete(`/api/${version}/user/role`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    data: {
      address: address,
      role_id: roleId,
    },
  });
};

export const getMkpInfo = async ({ chainId }: IGetMkpInfoProps) => {
  if (!chainId) return null;
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const mkpAddress = MKP_ADDRESS.get(chainId)!;

  const res = await axios.get(
    `/api/${version}/settings?marketplace=${mkpAddress}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.data;
};

export const editMkpInfo = async ({
  chainId,
  beneficiary,
  royalty,
  authToken,
}: IEditMkpInfoProps) => {
  if (!chainId) return null;
  const version = BACKEND_URL_VERSION.get(chainId)!;
  const mkpAddress = MKP_ADDRESS.get(chainId)!;

  const res = await axios.post(
    `/api/${version}/settings`,
    {
      marketplace: mkpAddress,
      beneficiary,
      royalty,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  return res.data.data;
};
