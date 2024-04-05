import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/base";

function SplashScreen() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-[#15A313] ">
      <View className="flex flex-1 items-center justify-evenly">
        <View className="flex items-center justify-center">
          {/* ERKADO LOGO */}
          <Image
            source={require("../../../assets/Erkado-logo-white.png")}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
            className="justify-self-start"
          />
          {/* ERKADO TEXT */}
          <Image
            source={require("../../../assets/Erkado Text.png")}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>
        <Text className="font-medium text-2xl text-white">
          Sales Made, Fair Trade.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <View className="flex-row flex-2 p-5 justify-center items-center">
          <Text className="font-light text-white text-lg">
            Press to continue
          </Text>
          <Icon
            name="chevron-forward"
            type="ionicon"
            size={32}
            color="#ebebeb"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SplashScreen;
