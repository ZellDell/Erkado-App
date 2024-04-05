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
function MessageScreen() {
  const [query, setQuery] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1">
        <SafeAreaView className="bg-gray-100 pt-5 flex-1 mt-12 px-8 space-y-4">
          <Text className="font-bold text-2xl text-gray-700">Chat (0)</Text>

          <View className="flex-row bg-gray-200 p-2 rounded-md space-x-2">
            <Icon
              name="search"
              type="ionicon"
              color={COLORS.primary}
              size={30}
            />
            <TextInput
              className="flex-1 font-semibold text-lg text-gray-700"
              placeholder="e.g. Trader Name.."
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

          <View>
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600 font-[450]">
                You don't have any conversations!
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default MessageScreen;
