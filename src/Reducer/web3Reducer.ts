import { WEB3_ACTION_TYPES, IWeb3Action, IWeb3 } from "@Store/index";

const web3Reducer = (state: IWeb3, action: IWeb3Action) => {
  switch (action.type) {
    case WEB3_ACTION_TYPES.CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    case WEB3_ACTION_TYPES.ADD_BUNDLE:
      const newAddBundle = [
        ...state.listItemsSellBundle,
        action.payload,
      ].slice();
      return {
        ...state,
        listItemsSellBundle: newAddBundle,
      };
    case WEB3_ACTION_TYPES.REMOVE_BUNDLE:
      const newRemoveBundle = state.listItemsSellBundle
        .filter((item) => item.identifier !== action.payload)
        .slice();
      return {
        ...state,
        listItemsSellBundle: newRemoveBundle,
      };
    case WEB3_ACTION_TYPES.SET_BUNDLE:
      return {
        ...state,
        listItemsSellBundle: action.payload,
      };
    case WEB3_ACTION_TYPES.ADD_LOADING:
      return {
        ...state,
        loading: true,
      };
    case WEB3_ACTION_TYPES.REMOVE_LOADING:
      return {
        ...state,
        loading: false,
      };
    case WEB3_ACTION_TYPES.LOGIN:
      const authTokenObjLogin = JSON.parse(
        localStorage.getItem("authTokenObj") || "{}"
      );

      authTokenObjLogin[action.payload.myAddress] = action.payload.authToken;
      localStorage.setItem("authTokenObj", JSON.stringify(authTokenObjLogin));
      return {
        ...state,
        authToken: action.payload.authToken,
      };
    case WEB3_ACTION_TYPES.LOGOUT:
      const authTokenObjLogout = JSON.parse(
        localStorage.getItem("authTokenObj") || "{}"
      );

      delete authTokenObjLogout[action.payload.myAddress];
      localStorage.setItem("authTokenObj", JSON.stringify(authTokenObjLogout));
      return {
        ...state,
        authToken: "",
      };

    default:
      return state;
  }
};

export default web3Reducer;
