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

function MessageScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState([]);

  const userType = useSelector((state) => state.user.userInfo.userType);

  useEffect(() => {
    fetchConvos();

    return () => {
      setConversations([]);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchConvos();
    }, [])
  );

  const fetchConvos = async () => {
    try {
      const convos = await dispatch(fetchMessages(userType));
      setConversations(convos?.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const useGetTimeAgo = getTimeAgoUtil();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1">
        <SafeAreaView className="bg-gray-100 pt-5 flex-1 mt-12 px-8 space-y-4">
          <Text className="font-bold text-2xl text-gray-700">
            Chat ({conversations?.length ? conversations?.length : 0})
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
              placeholder="e.g. Trader Name.."
              value={query}
              onChangeText={(text) => setQuery(text)}
            />
            {query?.length > 0 && (
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
          {/* Conversations */}

          <View>
            <View className="flex justify-center mt-4">
              {conversations ? (
                conversations.map((convo, index) => {
                  console.log("==", convo);
                  const TimeAgo = useGetTimeAgo.getTimeAgo(convo.TimeStamp);
                  return (
                    <TouchableHighlight
                      key={index}
                      activeOpacity={1}
                      underlayColor="#ededed"
                      onPress={() => {
                        navigation.navigate("ConversationScreen", {
                          InfoDetails: convo.Info[0],
                        });
                      }}
                    >
                      <View className="flex-row border-b-2 border-gray-200 py-4 items-center justify-between">
                        <View className="flex-row space-x-3">
                          <Image
                            source={
                              convo.Info[0].ProfileImg
                                ? { uri: convo.Info[0].ProfileImg }
                                : Traderplaceholder
                            }
                            style={{ width: 55, height: 55 }}
                            resizeMode="cover"
                            className=" rounded-full"
                          />
                          <View className="items-start">
                            <Text className="text-2xl font-bold text-gray-800">
                              {convo.Info[0].Fullname.length > 24
                                ? convo.Info[0].Fullname.slice(0, 24) + "..."
                                : convo.Info[0].Fullname}
                            </Text>
                            <Text className=" text-md font-semibold text-gray-700">
                              {convo.isLastSender ? "You: " : null}
                              {convo.Message.length > 24
                                ? convo.Message.slice(0, 24) + "..."
                                : convo.Message}
                            </Text>
                          </View>
                        </View>

                        <Text className="text-md font-semibold text-gray-500">
                          {TimeAgo}
                        </Text>
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

export default MessageScreen;
