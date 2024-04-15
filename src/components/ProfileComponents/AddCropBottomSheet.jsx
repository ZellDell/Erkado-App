import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import COLORS from "../../constant/colors";

import { Icon } from "@rneui/base";

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
        <Text className="text-xl font-bold" style={{ color: COLORS.primary }}>
          {isFarmer
            ? "What crops do you have?"
            : "What crops do you want to purchase?"}
        </Text>
        <BottomSheetScrollView contentContainerStyle={{ marginRight: 5 }}>
          {crops.map((crop) => (
            <TouchableOpacity
              key={crop.CropID}
              className="flex-row bg-slate-100 mt-6 py-3 px-5 items-center space-x-5 rounded-lg"
              onPress={() => props.handleSelectedCrop(crop)}
            >
              <Image
                source={{ uri: crop.Uri }}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
              <View>
                <Text className="font-bold text-base">{crop.CropName}</Text>
                <Text className="text-xs text-gray-500 pr-5">
                  {crop.Description.length > 34
                    ? crop.Description.slice(0, 35) + "..."
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
