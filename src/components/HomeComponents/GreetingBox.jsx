import React from "react";
import { Text, Image, View, Dimensions } from "react-native";

import COLORS from "../../constant/colors";

const GreetingBox = ({ illustration, header, content }) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  return (
    <View className="items-center flex-1 ">
      <Image
        source={illustration}
        resizeMode="contain"
        style={{
          width: deviceWidth * 0.9 * 0.9,
          height: deviceHeight * 0.55 * 0.5,
        }}
      />
      <Text className="font-bold text-2xl" style={{ color: COLORS.primary }}>
        {header}
      </Text>
      <Text className="font-medium text-gray-500 px-2 text-md mt-3 text-justify">
        {content}
      </Text>
    </View>
  );
};

export default GreetingBox;
