import Toast from "react-native-toast-message";
import { uiActions } from "./ui-slice";
import { authActions } from "./auth-slice";
import { userActions } from "./user-slice";
import client from "../api/client";
import authSlice from "./auth-slice";

export const requestUserInfo = () => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.get(`/userInfo/`);

      return response;
    };
    await dispatch(uiActions.setPreparing(true));
    try {
      const response = await sendRequest();
      console.log("Response : ", response.data);

      await dispatch(uiActions.setAsNewUser(false));

      const [addressText, coordinates] =
        response.data?.userInfo.Address.split("|");

      await dispatch(
        userActions.setUserInfo({
          userInfoId:
            response.data?.UserType != "Farmer"
              ? response.data?.FarmerId
              : response.data?.TraderId,
          userId: response.data?.userInfo.UserID,
          fullname: response.data?.userInfo.Fullname,
          address: addressText,
          coordinates: coordinates,
          userType: response.data?.UserType,
          profileImg: response.data?.userInfo.ProfileImg,
          extraInfo:
            response.data?.UserType != "Farmer"
              ? response.data?.userInfo?.RSBSA
              : response.data?.userInfo?.TraderType,
        })
      );

      return { success: true, Username: response.data?.Username };
    } catch (err) {
      if (err.response?.data?.isNewUser) {
        dispatch(uiActions.setAsNewUser(true));

        return;
      }
      Toast.show({
        type: "ErrorNotif",
        text1: err?.message,
        visibilityTime: 4000,
        swipeable: true,
      });
    } finally {
      dispatch(uiActions.setPreparing(false));
    }
  };
};

export const setUserInfo = ({
  fullname,
  address,
  extraInfo,
  profileImg,
  crops,
}) => {
  return async (dispatch, getState) => {
    const state = getState();
    const sendRequest = async () => {
      // const userID = state.auth.userID;
      const isFarmer = state.ui.isFarmer;

      const response = await client.post(`/userInfo/setInfo`, {
        fullname,
        address,
        extraInfo,
        isFarmer,
        profileImg,
        crops,
      });

      return response;
    };

    try {
      const fetchResult = await sendRequest();
      await dispatch(requestUserInfo());
      Toast.show({
        type: "SuccessNotif",
        props: { header: "Success" },
        text1: "Your Profile has been set!",
        visibilityTime: 5000,
        swipeable: true,
      });

      dispatch(uiActions.setAsNewUser(false));
      console.log(fetchResult);
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const imgUpload = (formdata) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      console.log(formdata);
      const response = await client.post(`/userInfo/upload-image`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    };

    try {
      const fetchResult = await sendRequest();
      console.log("Results : ", fetchResult?.data?.message);

      return fetchResult.data.image;
    } catch (err) {
      // if (err.response?.status === 401) {
      //   Toast.show({
      //     type: "WarningNotif",
      //     text1: err.response?.data?.message,
      //     visibilityTime: 5000,
      //     swipeable: true,
      //   });

      //   return;
      // }
      // if (err.response?.status == 500) {
      //   Toast.show({
      //     type: "ErrorNotif",
      //     text1: err.response.data.message,
      //     visibilityTime: 5000,
      //     swipeable: true,
      //   });

      //   return;
      // }
      console.log("Error ==== ", err);
      // Toast.show({
      //   type: "ErrorNotif",
      //   text1: err?.response,
      //   visibilityTime: 5000,
      //   swipeable: true,
      // });
    }
  };
};
