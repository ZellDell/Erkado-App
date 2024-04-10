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
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Icon } from "@rneui/base";
import COLORS from "../../constant/colors";
import Traderplaceholder from "../../../assets/profile/Default Trader.png";
import Farmerplaceholder from "../../../assets/profile/Default Farmer.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../features/message-actions";
import getTimeAgoUtil from "../../utils/getTimeAgoUtil";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { fetchTransaction } from "../../features/transaction-actions";

function TransactionScreen() {
  const [query, setQuery] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [transactions, setTransactions] = useState([]);

  const UserType = useSelector((state) => state.user.userInfo.userType);

  useEffect(() => {
    getTransaction();

    return () => {
      setTransactions([]);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getTransaction();
    }, [])
  );

  const getTransaction = async () => {
    try {
      const transaction = await dispatch(fetchTransaction({ UserType }));

      setTransactions(transaction?.data.transactions);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleTabPress = (index) => {
    setSelectedTabIndex(index);
  };

  const isTabSelected = (index) => {
    return index === selectedTabIndex;
  };

  const useGetTimeAgo = getTimeAgoUtil();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1">
        <SafeAreaView className="bg-gray-100 pt-5 flex-1 mt-12 px-8 space-y-4">
          <Text className="font-bold text-2xl text-gray-700">
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
              className="flex-1 font-semibold text-lg text-gray-700"
              placeholder="e.g. Transaction ID, Trader Name.."
              value={query}
              onChangeText={(text) => setQuery(text)}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
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
              {transactions ? (
                transactions.map((transaction, index) => {
                  console.log("==", transaction);
                  return (
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
                        <View className="flex-row space-x-3">
                          <Image
                            source={
                              transaction.userInfo.ProfileImg
                                ? { uri: transaction.userInfo.ProfileImg }
                                : Traderplaceholder
                            }
                            style={{ width: 55, height: 55 }}
                            resizeMode="cover"
                            className=" rounded-full"
                          />
                          <View className="items-start">
                            <Text className="text-2xl font-bold text-gray-800">
                              {transaction.userInfo.Fullname.length > 24
                                ? transaction.userInfo.Fullname.slice(0, 24) +
                                  "..."
                                : transaction.userInfo.Fullname}
                            </Text>
                            <View className="flex-row space-x-1">
                              <Text className=" text-sm font-semibold text-gray-700">
                                Transactions :
                              </Text>
                              <Text className=" text-sm font-bold text-lime-600">
                                {transaction.transactions.length}
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
                  );
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
