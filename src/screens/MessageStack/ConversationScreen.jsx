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

function ConversationScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const userID = useSelector((state) => state.user.userInfo.userId);
  const userType = useSelector((state) => state.user.userInfo.userType);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [InfoDetails, setInfoDetails] = useState(route.params?.InfoDetails);

  const useGetTimeAgo = getTimeAgoUtil();
  const deviceHeight = Dimensions.get("window").height;

  useEffect(() => {
    data = { userID, otherID: InfoDetails.UserID };
    socket.emit("JoinRoom", data);

    return () => {
      socket.emit("LeaveRoom", userID);
    };
  }, []);

  useEffect(() => {
    socket.on("Messages", (conversations) => {
      console.log("Messages is emitted", conversations);
      setMessages((prevMessages) => [conversations, ...prevMessages]);
    });

    return () => {
      socket.off("Messages");
    };
  }, []);

  handlePress = () => {
    if (newMessage.trim() !== "") {
      const messageData = {
        SenderID: userID,
        ReceiverID: InfoDetails.UserID,
        Msg: newMessage.trim(),
      };
      // Emit the message data to the server
      socket.emit("SendMessage", messageData);

      // Clear the message input
      setNewMessage("");
    }
  };
  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <View
        className="flex-row bg-white pb-5 px-5 pt-12 space-x-5 items-center z-10
          "
        style={[styles.shadow, { height: deviceHeight * 0.15 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon type="ionicon" name="arrow-back" size={30} color="#374151" />
        </TouchableOpacity>

        <View className="flex-row items-end space-x-2">
          <Image
            source={
              InfoDetails?.ProfileImg
                ? { uri: InfoDetails?.ProfileImg }
                : userType == "Farmer"
                ? Traderplaceholder
                : Farmerplaceholder
            }
            style={{ width: 35, height: 35 }}
            resizeMode="cover"
            className="m-1 rounded-full"
          />
          <View>
            <Text className="font-bold text-xl text-gray-700 text-gray-">
              {InfoDetails.Fullname}
            </Text>
            {userType == "Farmer" && (
              <Text className="font-semibold text-sm text-gray-500 text-gray-">
                {InfoDetails.TraderType}
              </Text>
            )}
          </View>
        </View>
      </View>
      {/* chat bubbles */}
      <View
        className="flex-1 bg-zinc-100 pb-5 px-5  space-x-5 "
        style={[styles.shadow, { height: deviceHeight * 0.75 }]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            showsVerticalScrollIndicator={false}
            inverted
            data={messages.flat()}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            style={{ flex: 1 }}
            keyExtractor={(item, index) => item.MessageID}
            renderItem={({ item: message }) => {
              const timeAgo = useGetTimeAgo.getTimeAgo(message.TimeStamp);
              return message.SenderID == userID ? (
                <SenderChatBubble
                  key={message.MessageID}
                  message={message.Message}
                  timeAgo={timeAgo}
                />
              ) : (
                <ReceiverChatBubble
                  profileImg={InfoDetails.ProfileImg}
                  key={message.MessageID}
                  message={message.Message}
                  timeAgo={timeAgo}
                />
              );
            }}
          />
        </TouchableWithoutFeedback>
      </View>
      {/* Send Message */}
      <View
        className="flex-row flex-2 bg-white px-8 space-x-4 justify-center items-center"
        style={[styles.shadow, { height: deviceHeight * 0.1 }]}
      >
        <View className="flex-1 rounded-full bg-white py-1 px-5 border-2 border-lime-500">
          <TextInput
            multiline={true}
            numberOfLines={2}
            className="font-semibold text-lg/loose text-gray-700"
            placeholder="Type a message..."
            onChangeText={(text) => setNewMessage(text)}
            value={newMessage}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          className="flex-2 p-3 bg-lime-500 rounded-full -rotate-45"
        >
          <Icon type="ionicon" name="send" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",

    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});
export default ConversationScreen;
