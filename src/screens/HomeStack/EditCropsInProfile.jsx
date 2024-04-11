import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  BackHandler,
  Animated,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import COLORS from "../../constant/colors";
import SetupProfileImage from "../../components/ProfileComponents/SetupProfileImage";
import * as ImagePicker from "expo-image-picker";
import SetupAddress from "../../components/ProfileComponents/SetupAddress";
import * as Location from "expo-location";
import SetupCrops from "../../components/ProfileComponents/SetupCrops";
import AddCropBottomSheet from "../../components/ProfileComponents/AddCropBottomSheet";
import Toast from "react-native-toast-message";
import {
  imgUpload,
  setUserInfo,
  updateUserInfoCrops,
} from "../../features/user-actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

function EditCropsInProfile() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const textInputRef = useRef(null);
  const isFarmer = useSelector((state) => state.ui.isFarmer);

  const [isLoading, setIsLoading] = useState(false);

  const { crops } = useSelector((state) => state.crop.crops);
  const { quality } = useSelector((state) => state.crop.quality);
  const [myCrops, setMyCrops] = useState([]);
  const [oldCrops, setOldCrops] = useState([]);

  const [selectedCrop, setSelectedCrop] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [currentAttributes, setCurrentAttributes] = useState(null);

  const [priceModal, setPriceModal] = useState(false);
  const [reConfirmModal, setReConfirmModal] = useState(false);
  const [isDiscarded, setIsDiscarded] = useState(false);

  const handlePriceModal = () => {
    setPriceModal(!priceModal);
  };

  useEffect(() => {
    if (route.params?.purchasingDetails) {
      const updatedCrops = [...myCrops];

      route.params?.purchasingDetails.forEach((cropWithPrice) => {
        const CROP = crops.find((crop) => crop.CropID == cropWithPrice.CropID);

        if (CROP) {
          updatedCrops.push({
            selectedCrop: CROP,
            QualityTypeID: cropWithPrice.QualityTypeID,
            CropType: cropWithPrice.CropType,
            Price: cropWithPrice.PricePerUnit,
          });
        }
      });
      setOldCrops(updatedCrops);
      setMyCrops(updatedCrops);
    }
  }, [route.params?.purchasingDetails]);

  useEffect(() => {
    if (isDiscarded) {
      navigation.goBack();
    }
  }, [isDiscarded]);

  useEffect(() => {
    const backAction = () => {
      if (checkCropChanges()) {
        setReConfirmModal(true);
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the event listener when the component unmounts
  }, [oldCrops, myCrops]);

  const checkCropChanges = () => {
    if (JSON.stringify(oldCrops) !== JSON.stringify(myCrops)) {
      return true;
    }
    return false;
  };

  const bottomSheetRef = useRef(null);
  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const handlecloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSelectedCrop = async (selected) => {
    setSelectedCrop(selected);
    handlePriceModal();
    bottomSheetRef.current?.close();
  };

  const updateCrop = (crop, quality, type, price) => {
    setSelectedCrop(crop);
    setCurrentAttributes({ quality, type });
    setCurrentPrice(price);
    handlePriceModal();
  };

  const clearCurrents = () => {
    setSelectedCrop(null);
    setCurrentAttributes(null);
    setCurrentPrice(null);
  };
  const setCrop = (quality, type, cropPrice, mode) => {
    console.log(
      quality + " " + type + " " + cropPrice + " " + selectedCrop.CropID
    );
    const existingCrop = myCrops.find(
      (crop) =>
        crop.selectedCrop.CropID == selectedCrop.CropID &&
        crop.QualityTypeID == quality &&
        crop.CropType == type &&
        crop.Price == cropPrice
    );

    if (mode === "update") {
      if (existingCrop) {
        console.log("There is duplicate -  before: ", myCrops);

        const updatedCrops = myCrops.filter(
          (crop) =>
            crop.selectedCrop.CropID != selectedCrop.CropID ||
            crop.QualityTypeID != currentAttributes.quality ||
            crop.CropType != currentAttributes.type ||
            crop.Price != currentPrice
        );

        setMyCrops(updatedCrops);
        console.log("Duplicate after ", updatedCrops);
        handlePriceModal();
        setSelectedCrop(null);
        return;
      } else {
        const updatedCrops = myCrops.map((crop) => {
          return crop.selectedCrop.CropID == selectedCrop.CropID &&
            crop.QualityTypeID == currentAttributes.quality &&
            crop.CropType == currentAttributes.type &&
            crop.Price == currentPrice
            ? {
                ...crop,
                QualityTypeID: quality,
                CropType: type,
                Price: cropPrice,
              }
            : crop;
        });
        console.log("no duplicates : ", updatedCrops);
        setMyCrops(updatedCrops);
        handlePriceModal();
        setSelectedCrop(null);
        return;
      }
    }

    console.log("Existing crop : ", existingCrop);
    if (!existingCrop) {
      setMyCrops([
        ...myCrops,
        {
          selectedCrop,
          QualityTypeID: quality,
          CropType: type,
          Price: cropPrice,
        },
      ]);
    }

    handlePriceModal();
    clearCurrents();
  };

  const removeCrop = async (cropToRemove) => {
    console.log(myCrops);

    const updatedCrops = await myCrops.filter(
      (crop) =>
        crop.QualityTypeID != cropToRemove.QualityTypeID ||
        crop.CropType != cropToRemove.CropType ||
        crop.Price != cropToRemove.Price ||
        crop.selectedCrop.CropID != cropToRemove.selectedCrop.CropID
    );

    setMyCrops(updatedCrops);
    clearCurrents();
  };

  const handleSetProfile = async () => {
    setIsLoading(true);

    const response = await dispatch(
      updateUserInfoCrops({
        myCrops,
      })
    );
    if (response.success) {
      navigation.goBack();
    } else {
      Toast.show({
        type: "ErrorNotif",
        props: { header: "Error" },
        text1: "An error occured while updating your profile",
        visibilityTime: 3000,
        swipeable: true,
      });
    }
    setIsLoading(false);
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShow = () => {
      setKeyboardVisible(true);
    };

    const keyboardDidHide = () => {
      setKeyboardVisible(false); // After animation completion, set visibility to false
    };

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      keyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-gray-100 pt-5 flex-1 py-5 px-3 items-center">
        <View className="flex-2 mt-5">
          <Text
            className="text-3xl p-4 font-bold"
            style={{ color: COLORS.primary }}
          >
            Edit Profile
          </Text>
        </View>
        <View className="flex-2 w-3/5"></View>
        {/* STEPS */}
        <View className="flex-1 w-11/12  mt-10">
          <SetupCrops
            handleOpenBottomSheet={handleOpenBottomSheet}
            crops={myCrops}
            removeCrop={removeCrop}
            handlePriceModal={handlePriceModal}
            priceModal={priceModal}
            currentPrice={currentPrice}
            isLoading={isLoading}
            selectedCrop={selectedCrop}
            updateCrop={updateCrop}
            setCrop={setCrop}
            currentAttributes={currentAttributes}
            clearCurrents={clearCurrents}
            reConfirmModal={reConfirmModal}
            setIsDiscarded={setIsDiscarded}
            setReConfirmModal={setReConfirmModal}
          />
        </View>
        {/* Preve - Next - Submit */}

        {!isKeyboardVisible && (
          <View className="flex-2 flex-row space-x-4 w-11/12">
            <TouchableOpacity
              className="flex-1 py-4 rounded-xl "
              style={{ backgroundColor: COLORS.primary }}
              onPress={handleSetProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  className="self-center"
                />
              ) : (
                <Text className="font-bold text-white text-xl text-center">
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <AddCropBottomSheet
          bottomSheetRef={bottomSheetRef}
          handlecloseBottomSheet={handlecloseBottomSheet}
          handleSelectedCrop={handleSelectedCrop}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default EditCropsInProfile;
