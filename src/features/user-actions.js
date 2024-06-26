import Toast from "react-native-toast-message";
import { uiActions } from "./ui-slice";

import { userActions } from "./user-slice";
import client from "../api/client";

export const requestUserInfo = () => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.get(`/userInfo/`);

      return response;
    };
    await dispatch(uiActions.setPreparing(true));
    try {
      const response = await sendRequest();
      console.log("Response === : ", response.data);

      await dispatch(uiActions.setAsNewUser(false));

      const [addressText, coordinates] =
        response.data?.userInfo.Address.split("|");

      await dispatch(
        userActions.setUserInfo({
          userInfoId:
            response.data?.UserType == "Farmer"
              ? response.data?.FarmerID
              : response.data?.TraderID,
          userId: response.data?.userInfo.UserID,
          fullname: response.data?.userInfo.Fullname,
          address: addressText,
          coordinates: coordinates,
          userType: response.data.UserType,
          profileImg: response.data?.userInfo.ProfileImg,
          purchasingDetails: response.data?.purchasingDetails,
          extraInfo:
            response.data?.UserType == "Farmer"
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
  isFarmer,
}) => {
  return async (dispatch) => {
    const sendRequest = async () => {
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
        visibilityTime: 3000,
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
      console.log("Error ==== ", err);
    }
  };
};

export const updateUserInfoCrops = ({ myCrops }) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.post(`/userInfo/update`, {
        myCrops,
      });

      return response;
    };

    try {
      const response = await sendRequest();
      await dispatch(requestUserInfo());
      Toast.show({
        type: "SuccessNotif",
        props: { header: "Success" },
        text1: "Your Crop has been updated!",
        visibilityTime: 3000,
        swipeable: true,
      });

      return { success: true };
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const updateUserInfo = ({ editedUserInfo }) => {
  return async (dispatch) => {
    console.log("1231290350-9", editedUserInfo);
    const sendRequest = async () => {
      const response = await client.post(`/userInfo/updateInfo`, {
        editedUserInfo,
      });

      return response;
    };

    try {
      const response = await sendRequest();
      await dispatch(requestUserInfo());
      Toast.show({
        type: "SuccessNotif",
        props: { header: "Success" },
        text1: "Your Account details has been updated!",
        visibilityTime: 3000,
        swipeable: true,
      });

      return { success: true };
    } catch (err) {
      return { error: true, err: err };
    }
  };
};
