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
  Keyboard,
} from "react-native";

import COLORS from "../../constant/colors";
import ProgressBar from "react-native-animated-progress";
import placeholder from "../../../assets/profile/Default Farmer.png";
import { Icon } from "@rneui/base";
import { useSelector } from "react-redux";
import SetPriceModal from "./SetPriceModal";
import { useEffect, useRef, useState } from "react";
import ReconfirmModal from "./ReconfirmModal";

function SetupCrops(props) {
  const { quality } = useSelector((state) => state.crop.quality);

  useEffect(() => {
    if (props.crops) {
      console.log(props.crops);
    }
  }, [props.crops]);

  return (
    <View>
      <SetPriceModal
        priceModal={props.priceModal}
        handlePriceModal={props.handlePriceModal}
        setCrop={props.setCrop}
        currentPrice={props.currentPrice}
        selectedCrop={props.selectedCrop}
        currentAttributes={props.currentAttributes}
        clearCurrents={props.clearCurrents}
      />

      <ReconfirmModal
        reConfirmModal={props.reConfirmModal}
        setIsDiscarded={props.setIsDiscarded}
        setReConfirmModal={props.setReConfirmModal}
      />

      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold" style={{ color: COLORS.primary }}>
          Setup Crops
        </Text>
        <TouchableOpacity
          className="rounded-lg  p-2 "
          style={{ backgroundColor: COLORS.primary }}
          onPress={props.handleOpenBottomSheet}
          disabled={props.isLoading}
        >
          <Text className="text-white text-lg self-center">Add Crops</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="mt-8">
        {props.crops != null && props.crops.length > 0 ? (
          props.crops.map((crop) => {
            const qualityType = quality.find(
              (quali) => quali.QualityTypeID == crop.QualityTypeID
            );
            return (
              <View
                key={
                  crop.selectedCrop.CropID +
                  "-" +
                  crop.QualityTypeID +
                  "-" +
                  crop.CropType +
                  "-" +
                  crop.Price
                }
                className="flex-row justify-between items-center bg-zinc-50 mb-5 p-5 rounded-md mx-3"
                style={styles.shadow}
              >
                <View className="flex-row space-x-3">
                  <Image
                    source={
                      crop.selectedCrop.Uri
                        ? { uri: crop.selectedCrop.Uri }
                        : placeholder
                    }
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                  />
                  <View>
                    <Text className="font-bold">
                      {crop.selectedCrop.CropName}
                    </Text>
                    <Text className="font-semibold text-gray-500 text-sm">
                      {crop.CropType.length > 11
                        ? crop.CropType.substring(0, 11) + "..."
                        : crop.CropType}
                    </Text>
                    <Text className="font-semibold text-lime-500  text-xs">
                      {qualityType.QualityType.length > 11
                        ? qualityType.QualityType.substring(0, 11) + "..."
                        : qualityType.QualityType}
                    </Text>
                  </View>
                </View>

                <View className="flex items-center space-y-2">
                  <Text className="font-bold text-xs self-center text-lime-600">
                    Price
                  </Text>

                  <Text className="self-center font-bold ">
                    ₱ {crop?.Price}
                  </Text>
                </View>

                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => {
                      props.updateCrop(
                        crop.selectedCrop,
                        crop.QualityTypeID,
                        crop.CropType,
                        crop.Price
                      );
                    }}
                  >
                    <Icon
                      name="color-wand"
                      type="ionicon"
                      color="#555555"
                      size={30}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => props.removeCrop(crop)}
                    disabled={props.isLoading}
                  >
                    <Icon name="trash" type="ionicon" color="red" size={30} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text className="self-center font-semibold text-gray-400">
            You don't have any crops to purchase yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#555555",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.27,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default SetupCrops;
