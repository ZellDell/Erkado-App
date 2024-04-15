import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableHighlight,
} from "react-native";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@rneui/base";
import { Logout } from "../../features/auth-actions";
import PLACEHOLDER from "../../constant/profile";
import { useNavigation } from "@react-navigation/native";

function SettingScreen() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  isFarmer = useSelector((state) => state.ui.isFarmer);
  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-gray-100 p-7 flex-1 justify-center">
      <View className="flex-row py-3 space-x-4 border-b-2 border-gray-200 items-end">
        <Image
          source={
            userInfo.profileImg
              ? { uri: userInfo.profileImg }
              : isFarmer
              ? { uri: PLACEHOLDER.farmer }
              : { uri: PLACEHOLDER.trader }
          }
          style={{ width: 70, height: 70 }}
          resizeMode="cover"
          className=" rounded-full"
        />
        <View className="w-3/4 space-y-1">
          <Text className="text-xl font-bold text-gray-800">
            {userInfo.fullname}
          </Text>
          <Text className="text-xs pr-2 font-semibold text-gray-500">
            {userInfo.address}
          </Text>
        </View>
      </View>

      {/* Menus */}

      <Text className=" font-extrabold text-lg text-gray-800 my-5">
        General
      </Text>
      <View className=" h-3/5 justify-between mb-10 pl-2">
        <View>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor="#ededed"
            onPress={() => {
              navigation.navigate("AccountSetting");
            }}
          >
            <View className="flex-row border-b-2 border-gray-200 py-3 items-center justify-between">
              <Text className="text-base font-[450] text-gray-800">
                Account
              </Text>
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
            <Text className="text-base font-medium text-red-500 text-red">
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
