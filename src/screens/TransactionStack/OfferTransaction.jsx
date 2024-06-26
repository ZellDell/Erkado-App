import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Icon } from "@rneui/base";
import COLORS from "../../constant/colors";

import { useDispatch, useSelector } from "react-redux";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

import SelectCropToOfferModal from "../../components/TransactionComponents/SelectCropToOfferModal";
import SetQuantityModal from "../../components/TransactionComponents/setQuantityModal";
import { sendTransactionOffer } from "../../features/transaction-actions";
import Toast from "react-native-toast-message";
import PLACEHOLDER from "../../constant/profile";
function OfferTransaction() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const userID = useSelector((state) => state.user.userInfo.userId);
  const userType = useSelector((state) => state.user.userInfo.userType);

  const deviceHeight = Dimensions.get("window").height;

  const [InfoDetails, setInfoDetails] = useState(route.params?.InfoDetails);
  const { crops } = useSelector((state) => state.crop.crops);
  const { quality } = useSelector((state) => state.crop.quality);

  const [selectedCrops, setSelectedCrops] = useState([]);

  const [selectCropToOfferModal, setSelectCropToOffer] = useState(true);
  const [initialSelection, setInitialSelection] = useState(true);

  let Total = 0;

  handleSelectCropToOffer = (isDecline) => {
    if (initialSelection) {
      if (isDecline) {
        navigation.goBack();
        return;
      }
      setInitialSelection(false);
      setSelectCropToOffer(!selectCropToOfferModal);
    }
    setSelectCropToOffer(!selectCropToOfferModal);
  };

  useFocusEffect(
    React.useCallback(() => {
      setInitialSelection(true);
    }, [])
  );

  useEffect(() => {
    if (selectedCrops) {
      console.log("Selected Crops: ", selectedCrops);
    }
  }, [selectedCrops]);

  const [selectedCropQuantity, setSelectedCropQuantity] = useState(null);
  const [quantityModal, setQuantityModal] = useState(false);

  const handleQuantityModal = () => {
    setQuantityModal(!quantityModal);
  };

  const setQuantityOfACrop = (crop, quantity) => {
    setSelectedCrops((prevSelectedCrops) => {
      const updatedCrops = prevSelectedCrops.map((selectedCrop) => {
        if (
          selectedCrop.selectedCrop.CropID === crop.selectedCrop.CropID &&
          selectedCrop.QualityTypeID === crop.QualityTypeID &&
          selectedCrop.CropType === crop.CropType &&
          selectedCrop.PricePerUnit === crop.PricePerUnit
        ) {
          return {
            ...selectedCrop,
            Quantity: quantity,
          };
        }
        return selectedCrop;
      });

      return updatedCrops;
    });

    handleQuantityModal();
    setSelectedCropQuantity(null);
  };
  const [isLoading, setIsLoading] = useState(false);

  handleSendOffer = async () => {
    setIsLoading(true);

    const result = await dispatch(
      sendTransactionOffer({
        crops: selectedCrops,
        TraderUserID: InfoDetails.UserID,
      })
    );

    if (result.error) {
      Toast.show({
        type: result.type,
        props: { header: "Error" },
        text1: result.message,
      });
      return;
    }

    if (result.success) {
      navigation.navigate("Transaction");
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <SelectCropToOfferModal
        initialSelection={initialSelection}
        selectCropToOfferModal={selectCropToOfferModal}
        handleSelectCropToOffer={handleSelectCropToOffer}
        TraderDetails={InfoDetails}
        setSelectedCropsToOffer={setSelectedCrops}
      />

      {selectedCropQuantity && (
        <SetQuantityModal
          quantityModal={quantityModal}
          handleQuantityModal={handleQuantityModal}
          setQuantityOfACrop={setQuantityOfACrop}
          selectedCropQuantity={selectedCropQuantity}
          PrevSelectedCrops={selectedCrops}
        />
      )}
      <View
        className="flex-2 bg-white pb-5 pt-12 space-x-5 items-center z-10
            "
        style={[styles.shadow]}
      >
        <Text className="self-center text-gray-800 font-bold text-base">
          Transaction Offer
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-10 left-3 p-2 bg-white z-20 rounded-full"
          style={styles.shadow}
        >
          <Icon type="ionicon" name="arrow-back" size={25} color="#374151" />
        </TouchableOpacity>

        <View className="flex-2 space-x-2 w-full mr-3 items-center">
          <Image
            source={
              InfoDetails?.ProfileImg
                ? { uri: InfoDetails?.ProfileImg }
                : userType == "Farmer"
                ? { uri: PLACEHOLDER.trader }
                : { uri: PLACEHOLDER.farmer }
            }
            style={{ width: 60, height: 60 }}
            resizeMode="cover"
            className="m-2 rounded-full"
          />
          <Text className="font-bold text-xl text-gray-700 text-gray-">
            {InfoDetails.Fullname}
          </Text>
          {userType == "Farmer" && (
            <Text className="font-semibold text-sm text-gray-500 text-gray-">
              {InfoDetails.TraderType}
            </Text>
          )}
        </View>
      </View>
      {/* chat bubbles */}
      <View className="flex-1 bg-zinc-100 pb-1 space-x-5 z-0">
        <ScrollView className=" rounded-l " nestedScrollEnabled={true}>
          {/* Reselect */}
          <View className="flex-row justify-end py-5 px-5">
            <TouchableOpacity
              className="px-3 py-2 rounded-md space-x-2 flex-row items-center justify-center"
              onPress={() => handleSelectCropToOffer()}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Icon
                name="color-wand"
                type="ionicon"
                color="#ffffff"
                size={20}
              />
              <Text className="text-white font-bold text-sm">Reselect</Text>
            </TouchableOpacity>
          </View>
          {/* Selected Crops */}

          {selectedCrops &&
            selectedCrops.map((traderCrop) => {
              const associatedCrop = crops.find(
                (crop) => crop.CropID === traderCrop.selectedCrop.CropID
              );
              const qualityType = quality.find(
                (quali) => quali.QualityTypeID == traderCrop.QualityTypeID
              );

              Total += traderCrop.Quantity * traderCrop.PricePerUnit;

              return (
                <View
                  key={
                    associatedCrop.CropID +
                    "-" +
                    traderCrop.QualityTypeID +
                    "-" +
                    traderCrop.CropType +
                    "-" +
                    traderCrop.PricePerUnit
                  }
                  className="flex-row justify-between py-6 px-5 bg-white items-center mt-2"
                >
                  <View className="flex-row space-x-2 items-center flex-1">
                    <Image
                      source={{ uri: associatedCrop.Uri }}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                      className="m-1"
                    />
                    <View>
                      <Text className="text-gray-800 font-bold text-lg">
                        {associatedCrop.CropName}
                      </Text>
                      <Text className="text-gray-500 font-medium text-xs">
                        {traderCrop.CropType && traderCrop.CropType.length > 8
                          ? traderCrop.CropType.substring(0, 8) + "..."
                          : traderCrop.CropType}{" "}
                        |{" "}
                        {qualityType.QualityType &&
                        qualityType.QualityType.length > 8
                          ? qualityType.QualityType.substring(0, 8) + "..."
                          : qualityType.QualityType}
                      </Text>
                      <Text className="text-gray-800 font-semibold text-xs ">
                        Per Kilo : ₱ {traderCrop.PricePerUnit.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View className=" space-x-3 items-end">
                    <TouchableOpacity
                      className="py-1.5 px-1.5 rounded-md  flex-row space-x-2 justify-center items-center"
                      onPress={() => {
                        setSelectedCropQuantity(traderCrop);
                        handleQuantityModal();
                      }}
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      <Icon
                        name="pencil"
                        type="ionicon"
                        color="#ffffff"
                        size={15}
                      />
                      <Text className="text-white font-bold text-xs">Edit</Text>
                    </TouchableOpacity>
                    <Text className="text-gray-800 text-xs font-bold mt-1">
                      Quantity: {traderCrop.Quantity}
                    </Text>
                    <Text className="text-green-600 text-sm font-bold mt-1">
                      Total: ₱{" "}
                      {(traderCrop.Quantity * traderCrop.PricePerUnit).toFixed(
                        2
                      )}
                    </Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
      {/* Send Message */}
      <View className="flex-row flex-2 p-5 bg-white px-10 space-x-4 justify-center items-center">
        <View className="flex-1 space-y-8">
          <View>
            <View className="flex-row justify-between">
              <Text className="text-gray-800 font-bold text-lg">
                Total Amount:
              </Text>
              <Text className="text-gray-800 font-bold text-lg">
                ₱ {Total.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-800 font-bold text-lg">Date</Text>
              <Text className="text-gray-800 font-bold text-lg">
                {new Date().getMonth() + 1}/{new Date().getDate()}/
                {new Date().getFullYear()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSendOffer}
            className="p-3 rounded-xl "
            style={{ backgroundColor: COLORS.primary }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                className="self-center"
              />
            ) : (
              <Text className="text-white font-bold text-base self-center">
                Send Offer
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",

    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});
export default OfferTransaction;
