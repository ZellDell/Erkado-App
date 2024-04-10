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
import { imgUpload, setUserInfo } from "../../features/user-actions";
import { useDispatch, useSelector } from "react-redux";

function EditProfileScreen() {
  const dispatch = useDispatch();
  const textInputRef = useRef(null);
  const isFarmer = useSelector((state) => state.ui.isFarmer);
  const [userInformation, setUserInformation] = useState({
    fullname: "",
    address: "",
    extraInfo: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [myLocation, setMyLocation] = useState(null);

  const [image, setImage] = useState({
    uri: null,
    type: null,
  });

  const [crops, setCrops] = useState([]);

  const [selectedCrop, setSelectedCrop] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [currentAttributes, setCurrentAttributes] = useState(null);

  const [page, setPage] = useState(1);
  const totalNumberOfPages = isFarmer ? 2 : 3;

  const handleNext = () => {
    if (
      (page === 1 && !userInformation.fullname) ||
      !userInformation.extraInfo
    ) {
      Toast.show({
        type: "WarningNotif",
        text1: "Please provide all the fields",
        visibilityTime: 4000,
        swipeable: true,
      });
      return;
    }

    if (page === 2 && !userInformation.address && !myLocation) {
      Toast.show({
        type: "WarningNotif",
        text1: "Please Provide a real address",
        visibilityTime: 3000,
        swipeable: true,
      });
      return;
    }
    setPage(page + 1);
  };

  const handlePrev = () => {
    setPage(page - 1);
  };
  const [imageModal, setImageModal] = useState(false);
  const handleModal = () => {
    setImageModal(!imageModal);
  };

  const [priceModal, setPriceModal] = useState(false);
  const handlePriceModal = () => {
    setPriceModal(!priceModal);
  };
  const handleKeyPress = (event) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      userInformation.address.length < 2
    ) {
      setUserInformation((prevState) => ({
        ...prevState,
        address: "",
      }));
      setMyLocation(null);
    }
  };

  const handleChange = (name, value) => {
    if (name === "address" && value === "") {
      setIsGettingLocation(false);
    }
    setUserInformation({
      ...userInformation,
      [name]: value,
    });
  };

  const uploadImage = async (mode) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();

        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage({
          img: result.assets[0].uri,
          type: result.assets[0].mimeType,
        });
      }
    } catch (err) {
      alert("Error" + err.message);
      handleModal();
    }
  };

  const saveImage = async ({ img, type }) => {
    try {
      setImage({
        uri: img,
        type: type,
      });

      handleModal();
    } catch (err) {
      throw err;
    }
  };

  const removeImage = async () => {
    try {
      setImage({
        uri: null,
        type: null,
      });
      handleModal();
    } catch (err) {
      handleModal();
      console.log(err?.message);
    }
  };

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const getLocation = async (mode, selectedAddress) => {
    try {
      setIsGettingLocation(true);
      if (mode === "query") {
        setMyLocation({
          longitude: selectedAddress[0],
          latitude: selectedAddress[1],
        });
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");

          return;
        }
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = location?.coords;

        const addressResponse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        setMyLocation({ longitude: longitude, latitude: latitude });

        handleChange("address", addressResponse[0].formattedAddress);

        textInputRef.current?.focus();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsGettingLocation(false);
    }
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
    const existingCrop = crops.find(
      (crop) =>
        crop.selectedCrop.CropID == selectedCrop.CropID &&
        crop.QualityTypeID == quality &&
        crop.CropType == type &&
        crop.Price == cropPrice
    );

    if (mode === "update") {
      if (existingCrop) {
        console.log("There is duplicate -  before: ", crops);

        const updatedCrops = crops.filter(
          (crop) =>
            crop.selectedCrop.CropID != selectedCrop.CropID ||
            crop.QualityTypeID != currentAttributes.quality ||
            crop.CropType != currentAttributes.type ||
            crop.Price != currentPrice
        );

        setCrops(updatedCrops);
        console.log("Duplicate after ", updatedCrops);
        handlePriceModal();
        setSelectedCrop(null);
        return;
      } else {
        const updatedCrops = crops.map((crop) => {
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
        setCrops(updatedCrops);
        handlePriceModal();
        setSelectedCrop(null);
        return;
      }
    }

    console.log("Existing crop : ", existingCrop);
    if (!existingCrop) {
      setCrops([
        ...crops,
        {
          selectedCrop,
          QualityTypeID: quality,
          CropType: type,
          Price: cropPrice,
        },
      ]);
    }

    handlePriceModal();
    setSelectedCrop(null);
    clearCurrents();
  };

  const removeCrop = async (cropToRemove) => {
    console.log(crops);

    const updatedCrops = await crops.filter(
      (crop) =>
        crop.QualityTypeID != cropToRemove.QualityTypeID ||
        crop.CropType != cropToRemove.CropType ||
        crop.Price != cropToRemove.Price ||
        crop.selectedCrop.CropID != cropToRemove.selectedCrop.CropID
    );

    setCrops(updatedCrops);
    clearCurrents();
  };

  useEffect(() => {
    const backAction = () => {
      if (page === 1) {
        // Prevent going back if on the first step
        return true; // Returning true indicates that we have handled the back action
      } else {
        // Allow normal back navigation
        handlePrev();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the event listener when the component unmounts
  }, [page]); // Re-run the effect whenever the page state changes

  const handleSetProfile = async () => {
    if ((isFarmer && !userInformation.address) || !myLocation) {
      Toast.show({
        type: "WarningNotif",
        text1: "Please provide a real address",
        visibilityTime: 3000,
        swipeable: true,
      });
      return;
    }

    setIsLoading(true);

    let profileImg = null;
    if (image.uri != null) {
      formdata = new FormData();
      formdata.append("image", {
        uri: image.uri,
        type: image.type,
        name: new Date() + image.name,
      });
      profileImg = await dispatch(imgUpload(formdata));
    }
    const completeAddress = `${userInformation.address} | ${myLocation.latitude},${myLocation.longitude}`;

    await dispatch(
      setUserInfo({
        fullname: userInformation.fullname,
        address: completeAddress,
        extraInfo: userInformation.extraInfo,
        profileImg,
        crops,
        isFarmer,
      })
    );
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
          {page === 1 && (
            <SetupProfileImage
              handleChangeFullname={(text) => handleChange("fullname", text)}
              fullname={userInformation.fullname}
              handleChangeExtraInfo={(text) => handleChange("extraInfo", text)}
              extraInfo={userInformation.extraInfo}
              uri={image.uri}
              uploadImage={uploadImage}
              removeImage={removeImage}
              handleModal={handleModal}
              imageModal={imageModal}
            />
          )}

          {page === 2 && (
            <SetupAddress
              handleChangeAddress={(text) => handleChange("address", text)}
              address={userInformation.address}
              getLocation={getLocation}
              textInputRef={textInputRef}
              location={myLocation}
              onKeyPress={handleKeyPress}
              isGettingLocation={isGettingLocation}
            />
          )}

          {page === 3 && (
            <SetupCrops
              handleOpenBottomSheet={handleOpenBottomSheet}
              crops={crops}
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
            />
          )}
        </View>
        {/* Preve - Next - Submit */}

        {!isKeyboardVisible && (
          <View className="flex-2 flex-row space-x-4 w-11/12">
            {page > 1 && (
              <TouchableOpacity
                className="flex-1 py-4 rounded-xl  bg-gray-400"
                onPress={handlePrev}
                disabled={isLoading}
              >
                <Text className="font-bold text-white text-xl text-center">
                  Back
                </Text>
              </TouchableOpacity>
            )}

            {page < totalNumberOfPages && (
              <TouchableOpacity
                className="py-4 rounded-xl flex-1"
                style={{ backgroundColor: COLORS.primary }}
                activeOpacity={0.6}
                onPress={handleNext}
              >
                <Text className="text-white text-center font-bold text-xl">
                  Next
                </Text>
              </TouchableOpacity>
            )}

            {page === totalNumberOfPages && (
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
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {page === 3 && (
          <AddCropBottomSheet
            bottomSheetRef={bottomSheetRef}
            handlecloseBottomSheet={handlecloseBottomSheet}
            handleSelectedCrop={handleSelectedCrop}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default EditProfileScreen;
