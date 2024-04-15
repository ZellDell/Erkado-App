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
import React from "react";
import { Icon } from "@rneui/base";
import COLORS from "../../constant/colors";

import { useDispatch, useSelector } from "react-redux";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

import useQueryTransaction from "../../utils/queryTransactions";
import PLACEHOLDER from "../../constant/profile";

function TransactionScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const UserType = useSelector((state) => state.user.userInfo.userType);

  const queryTransaction = useQueryTransaction("", UserType);

  useFocusEffect(
    React.useCallback(() => {
      queryTransaction.onChangeText("");
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1">
        <SafeAreaView className="bg-gray-100 pt-5 flex-1 mt-12 px-8 space-y-4">
          <Text className="font-bold text-xl text-gray-700">
            Transactions (0)
          </Text>

          <View className="flex-row bg-gray-200 p-2 rounded-md space-x-2">
            <Icon
              name="search"
              type="ionicon"
              color={COLORS.primary}
              size={30}
            />
            <TextInput
              className="flex-1 font-semibold text-base text-gray-700"
              placeholder="e.g. Trader Name.."
              value={queryTransaction.value}
              onChangeText={(text) => queryTransaction.onChangeText(text)}
            />
            {queryTransaction.value.length > 0 && (
              <TouchableOpacity
                onPress={() => queryTransaction.onChangeText("")}
              >
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
            <View className="flex-1 justify-center mt-4">
              {queryTransaction?.results?.length > 0 ? (
                queryTransaction.results.map((transaction, index) => {
                  console.log("==", transaction);

                  const AdminRequestNotif =
                    UserType == "Farmer"
                      ? transaction.transactions[0].viewaccess[0]
                          .FarmerNotification === 1
                      : transaction.transactions[0].viewaccess[0]
                          .TraderNotification === 1;
                  isNotif = AdminRequestNotif;

                  return transaction.userInfo ? (
                    <TouchableHighlight
                      key={index}
                      activeOpacity={1}
                      underlayColor="#ededed"
                      onPress={() => {
                        navigation.navigate("TransactionListScreen", {
                          transactions: transaction.transactions,
                          userInfo: transaction.userInfo,
                        });
                      }}
                    >
                      <View className="flex-row border-b-2 border-gray-200 py-4 items-center justify-between">
                        <View className="flex-row space-x-3 relative">
                          {isNotif && (
                            <Text className="absolute -top-2 -left-1 font-bold bg-red-500 py-.5 px-2 z-10 text-white rounded-full">
                              !
                            </Text>
                          )}
                          <Image
                            source={
                              transaction.userInfo?.ProfileImg
                                ? { uri: transaction.userInfo.ProfileImg }
                                : { uri: PLACEHOLDER.trader }
                            }
                            style={{ width: 45, height: 45 }}
                            resizeMode="cover"
                            className=" rounded-full"
                          />
                          <View className="items-start">
                            <Text className="text-lg font-bold text-gray-800">
                              {transaction.userInfo?.Fullname.length > 24
                                ? transaction.userInfo?.Fullname.slice(0, 24) +
                                  "..."
                                : transaction.userInfo?.Fullname}
                            </Text>
                            <View className="flex-row space-x-1">
                              <Text className=" text-xs font-semibold text-gray-700">
                                Transactions :
                              </Text>
                              <Text className=" text-xs font-bold text-lime-600">
                                {transaction?.transactions.length}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View className="p-3 bg-lime-500 rounded-lg">
                          <Text className="text-sm text-white font-semibold ">
                            See All
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  ) : null;
                })
              ) : (
                <Text className="self-center text-gray-400 font-semibold mt-5">
                  You dont have any Conversations...
                </Text>
              )}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default TransactionScreen;
