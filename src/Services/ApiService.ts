import axios from "axios";

export const getNFTCollectionListService = async (): Promise<any> => {
  return axios
    .get("/nfts")
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {});
};
