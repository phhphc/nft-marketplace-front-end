import { createContext, useReducer, Dispatch } from "react";
import web3Reducer from "@Reducer/web3Reducer";
import { useEffect } from "react";
import { ethers } from "ethers";

export enum WEB3_ACTION_TYPES {
  CHANGE = "CHANGE",
}

export interface IWeb3 {
  provider: any;
  myAddress: string;
}

export interface IWeb3Action {
  type: WEB3_ACTION_TYPES;
  payload: IWeb3;
}

export interface IState {
  web3: IWeb3;
}

const initialState: IState = {
  web3: { provider: null, myAddress: "" },
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
    const fetchData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      dispatch({
        type: WEB3_ACTION_TYPES.CHANGE,
        payload: { provider, myAddress: await signer.getAddress() },
      });
    };
    if (window.ethereum._state.isUnlocked) {
      fetchData();
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
