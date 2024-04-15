import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { Icon } from "@rneui/base";

function ConfirmAccessView({
  allowAccessModal,
  handleAllow,
  setAllowAccessModal,
}) {
  handleConfirm = () => {
    handleAllow(true);
  };

  handleDecline = () => {
    handleAllow(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Modal
        isVisible={allowAccessModal}
        animationIn="fadeIn"
        animationInTiming={200}
        onBackdropPress={() => setAllowAccessModal(false)}
      >
        <View className="flex  bg-zinc-50 rounded-md py-5 px-7 space-y-5 justify-center">
          <View className="flex-row items-center space-x-2 pb-5 border-b-2 border-b-gray-300">
            <Icon name="lock-open" type="ionicon" color="tomato" size={40} />
            <View>
              <Text className="text-base text-justify text-gray-800 pr-10 font-bold">
                Allow Administrator to have access to this transaction?
              </Text>
            </View>
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="p-3 rounded-md flex-1 bg-red-500"
              onPress={handleConfirm}
            >
              <Text className="self-center font-bold text-md  text-white">
                Allow
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3 rounded-md flex-1 bg-gray-600"
              onPress={handleDecline}
            >
              <Text className="self-center font-bold text-md  text-gray-200">
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
}

export default ConfirmAccessView;
