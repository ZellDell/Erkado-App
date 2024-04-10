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
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import COLORS from "../../constant/colors";
import Traderplaceholder from "../../../assets/profile/Default Trader.png";
import { useDispatch, useSelector } from "react-redux";
function SenderChatBubble({ profileImg, message, timeAgo }) {
  const userType = useSelector((state) => state.user.userInfo.userType);
  const bg = userType == "Trader" ? "#fb923c" : "#84cc16";
  return (
    <View
      className="bg-lime-500 rounded-xl rounded-tr-none px-5 py-3 mx-3 my-2"
      style={{
        alignSelf: "flex-start",
        marginLeft: "auto",
        backgroundColor: bg,
      }}
    >
      <Text className="text-lg/loose text-white font-bold">{message}</Text>
      <Text className="text-xs text-gray-100 font-bold mt-2">{timeAgo}</Text>
    </View>
  );
}

export default SenderChatBubble;
