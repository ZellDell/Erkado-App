import Toast from "react-native-toast-message";
import { uiActions } from "./ui-slice";
import { authActions } from "./auth-slice";
import { userActions } from "./user-slice";
import client from "../api/client";
import authSlice from "./auth-slice";

export const sendTransactionOffer = ({ crops, TraderUserID }) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.post(`/transaction/offer`, {
        crops,
        traderUserID: TraderUserID,
      });

      return response;
    };

    try {
      const response = await sendRequest();
      console.log(response.data);
      Toast.show({
        type: "SuccessNotif",
        props: { header: "Success" },
        text1: "Your Offer has been sent!",
        visibilityTime: 3000,
        swipeable: true,
      });

      return { success: true };
    } catch (err) {
      if (err.response?.status === 401) {
        return {
          error: true,
          type: "WarningNotif",
          message: err.response.data.message,
        };
      }
      console.log(err.response.data ? err.response.data : err);
    }
  };
};

export const fetchTransaction = ({ UserType }) => {
  return async (dispatch) => {
    console.log(UserType);
    const sendRequest = async () => {
      const response = await client.get(`/transaction/`, {
        params: { UserType },
      });

      return response;
    };

    try {
      const response = await sendRequest();
      console.log(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.log(err.response.data ? err.response.data : err);
    }
  };
};

export const confirmTransaction = (TransactionID, isConfirm) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.post(`/transaction/confirm`, {
        TransactionID,
        isConfirm,
      });

      return response;
    };

    try {
      const response = await sendRequest();

      return { success: true, data: response.data };
    } catch (err) {
      console.log(err.response.data ? err.response.data : err);
    }
  };
};

export const completeTransaction = (TransactionID) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.post(`/transaction/complete`, {
        TransactionID,
      });

      return response;
    };

    try {
      const response = await sendRequest();
      Toast.show({
        type: "SuccessNotif",
        props: { header: "Success" },
        text1: "Transaction Completed!",
        visibilityTime: 3000,
        swipeable: true,
      });

      return { success: true, data: response.data };
    } catch (err) {
      console.log(err.response.data ? err.response.data : err);
    }
  };
};
