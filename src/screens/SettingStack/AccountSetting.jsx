import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@rneui/base";
import { Logout } from "../../features/auth-actions";
import PLACEHOLDER from "../../constant/profile";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import usePlacesAutoComplete from "../../utils/usePlacesAutoComplete";
import COLORS from "../../constant/colors";

function AccountSetting() {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);
  isFarmer = useSelector((state) => state.ui.isFarmer);

  const placesAutocomplete = usePlacesAutoComplete(
    "",
    "pk.eyJ1IjoiemVsbGRlbGwiLCJhIjoiY2x0d3hjdG91MDBheTJqczdqcHRjdWhpZSJ9.UyWdrUlPhJlQN-XE_JoP6Q",
    "PH"
  );

  return (
    <SafeAreaView className="bg-gray-100 px-10 py-5 flex-1 ">
      <ScrollView className="flex-1">
        <View className="flex-1  py-3 space-x-4 border-b-2 border-gray-200 items-center justify-center">
          <TouchableOpacity activeOpacity={0.8} className="relative">
            <Image
              source={
                userInfo.profileImg
                  ? { uri: userInfo.profileImg }
                  : isFarmer
                  ? { uri: PLACEHOLDER.farmer }
                  : { uri: PLACEHOLDER.trader }
              }
              style={{ width: 130, height: 130 }}
              resizeMode="cover"
              className=" rounded-full"
            />
            <View className="absolute bottom-0 -right-2 p-2 rounded-full bg-gray-700">
              <Icon name="camera" type="ionicon" size={30} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>
        {/* FIELDS */}

        <View className="flex-1 bg-yellow-100 py-3 space-x-4 ">
          <View className="flex-1 bg-green-100 space-y-1 justify-center py-2">
            <Text className="font-bold text-sm">Fullname:</Text>
            <View className="flex-1 bg-blue-100 flex-row space-x-2">
              <View className="bg-green-500 p-2 rounded-l-lg">
                <Icon name="person" type="ionicon" size={20} color="#ffffff" />
              </View>
              <TextInput className="flex-1" />
              <View className="bg-gray-500 ml-2 p-2 rounded-lg">
                <Icon
                  name="color-wand"
                  type="ionicon"
                  size={20}
                  color="#ffffff"
                />
              </View>
            </View>
          </View>

          <View className="flex-1 space-y-1 ">
            <Text>Label:</Text>
            <View className="flex-1 bg-blue-100 flex-row space-x-2">
              <Icon name="camera" type="ionicon" size={30} color="#ffffff" />
              <TextInput
                onChangeText={(inputText) => {
                  placesAutocomplete.onChangeText(inputText);
                  //   props.handleChangeAddress(inputText);
                }}
              />

              <Icon name="camera" type="ionicon" size={30} color="#ffffff" />
            </View>
            {placesAutocomplete.suggestions?.length > 0 &&
              placesAutocomplete.value && (
                <PlaceSuggestionList {...{ placesAutocomplete, props }} />
              )}
          </View>

          <View className="flex-1 space-y-1 ">
            <TouchableOpacity
              className="rounded-lg  py-3 "
              style={{ backgroundColor: COLORS.primary }}
              //   onPress={props.getLocation}
              //   disabled={props?.isGettingLocation}
            >
              {/* {props?.isGettingLocation ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  className="self-center"
                />
              ) : (
                <Text className="text-white text-lg self-center">
                  Use my location
                </Text>
              )} */}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountSetting;

const PlaceSuggestionList = ({ placesAutocomplete, props }) => {
  return (
    <View
      className="w-full absolute top-16 mt-2 border-2"
      style={{ zIndex: 1, borderColor: COLORS.primary }}
    >
      {placesAutocomplete.suggestions.map((suggestion, index) => {
        return (
          <TouchableOpacity
            className="p-2 bg-white border-b-2 border-gray-200 "
            key={index}
            onPress={() => {
              placesAutocomplete.setSuggestions([]);
              //   props.getLocation("query", suggestion?.center);
              //   props.handleChangeAddress(suggestion.place_name);
              // onPlaceSelect && onPlaceSelect(suggestion);
            }}
          >
            <Text className="font-semibold text-gray-600">
              {suggestion.place_name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
