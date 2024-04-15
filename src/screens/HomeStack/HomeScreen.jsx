import {
  View,
  Text,
  SafeAreaView,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { requestUserInfo } from "../../features/user-actions";
import COLORS from "../../constant/colors";

import ErkadoPlaceholder from "../../../assets/Erkado-logo.png";
import ErkadoTextPlaceholder from "../../../assets/Erkado Text Fill.png";

import PreparingScreen from "../PreparingScreen";

import NewUserGreetingsModal from "../../components/HomeComponents/NewUserGreetingsModal";

import Toast from "react-native-toast-message";
import PLACEHOLDER from "../../constant/profile";
import useQueryTransaction from "../../utils/queryTransactions";
import getTimeAgoUtil from "../../utils/getTimeAgoUtil";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Icon } from "@rneui/base";

function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [newUserModal, setNewUserModal] = useState(false);

  const UserType = useSelector((state) => state.user.userInfo.userType);

  const isNewUser = useSelector((state) => state.ui.isNewUser);
  const isFarmer = useSelector((state) => state.ui.isFarmer);
  const isPreparing = useSelector((state) => state.ui.isPreparing);

  const userInfo = useSelector((state) => state.user.userInfo);
  const { crops } = useSelector((state) => state.crop.crops);

  useEffect(() => {
    const requestuserinfo = async () => {
      const result = await dispatch(requestUserInfo());

      if (isNewUser) {
        setNewUserModal(true);
      }
      if (result?.success) {
        Toast.show({
          type: "SuccessNotif",
          props: { header: "Hello," },
          text1: result?.Username,
          visibilityTime: 3000,
          swipeable: true,
        });
      }
    };
    requestuserinfo();
  }, []);

  const handleNewUserModal = () => {
    setNewUserModal(!newUserModal);
  };

  const queryTransaction = useQueryTransaction("", UserType);

  const useGetTimeAgo = getTimeAgoUtil();
  const [pendings, setPendings] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (UserType) {
        queryTransaction.onChangeText("");

        const AdminRequestView = queryTransaction.results.filter(
          (transaction) =>
            transaction.transactions[0].viewaccess[0].FarmerNotification === 1
        );

        if (AdminRequestView.length > 0) {
          setIsNotification(true);
        } else {
          setIsNotification(false);
        }
      }
    }, [])
  );

  const [isNotification, setIsNotification] = useState(false);

  useEffect(() => {
    if (queryTransaction.results) {
      const pendingTransactions = queryTransaction.results.filter(
        (transaction) => transaction.transactions[0].Status === "Pending"
      );
      setPendings(pendingTransactions.length);

      const AdminRequestView = queryTransaction.results.filter(
        (transaction) =>
          transaction.transactions[0].viewaccess[0].FarmerNotification === 1
      );

      if (AdminRequestView.length > 0) {
        setIsNotification(true);
      } else {
        setIsNotification(false);
      }
    } else {
      setPendings(0);
    }
  }, [queryTransaction.results]);

  const RecentTransactionCard = memo(({ transaction, index }) => {
    const status = transaction.transactions[0].Status;
    let QuantityTotal = 0;

    transaction.transactions[0].transactioncontent.map((content) => {
      return (QuantityTotal += content.Quantity);
    });

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Transaction")}
        className="bg-white my-2 p-5 px-6 rounded-lg ml-5 w-5/12 "
        style={styles.box}
      >
        <>
          {/* Upper Half */}
          <View className="flex-2 flex-row space-x-2 border-b-2 border-gray-300 pb-3 mb-3">
            <View className="flex-row flex-1 space-x-2">
              <Image
                source={
                  transaction.userInfo.ProfileImg
                    ? { uri: transaction.userInfo.ProfileImg }
                    : { uri: PLACEHOLDER.trader }
                }
                style={{ width: 50, height: 50 }}
                resizeMode="cover"
                className="rounded-full "
              />
              <View className="">
                <Text className="font-bold text-xs">
                  {transaction.userInfo.Fullname}
                </Text>
                <Text className="font-semibold text-[10px] text-gray-500">
                  {transaction.userInfo.TraderType}
                </Text>
              </View>
            </View>
            <Text className="flex-2 self-start font-semibold text-gray-600 text-[10px]">
              {useGetTimeAgo.getTimeAgo(transaction.transactions[0].TimeStamp)}
            </Text>
          </View>

          {/* Lower Half */}
          <View className="flex-2 flex-row justify-between items-center">
            {/*Map all crops in transaction */}
            <View className="flex-row">
              {transaction.transactions[0].transactioncontent
                .slice(0, 5)
                .map((content, index) => {
                  const cropURI = crops.find(
                    (crop) => crop.CropID === content.CropID
                  ).Uri;
                  console.log(
                    "KEY==============" +
                      index +
                      "-" +
                      content.TransactionContentID +
                      "-" +
                      transaction.transactions[0].TransactionID
                  );
                  return (
                    <View className="border-2 border-lime-500 rounded-full p-1 -ml-2 bg-white">
                      <Image
                        key={index + "-" + content.TransactionContentID}
                        source={{ uri: cropURI }}
                        style={{ width: 15, height: 15 }}
                        resizeMode="cover"
                      />
                    </View>
                  );
                })}
            </View>

            <View>
              <Text className="p-1 px-2 bg-lime-500 text-white font-bold text-[11px] rounded-xl">
                {QuantityTotal}x{" "}
                {status == "Complete"
                  ? "crops sold"
                  : status == "Declined"
                  ? "crops not sold"
                  : "crops to be sold"}
              </Text>
            </View>
          </View>
          {/* Status */}

          <View className="flex-2 mt-3">
            <Text
              className=" text-green-500 font-bold text-sm"
              style={{
                color:
                  status == "Pending"
                    ? "#f58931"
                    : status == "Declined"
                    ? "#f87171"
                    : status == "Ongoing"
                    ? "#60a5fa"
                    : "#22c55e",
              }}
            >
              {status}
            </Text>
          </View>
        </>
      </TouchableOpacity>
    );
  });

  return (
    <ScrollView
      className="flex-1 mb-20"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <SafeAreaView className="bg-gray-50 pt-5 flex-1">
        {isNotification && (
          <View className="flex-row bg-green-500 justify-center items-center">
            <Icon
              name="notifications"
              type="ionicon"
              color="#ffffff"
              size={40}
            />
            <View className="">
              <Text className="font-bold text-base text-white pt-5 ml-8">
                Notification : Admin Request
              </Text>
              <Text className="font-[450] text-base text-gray-100 pb-5 ml-8">
                Transaction View Access.
              </Text>
            </View>
          </View>
        )}
        {isPreparing ? (
          <PreparingScreen isPreparing={isPreparing} />
        ) : (
          isNewUser && (
            <NewUserGreetingsModal
              newUserModal={newUserModal}
              handleNewUserModal={handleNewUserModal}
            />
          )
        )}

        {userInfo.userId && (
          <>
            <View className="flex-1  pb-14 mt-5 space-y-6">
              {/* Header & User Info */}
              {userInfo.userId ? (
                <View
                  className="flex p-4 bg-white mx-8 rounded-lg space-y-5 "
                  style={styles.box}
                >
                  <View className="flex-row  items-center justify-between ">
                    <View className="flex-row space-x-2 items-center">
                      <Image
                        source={
                          userInfo.profileImg
                            ? { uri: userInfo.profileImg }
                            : isFarmer
                            ? { uri: PLACEHOLDER.farmer }
                            : { uri: PLACEHOLDER.trader }
                        }
                        style={{ width: 50, height: 50 }}
                        resizeMode="cover"
                        className="rounded-full "
                      />
                      <View>
                        <Text className="text-xl font-bold text-gray-800">
                          {userInfo.fullname}
                        </Text>
                        <Text className="text-md font-bold text-lime-600">
                          {userInfo.userType}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      className="relative"
                      onPress={() => {
                        navigation.navigate("Transaction");
                      }}
                    >
                      {isNotification && (
                        <Text className="absolute -top-2 -right-1 font-bold bg-red-500 py-.5 px-2 z-10 text-white rounded-full">
                          !
                        </Text>
                      )}
                      <Icon
                        name="notifications"
                        type="ionicon"
                        color={COLORS.primary}
                        size={30}
                      />
                    </TouchableOpacity>

                    {/* Data */}
                  </View>
                  <View className="flex-row justify-between">
                    <View
                      className="bg-gray-50 px-3 py-2 w-5/12 rounded-lg"
                      style={{ width: "45%" }}
                    >
                      <Text className="font-bold text-md">Pending</Text>
                      <Text
                        className="font-bold text-lg"
                        style={{ color: COLORS.primary }}
                      >
                        {pendings}
                      </Text>
                    </View>
                    <View
                      className="bg-gray-50 px-3 py-2 rounded-lg"
                      style={{ width: "45%" }}
                    >
                      <Text className="font-bold text-md">Transactions</Text>
                      <Text
                        className="font-bold text-lg"
                        style={{ color: COLORS.primary }}
                      >
                        {queryTransaction?.results?.length}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="items-center space-y-2">
                  <Image
                    source={ErkadoPlaceholder}
                    style={{ width: 80, height: 80 }}
                    resizeMode="contain"
                  />
                  <Image
                    source={ErkadoTextPlaceholder}
                    style={{ width: 150, height: 60 }}
                    resizeMode="contain"
                  />
                </View>
              )}

              {/* Crop Categories */}
              <View className="space-y-3">
                <Text className="font-bold px-8 text-xl">Categories</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  className=" pl-8"
                >
                  {crops.map((crop) => (
                    <TouchableOpacity
                      key={crop.CropID}
                      className="flex bg-white items-center rounded-full py-2 px-4 border-2 mr-3"
                      style={{ borderColor: COLORS.primary }}
                      onPress={() => {
                        navigation.navigate("CropSearchTrader", {
                          cropID: crop.CropID,
                          cropQuery: crop.CropName,
                          cropUri: crop.Uri,
                          cropDescription: crop.Description,
                        });
                      }}
                    >
                      <Image
                        source={{ uri: crop.Uri }}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                        className="m-1"
                      />
                      <Text className="font-medium text-xs">
                        {crop.CropName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Latest Transacts */}
              <View className="flex-roow space-y-3 w-full ">
                <Text className="font-bold px-8 text-xl ">Recent</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    marginRight: -300,
                  }}
                >
                  {queryTransaction &&
                    queryTransaction.results?.length > 0 &&
                    queryTransaction.results.map((transaction, index) => {
                      return (
                        <RecentTransactionCard
                          key={
                            index +
                            "-" +
                            transaction.transactions[0].TransactionID
                          }
                          index={index}
                          transaction={transaction}
                        />
                      );
                    })}
                </ScrollView>
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.27,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default HomeScreen;
