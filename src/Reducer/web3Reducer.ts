import { WEB3_ACTION_TYPES, IWeb3Action, IWeb3 } from "@Store/index";

const web3Reducer = (state: IWeb3, action: IWeb3Action) => {
  switch (action.type) {
    case WEB3_ACTION_TYPES.CHANGE:
      return {
        ...state,
        ...action.payload,
      };
      break;
    case WEB3_ACTION_TYPES.ADD_BUNDLE:
      const newAddBundle = [
        ...state.listItemsSellBundle,
        action.payload,
      ].slice();
      return {
        ...state,
        listItemsSellBundle: newAddBundle,
      };
      break;
    case WEB3_ACTION_TYPES.REMOVE_BUNDLE:
      const newRemoveBundle = state.listItemsSellBundle
        .filter((item) => item.identifier !== action.payload)
        .slice();
      return {
        ...state,
        listItemsSellBundle: newRemoveBundle,
      };
      break;
    case WEB3_ACTION_TYPES.SET_BUNDLE:
      return {
        ...state,
        listItemsSellBundle: action.payload,
      };
      break;
    default:
      return state;
  }
};

export default web3Reducer;
