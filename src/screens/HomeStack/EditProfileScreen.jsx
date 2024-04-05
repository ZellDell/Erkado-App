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
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import COLORS from "../../constant/colors";
import ProgressBar from "react-native-animated-progress";
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
  isFarmer = useSelector((state) => state.ui.isFarmer);
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

  const [ProgressBarValue, setProgressBarValue] = useState(0);

  const [page, setPage] = useState(1);
  const totalNumberOfPages = 3;
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

    if (
      page === 2 &&
      !userInformation.address &&
      !userInformation.lat &&
      !userInformation.long
    ) {
      Toast.show({
        type: "WarningNotif",
        text1: "Please provide your address",
        visibilityTime: 4000,
        swipeable: true,
      });
      return;
    }
    setPage(page + 1);
  };

  useEffect(() => {
    const setProgress = () => {
      if (page === 1) setProgressBarValue(33);
      else if (page === 2) setProgressBarValue(66);
      else if (page === 3) setProgressBarValue(100);
    };
    setProgress();
  }, [page]);

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
      setIsGettingLocation(false);
    } catch (err) {
      console.log(err);
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

  const handleSelectedCrop = async (selectedCrop) => {
    const existingCrop = crops.find(
      (crop) => crop.selectedCrop.CropID === selectedCrop.CropID
    );
    if (!existingCrop) {
      if (isFarmer) {
        setCrops([...crops, { selectedCrop, quantity: 1 }]);
      } else {
        setSelectedCrop(selectedCrop);
        handlePriceModal();
      }
      // Create a new array with the selected crop appended

      // Update the state with the new array of crops
    }

    bottomSheetRef.current?.close();
  };

  const updatePrice = (crop, price) => {
    setSelectedCrop(crop);
    setCurrentPrice(price);
    handlePriceModal();
  };

  const setPrice = (cropPrice, mode) => {
    if (mode === "updatePrice") {
      const updatedCrops = crops.map((crop) =>
        crop.selectedCrop.CropID === selectedCrop.CropID
          ? { ...crop, price: cropPrice }
          : crop
      );
      setCrops(updatedCrops);
      handlePriceModal();
      setCurrentPrice(null);
      return;
    }

    handlePriceModal();
    setCrops([...crops, { selectedCrop, price: cropPrice }]);
    setSelectedCrop(null);
  };

  const removeCrop = (cropToRemove) => {
    const updatedCrops = crops.filter(
      (crop) => crop.selectedCrop.CropID !== cropToRemove.CropID
    );
    setCrops(updatedCrops);
  };

  const handleQuantity = (cropID, value) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue <= 2000) {
      changeQuantity(cropID, value);
    } else {
      changeQuantity(cropID, 0);
    }
  };

  const changeQuantity = (cropID, value) => {
    setCrops((prevCrops) => {
      return prevCrops.map((crop) => {
        if (crop.selectedCrop.CropID === cropID) {
          return {
            ...crop,
            quantity: value != "" || value != 0 ? value : "",
          };
        }
        return crop;
      });
    });
  };

  const incrementQuantity = (cropID) => {
    setCrops((prevCrops) => {
      return prevCrops.map((crop) => {
        if (crop.selectedCrop.CropID === cropID) {
          const newQuantity = crop.quantity + 1;
          return {
            ...crop,
            quantity: newQuantity <= 2000 ? newQuantity : crop.quantity,
          };
        }
        return crop;
      });
    });
  };

  const decrementQuantity = (cropID) => {
    setCrops((prevCrops) => {
      return prevCrops.map((crop) => {
        if (crop.selectedCrop.CropID === cropID) {
          const newQuantity = crop.quantity - 1;
          return {
            ...crop,
            quantity: newQuantity >= 0 ? newQuantity : crop.quantity,
          };
        }
        return crop;
      });
    });
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
    if (crops.length === 0) {
      Toast.show({
        type: "WarningNotif",
        text1: "Please Add your Crops",
        visibilityTime: 5000,
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
      })
    );
    setIsLoading(false);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-gray-100 pt-5 flex-1 p-5 items-center">
        <View className="flex-2  mt-5">
          <Text
            className="text-3xl p-4 font-bold"
            style={{ color: COLORS.primary }}
          >
            Edit Profile
          </Text>
        </View>
        <View className="flex-2 w-3/5">
          <ProgressBar
            progress={ProgressBarValue}
            height={7}
            backgroundColor="#60BB46"
            className="self-center"
            trackColor="#ebeaeb"
          />
        </View>
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
              handleQuantity={handleQuantity}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              updatePrice={updatePrice}
              handlePriceModal={handlePriceModal}
              priceModal={priceModal}
              setPrice={setPrice}
              currentPrice={currentPrice}
              isLoading={isLoading}
            />
          )}
        </View>
        {/* Preve - Next - Submit */}
        <View className="flex-2 flex-row space-x-4 w-11/12 ">
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
