import { View, Text } from "react-native";

export const toastConfig = {
  SuccessNotif: ({ text1, props }) => (
    <View className="flex-row  rounded-lg w-3/4 py-3 h=1/5 bg-lime-600 px-3 space-x-2">
      <View className="">
        <Text className="text-xl py-1.5  px-2 bg-white rounded-full">👋🏻</Text>
      </View>

      <View className="items-start justify-center flex-1">
        <Text className="text-sm text-white font-bold">{props.header}</Text>
        <Text
          className={` text-white font-black ${
            text1.length > 20 ? "text-xs" : "text-lg"
          }`}
        >
          {text1}!
        </Text>
      </View>
    </View>
  ),
  InfoNotif: ({ text1, props }) => (
    <View className="flex-row  rounded-lg w-3/4 py-3 h=1/5 bg-blue-500 px-3 space-x-2">
      <View className="">
        <Text className="text-xl py-1.5  px-2 bg-white rounded-full">👋🏻</Text>
      </View>

      <View className="items-start justify-center flex-1">
        <Text className="text-sm text-white font-bold">{props.header}</Text>
        <Text
          className={` text-white font-black ${
            text1.length > 20 ? "text-xs" : "text-lg"
          }`}
        >
          {text1}!
        </Text>
      </View>
    </View>
  ),
  ErrorNotif: ({ text1 }) => (
    <View className="flex-row  rounded-lg w-3/4 py-3 h=1/5 bg-red-500 px-3 space-x-2">
      <View className="">
        <Text className="text-xl py-1.5  px-2 bg-white rounded-full">❌</Text>
      </View>

      <View className="items-start justify-center">
        <Text className="text-sm text-red-200 font-bold">Error:</Text>
        <Text
          className={` text-white font-black ${
            text1.length > 20 ? "text-xs" : "text-lg"
          }`}
        >
          {text1}!
        </Text>
      </View>
    </View>
  ),
  WarningNotif: ({ text1 }) => (
    <View className="flex-row  rounded-lg w-3/4 py-3 h=1/5 bg-orange-400 px-3 space-x-2 items-center">
      <View className="">
        <Text className="text-xl py-1.5  px-2 bg-white rounded-full">⚠️</Text>
      </View>
      <View className="items-start justify-center pr-12">
        <Text className="text-sm text-orange-100 font-bold">Warning:</Text>
        <Text
          className={` text-white font-black ${
            text1.length > 20 ? "text-xs" : "text-lg"
          }`}
        >
          {text1}!
        </Text>
      </View>
    </View>
  ),
};
