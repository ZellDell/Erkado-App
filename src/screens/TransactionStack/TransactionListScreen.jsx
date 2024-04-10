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
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Icon } from "@rneui/base";
import COLORS from "../../constant/colors";
import Traderplaceholder from "../../../assets/profile/Default Trader.png";
import Farmerplaceholder from "../../../assets/profile/Default Farmer.png";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  fetchMessagesWithTrader,
} from "../../features/message-actions";
import getTimeAgoUtil from "../../utils/getTimeAgoUtil";
import { useNavigation, useRoute } from "@react-navigation/native";
import socket from "../../api/socket";
import SenderChatBubble from "../../components/MessageComponent/SenderChatBubble";
import ReceiverChatBubble from "../../components/MessageComponent/ReceiverChatBubble";

function TransactionListScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const { transactions, userInfo } = route.params;

  const { crops } = useSelector((state) => state.crop.crops);
  const userType = useSelector((state) => state.user.userInfo.userType);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const useGetTimeAgo = getTimeAgoUtil();
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    filterTransactions(selectedTabIndex);
  }, [selectedTabIndex]); // Re-filter transactions when the selected tab index changes

  const getStatusFromIndex = (index) => {
    // Define your logic to get status from index
    switch (index) {
      case 0:
        return "Ongoing";
      case 1:
        return "Complete";
      case 2:
        return "Pending";
      case 3:
        return "Declined";
      default:
        return "";
    }
  };

  const filterTransactions = (index) => {
    const status = getStatusFromIndex(index);
    const filtered = transactions.filter(
      (transaction) => transaction.Status === status
    );
    setFilteredTransactions(filtered);
  };

  const handleTabPress = (index) => {
    setSelectedTabIndex(index);
  };

  const isTabSelected = (index) => {
    return index === selectedTabIndex;
  };

  const renderTransactions = () => {
    return filteredTransactions.map((transaction, index) => {
      const fetchedCrop = crops.find(
        (crop) => crop.CropID === transaction.transactioncontent[0].CropID
      );

      const BGColor =
        transaction.Status === "Pending"
          ? "#fb923c"
          : transaction.Status === "Declined"
          ? "#f87171"
          : transaction.Status === "Ongoing"
          ? "#60a5fa"
          : transaction.Status === "Complete"
          ? "#a3e635"
          : null;

      return (
        <View
          key={index}
          className="flex-1 bg-white z-10 mb-5"
          style={styles.shadow}
        >
          <View className="flex-1 px-5 py-4 border-b-2 border-gray-200">
            <Text
              className="self-end text-sm p-2 rounded-lg font-semibold text-white"
              style={{ backgroundColor: BGColor }}
            >
              {transaction.Status}
            </Text>
          </View>

          <View className="flex-1 flex-row justify-between items-center px-5 py-2 border-b-2 border-gray-200">
            <View className="p-2 bg-white rounded-lg">
              <Image
                source={{ uri: fetchedCrop.Uri }}
                style={{ width: 40, height: 40 }}
                resizeMode="cover"
                className="m-1 "
              />
            </View>
            <View className="flex-1 flex-row pt-2 px-3 h-full ">
              <View>
                <Text className="font-bold text-gray-800 text-2xl">
                  {fetchedCrop.CropName}
                </Text>
                <Text className="font-bold text-gray-800 text-base">
                  {transaction.transactioncontent[0].CropType}
                </Text>
              </View>
            </View>
            <View className="flex-1 flex-row h-full justify-end items-end">
              <View>
                <Text className="self-end font-bold text-gray-800 text-base">
                  {transaction.transactioncontent[0].Quantity} x
                </Text>
                <Text className="self-end font-bold text-gray-800 text-base">
                  Php{" "}
                  {transaction.transactioncontent[0].PricePerUnit.toFixed(2)}{" "}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-1 flex-row justify-between items-center px-5 py-2 border-b-2 border-gray-200">
            <Text className="text-gray-500 text-base font-bold">
              {transaction.transactioncontent.length} crops
            </Text>
            <Text className="text-lime-500 font-bold text-base">
              Php {transaction.transactioncontent[0].Total.toFixed(2)}
            </Text>
          </View>

          <View className="flex-1 flex-row justify-between items-center  px-5 py-2 border-b-2 border-gray-200">
            <Text className="text-gray-500 font-bold">
              {new Date(transaction.TimeStamp).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }) +
                " | " +
                new Date(transaction.TimeStamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </Text>
          </View>

          <View className="flex-1 flex-row justify-between items-center px-5 py-4">
            <Text className="text-gray-400 font-semibold">
              This transaction is {transaction.Status}
            </Text>
            <TouchableOpacity
              className="bg-lime-600 p-2 rounded-lg"
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("FullViewTransaction", {
                  transaction: transaction,
                  userInfo: userInfo,
                });
              }}
            >
              <Text className="text-white font-bold text-sm">
                Review Transaction
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <View
        className="flex bg-zinc-100 pt-12  z-10
            "
        style={[styles.shadow, { height: deviceHeight * 0.4 }]}
      >
        <TouchableOpacity
          style={styles.shadow}
          className="p-2 bg-white rounded-full absolute top-10 left-5 z-10"
          onPress={() => navigation.goBack()}
        >
          <Icon type="ionicon" name="arrow-back" size={30} color="#374151" />
        </TouchableOpacity>

        <View className="px-7 flex-1">
          <View className="flex-1 flex-row pb-3 mb-3 items-end space-x-2 border-b-2 border-gray-300">
            <Image
              source={
                userInfo?.ProfileImg
                  ? { uri: userInfo?.ProfileImg }
                  : userType == "Farmer"
                  ? Traderplaceholder
                  : Farmerplaceholder
              }
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
              className="m-1 rounded-full"
            />
            <View>
              <Text className="font-bold text-3xl text-gray-700 text-gray-">
                {userInfo?.Fullname}
              </Text>

              <Text
                className="font-semibold text-base/loose text-gray-500 wrap"
                style={{ width: deviceWidth * 0.65 }}
              >
                {(userInfo?.Address).split("|")[0].length > 90
                  ? (userInfo?.Address).split("|")[0].substring(0, 90) + "..."
                  : (userInfo?.Address).split("|")[0]}
              </Text>
            </View>
          </View>
          {userType != "Farmer" && (
            <View className="  flex-row pb-3 items-center space-x-3 border-b-2 border-gray-300">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate("ConversationScreen", {
                    InfoDetails: userInfo,
                  });
                }}
                className="p-3 rounded-lg flex-1 bg-lime-500"
              >
                <Text className="text-base text-white font-bold self-center">
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                className="p-3 rounded-lg flex-1 bg-white border-2 border-gray-300"
              >
                <Text className="text-base text-lime-500 font-bold self-center">
                  Locate
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="flex-row w-full mt-5">
          {["Ongoing", "Complete", "Pending", "Declined"].map((tab, index) => (
            <TouchableHighlight
              key={index}
              activeOpacity={1}
              underlayColor={
                isTabSelected(index) ? "#27C10E" : "#dedede" // Change the underlay color based on selection
              }
              onPress={() => handleTabPress(index)}
              className="flex-1 p-3 px-4 items-center justify-center border-b-2 border-gray-300"
              style={{
                // Change background color based on selection
                borderColor: isTabSelected(index) ? "#83cc16" : "#dedede",
              }}
            >
              <Text
                className="text-gray-800 font-medium text-base"
                style={{
                  color: isTabSelected(index) ? "#83cc16" : "#999999", // Change text color based on selection
                }}
              >
                {tab}
              </Text>
            </TouchableHighlight>
          ))}
        </View>
      </View>
      {/* chat bubbles */}
      <View
        className="flex-1 bg-zinc-100 pb-5 space-x-5 "
        style={[styles.shadow, { height: deviceHeight * 0.75 }]}
      >
        <ScrollView className="pt-5">{renderTransactions()}</ScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",

    shadowOpacity: 0.38,
    shadowRadius: 15.0,

    elevation: 10,
  },
});
export default TransactionListScreen;
