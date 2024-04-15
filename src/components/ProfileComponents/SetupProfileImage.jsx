import {
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import React from "react";

import { Icon } from "@rneui/base";
import TextInputField from "../../components/General/TextInputField";
import ImageModal from "./ImageModal";
import { useSelector } from "react-redux";
import PLACEHOLDER from "../../constant/profile";
import { SafeAreaView } from "react-native-safe-area-context";
function SetupProfileImage(props) {
  isFarmer = useSelector((state) => state.ui.isFarmer);

  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  return (
    <View className="flex-1 space-y-2">
      <View className="flex-row justify-center ">
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
          <View
            className="rounded-full shadow-2xl shadow-lime-500"
            style={{
              borderColor: isFarmer ? "#fb923c" : "#a3e635",
            }}
          >
            <Image
              source={
                props.uri
                  ? { uri: props.uri }
                  : isFarmer
                  ? { uri: PLACEHOLDER.farmer }
                  : { uri: PLACEHOLDER.trader }
              }
              style={{ width: deviceWidth * 0.5, height: deviceWidth * 0.5 }}
              resizeMode="cover"
              className=" rounded-full"
            />
          </View>
          <View className="bg-gray-500 p-2 rounded-full absolute -right-1 -bottom-1">
            <Icon name="camera" type="ionicon" color="#FFFFFF" size={30} />
          </View>
        </TouchableOpacity>
      </View>
      {/* FIELDS */}
      <KeyboardAvoidingView className="flex-1">
        <TextInputField
          placeholder="Fullname"
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
