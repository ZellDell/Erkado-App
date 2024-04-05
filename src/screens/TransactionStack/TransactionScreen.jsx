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
function TransactionScreen() {
  const [query, setQuery] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1">
        <SafeAreaView className="bg-gray-100 pt-5 flex-1 mt-12 px-8 space-y-4">
          <Text className="font-bold text-2xl text-gray-700">
            Transactions (0)
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
              placeholder="e.g. Transaction ID, Trader Name.."
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
            <TouchableHighlight
              activeOpacity={1}
              underlayColor="#27C10E"
              onPress={() => {}}
              className="w-1/2 p-2 rounded-l-xl items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-white font-medium text-sm">Ongoing</Text>
            </TouchableHighlight>
            <TouchableHighlight
              className="w-1/2 p-2 rounded-r-xl items-center justify-center bg-gray-300"
              activeOpacity={1}
              underlayColor="#dedede"
              onPress={() => {}}
            >
              <Text className="text-gray-800 font-medium text-sm">
                Complete
              </Text>
            </TouchableHighlight>
          </View>

          <View>
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600 font-[450]">
                You don't have any transactions!
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default TransactionScreen;
