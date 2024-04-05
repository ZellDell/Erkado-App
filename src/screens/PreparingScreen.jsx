import {
  View,
  StatusBar,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";

import * as Animatable from "react-native-animatable";
import Modal from "react-native-modal";
function PreparingScreen(props) {
  return (
    <Modal
      isVisible={props?.isPreparing}
      animationIn="fadeIn"
      animationInTiming={300}
      animationOut="fadeOut"
      animationOutTiming={300}
      style={{ margin: 0 }}
    >
      <View
        className="flex-1 bg-white justify-center h-full w-full"
        style={{ backgroundColor: "#82eb80", width: "100%", height: "100%" }}
      >
        <View className="flex-row self-center ">
          <Animatable.Image
            source={require("../../assets/animation/Loading-Animation.gif")}
            iterationCount={1}
            animation="slideInUp"
            className="h-96 w-96 "
          />
        </View>
        <View className="flex-row self-center">
          <Animatable.Text
            animation="slideInUp"
            className="text-2xl my-10 px-3 text-white font-bold text-center"
          >
            We are preparing things for you...
          </Animatable.Text>
        </View>

        <View className="flex-row self-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default PreparingScreen;
