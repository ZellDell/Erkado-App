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
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import COLORS from "../../constant/colors";
import ProgressBar from "react-native-animated-progress";
import placeholder from "../../../assets/profile/Default Farmer.png";
import { Icon } from "@rneui/base";
import TextInputField from "../../components/General/TextInputField";
import ImageModal from "./ImageModal";
import Mapbox from "@rnmapbox/maps";
import usePlacesAutocomplete from "../../utils/usePlacesAutoComplete";

function SetupAddress(props) {
  const defaultLocation = { latitude: 7.448212, longitude: 125.809425 };

  const placesAutocomplete = usePlacesAutocomplete(
    "",
    "pk.eyJ1IjoiemVsbGRlbGwiLCJhIjoiY2x0d3hjdG91MDBheTJqczdqcHRjdWhpZSJ9.UyWdrUlPhJlQN-XE_JoP6Q",
    "PH"
  );

  return (
    <View classNam="relative">
      {/* FIELDS */}
      <KeyboardAvoidingView className="space-y-8">
        <TextInputField
          placeholder="Address"
          onChangeText={(inputText) => {
            placesAutocomplete.onChangeText(inputText);
            props.handleChangeAddress(inputText);
          }}
          value={props.address}
          iconName="location"
          textInputRef={props.textInputRef}
          onKeyPress={props.onKeyPress}
        />
        {placesAutocomplete.suggestions?.length > 0 &&
          placesAutocomplete.value && (
            <PlaceSuggestionList {...{ placesAutocomplete, props }} />
          )}
        <TouchableOpacity
          className="rounded-lg  py-3 "
          style={{ backgroundColor: COLORS.primary }}
          onPress={props.getLocation}
          disabled={props?.isGettingLocation}
        >
          {props?.isGettingLocation ? (
            <ActivityIndicator
              size="small"
              color="#ffffff"
              className="self-center"
            />
          ) : (
            <Text className="text-white text-lg self-center">
              Use my location
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
      {/* MAP */}
      <View className="mt-5 flex-row w-full h-2/4 rounded-xl border-4 border-white overflow-hidden -z-10">
        <Mapbox.MapView
          zoomEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          scaleBarEnabled={false}
          attributionEnabled={false}
          style={{ flex: 1, borderRadius: 20 }}
          styleURL="mapbox://styles/mapbox/outdoors-v12"
          logoEnabled={false}
        >
          <Mapbox.Camera
            zoomLevel={props.location ? 15 : 8}
            centerCoordinate={
              props.location
                ? [props.location.longitude, props.location.latitude]
                : [defaultLocation.longitude, defaultLocation.latitude]
            }
            animationMode="flyTo"
            animationDuration={4000}
          />
          {props.location && (
            <Mapbox.PointAnnotation
              id="marker"
              coordinate={[props.location.longitude, props.location.latitude]}
            >
              <View
                className="rounded-full p-1 border-2 border-white "
                style={{ backgroundColor: COLORS.primary }}
              >
                <Icon
                  name="location"
                  type="ionicon"
                  color="#FFFFFF"
                  size={15}
                />
              </View>
            </Mapbox.PointAnnotation>
          )}
        </Mapbox.MapView>
      </View>
    </View>
  );
}

export default SetupAddress;

const PlaceSuggestionList = ({ placesAutocomplete, onPlaceSelect, props }) => {
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
              props.getLocation("query", suggestion?.center);
              props.handleChangeAddress(suggestion.place_name);
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
