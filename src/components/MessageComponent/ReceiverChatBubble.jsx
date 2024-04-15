import { View, Text, Image } from "react-native";
import React from "react";

import { useSelector } from "react-redux";

import PLACEHOLDER from "../../constant/profile";

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
            ? { uri: PLACEHOLDER.trader }
            : { uri: PLACEHOLDER.farmer }
        }
      />
      <Text className="text-lg/loose text-zinc-100 font-bold">{message}</Text>
      <Text className="text-xs text-gray-100 font-bold mt-2">{timeAgo}</Text>
    </View>
  );
}

export default ReceiverChatBubble;
