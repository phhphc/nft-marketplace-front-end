import { createContext, useReducer, Dispatch } from "react";
import web3Reducer from "@Reducer/web3Reducer";
import { useEffect } from "react";
import { Contract, ethers, Wallet } from "ethers";

export enum WEB3_ACTION_TYPES {
  CHANGE = "CHANGE",
}

export interface IWeb3 {
  provider: any;
  myAddress: string;
  myWallet: Wallet | Contract | null;
  chainId: number;
  cart: {};
}

export interface IWeb3Action {
  type: WEB3_ACTION_TYPES;
  payload: Partial<IWeb3>;
}

export interface IState {
  web3: IWeb3;
}

const initialState: IState = {
  web3: { provider: null, myAddress: "", cart: {}, myWallet: null, chainId: 0 },
};

const AppContext = createContext<{
  state: IState;
  dispatch: Dispatch<IWeb3Action>;
}>({
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
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "{}");

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
    localStorage.setItem("shoppingCart", JSON.stringify(state.web3.cart));
  }, [state.web3.cart]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
