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
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Modal from "react-native-modal";
import { Icon } from "@rneui/base";
import TextInputField from "../General/TextInputField";
import COLORS from "../../constant/colors";

function SetPriceModal({
  priceModal,
  handlePriceModal,
  setPrice,
  currentPrice,
}) {
  const [cropPrice, setCropPrice] = useState(1);

  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setCropPrice(currentPrice ? currentPrice : 1);
  }, [currentPrice]);

  handleSetPrice = async () => {
    if (cropPrice < 1 || cropPrice === null) {
      setInvalid(true);

      return setCropPrice(1);
    }
    setInvalid(false);
    await setPrice(cropPrice, currentPrice ? "updatePrice" : null);
    return setCropPrice(1);
  };
  return (
    <View>
      {priceModal && (
        <Modal
          isVisible={priceModal}
          animationIn="fadeIn"
          animationInTiming={200}
          onBackdropPress={handlePriceModal}
          onBackButtonPress={handlePriceModal}
        >
          <View className="flex  bg-white rounded-md py-5 px-5 space-y-5 justify-center">
            {invalid && (
              <Text className="text-red-500 font-medium text-xs">
                Invalid Price : Must be greater than 0
              </Text>
            )}
            <TextInputField
              placeholder="Price Per Unit"
              iconName="pricetag"
              onChangeText={(price) => setCropPrice(price)}
              value={cropPrice.toString()}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={{ backgroundColor: COLORS.primary }}
              className="p-3 rounded-md"
              onPress={handleSetPrice}
            >
              <Text className="self-center font-bold text-md  text-white">
                Set Price
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default SetPriceModal;
