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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Modal from "react-native-modal";
import { Icon } from "@rneui/base";
import TextInputField from "../General/TextInputField";
import COLORS from "../../constant/colors";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";

import placeholder from "../../../assets/profile/Default Farmer.png";

function SetQuantityModal({
  quantityModal,
  handleQuantityModal,
  setQuantityOfACrop,
  selectedCropQuantity,
}) {
  const [currQuantity, setCurrQuantity] = useState(0);

  const { quality } = useSelector((state) => state.crop.quality);
  const [Quality, setQuality] = useState(
    quality.find(
      (quali) => quali.QualityTypeID == selectedCropQuantity.QualityTypeID
    )
  );

  useEffect(() => {
    if (selectedCropQuantity) {
      console.log(selectedCropQuantity?.Quantity);
      setCurrQuantity(selectedCropQuantity?.Quantity);
    }
  }, [selectedCropQuantity]);

  const [invalid, setInvalid] = useState(false);

  handleSetQuantity = () => {
    if (currQuantity <= 0) {
      setInvalid(true);
      return;
    }

    setQuantityOfACrop(selectedCropQuantity, currQuantity);
    setInvalid(false);
    setCurrQuantity(1);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {quantityModal ? (
        <Modal
          isVisible={quantityModal}
          animationIn="fadeIn"
          animationInTiming={200}
          onBackdropPress={() => {
            handleQuantityModal();

            setCurrQuantity(1);
          }}
          onBackButtonPress={() => {
            handleQuantityModal();

            setCurrQuantity(1);
          }}
        >
          <View className="flex  bg-zinc-100 rounded-md py-5 px-7 space-y-5 justify-center">
            <Image
              source={
                selectedCropQuantity.selectedCrop.Uri
                  ? { uri: selectedCropQuantity.selectedCrop.Uri }
                  : placeholder
              }
              style={{ height: 70, width: 70 }}
              className="self-center"
            />
            <Text className="font-bold text-2xl self-center">
              {selectedCropQuantity.selectedCrop.CropName}
            </Text>
            <Text className="font-semibold text-gray-600 text-md self-center">
              {selectedCropQuantity.CropType} | {Quality.QualityType}
            </Text>
            <TextInputField
              onblur={() => {
                if (currQuantity <= 0) setCurrQuantity(1);
              }}
              placeholder="Quantity"
              iconName="ellipsis-horizontal"
              onChangeText={(quantity) => {
                const digitOnly = quantity.replace(/\D/g, "");
                setCurrQuantity(digitOnly);
              }}
              value={currQuantity.toString()}
              keyboardType="numeric"
              className="flex-1"
            />
            {invalid && (
              <Text className="text-red-500 font-medium text-xs">
                Invalid Input, please enter a valid quantity
              </Text>
            )}

            <View className="flex rounded-md py-5  space-y-5 justify-center">
              <TouchableOpacity
                style={{ backgroundColor: COLORS.primary }}
                className="p-3 rounded-md"
                onPress={handleSetQuantity}
              >
                <Text className="self-center font-bold text-md  text-white">
                  Set Quantity
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

export default SetQuantityModal;
