import Toast from "react-native-toast-message";
import client, { clearHeader, setHeader } from "../api/client";
import { authActions } from "./auth-slice";
import { uiActions } from "./ui-slice";
import * as SecureStore from "expo-secure-store";
import { userActions } from "./user-slice";

const TOKEN_KEY = "Erkado-User-Token";

export const sendLogin = (username, password) => {
  return async (dispatch) => {
    const requestLogin = async () => {
      const response = await client.post(`/user/login`, {
        username,
        password,
      });

      return response;
    };

    try {
      const result = await requestLogin();

      const accessToken = result.data.token;
      const userID = result.data.userId;
      const userType = result.data.UserType;

      await dispatch(
        userActions.setUserInfo({
          userType: userType,
        })
      );
      if (userType === "Farmer") {
        dispatch(uiActions.setFarmer(true));
      } else {
        dispatch(uiActions.setFarmer(false));
      }

      const TokenAndID = JSON.stringify({ accessToken, userID, userType });

      await SecureStore.setItemAsync(TOKEN_KEY, TokenAndID);

      setHeader(accessToken);

      dispatch(
        authActions.setAuthState({
          token: accessToken,
          authenticated: true,
        })
      );

      if (result.data.UserType === "Farmer") {
        dispatch(uiActions.setFarmer(true));
      } else {
        dispatch(uiActions.setFarmer(false));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        return {
          error: true,
          type: "WarningNotif",
          message: err.response.data.message,
        };
      }
      return { error: true, type: "ErrorNotif", message: err.message };
    }
  };
};

export const sendRegister = (username, email, password, userType) => {
  return async (dispatch) => {
    const requestRegister = async () => {
      const response = await client.post(`/user/register`, {
        username,
        email,
        password,
        userType,
      });

      return response;
    };

    try {
      const response = await requestRegister();

      dispatch(sendLogin(username, password));
    } catch (err) {
      if (err.response?.status === 401) {
        return {
          error: true,
          type: "WarningNotif",
          message: err.response.data.message,
        };
      }
      return { error: true, type: "ErrorNotif", message: err.message };
    }
  };
};

export const Logout = () => {
  return async (dispatch) => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      dispatch(uiActions.setPreparing(false));
      dispatch(uiActions.setAsNewUser(true));
      dispatch(uiActions.setFarmer(true));

      dispatch(
        userActions.setUserInfo({
          userInfoId: null,
          userId: null,
          fullname: null,
          address: null,
          coordinates: null,
          userType: null,
          profileImg: null,
          extraInfo: null,
        })
      );

      dispatch(
        authActions.setAuthState({
          token: null,
          authenticated: false,
          userID: null,
        })
      );
      clearHeader();
      console.log("Logout Sucessfully");
    } catch (err) {
      Toast.show({
        type: "ErrorNotif",
        text1: err.message,
        visibilityTime: 5000,
        swipeable: true,
      });
    }
  };
};

export const sendIsAuth = () => {
  return async (dispatch) => {
    try {
      dispatch(uiActions.setPreparing(true));

      const data = await SecureStore.getItemAsync(TOKEN_KEY);
      const { accessToken, userID, userType } = JSON.parse(data);

      if (userType === "Farmer") {
        dispatch(uiActions.setFarmer(true));
      } else {
        dispatch(uiActions.setFarmer(false));
      }
      if (data != null) {
        dispatch(
          authActions.setAuthState({
            token: accessToken,
            authenticated: true,
          })
        );
        setHeader(accessToken);
      }
    } catch (err) {
      Toast.show({
        type: "ErrorNotif",
        text1: err.message,
        visibilityTime: 5000,
        swipeable: true,
      });
    } finally {
      dispatch(uiActions.setPreparing(false));
    }
  };
};
