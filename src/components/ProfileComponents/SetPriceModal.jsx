import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-native-modal";
import { Icon } from "@rneui/base";
import TextInputField from "../General/TextInputField";
import COLORS from "../../constant/colors";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";

import PLACEHOLDER from "../../constant/profile";

function SetPriceModal({
  priceModal,
  handlePriceModal,
  setCrop,
  currentPrice,
  selectedCrop,
  clearCurrents,
  currentAttributes,
}) {
  const { quality } = useSelector((state) => state.crop.quality);

  const [CropQuality, setQuality] = useState(null);
  const [CropType, setType] = useState(null);

  const [selectedQuality, setQualityData] = useState([]);

  const [cropPrice, setCropPrice] = useState(1);

  const [invalid, setInvalid] = useState(false);
  const setInputRef = useRef(null);

  useEffect(() => {
    setInputRef.current?.focus();
  }, [priceModal]);

  useEffect(() => {
    if (selectedCrop) {
      getAttributes();
    }
  }, [selectedCrop]);

  getAttributes = () => {
    const qualidata = quality.map((q) => ({
      label: q.QualityType,
      value: q.QualityTypeID,
    }));

    setQualityData(qualidata);
  };

  useEffect(() => {
    if (currentAttributes && currentPrice) {
      setQuality(currentAttributes.quality);
      setType(currentAttributes.type);
      setCropPrice(currentPrice ? currentPrice : 1);
    }
  }, [currentPrice, currentAttributes]);

  handleSetTrader = async () => {
    if (
      cropPrice < 1 ||
      cropPrice === null ||
      CropType === null ||
      CropQuality === null
    ) {
      setInvalid(true);
      return setCropPrice(1);
    }

    setInvalid(false);

    if (
      currentAttributes &&
      currentPrice &&
      CropQuality == currentAttributes.quality &&
      CropType == currentAttributes.type &&
      cropPrice == currentPrice
    ) {
      handlePriceModal();
      clearFields();
      clearCurrents();
      return;
    }

    console.log("Adding these", CropQuality, CropType, cropPrice);
    console.log(currentPrice, currentAttributes);

    await setCrop(
      CropQuality,
      CropType,
      cropPrice,
      currentPrice && currentAttributes ? "update" : null
    );
    clearFields();
    return;
  };

  clearFields = () => {
    setQuality(null);
    setType(null);
    setCropPrice(1);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {priceModal ? (
        <Modal
          isVisible={priceModal}
          animationIn="fadeIn"
          animationInTiming={200}
          onBackdropPress={() => {
            handlePriceModal();
            clearFields();
            clearCurrents();
          }}
          onBackButtonPress={() => {
            handlePriceModal();
            clearFields();
            clearCurrents();
          }}
        >
          <View className="flex  bg-zinc-100 rounded-md py-5 px-7 space-y-5 justify-center">
            <Image
              source={
                selectedCrop.Uri
                  ? { uri: selectedCrop.Uri }
                  : { uri: PLACEHOLDER.farmer }
              }
              style={{ height: 70, width: 70 }}
              className="self-center"
            />
            <Text className="font-bold text-xl self-center">
              {selectedCrop.CropName}
            </Text>
            <TextInputField
              textInputRef={setInputRef}
              placeholder={"Type of " + selectedCrop.CropName}
              iconName="leaf"
              onChangeText={(type) => setType(type)}
              value={CropType}
            />

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.textItem}
              search={false}
              data={selectedQuality}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Quality"
              searchPlaceholder="Search..."
              value={CropQuality}
              onChange={(item) => {
                {
                  setQuality(item.value);
                }
              }}
            />
            <TextInputField
              placeholder="Price Per Unit"
              iconName="pricetag"
              onChangeText={(price) => setCropPrice(price)}
              value={cropPrice.toString()}
              keyboardType="numeric"
              className="flex-1"
            />
            {invalid && (
              <Text className="text-red-500 font-medium text-xs">
                Invalid Input, please provide the correct value
              </Text>
            )}

            <View className="flex rounded-md py-5  space-y-5 justify-center">
              <TouchableOpacity
                style={{ backgroundColor: COLORS.primary }}
                className="p-3 rounded-md"
                onPress={handleSetTrader}
              >
                <Text className="self-center font-bold text-md  text-white">
                  Set Price
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        <View></View>
      )}
    </TouchableWithoutFeedback>
  );
}

export default SetPriceModal;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 12,
    borderWidth: 2,
    borderColor: "#ededed",

    shadowColor: "#000",
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#919191",
  },
  placeholderStyle: {
    fontSize: 17,
    fontWeight: "500",
    fontWeight: "500",
    color: "#5e5e5e",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "500",
    fontWeight: "500",
    color: "#5e5e5e",
  },
});
