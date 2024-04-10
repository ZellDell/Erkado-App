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
import Farmerplaceholder from "../../../assets/profile/Default Farmer.png";
import { useDispatch, useSelector } from "react-redux";
function ReceiverChatBubble({ profileImg, message, timeAgo }) {
  const userType = useSelector((state) => state.user.userInfo.userType);
  const bg = userType == "Trader" ? "#84cc16" : "#fb923c";
  return (
    <View
      className=" rounded-xl rounded-tl-none px-5 py-3 mx-3 my-2 ml-14"
      style={{ alignSelf: "flex-start", backgroundColor: bg }}
    >
      <Image
        className="h-12 w-12 rounded-full absolute top-0 -left-14"
        source={
          profileImg
            ? { uri: profileImg }
            : userType == "Farmer"
            ? Traderplaceholder
            : Farmerplaceholder
        }
      />
      <Text className="text-lg/loose text-zinc-100 font-bold">{message}</Text>
      <Text className="text-xs text-gray-100 font-bold mt-2">{timeAgo}</Text>
    </View>
  );
}

export default ReceiverChatBubble;
