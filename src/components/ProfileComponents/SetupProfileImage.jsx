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
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import COLORS from "../../constant/colors";
import ProgressBar from "react-native-animated-progress";
import placeholder from "../../../assets/profile/Default Farmer.png";
import { Icon } from "@rneui/base";
import TextInputField from "../../components/General/TextInputField";
import ImageModal from "./ImageModal";
import { useSelector } from "react-redux";
function SetupProfileImage(props) {
  isFarmer = useSelector((state) => state.ui.isFarmer);
  return (
    <View>
      <View className="flex-row justify-center mb-12">
        <ImageModal
          imageModal={props.imageModal}
          handleModal={props.handleModal}
          uploadImage={props.uploadImage}
          removeImage={props.removeImage}
        />
        <TouchableOpacity
          className="p-1 rounded-full mb-3 border-[#60BB46] border-4 relative"
          activeOpacity={0.6}
          onPress={props.handleModal}
        >
          <View className="rounded-full bg-lime-500 shadow-2xl shadow-lime-500">
            <Image
              source={props.uri ? { uri: props.uri } : placeholder}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
              className=" rounded-full"
            />
          </View>
          <View className="bg-gray-500 p-2 rounded-full absolute -right-1 -bottom-1">
            <Icon name="camera" type="ionicon" color="#FFFFFF" size={30} />
          </View>
        </TouchableOpacity>
      </View>
      {/* FIELDS */}
      <KeyboardAvoidingView>
        <TextInputField
          placeholder="Firstname, Middlename, Lastname"
          onChangeText={props.handleChangeFullname}
          value={props.fullname}
          iconName="person-add"
        />

        <TextInputField
          placeholder={isFarmer ? "RSBSA ID Number" : "Trader Type"}
          onChangeText={props.handleChangeExtraInfo}
          value={props.extraInfo}
          iconName={isFarmer ? "key" : "people-circle"}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

export default SetupProfileImage;
