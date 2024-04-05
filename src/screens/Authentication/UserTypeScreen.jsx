import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

import COLORS from "../../constant/colors";

function UserTypeScreen() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-white py-6">
      <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 1 }}>
        <SafeAreaView className="flex flex-1 mt-5">
          {/* Header Title - "Are you a Farmer?" */}
          <View className="flex-row ">
            <Text
              className="text-4xl px-8 font-bold"
              style={{ color: COLORS.primary }}
            >
              Are you a farmer?
            </Text>
          </View>
          <View className="flex-row mb-10">
            <Text className="text-sm px-8 font-bold text-gray-700">
              Select a role
            </Text>
          </View>

          {/* Role Options - Farmer or Trader */}
          <View className="flex-row justify-center space-x-1 relative  px-6">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Credentials", { userType: "Farmer" })
              }
              className="bg-gray-100 rounded-xl"
            >
              <Text
                className="font-semibold text-xl self-center absolute pt-4"
                style={{ color: COLORS.primary }}
              >
                Farmer
              </Text>
              <Image
                source={require("../../../assets/illustration/Farmer.png")}
                resizeMode="contain"
                style={{ width: 275, height: 275 }}
              />
            </TouchableOpacity>
          </View>
          <Text className="text-xl text-gray-700 font-bold text-center py-5">
            OR
          </Text>
          <View className="flex-row justify-center space-x-1 relative  px-6">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Credentials", { userType: "Trader" })
              }
              className="bg-gray-100 rounded-xl"
            >
              <Text
                className="font-semibold text-xl self-center absolute pt-4"
                style={{ color: COLORS.primary }}
              >
                Trader
              </Text>
              <Image
                source={require("../../../assets/illustration/Trader.png")}
                resizeMode="contain"
                style={{ width: 275, height: 275 }}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Return to Login */}
        <View className="flex-row justify-center space-x-1 mt-10">
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
      </ScrollView>
    </View>
  );
}

export default UserTypeScreen;
