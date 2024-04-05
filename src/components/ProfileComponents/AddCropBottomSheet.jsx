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
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import COLORS from "../../constant/colors";
import ProgressBar from "react-native-animated-progress";
import placeholder from "../../../assets/profile/Default Farmer.png";
import { Icon } from "@rneui/base";
import TextInputField from "../../components/General/TextInputField";
import ImageModal from "./ImageModal";
import Mapbox from "@rnmapbox/maps";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";

function AddCropBottomSheet(props) {
  const snapPoints = useMemo(() => ["60%"], []);
  const { crops } = useSelector((state) => state.crop.crops);
  isFarmer = useSelector((state) => state.ui.isFarmer);

  return (
    <BottomSheet
      index={-1}
      ref={props.bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      style={{
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <View className="flex-1 p-5 relative">
        <Text
          className="text-2xl font-bold self-center"
          style={{ color: COLORS.primary }}
        >
          {isFarmer
            ? "What crops do you have?"
            : "What crops do you want to purchase?"}
        </Text>
        <BottomSheetScrollView contentContainerStyle={{ marginRight: 15 }}>
          {crops.map((crop) => (
            <TouchableOpacity
              key={crop.CropID}
              className="flex-row bg-slate-100 mt-6 py-3 px-4 items-center space-x-5 rounded-lg"
              onPress={() => props.handleSelectedCrop(crop)}
            >
              <Image
                source={{ uri: crop.Uri }}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
              <View>
                <Text className="font-bold text-lg">{crop.CropName}</Text>
                <Text className="text-md text-gray-500">
                  {crop.Description.length > 34
                    ? crop.Description.slice(0, 39) + "..."
                    : crop.Description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
        <TouchableOpacity
          onPress={props.handlecloseBottomSheet}
          className="self-center"
        >
          <Icon name="chevron-down" type="ionicon" color="gray" size={35} />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

export default AddCropBottomSheet;
