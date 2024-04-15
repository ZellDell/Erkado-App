import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../constant/colors";
import { Icon } from "@rneui/base";
import TextInputField from "../../components/General/TextInputField";
import Toast from "react-native-toast-message";

import { sendLogin } from "../../features/auth-actions";
import { useDispatch } from "react-redux";

function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name, value) => {
    setUserCredentials({
      ...userCredentials,
      [name]: value,
    });
  };

  const login = async () => {
    if (!userCredentials.username || !userCredentials.password) {
      await Toast.show({
        type: "WarningNotif",
        text1: "Please Fill All Fields",
        visibilityTime: 4000,
        swipeable: true,
      });
      return;
    }
    setIsLoading(true);
    const result = await dispatch(
      sendLogin(userCredentials.username, userCredentials.password)
    );

    if (result?.error) {
      await Toast.show({
        type: result.type,
        text1: result.message,
        visibilityTime: 3000,
        swipeable: true,
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className="flex-1 bg-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <SafeAreaView style={styles.AndroidSafeArea} className="flex">
          <View
            className="flex-row justify-center w-screen relative mt-5"
            style={{ zIndex: 2 }}
          >
            <Image
              source={require("../../../assets/Erkado-logo-white.png")}
              style={{ width: 70, height: 70 }}
              resizeMode="contain"
            />
          </View>
          <View
            className="flex-row justify-center h-1/5  relative top-[-35]"
            style={{ zIndex: 1 }}
          >
            <Image
              source={require("../../../assets/Erkado Text.png")}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>

        {/* FORM FIELD */}
        <View className="flex-1 bg-white px-8 py-10 rounded-t-3xl">
          <Text
            className="font-bold text-3xl mb-5 text-center"
            style={{ color: COLORS.primary }}
          >
            Sign In
          </Text>
          <View className=" form space-y-10">
            <TextInputField
              placeholder="Username"
              onChangeText={(text) => handleChange("username", text)}
              value={userCredentials.username}
              iconName="person"
            />
            <TextInputField
              placeholder="Password"
              onChangeText={(text) => handleChange("password", text)}
              value={userCredentials.password}
              iconName="lock-closed"
              isPassword={true}
            />

            <TouchableOpacity
              className="py-3 rounded-xl mb-3"
              style={{ backgroundColor: COLORS.primary }}
              activeOpacity={0.6}
              onPress={login}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  className="self-center"
                />
              ) : (
                <Text className="text-white font-bold text-center font-xl">
                  Login
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center space-x-1 ">
              <Text className="text-gray-500 font-semibold">
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("UserType")}>
                <Text
                  className="font-semibold text-500"
                  style={{ color: COLORS.primary }}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default LoginScreen;
