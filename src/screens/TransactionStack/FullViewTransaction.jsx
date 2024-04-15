import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "@rneui/base";

import { useDispatch, useSelector } from "react-redux";

import getTimeAgoUtil from "../../utils/getTimeAgoUtil";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  TransactionViewAccess,
  completeTransaction,
  confirmTransaction,
} from "../../features/transaction-actions";
import PLACEHOLDER from "../../constant/profile";

import ConfirmAccessView from "../../components/TransactionComponents/ConfirmAccessView";
import Toast from "react-native-toast-message";

function FullViewTransaction() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const { transaction, userInfo } = route.params;

  const { crops } = useSelector((state) => state.crop.crops);
  const { quality } = useSelector((state) => state.crop.quality);
  const userType = useSelector((state) => state.user.userInfo.userType);

  let Total = 0;
  let TotalQuantity = 0;

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const useGetTimeAgo = getTimeAgoUtil();
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const reqAdminAccess =
    userType == "Farmer"
      ? transaction.viewaccess[0].FarmerNotification === 1
      : transaction.viewaccess[0].TraderNotification === 1;

  useEffect(() => {
    console.log("Transaction View ", transaction);
  }, []);

  handleConfirmTransaction = async () => {
    const result = await dispatch(
      confirmTransaction(transaction.TransactionID, true)
    );

    if (result?.success) {
      navigation.navigate("Transaction");
    }
  };

  handleDeclineTransaction = async () => {
    const result = await dispatch(
      confirmTransaction(transaction.TransactionID, false)
    );

    if (result?.success) {
      navigation.navigate("Transaction");
    }
  };

  handleCompleteTransaction = async () => {
    const result = await dispatch(
      completeTransaction(transaction.TransactionID)
    );

    if (result?.success) {
      navigation.navigate("Transaction");
    }
  };

  const [allowAccessModal, setAllowAccessModal] = useState(false);

  const handleAllow = async (isAllow) => {
    console.log("Allow Access submit");

    if (isAllow) {
      const response = await dispatch(
        TransactionViewAccess(transaction.TransactionID, userType, 1)
      );
      if (response.success) {
        Toast.show({
          type: "InfoNotif",
          props: { header: "View Access" },
          text1: "Admin Granted",
          visibilityTime: 3000,
          swipeable: true,
        });
        navigation.navigate("Transaction");
      }
    } else {
      const response = await dispatch(
        TransactionViewAccess(transaction.TransactionID, userType, 0)
      );
      if (response.success) {
        Toast.show({
          type: "InfoNotif",
          props: { header: "View Access" },
          text1: "Admin Denied",
          visibilityTime: 3000,
          swipeable: true,
        });
        navigation.navigate("Transaction");
      }
    }

    setAllowAccessModal(false);
  };

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <View
        className="flex bg-zinc-100 pt-12 space-y-5 z-10
              "
        style={[styles.shadow, { height: deviceHeight * 0.25 }]}
      >
        <TouchableOpacity
          style={styles.shadow}
          className="p-2 bg-white rounded-full absolute top-10 left-5 z-10"
          onPress={() => navigation.goBack()}
        >
          <Icon type="ionicon" name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>

        {reqAdminAccess && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.shadow}
            className="p-2 bg-red-500 flex-row rounded-full absolute items-center space-x-2 px-3 top-5 right-5 z-10"
            onPress={() => {
              setAllowAccessModal(true);
            }}
          >
            <Icon type="ionicon" name="eye-off" size={30} color="#ffffff" />
            <Text className="font-bold text-white text-xs">
              Requesting View Access
            </Text>
          </TouchableOpacity>
        )}

        <View className="px-7 flex-1">
          <View className="flex-1 flex-row pb-3 mb-3 items-end space-x-2 ">
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
        </View>
      </View>
      {/* chat bubbles */}
      <View
        className="flex-1 bg-zinc-100 space-x-5 z-0"
        style={[styles.shadow, { height: deviceHeight * 0.75 }]}
      >
        <ScrollView className="pt-5 ">
          {transaction.transactioncontent &&
            transaction.transactioncontent.map((content, index) => {
              const fetchedCrop = crops?.find(
                (crop) => crop?.CropID === content?.CropID
              );

              const fetchedquality = quality.find(
                (quali) => quali.QualityTypeID === content.QualityTypeID
              );

              Total += content.Quantity * content.PricePerUnit;
              TotalQuantity += content.Quantity;
              return (
                <View
                  key={index + "-" + content.TransactionContentID}
                  className="flex-1 flex-row bg-white py-5 px-5 mb-7"
                >
                  {/* Image & Crop Details */}

                  <View className="flex-1 flex-row space-x-3">
                    <View className="p-3 border-2 border-gray-300 rounded-xl">
                      <Image
                        source={{ uri: fetchedCrop?.Uri }}
                        style={{ width: 30, height: 30 }}
                        resizeMode="cover"
                        className="m-1 "
                      />
                    </View>

                    <View>
                      <Text className="font-bold text-base text-gray-700 ">
                        {fetchedCrop.CropName}
                      </Text>
                      <Text className="font-semibold text-xs text-gray-400 ">
                        {fetchedquality.QualityType}
                      </Text>
                      <Text className="font-semibold text-sm text-lime-600">
                        Php {content.PricePerUnit.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View className="justify-end items-end">
                    <Text className="font-semibold text-sm text-gray-600 ">
                      Quantity: {content.Quantity}
                      {" x"}
                    </Text>
                    <Text className="font-bold text-sm text-lime-600 ">
                      Php {(content.Quantity * content.PricePerUnit).toFixed(2)}
                    </Text>
                  </View>

                  {/* Price & Quantity */}
                </View>
              );
            })}
        </ScrollView>
      </View>

      <View>
        <View
          className="flex-2 flex-row justify-center items-center px-6 bg-white py-1.5 z-20 border-t-2 border-lime-300
              "
          style={styles.shadow}
        >
          <View className="flex-row justify-between px-3 flex-1">
            <Text className="font-semibold text-sm text-gray-700">Date</Text>
            <Text className="font-bold text-sm text-gray-700 ">
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
        </View>
        <View
          className="flex-2 flex-row justify-center items-center px-6 bg-white py-1.5 space-x-5 z-20
              "
        >
          <View className="flex-row justify-between px-3 flex-1">
            <Text className="font-semibold text-sm  text-gray-700">
              Quantity Total
            </Text>
            <Text className="font-bold text-sm text-gray-700 ">
              {TotalQuantity}x
            </Text>
          </View>
        </View>
        <View
          className="flex-2 flex-row justify-center items-center px-6 bg-white py-1.5 space-x-5 z-20
              "
        >
          <View className="flex-row justify-between px-3 flex-1">
            <Text className="font-semibold text-sm text-gray-700">Total</Text>
            <Text className="font-bold text-sm text-gray-700 ">
              Php {Total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      {transaction.Status == "Pending" && userType == "Farmer" && (
        <View
          className="flex-2 flex-row justify-center items-center px-10 bg-orange-400 py-3 space-x-5 z-20
              "
          style={[styles.shadow, { height: deviceHeight * 0.13 }]}
        >
          <Icon name="warning" type="ionicon" color="#FFFFFF" size={40} />
          <View>
            <Text className="font-bold text-xl text-white">
              Pending Transaction Offer
            </Text>
            <Text className="font-[450] text-[11px] text-gray-50 text-justify">
              This transaction is currently still pending. Until the Trader,{" "}
              {userInfo.Fullname.split(" ")[0]} confirms the transaction offer,
              this will persist.
            </Text>
          </View>
        </View>
      )}

      {transaction.Status == "Pending" && userType == "Trader" && (
        <>
          <View
            className="flex-2 flex-row justify-center items-center px-10 bg-white pt-2 space-x-5 z-20 border-t-2 border-lime-200
              "
            style={[styles.shadow, { height: deviceHeight * 0.13 }]}
          >
            <TouchableOpacity
              className="p-2 flex-1 bg-lime-500 rounded-lg"
              activeOpacity={0.8}
              onPress={handleConfirmTransaction}
            >
              <Text className="text-base font-semibold text-white self-center">
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 flex-1 bg-red-500 rounded-lg"
              onPress={handleDeclineTransaction}
              activeOpacity={0.8}
            >
              <Text className="text-base font-semibold text-white self-center">
                Decline
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className="flex-row justify-center items-center bg-white pb-5 space-x-5 z-20
            "
          >
            <Text className="text-sm font-semibold text-gray-600">
              Select an Option
            </Text>
          </View>
        </>
      )}

      {transaction.Status == "Ongoing" && (
        <>
          <View
            className="flex-2 flex-row justify-center items-center px-10 bg-white py-2 z-20 border-t-2 border-lime-200
              "
            style={[styles.shadow, { height: deviceHeight * 0.1 }]}
          >
            <TouchableOpacity
              className="p-2 flex-1 bg-lime-500 rounded-lg"
              activeOpacity={0.8}
              onPress={handleCompleteTransaction}
            >
              <Text className="text-base font-semibold text-white self-center">
                Complete
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {transaction.Status == "Declined" && userType == "Farmer" && (
        <View
          className="flex-2 flex-row justify-center items-center px-10 bg-red-400 py-3 space-x-5 z-20
              "
          style={[styles.shadow, { height: deviceHeight * 0.13 }]}
        >
          <Icon name="warning" type="ionicon" color="#FFFFFF" size={40} />
          <View>
            <Text className="font-bold text-xl text-white">
              Denied Transaction Offer
            </Text>
            <Text className="font-[450] text-[11px] text-gray-100 text-justify">
              This transaction is declined by the Trader.{" "}
              {userInfo.Fullname.split(" ")[0]} might not have been satisfied
              with your offer
            </Text>
          </View>
        </View>
      )}

      {transaction.Status == "Complete" && userType == "Farmer" && (
        <View
          className="flex-2 flex-row justify-center items-center px-10 bg-green-500 py-3 space-x-5 z-20
              "
          style={[styles.shadow, { height: deviceHeight * 0.13 }]}
        >
          <Icon
            name="checkmark-circle"
            type="ionicon"
            color="#FFFFFF"
            size={40}
          />
          <View>
            <Text className="font-bold text-xl text-white">
              Completed Transaction
            </Text>
            <Text className="font-[450] text-xs text-gray-100 text-justify">
              This concludes the transaction. You can start a new transaction or
              view your previous
            </Text>
          </View>
        </View>
      )}

      <ConfirmAccessView
        allowAccessModal={allowAccessModal}
        handleAllow={handleAllow}
        setAllowAccessModal={setAllowAccessModal}
      />
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
export default FullViewTransaction;
