import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Icon } from "@rneui/base";
import COLORS from "../../constant/colors";

import useQueryTrader from "../../utils/queryTraders";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import PLACEHOLDER from "../../constant/profile";
function SearchScreen() {
  const { crops } = useSelector((state) => state.crop.crops);

  const queryTrader = useQueryTrader("", "trader");
  const navigation = useNavigation();
  const deviceHeight = Dimensions.get("window").height;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1 ">
        <SafeAreaView className="bg-gray-100 pt-5 flex-1 mt-12  space-y-6">
          <Text className="font-bold text-xl px-8 text-gray-700">
            Want to know who will buy your crops?
          </Text>

          <View className="flex-row bg-gray-200 p-2 mx-8 rounded-md space-x-2">
            <Icon
              name="search"
              type="ionicon"
              color={COLORS.primary}
              size={30}
            />
            <TextInput
              className="flex-1 font-semibold text-base text-gray-700"
              placeholder="e.g. Trader Name, Trader type..."
              value={queryTrader.value}
              onChangeText={(text) => queryTrader.onChangeText(text)}
            />
            {queryTrader.value.length > 0 && (
              <TouchableOpacity onPress={() => queryTrader.onChangeText("")}>
                <Icon
                  name="close-circle"
                  type="ionicon"
                  color="#000"
                  size={30}
                />
              </TouchableOpacity>
            )}
          </View>

          {queryTrader?.results?.length > 0 && queryTrader.value ? (
            <View>
              {queryTrader.results.map((result, index) => {
                return (
                  <TouchableHighlight
                    key={index}
                    activeOpacity={1}
                    underlayColor="#ededed"
                    onPress={() => {
                      navigation.navigate("TraderView", {
                        TraderDetails: result,
                      });
                    }}
                    className="px-7"
                  >
                    <View className="flex-row border-b-2 border-gray-200 py-4  items-center justify-between">
                      <View className="flex-row space-x-3">
                        <Image
                          source={
                            result.profileImg
                              ? { uri: result.profileImg }
                              : { uri: PLACEHOLDER.trader }
                          }
                          style={{ width: 40, height: 40 }}
                          resizeMode="cover"
                          className=" rounded-full"
                        />
                        <View className="items-start">
                          <Text className="text-xl font-bold text-gray-800">
                            {result?.Fullname.length > 24
                              ? result?.Fullname.slice(0, 24) + "..."
                              : result?.Fullname}
                          </Text>
                          <Text className="pl-1 text-xs font-medium text-gray-400">
                            {result?.TraderType}
                          </Text>
                        </View>
                      </View>

                      <Icon
                        name="caret-forward"
                        type="ionicon"
                        color="#000"
                        size={30}
                      />
                    </View>
                  </TouchableHighlight>
                );
              })}
            </View>
          ) : (
            <View className="space-y-5 ">
              <View className="flex-row w-full">
                <ScrollView
                  className="flex-row space-x-2 pl-8"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    marginRight: -100,
                  }}
                >
                  {crops.map((crop) => (
                    <TouchableHighlight
                      activeOpacity={1}
                      key={crop.CropID}
                      underlayColor="#ededed"
                      className="flex-row bg-white items-center rounded-full px-3 border-2 border-gray-300 mt-2"
                      onPress={() => {
                        navigation.navigate("CropSearchTrader", {
                          cropID: crop.CropID,
                          cropQuery: crop.CropName,
                          cropUri: crop.Uri,
                          cropDescription: crop.Description,
                        });
                      }}
                    >
                      <>
                        <Image
                          source={{ uri: crop.Uri }}
                          style={{ width: 20, height: 29 }}
                          resizeMode="contain"
                          className="m-1"
                        />
                        <Text className="font-[500] text-xs">
                          {crop.CropName}
                        </Text>
                      </>
                    </TouchableHighlight>
                  ))}
                </ScrollView>
              </View>

              <View className="border-t-2 border-gray-300 mx-8">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row justify-center mt-4 py-3 rounded-3xl space-x-2 items-center"
                  style={{ backgroundColor: COLORS.primary }}
                  onPress={() => {
                    navigation.navigate("ProximitySearch");
                  }}
                >
                  <Icon name="map" type="ionicon" color="#FFFFFF" size={20} />
                  <Text className="text-white font-semibold text-md">
                    Proximity Search
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default SearchScreen;
