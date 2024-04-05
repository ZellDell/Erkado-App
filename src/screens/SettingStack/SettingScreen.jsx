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
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Farmerplaceholder from "../../../assets/profile/Default Farmer.png";
import Traderplaceholder from "../../../assets/profile/Default Trader.png";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@rneui/base";
import { Logout } from "../../features/auth-actions";

function SettingScreen() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  isFarmer = useSelector((state) => state.ui.isFarmer);
  return (
    <SafeAreaView className="bg-gray-100  px-7 flex-1 justify-center">
      <View className=" flex-row py-3 space-x-4 border-b-2 border-gray-200 items-end">
        <Image
          source={
            userInfo.profileImg
              ? { uri: userInfo.profileImg }
              : isFarmer
              ? Farmerplaceholder
              : Traderplaceholder
          }
          style={{ width: 90, height: 90 }}
          resizeMode="cover"
          className=" rounded-full"
        />
        <View className="w-3/4 space-y-1">
          <Text className="text-2xl font-bold text-gray-800">
            {userInfo.fullname}
          </Text>
          <Text className="text-md font-semibold text-gray-500">
            {userInfo.address}
          </Text>
        </View>
      </View>

      {/* Menus */}

      <Text className="font-extrabold text-xl text-gray-800 mt-5">General</Text>
      <View className="h-3/5 justify-between mb-10 pl-2">
        <View>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor="#ededed"
            onPress={() => {}}
          >
            <View className="flex-row border-b-2 border-gray-200 py-5 items-center justify-between">
              <Text className="text-xl font-[450] text-gray-800">Account</Text>
              <Icon
                name="caret-forward"
                type="ionicon"
                color="#000"
                size={30}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor="#ededed"
            onPress={() => {}}
          >
            <View className="flex-row border-b-2 border-gray-200 py-5 items-center justify-between">
              <Text className="text-xl font-[450] text-gray-800">Security</Text>
              <Icon
                name="caret-forward"
                type="ionicon"
                color="#000"
                size={30}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor="#ededed"
            onPress={() => {}}
          >
            <View className="flex-row border-b-2 border-gray-200 py-5 items-center justify-between">
              <Text className="text-xl font-[450] text-gray-800">Help</Text>
              <Icon
                name="caret-forward"
                type="ionicon"
                color="#000"
                size={30}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor="#ededed"
            onPress={() => {}}
          >
            <View className="flex-row border-b-2 border-gray-200 py-5 items-center justify-between">
              <Text className="text-xl font-[450] text-gray-800">About</Text>
              <Icon
                name="caret-forward"
                type="ionicon"
                color="#000"
                size={30}
              />
            </View>
          </TouchableHighlight>
        </View>

        <TouchableHighlight
          activeOpacity={1}
          underlayColor="#ededed"
          onPress={() => dispatch(Logout())}
        >
          <View className="flex-row border-t-2 border-gray-200 py-2 items-center justify-between">
            <Text className="text-xl font-medium text-red-500 text-red">
              Logout
            </Text>
            <Icon
              name="caret-forward"
              type="ionicon"
              color="#CC3333"
              size={30}
            />
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

export default SettingScreen;
