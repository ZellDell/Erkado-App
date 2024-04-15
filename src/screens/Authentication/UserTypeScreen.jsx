import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

import COLORS from "../../constant/colors";
import { TouchableHighlight } from "react-native-gesture-handler";

function UserTypeScreen() {
  const navigation = useNavigation();
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <SafeAreaView className="flex flex-1 mt-5">
          {/* Header Title - "Are you a Farmer?" */}
          <View className="flex-row ">
            <Text
              className="text-3xl px-8 font-bold"
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
            <TouchableHighlight
              activeOpacity={1}
              underlayColor="#dfe0e2"
              onPress={() =>
                navigation.navigate("Credentials", { userType: "Farmer" })
              }
              className="bg-gray-100 px-5 rounded-xl"
            >
              <>
                <Text
                  className="font-semibold text-xl self-center absolute pt-4"
                  style={{ color: COLORS.primary }}
                >
                  Farmer
                </Text>
                <Image
                  source={require("../../../assets/illustration/Farmer.png")}
                  resizeMode="contain"
                  style={{
                    width: deviceWidth * 0.65,
                    height: deviceWidth * 0.65,
                  }}
                />
              </>
            </TouchableHighlight>
          </View>
          <Text className="text-lg text-gray-700 font-bold text-center py-5">
            OR
          </Text>
          <View className="flex-row justify-center space-x-1 relative  px-6">
            <TouchableHighlight
              activeOpacity={1}
              underlayColor="#dfe0e2"
              onPress={() =>
                navigation.navigate("Credentials", { userType: "Trader" })
              }
              className="bg-gray-100 px-5 rounded-xl"
            >
              <>
                <Text
                  className="font-semibold text-xl self-center absolute pt-4"
                  style={{ color: COLORS.primary }}
                >
                  Trader
                </Text>
                <Image
                  source={require("../../../assets/illustration/Trader.png")}
                  resizeMode="contain"
                  style={{
                    width: deviceWidth * 0.65,
                    height: deviceWidth * 0.65,
                  }}
                />
              </>
            </TouchableHighlight>
          </View>
        </SafeAreaView>

        {/* Return to Login */}
        <View className="flex-row justify-center space-x-1 mt-8">
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
