import { createContext, useReducer, Dispatch } from "react";
import web3Reducer from "@Reducer/web3Reducer";
import { useEffect } from "react";
import { Contract, ethers, Wallet } from "ethers";
import { INFTCollectionItem } from "@Interfaces/index";

export enum WEB3_ACTION_TYPES {
  CHANGE = "CHANGE",
  ADD_BUNDLE = "ADD_BUNDLE",
  REMOVE_BUNDLE = "REMOVE_BUNDLE",
  SET_BUNDLE = "SET_BUNDLE",
  ADD_LOADING = "ADD_LOADING",
  REMOVE_LOADING = "REMOVE_LOADING",
}

export interface ICart {
  orderHash: string;
  price: string;
  quantity: number;
}

export interface IWeb3 {
  provider: any;
  myAddress: string;
  myWallet: Wallet | Contract | null;
  chainId: number;
  cart: ICart[];
  isApprovedForAllNFTs: boolean;
  listItemsSellBundle: INFTCollectionItem[];
  loading: boolean;
}

export interface IWeb3Action {
  type: WEB3_ACTION_TYPES;
  payload?: any;
}

export interface IState {
  web3: IWeb3;
}

const initialState: IState = {
  web3: {
    provider: null,
    myAddress: "",
    cart: [],
    myWallet: null,
    chainId: 0,
    isApprovedForAllNFTs: false,
    listItemsSellBundle: [],
    loading: false,
  },
};

export interface IWeb3Context {
  state: IState;
  dispatch: Dispatch<IWeb3Action>;
}

const AppContext = createContext<IWeb3Context>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = ({ web3 }: IState, action: IWeb3Action) => ({
  web3: web3Reducer(web3, action),
});

export interface IAppProvider {
  children: React.ReactNode;
}

const AppProvider = ({ children }: IAppProvider) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");

    const fetchData = async () => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum
      ) as any;

      const signer = provider.getSigner();
      const { chainId } = await provider.getNetwork();
      dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: {
          provider,
          myAddress: await signer.getAddress(),
          cart,
          myWallet: signer,
          chainId,
        },
      });
    };
    if (window?.ethereum?._state?.isUnlocked) {
      fetchData();
    } else {
      dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: {
          cart,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        dispatch({
          type: WEB3_ACTION_TYPES.CHANGE,
          payload: {
            cart: [],
            isApprovedForAllNFTs: false,
            listItemsSellBundle: [],
            loading: false,
          },
        });
        localStorage.setItem("shoppingCart", JSON.stringify([]));
        window.location.reload();
      });
    }
  });

  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(state.web3.cart));
  }, [state.web3.cart]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
