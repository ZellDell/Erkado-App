import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Modal from "react-native-modal";

import COLORS from "../../constant/colors";

import { useSelector } from "react-redux";

function SelectCropToOfferModal({
  selectCropToOfferModal,
  handleSelectCropToOffer,
  initialSelection,
  TraderDetails,
  setSelectedCropsToOffer,
  PrevSelectedCrops,
}) {
  const [InfoDetails, setInfoDetails] = useState(TraderDetails);

  useEffect(() => {
    console.log(InfoDetails.purchasingDetails);
  }, [InfoDetails]);

  const { crops } = useSelector((state) => state.crop.crops);
  const { quality } = useSelector((state) => state.crop.quality);

  const height = Dimensions.get("window").height;

  const [selectedCrops, setSelectedCrops] = useState(
    InfoDetails.purchasingDetails.map((traderCrop) => {
      const associatedCrop = crops.find(
        (crop) => crop.CropID === traderCrop.CropID
      );

      const selectedCrop = {
        selectedCrop: associatedCrop,
        QualityTypeID: traderCrop.QualityTypeID,
        CropType: traderCrop.CropType,
        PricePerUnit: traderCrop.PricePerUnit,
        Quantity: 1,
      };

      return selectedCrop;
    })
  );

  useEffect(() => {
    setPrevCrops;
  }, [PrevSelectedCrops]);

  const setPrevCrops = () => {
    if (PrevSelectedCrops) {
      setSelectedCrops(PrevSelectedCrops);
    }
  };

  // Function to toggle the selection state of a crop
  const toggleCropSelection = (crop, quality, type, price) => {
    setInvalid(false);
    setSelectedCrops((prevSelectedCrops) => {
      if (
        prevSelectedCrops.some(
          (prevCrop) =>
            prevCrop.selectedCrop.CropID === crop.CropID &&
            prevCrop.QualityTypeID === quality &&
            prevCrop.CropType === type &&
            prevCrop.PricePerUnit === price
        )
      ) {
        // Crop is already selected, so remove it from the list
        return prevSelectedCrops.filter(
          (selectedCrop) =>
            selectedCrop.selectedCrop.CropID !== crop.CropID ||
            selectedCrop.QualityTypeID !== quality ||
            selectedCrop.CropType !== type ||
            selectedCrop.PricePerUnit !== price
        );
      } else {
        // Crop is not selected, so add it to the list
        return [
          ...prevSelectedCrops,
          {
            selectedCrop: crop,
            QualityTypeID: quality,
            CropType: type,
            PricePerUnit: price,
            Quantity: 1,
          },
        ];
      }
    });
  };

  // Function to determine if a crop is selected
  const isCropSelected = (crop, quality, type, price) => {
    return selectedCrops.some(
      (selectedCrop) =>
        selectedCrop.selectedCrop.CropID === crop.CropID &&
        selectedCrop.QualityTypeID === quality &&
        selectedCrop.CropType === type &&
        selectedCrop.PricePerUnit === price
    );
  };

  const [invalid, setInvalid] = useState(false);

  handleSubmitSelection = () => {
    if (selectedCrops.length === 0) {
      setInvalid(true);
      return;
    }
    setSelectedCropsToOffer(selectedCrops);
    handleSelectCropToOffer(false);
  };

  return (
    <View>
      {selectCropToOfferModal ? (
        <Modal
          isVisible={selectCropToOfferModal}
          animationIn="fadeIn"
          animationInTiming={200}
          onBackdropPress={
            initialSelection
              ? () => {}
              : () => {
                  handleSelectCropToOffer();
                  setPrevCrops();
                }
          }
        >
          <View className="flex  bg-zinc-100 rounded-md py-5  space-y-5 justify-center">
            <View className="px-7">
              <Text className="text-2xl font-bold self-center mt-2">
                Select Crop to Offer
              </Text>
              <Text className="text-xs font-bold self-center text-gray-500 ">
                Press to select or deselect a crop
              </Text>
              {invalid && (
                <Text className="text-red-500 font-bold text-base self-center mt-5">
                  Please select at least 1 crop
                </Text>
              )}
            </View>

            <View
              className=" bg-zinc-100 px-4 pt-4 space-x-5 "
              style={{ height: height * 0.35 }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <View
                  className="w-full"
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {InfoDetails.purchasingDetails.map((traderCrop) => {
                    const associatedCrop = crops.find(
                      (crop) => crop.CropID === traderCrop.CropID
                    );
                    const qualityType = quality.find(
                      (quali) => quali.QualityTypeID == traderCrop.QualityTypeID
                    );

                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          toggleCropSelection(
                            associatedCrop,
                            traderCrop.QualityTypeID,
                            traderCrop.CropType,
                            traderCrop.PricePerUnit
                          )
                        }
                        key={
                          "-" +
                          traderCrop.PricePerUnit +
                          "-" +
                          associatedCrop.CropID +
                          "-" +
                          traderCrop.QualityTypeID +
                          "-" +
                          traderCrop.CropType
                        }
                        className="flex rounded-lg  bg-white items-center justify-center border-2 border-gray-300 mt-2 ml-2"
                        style={[
                          isCropSelected(
                            associatedCrop,
                            traderCrop.QualityTypeID,
                            traderCrop.CropType,
                            traderCrop.PricePerUnit
                          )
                            ? styles.selected
                            : null,
                        ]}
                      >
                        <View className="flex space-x-2 py-2 px-4 items-center justify-center ">
                          <Image
                            source={{ uri: associatedCrop.Uri }}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                            className="m-1 self-center"
                          />
                          <View>
                            <Text className="text-gray-800 font-bold text-xs self-center">
                              {associatedCrop.CropName}
                            </Text>
                            <Text className="text-gray-500 font-bold text-[10px] self-center">
                              {traderCrop.CropType &&
                              traderCrop.CropType.length > 8
                                ? traderCrop.CropType.substring(0, 9) + "..."
                                : traderCrop.CropType}
                            </Text>
                            <Text className="text-gray-500 font-bold text-[10px] self-center">
                              {qualityType.QualityType &&
                              qualityType.QualityType.length > 8
                                ? qualityType.QualityType.substring(0, 9) +
                                  "..."
                                : qualityType.QualityType}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            <View className="flex rounded-md py-5  px-7 space-y-5 justify-center">
              <TouchableOpacity
                style={{ backgroundColor: COLORS.primary }}
                className="p-3 rounded-md"
                onPress={handleSubmitSelection}
              >
                <Text className="self-center font-bold text-md  text-white">
                  Select
                </Text>
              </TouchableOpacity>
              {initialSelection && (
                <TouchableOpacity
                  className="p-3 rounded-md bg-gray-600"
                  onPress={() => handleSelectCropToOffer(true)}
                >
                  <Text className="self-center font-bold text-md  text-white">
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      ) : (
        <View></View>
      )}
    </View>
  );
}

export default SelectCropToOfferModal;
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",

    shadowOpacity: 0.38,
    shadowRadius: 16.0,

    elevation: 14,
  },
  selected: {
    borderColor: COLORS.primary,
  },
});
