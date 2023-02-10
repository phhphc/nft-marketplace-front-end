import { WEB3_ACTION_TYPES, IWeb3Action, IWeb3 } from "@Store/index";

const web3Reducer = (state: IWeb3, action: IWeb3Action) => {
  switch (action.type) {
    case WEB3_ACTION_TYPES.CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default web3Reducer;
