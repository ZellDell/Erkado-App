import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Icon } from "@rneui/base";

import { useDispatch, useSelector } from "react-redux";

import getTimeAgoUtil from "../../utils/getTimeAgoUtil";
import { useNavigation, useRoute } from "@react-navigation/native";
import PLACEHOLDER from "../../constant/profile";

function TransactionListScreen() {
  const [isNotification, setIsNotification] = useState({
    tabIndex: null,
    isNotif: false,
  });

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

  const Location = {
    textAddress: userInfo.Address.split("|")[0],
    coordinates: {
      latitude: parseFloat(userInfo.Address.split("|")[1].split(",")[0]),
      longitude: parseFloat(userInfo.Address.split("|")[1].split(",")[1]),
    },
  };

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

  const [notificationStatus, setNotificationStatus] = useState({
    ongoing: false,
    complete: false,
    pending: false,
    declined: false,
  });

  useEffect(() => {
    isAdminAccess();
  }, [filteredTransactions]);

  const isAdminAccess = () => {
    const newNotificationStatus = {
      ongoing: false,
      complete: false,
      pending: false,
      declined: false,
    };

    transactions.map((transaction) => {
      const hasAdminRequestNotif =
        userType == "Farmer"
          ? transaction.viewaccess[0].FarmerNotification === 1
          : transaction.viewaccess[0].TraderNotification === 1;

      switch (transaction.Status) {
        case "Ongoing":
          if (hasAdminRequestNotif) newNotificationStatus.ongoing = true;
          break;
        case "Complete":
          if (hasAdminRequestNotif) newNotificationStatus.complete = true;
          break;
        case "Pending":
          if (hasAdminRequestNotif) newNotificationStatus.pending = true;
          break;
        case "Declined":
          if (hasAdminRequestNotif) newNotificationStatus.declined = true;
          break;
        default:
          break;
      }
    });
    setNotificationStatus(newNotificationStatus);
  };

  const renderTransactions = () => {
    return filteredTransactions.map((transaction, index) => {
      const fetchedCrop = crops.find(
        (crop) => crop.CropID === transaction.transactioncontent[0].CropID
      );

      const AdminRequestNotif =
        userType == "Farmer"
          ? transaction.viewaccess[0].FarmerNotification === 1
          : transaction.viewaccess[0].TraderNotification === 1;
      isNotif = AdminRequestNotif;

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
          <View className="flex-1 justify-between flex-row px-5 py-4 border-b-2 border-gray-200">
            <Text
              className=" text-xs p-1.5 rounded-lg font-semibold text-white"
              style={{ backgroundColor: BGColor }}
            >
              {transaction.Status}
            </Text>
            {isNotif && (
              <Text className="text-[11px] p-1.5 rounded-lg font-semibold text-red-500">
                Admin is requesting access to this transaction
              </Text>
            )}
          </View>

          <View className="flex-1 flex-row justify-between items-center px-5 py-2 border-b-2 border-gray-200">
            <View className="p-2 bg-white rounded-lg">
              <Image
                source={{ uri: fetchedCrop.Uri }}
                style={{ width: 30, height: 30 }}
                resizeMode="cover"
                className="m-1 "
              />
            </View>
            <View className="flex-1 flex-row pt-2 px-3 h-full ">
              <View>
                <Text className="font-bold text-gray-800 text-lg">
                  {fetchedCrop.CropName}
                </Text>
                <Text className="font-bold text-gray-500 text-xs">
                  {transaction.transactioncontent[0].CropType}
                </Text>
              </View>
            </View>
            <View className="flex-1 flex-row h-full justify-end items-end">
              <View>
                <Text className="self-end font-bold text-gray-800 text-xs">
                  {transaction.transactioncontent[0].Quantity} x
                </Text>
                <Text className="self-end font-bold text-gray-800 text-xs">
                  Php{" "}
                  {transaction.transactioncontent[0].PricePerUnit.toFixed(2)}{" "}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-1 flex-row justify-between items-center px-5 py-2 border-b-2 border-gray-200">
            <Text className="text-gray-500 text-xs font-bold">
              {transaction.transactioncontent.length} crops
            </Text>
            <Text className="text-lime-500 font-bold text-xs">
              Php {transaction.transactioncontent[0].Total.toFixed(2)}
            </Text>
          </View>

          <View className="flex-1 flex-row justify-between items-center  px-5 py-2 border-b-2 border-gray-200">
            <Text className="text-gray-500 font-bold text-xs">
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
            <Text className="text-gray-400 font-semibold text-xs">
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
              <Text className="text-white font-bold text-xs">
                Review Transaction
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView className="bg-gray-100 flex-1 ">
      <View
        className="flex-1 bg-zinc-100 relative z-10 
            "
        style={[styles.shadow, { height: deviceHeight * 0.75 }]}
      >
        <TouchableOpacity
          style={styles.shadow}
          className="p-2 bg-white rounded-full absolute top-10 left-5 z-10"
          onPress={() => navigation.goBack()}
        >
          <Icon type="ionicon" name="arrow-back" size={30} color="#374151" />
        </TouchableOpacity>

        <View className="px-7 pb-7 flex-1 ">
          <View
            activeOpacity={0.8}
            underlayColor="#dedede"
            className="flex-1 flex-row pb-3 mb-3 items-end space-x-2 border-b-2 border-gray-300"
          >
            <Image
              source={
                userInfo?.ProfileImg
                  ? { uri: userInfo?.ProfileImg }
                  : userType == "Farmer"
                  ? { uri: PLACEHOLDER.trader }
                  : { uri: PLACEHOLDER.farmer }
              }
              style={{ width: 60, height: 60 }}
              resizeMode="cover"
              className="m-1 rounded-full"
            />
            <View>
              <Text className="font-bold text-xl text-gray-700 text-gray-">
                {userInfo?.Fullname}
              </Text>

              <Text
                className="font-semibold text-xs text-gray-500 wrap"
                style={{ width: deviceWidth * 0.65 }}
              >
                {(userInfo?.Address).split("|")[0].length > 90
                  ? (userInfo?.Address).split("|")[0].substring(0, 90) + "..."
                  : (userInfo?.Address).split("|")[0]}
              </Text>
            </View>
          </View>

          <View className="flex-2  flex-row pb-3 items-center space-x-3 border-b-2 border-gray-300">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("ConversationScreen", {
                  InfoDetails: userInfo,
                });
              }}
              className="p-3 rounded-lg flex-1 bg-lime-500"
            >
              <Text className="text-xs text-white font-bold self-center">
                Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="p-3 rounded-lg flex-1 bg-white border-2 border-gray-300"
              onPress={() => {
                navigation.navigate("TraderRoute", {
                  Trader: {
                    Fullname: userInfo?.Fullname,
                    TraderType:
                      userType != "Farmer" ? "Farmer" : userInfo.TraderType,
                    ProfileImg: userInfo?.ProfileImg,
                  },
                  Address: Location.textAddress,
                  Coordinates: Location.coordinates,
                });
              }}
            >
              <Text className="text-xs text-lime-500 font-bold self-center">
                Locate
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-2 flex-row w-full">
          {["Ongoing", "Complete", "Pending", "Declined"].map((tab, index) => (
            <TouchableHighlight
              key={index}
              activeOpacity={1}
              underlayColor={
                isTabSelected(index) ? "#27C10E" : "#dedede" // Change the underlay color based on selection
              }
              onPress={() => handleTabPress(index)}
              className="flex-1 p-3 px-2 items-center justify-center border-b-2 border-gray-300 relative"
              style={{
                // Change background color based on selection
                borderColor: isTabSelected(index) ? "#83cc16" : "#dedede",
              }}
            >
              <View>
                {index === 0 && notificationStatus.ongoing && (
                  <Text className="absolute -top-2 -right-4 font-bold bg-red-500 py-.5 px-2 z-10 text-white rounded-full">
                    !
                  </Text>
                )}
                {index === 1 && notificationStatus.complete && (
                  <Text className="absolute -top-2 -right-4 font-bold bg-red-500 py-.5 px-2 z-10 text-white rounded-full">
                    !
                  </Text>
                )}
                {index === 2 && notificationStatus.pending && (
                  <Text className="absolute -top-2 -right-4 font-bold bg-red-500 py-.5 px-2 z-10 text-white rounded-full">
                    !
                  </Text>
                )}
                {index === 3 && notificationStatus.declined && (
                  <Text className="absolute -top-2 -right-4 font-bold bg-red-500 py-.5 px-2 z-10 text-white rounded-full">
                    !
                  </Text>
                )}

                <Text
                  className="text-gray-800 font-medium text-sm"
                  style={{
                    color: isTabSelected(index) ? "#83cc16" : "#999999", // Change text color based on selection
                  }}
                >
                  {tab}
                </Text>
              </View>
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
