import { Icon } from "@rneui/base";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const TextInputField = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnimation = useRef(
    new Animated.Value(props?.value ? 1 : 0)
  ).current;

  const handleFocus = () => {
    // Animate the label up and reduce its size when input is focus
    setIsFocused(true);

    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false,
      easing: Easing.in,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    // If the input is empty, animate the floating label back to its original position
    if (!props?.value) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.in,
      }).start();
    }
  };

  // Define animated styles for the floating label
  const labelStyle = {
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [4, -3], // top value
    }),
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 12], // font size
    }),
  };

  return (
    <View
      className="mt-5 bg-white border-2 pt-2 pb-1 px-4 pl-12 rounded-md"
      style={
        isFocused
          ? { borderColor: "#60BB46", ...styles.shadow }
          : { borderColor: "#ebeaeb" }
      }
    >
      <View className="absolute justify-self-center top-2.5 left-3">
        <Icon name={props?.iconName} type="ionicon" color="#60BB46" size={25} />
      </View>
      <View className="relative">
        <Animated.Text
          style={labelStyle}
          className="-mt-.5 absolute text-gray-400 font-semibold"
        >
          {props?.placeholder}
        </Animated.Text>
        <TextInput
          className="mt-2 text-md font-bold text-gray-700"
          value={props.value}
          onChangeText={props.onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={props?.isMultiline || false}
          secureTextEntry={props?.isPassword || false}
          ref={props.textInputRef}
          onKeyPress={props.onKeyPress}
          keyboardType={props.keyboardType}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#60BB46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
});
export default TextInputField;
