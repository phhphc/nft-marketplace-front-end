import { randomBytes as nodeRandomBytes } from "crypto";
import { snakeCase, camelCase } from "lodash";
import { BigNumber, constants, utils } from "ethers";
import {
  getAddress,
  keccak256,
  toUtf8Bytes,
  recoverAddress,
} from "ethers/lib/utils";
import type { BigNumberish, ContractTransaction } from "ethers";
import {
  ConsiderationItem,
  FulfillmentComponent,
  OfferItem,
  OrderComponents,
} from "@Interfaces/index";
import type { Contract, Wallet } from "ethers";
import {
  orderType,
  DATA_MAPPING_SNAKIZE,
  NORMAL_STRING_MAPPING,
  DATA_MAPPING_CAMELIZE,
  TO_NUMBER_MAPPING,
  TO_NUMBER_MAPPING_WITH_ITEM_TYPE,
  MAPPING_STRING_TO_BIG_NUMBER,
  STRING_HEX_TO_NUMBER,
} from "@Constants/index";
import { IWeb3Context, WEB3_ACTION_TYPES } from "@Store/index";

const randomBytes = (n: number) => nodeRandomBytes(n).toString("hex");

export const randomHex = (bytes = 32) => `0x${randomBytes(bytes)}`;

export const random128 = () => toBN(randomHex(16));

const hexRegex = /[A-Fa-fx]/g;

export const toHex = (n: BigNumberish, numBytes: number = 0) => {
  const asHexString = BigNumber.isBigNumber(n)
    ? n.toHexString().slice(2)
    : typeof n === "string"
    ? hexRegex.test(n)
      ? n.replace(/0x/, "")
      : Number(n).toString(16)
    : Number(n).toString(16);
  return `0x${asHexString.padStart(numBytes * 2, "0")}`;
};

export const baseFee = async (tx: ContractTransaction) => {
  const data = tx.data;
  const { gasUsed } = await tx.wait();
  const bytes = toHex(data)
    .slice(2)
    .match(/.{1,2}/g) as string[];
  const numZero = bytes.filter((b) => b === "00").length;
  return (
    gasUsed.toNumber() - (21000 + (numZero * 4 + (bytes.length - numZero) * 16))
  );
};

export const toBigInt = (num: BigNumber | string | number) => {
  let req: BigNumber = BigNumber.from(num);
  return parseInt(utils.formatEther(req.toBigInt()));
};

export const randomBN = (bytes: number = 16) => toBN(randomHex(bytes));

export const toBN = (n: BigNumberish) => BigNumber.from(toHex(n));

export const toAddress = (n: BigNumberish) => getAddress(toHex(n, 20));

export const toKey = (n: BigNumberish) => toHex(n, 32);

export const convertSignatureToEIP2098 = (signature: string) => {
  if (signature.length === 130) {
    return signature;
  }

  return utils.splitSignature(signature).compact;
};

export const getOfferOrConsiderationItem = <
  RecipientType extends string | undefined = undefined
>(
  itemType: number = 0,
  token: string = constants.AddressZero,
  identifierOrCriteria: BigNumberish = 0,
  startAmount: BigNumberish = 1,
  endAmount: BigNumberish = 1,
  recipient?: RecipientType
): RecipientType extends string ? ConsiderationItem : OfferItem => {
  const offerItem: OfferItem = {
    itemType,
    token,
    identifier:
      Number(identifierOrCriteria) !== 0
        ? identifierOrCriteria.toString()
        : toBN(0),
    startAmount: toBN(startAmount),
    endAmount: toBN(endAmount),
  };
  if (typeof recipient === "string") {
    return {
      ...offerItem,
      recipient: recipient as string,
    } as ConsiderationItem;
  }
  return offerItem as any;
};

export const getTestItem721 = (
  identifier: BigNumberish = 0,

  startAmount: BigNumberish = 1,
  endAmount: BigNumberish = 1,
  recipient?: string,
  token = process.env.NEXT_PUBLIC_ERC721_ADDRESS
) => {
  return getOfferOrConsiderationItem(
    2, // ERC721
    token,
    identifier,
    startAmount,
    endAmount,
    recipient
  );
};

export const getTestItem20 = (
  identifier: BigNumberish = 0,

  startAmount: BigNumberish = 1,
  endAmount: BigNumberish = 1,
  recipient?: string,
  token = process.env.NEXT_PUBLIC_ERC20_ADDRESS
) => {
  return getOfferOrConsiderationItem(
    1, // ERC20
    token,
    identifier,
    startAmount,
    endAmount,
    recipient
  );
};

export const getItemETH = (
  startAmount: BigNumberish = 1,
  endAmount: BigNumberish = 1,
  recipient?: string
) =>
  getOfferOrConsiderationItem(
    0,
    constants.AddressZero,
    0,
    toBN(startAmount),
    toBN(endAmount),
    recipient
  );

export const calculateOrderHash = (orderComponents: OrderComponents) => {
  const offerItemTypeString =
    "OfferItem(uint8 itemType,address token,uint256 identifier,uint256 startAmount,uint256 endAmount)";
  const considerationItemTypeString =
    "ConsiderationItem(uint8 itemType,address token,uint256 identifier,uint256 startAmount,uint256 endAmount,address recipient)";
  const orderComponentsPartialTypeString =
    "OrderComponents(address offerer,OfferItem[] offer,ConsiderationItem[] consideration,uint256 startTime,uint256 endTime,uint256 salt,uint256 counter)";
  const orderTypeString = `${orderComponentsPartialTypeString}${considerationItemTypeString}${offerItemTypeString}`;

  const offerItemTypeHash = keccak256(toUtf8Bytes(offerItemTypeString));
  const considerationItemTypeHash = keccak256(
    toUtf8Bytes(considerationItemTypeString)
  );
  const orderTypeHash = keccak256(toUtf8Bytes(orderTypeString));

  const offerHash = keccak256(
    "0x" +
      orderComponents.offer
        .map((offerItem) => {
          return keccak256(
            "0x" +
              [
                offerItemTypeHash.slice(2),
                offerItem.itemType.toString().padStart(64, "0"),
                offerItem.token.slice(2).padStart(64, "0"),
                toBN(offerItem.identifier)
                  .toHexString()
                  .slice(2)
                  .padStart(64, "0"),
                toBN(offerItem.startAmount)
                  .toHexString()
                  .slice(2)
                  .padStart(64, "0"),
                toBN(offerItem.endAmount)
                  .toHexString()
                  .slice(2)
                  .padStart(64, "0"),
              ].join("")
          ).slice(2);
        })
        .join("")
  );

  const considerationHash = keccak256(
    "0x" +
      orderComponents.consideration
        .map((considerationItem) => {
          return keccak256(
            "0x" +
              [
                considerationItemTypeHash.slice(2),
                considerationItem.itemType.toString().padStart(64, "0"),
                considerationItem.token.slice(2).padStart(64, "0"),
                toBN(considerationItem.identifier)
                  .toHexString()
                  .slice(2)
                  .padStart(64, "0"),
                toBN(considerationItem.startAmount)
                  .toHexString()
                  .slice(2)
                  .padStart(64, "0"),
                toBN(considerationItem.endAmount)
                  .toHexString()
                  .slice(2)
                  .padStart(64, "0"),
                considerationItem.recipient.slice(2).padStart(64, "0"),
              ].join("")
          ).slice(2);
        })
        .join("")
  );

  const derivedOrderHash = keccak256(
    "0x" +
      [
        orderTypeHash.slice(2),
        orderComponents.offerer.slice(2).padStart(64, "0"),
        offerHash.slice(2),
        considerationHash.slice(2),
        toBN(orderComponents.startTime)
          .toHexString()
          .slice(2)
          .padStart(64, "0"),
        toBN(orderComponents.endTime).toHexString().slice(2).padStart(64, "0"),
        orderComponents.salt.slice(2).padStart(64, "0"),
        toBN(orderComponents.counter).toHexString().slice(2).padStart(64, "0"),
      ].join("")
  );

  return derivedOrderHash;
};

export const getAndVerifyOrderHash = async (
  marketplace: Contract,
  orderComponents: OrderComponents
) => {
  const orderHash = await marketplace.getOrderHash(orderComponents);
  const derivedOrderHash = calculateOrderHash(orderComponents);
  return orderHash;
};

const signOrder = async (
  marketplace: Contract,
  chainId: number,
  orderComponents: OrderComponents,
  signer: Wallet | Contract
) => {
  console.log("🚀 ~ file: index.ts:268 ~ orderComponents:", orderComponents);
  console.log("🚀 ~ file: index.ts:268 ~ marketplace:", marketplace);
  try {
    const domainData = {
      name: "Lover",
      version: "1.0",
      chainId,
      verifyingContract: marketplace.address,
    };
    const signature = await signer._signTypedData(
      domainData,
      orderType,
      orderComponents
    );

    const orderHash = await getAndVerifyOrderHash(marketplace, orderComponents);
    const { domainSeparator } = await marketplace["information"]();
    const digest = keccak256(
      `0x1901${domainSeparator.slice(2)}${orderHash.slice(2)}`
    );
    const recoveredAddress = recoverAddress(digest, signature);
    return signature;
  } catch (err) {
    console.log(err);
  }
};

export const createOrder = async (
  marketplace: Contract,
  chainId: number,
  offerer: Wallet | Contract,
  offer: OfferItem[],
  consideration: ConsiderationItem[],
  startDate: Date | null,
  endDate: Date | null
) => {
  const counter = await marketplace.getCounter(await offerer.getAddress());

  const salt = randomHex();

  const startTime = startDate
    ? toBN(Math.round(startDate.getTime() / 1000))
    : toBN(0);

  const endTime = endDate
    ? toBN(Math.round(endDate.getTime() / 1000))
    : toBN("0xff00000000000000000000000000");

  const orderParameters = {
    offerer: await offerer.getAddress(),
    offer,
    consideration,
    salt,
    startTime,
    endTime,
  };

  const orderComponents = {
    ...orderParameters,
    counter,
  };

  const orderHash = await marketplace.getOrderHash(orderComponents);
  await calculateOrderHash(orderComponents);

  const domainData = {
    name: "Lover",
    version: "1.0",
    chainId,
    verifyingContract: marketplace.address,
  };
  console.log("🚀 ~ file: index.ts:344 ~ domainData:", domainData);
  console.log("🚀 ~ file: index.ts:344 ~ domainData:", orderType);

  const flatSig = await offerer._signTypedData(
    domainData,
    orderType,
    orderComponents
  );
  const { domainSeparator } = await marketplace.information();
  console.log("🚀 ~ file: index.ts:353 ~ domainSeparator:", domainSeparator);
  const digest = keccak256(
    `0x1901${domainSeparator.slice(2)}${orderHash.slice(2)}`
  );
  const recoveredAddress = recoverAddress(digest, flatSig);
  if (recoveredAddress !== (await offerer.getAddress())) {
    throw "wrong signature";
  }

  const order = {
    parameters: orderParameters,
    signature: convertSignatureToEIP2098(flatSig),
  };

  // How much ether (at most) needs to be supplied when fulfilling the order
  const value = offer
    .map((x) =>
      x.itemType === 0
        ? x.endAmount.gt(x.startAmount)
          ? x.endAmount
          : x.startAmount
        : toBN(0)
    )
    .reduce((a, b) => a.add(b), toBN(0))
    .add(
      consideration
        .map((x) =>
          x.itemType === 0
            ? x.endAmount.gt(x.startAmount)
              ? x.endAmount
              : x.startAmount
            : toBN(0)
        )
        .reduce((a, b) => a.add(b), toBN(0))
    );

  return {
    order,
    value,
    orderComponents,
    orderHash,
    startTime,
    endTime,
    signature: convertSignatureToEIP2098(flatSig),
  };
};

export const snakizeKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [Object.keys(DATA_MAPPING_SNAKIZE).indexOf(key) != -1
          ? DATA_MAPPING_SNAKIZE[key]
          : snakeCase(key)]: snakizeKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const camelizeKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [Object.keys(DATA_MAPPING_CAMELIZE).indexOf(key) != -1
          ? DATA_MAPPING_CAMELIZE[key]
          : camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const toBigNumberHex = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toBigNumberHex(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key]:
          typeof obj[key] == "number" || obj[key]._isBigNumber
            ? NORMAL_STRING_MAPPING.indexOf(key) == -1
              ? toBN(obj[key])._hex
              : obj[key].toString()
            : toBigNumberHex(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const toNumber = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toNumber(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key]: TO_NUMBER_MAPPING[key]
          ? Number(obj[key] / TO_NUMBER_MAPPING[key])
          : toNumber(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const stringHexToNumber = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => stringHexToNumber(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key]: STRING_HEX_TO_NUMBER[key]
          ? obj[key].length >= 2 && obj[key][1] === "x"
            ? parseInt(obj[key], 16) / STRING_HEX_TO_NUMBER[key]
            : Number(obj[key]) / STRING_HEX_TO_NUMBER[key]
          : stringHexToNumber(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const toNumberWithItemType = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toNumberWithItemType(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key]:
          TO_NUMBER_MAPPING_WITH_ITEM_TYPE[key] && Number(obj.itemType) === 2
            ? TO_NUMBER_MAPPING_WITH_ITEM_TYPE[key]
            : toNumberWithItemType(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const stringToBigNumber = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => stringToBigNumber(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key]: MAPPING_STRING_TO_BIG_NUMBER.includes(key)
          ? toBN(Number(obj[key]))._hex
          : stringToBigNumber(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const transformDataRequestToSellNFT = (obj: any): any => {
  return JSON.parse(JSON.stringify(toNumber(toBigNumberHex(snakizeKeys(obj)))));
};

export const transformDataRequestToBuyNFT = (obj: any): any => {
  return JSON.parse(
    JSON.stringify(
      toNumberWithItemType(
        stringToBigNumber(toNumber(toBigNumberHex(camelizeKeys(obj))))
      )
    )
  );
};

export const parseGwei = (str: string) => {
  return utils.parseUnits(str, "gwei");
};

export const handleAddToCart = (
  web3Context: IWeb3Context,
  orderHash: string,
  quantity: number = 1,
  price: string
) => {
  const currCart = web3Context.state.web3.cart;
  const newCart = [...currCart, { orderHash, quantity, price }];
  console.log("🚀 ~ file: index.ts:546 ~ newCart:", newCart);
  web3Context.dispatch({
    type: WEB3_ACTION_TYPES.CHANGE,
    payload: {
      provider: web3Context.state.web3.provider,
      myAddress: web3Context.state.web3.myAddress,
      cart: newCart,
    },
  });
};

export const handleRemoveFromCart = (
  web3Context: IWeb3Context,
  orderHash: string,
  quantity: number = 1
) => {
  const currCart = web3Context.state.web3.cart;
  const newCart: any = currCart.filter((item) => item.orderHash !== orderHash);

  web3Context.dispatch({
    type: WEB3_ACTION_TYPES.CHANGE,
    payload: {
      provider: web3Context.state.web3.provider,
      myAddress: web3Context.state.web3.myAddress,
      cart: newCart,
    },
  });
};

export const toFulfillmentComponents = (
  arr: number[][]
): FulfillmentComponent[] =>
  arr.map(([orderIndex, itemIndex]) => ({ orderIndex, itemIndex }));

export const showingPrice = (
  price: string,
  currency?: string,
  isOnlyShowEth = false
): string => {
  const eth = price.slice(0, -18);
  const gwei = price.slice(-18, -9);
  const ethShowingPrice = eth ? `${Number(eth)} ${currency || "ETH"}` : "";
  const gweiShowingPrice = gwei ? `${Number(gwei)} GWEI` : "";
  if (isOnlyShowEth) {
    return (
      (Number(eth) + Number(gwei) / 1000000000).toString() + " " + currency ||
      "ETH"
    );
  }
  return ethShowingPrice + gweiShowingPrice;
};
