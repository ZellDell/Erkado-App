import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
} from "react-native";
import React, { useEffect } from "react";
import { Icon } from "@rneui/base";

import useQueryTrader from "../../utils/queryTraders";

import { useNavigation, useRoute } from "@react-navigation/native";
import PLACEHOLDER from "../../constant/profile";

function CropSearchTrader() {
  const route = useRoute();

  const queryTrader = useQueryTrader("", "crop");
  const navigation = useNavigation();

  useEffect(() => {
    queryTrader.onChangeText(route.params?.cropQuery);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1 bg-gray-50">
        <SafeAreaView className="bg-gray-50 pt-5 flex-1 mt-5 px-8 space-y-3">
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="p-3 rounded-full items-start "
              style={styles.shadow}
            >
              <Icon name="arrow-back" type="ionicon" color="#000" size={25} />
            </TouchableOpacity>
          </View>
          {/* Crop and its Description */}
          <View className=" p-2 rounded-md space-y-4 border-b-2 border-gray-300">
            <View className="flex-row items-end space-x-3">
              <Image
                source={{ uri: route.params?.cropUri }}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
                className="m-1"
              />
              <Text className="text-xl text-gray-800 font-bold">
                {route.params?.cropQuery}
              </Text>
            </View>

            <Text className="text-sm leading-2 text-gray-800 font-semibold text-justify">
              {route.params?.cropDescription}
            </Text>
          </View>

          {queryTrader.results?.length > 0 && queryTrader.value ? (
            <View>
              {queryTrader.results.map((result, index) => {
                const price = result.queryCropDetails[0].PricePerUnit;
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
                  >
                    <View className="flex-row border-b-2 border-gray-200 py-4 items-center justify-between">
                      <View className="flex-row space-x-3">
                        <Image
                          source={
                            result.ProfileImg
                              ? { uri: result.ProfileImg }
                              : { uri: PLACEHOLDER.trader }
                          }
                          style={{ width: 45, height: 45 }}
                          resizeMode="cover"
                          className=" rounded-full"
                        />
                        <View className="items-start">
                          <Text className="text-lg font-bold text-gray-800">
                            {result?.Fullname.length > 24
                              ? result?.Fullname.slice(0, 24) + "..."
                              : result?.Fullname}
                          </Text>
                          <Text className="pl-1 text-sm font-medium text-gray-400">
                            {result?.TraderType}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row space-x-2">
                        <View className="items-center">
                          <Text className="font-semibold text-xs text-gray-500">
                            Per Kilo
                          </Text>
                          <Text className="font-extrabold text-base text-lime-600 ">
                            ₱ {price}
                          </Text>
                        </View>
                        <Icon
                          name="chevron-forward"
                          type="ionicon"
                          color="#84cc16"
                          size={30}
                        />
                      </View>
                    </View>
                  </TouchableHighlight>
                );
              })}
            </View>
          ) : (
            <Text className="text-gray-600 font-[450] text-sm pt-10 self-center">
              No traders are looking to buy this crop.
            </Text>
          )}
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    elevation: 25,
    backgroundColor: "white",
  },
});
export default CropSearchTrader;
