import {
  createContext,
  useReducer,
  Dispatch,
  useRef,
  useState,
  use,
} from "react";
import web3Reducer from "@Reducer/web3Reducer";
import { useEffect } from "react";
import { Contract, ethers, Wallet } from "ethers";
import { INFTCollectionItem } from "@Interfaces/index";
import { SUPPORTED_NETWORK } from "@Constants/index";
import { Toast } from "primereact/toast";

export enum WEB3_ACTION_TYPES {
  CHANGE = "CHANGE",
  ADD_BUNDLE = "ADD_BUNDLE",
  REMOVE_BUNDLE = "REMOVE_BUNDLE",
  SET_BUNDLE = "SET_BUNDLE",
  ADD_LOADING = "ADD_LOADING",
  REMOVE_LOADING = "REMOVE_LOADING",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
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
  listItemsSellBundle: INFTCollectionItem[];
  loading: boolean;
  toast: any;
  authToken: string;
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
    listItemsSellBundle: [],
    loading: false,
    toast: {
      current: null,
    },
    authToken: "",
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
  const toast = useRef(null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const authToken = localStorage.getItem("authToken") || "";

    const fetchData = async () => {
      if (await !window.ethereum?._metamask?.isUnlocked()) {
        dispatch({ type: WEB3_ACTION_TYPES.LOGOUT });
      }

      dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: {
          toast,
          cart,
          authToken,
          chainId: Number(window.ethereum.networkVersion),
        },
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();

      dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: {
          provider,
          myAddress: await signer.getAddress(),
          myWallet: signer,
        },
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!!window.ethereum?.networkVersion) {
      dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: {
          chainId: Number(window.ethereum.networkVersion),
        },
      });
    }
  }, [state.web3.provider]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        dispatch({ type: WEB3_ACTION_TYPES.LOGOUT });
        dispatch({
          type: WEB3_ACTION_TYPES.CHANGE,
          payload: {
            cart: [],
            listItemsSellBundle: [],
            loading: false,
          },
        });
        localStorage.setItem("shoppingCart", JSON.stringify([]));
        window.location.reload();
      });

      window.ethereum.on("chainChanged", () => {
        dispatch({
          type: WEB3_ACTION_TYPES.CHANGE,
          payload: {
            cart: [],
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
      <Toast ref={toast} position="top-center" />
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
