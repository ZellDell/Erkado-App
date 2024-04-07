import Toast from "react-native-toast-message";
import { uiActions } from "./ui-slice";
import { authActions } from "./auth-slice";
import { userActions } from "./user-slice";
import client from "../api/client";
import authSlice from "./auth-slice";

export const queryTrader = (inputText, queryType) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.get(`/traders/search`, {
        params: { inputText, queryType },
      });

      return response;
    };

    try {
      const response = await sendRequest();

      return { success: true, data: response.data };
    } catch (err) {
      console.log(err?.response?.data.message);
    }
  };
};
