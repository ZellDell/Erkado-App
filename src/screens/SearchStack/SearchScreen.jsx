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
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Icon } from "@rneui/base";
import COLORS from "../../constant/colors";
import { useDispatch, useSelector } from "react-redux";

function SearchScreen() {
  const [query, setQuery] = useState("");
  const { crops } = useSelector((state) => state.crop.crops);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1">
        <SafeAreaView className="bg-gray-100 pt-5 flex-1 mt-12 px-8 space-y-6">
          <Text className="font-bold text-2xl text-gray-700">
            Want to know who will buy your crops?
          </Text>

          <View className="flex-row bg-gray-200 p-2 rounded-md space-x-2">
            <Icon
              name="search"
              type="ionicon"
              color={COLORS.primary}
              size={30}
            />
            <TextInput
              className="flex-1 font-semibold text-lg text-gray-700"
              placeholder="e.g. Crop, Trader Name.."
              value={query}
              onChangeText={(text) => setQuery(text)}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Icon
                  name="close-circle"
                  type="ionicon"
                  color="#000"
                  size={30}
                />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row w-full">
            <ScrollView
              className="flex-row space-x-2"
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                marginRight: -200,
              }}
            >
              {crops.map((crop) => (
                <TouchableHighlight
                  key={crop.CropID}
                  className="flex-row bg-white items-center rounded-full px-3 border-2 border-gray-300 mt-2"
                  onPress={() => {}}
                >
                  <>
                    <Image
                      source={{ uri: crop.Uri }}
                      style={{ width: 20, height: 29 }}
                      resizeMode="contain"
                      className="m-1"
                    />
                    <Text className="font-[500] text-xs">{crop.CropName}</Text>
                  </>
                </TouchableHighlight>
              ))}
            </ScrollView>
          </View>

          <View className="border-t-2 border-gray-300 ">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row justify-center mt-4 py-3 rounded-3xl space-x-2 items-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Icon name="map" type="ionicon" color="#FFFFFF" size={20} />
              <Text className="text-white font-semibold text-md">
                Proximity Search
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default SearchScreen;
