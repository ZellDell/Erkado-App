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
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Icon } from "@rneui/themed";

import Toast from "react-native-toast-message";

import { useSelector, useDispatch } from "react-redux";
import COLORS from "../../constant/colors";
import TextInputField from "../../components/General/TextInputField";
import { sendRegister } from "../../features/auth-actions";

function CredentialsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const [userCredentials, setUserCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: route.params?.userType,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name, value) => {
    setUserCredentials({
      ...userCredentials,
      [name]: value,
    });
  };

  const register = async () => {
    if (
      !userCredentials.username ||
      !userCredentials.email ||
      !userCredentials.password ||
      !userCredentials.confirmPassword
    ) {
      await Toast.show({
        type: "WarningNotif",
        text1: "Please Fill All Fields",
        visibilityTime: 4000,
        swipeable: true,
      });
      return;
    }

    if (userCredentials.password !== userCredentials.confirmPassword) {
      await Toast.show({
        type: "WarningNotif",
        text1: "Passwords Do Not Match",
        visibilityTime: 4000,
        swipeable: true,
      });
      return;
    }
    setIsLoading(true);
    const result = await dispatch(
      sendRegister(
        userCredentials.username,
        userCredentials.email,
        userCredentials.password,
        userCredentials.userType
      )
    );

    if (result?.error) {
      await Toast.show({
        type: result.type,
        text1: result.message,
        visibilityTime: 4000,
        swipeable: true,
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    Toast.show({
      type: "SuccessNotif",
      props: { header: "Registered" },
      text1: "You've successfully created your account",
      visibilityTime: 4000,
      swipeable: true,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className="flex-1 bg-white px-10 py-12 relative"
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
      >
        <TouchableOpacity
          className=" p-1 absolute top-8 left-4"
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="ionicon" color="#60BB46" size={25} />
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SafeAreaView>
            <Text
              className="text-4xl font-bold mt-10"
              style={{ color: COLORS.primary }}
            >
              Setting Credentials
            </Text>
            <Text className="text-2xl font-medium text-gray-800">
              Let's start your Erkado journey
            </Text>
            <Text className="text-2xl font-medium mb-4 text-gray-800">
              with this!
            </Text>
            <View className="form space-y-9 ">
              <TextInputField
                placeholder="Username"
                onChangeText={(text) => handleChange("username", text)}
                value={userCredentials.username}
                iconName="person"
              />
              <TextInputField
                placeholder="Email"
                onChangeText={(text) => handleChange("email", text)}
                value={userCredentials.email}
                iconName="mail"
              />

              <TextInputField
                placeholder="Password"
                onChangeText={(text) => handleChange("password", text)}
                value={userCredentials.password}
                iconName="lock-closed"
                isPassword={true}
              />

              <TextInputField
                placeholder="Confirm Password"
                onChangeText={(text) => handleChange("confirmPassword", text)}
                value={userCredentials.confirmPassword}
                iconName="lock-closed"
                isPassword={true}
              />

              <TouchableOpacity
                className="py-3 rounded-xl mb-3 mt-6"
                style={{ backgroundColor: COLORS.primary }}
                activeOpacity={0.6}
                onPress={register}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                    className="self-center"
                  />
                ) : (
                  <Text className="text-white font-bold text-center text-lg">
                    Register
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center space-x-1 ">
                <Text className="text-gray-500 font-semibold">
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text
                    className="font-semibold text-500"
                    style={{ color: COLORS.primary }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default CredentialsScreen;
