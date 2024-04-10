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
  Dimensions,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../features/auth-actions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { requestUserInfo } from "../../features/user-actions";
import COLORS from "../../constant/colors";

import Traderplaceholder from "../../../assets/profile/Default Trader.png";
import ErkadoPlaceholder from "../../../assets/Erkado-logo.png";
import ErkadoTextPlaceholder from "../../../assets/Erkado Text Fill.png";
import Mapbox from "@rnmapbox/maps";
import Modal from "react-native-modal";
import NewUserGreetingsModal from "../../components/HomeComponents/NewUserGreetingsModal";
import { Icon } from "@rneui/base";
import Toast from "react-native-toast-message";
import PreparingScreen from "../PreparingScreen";

function TraderView() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [newUserModal, setNewUserModal] = useState(false);
  const route = useRoute();
  const camera = useRef(null);
  const [traderDetails, setTraderDetails] = useState(
    route.params?.TraderDetails
  );
  const traderLocation = {
    textAddress: traderDetails.Address.split("|")[0],
    coordinates: {
      latitude: parseFloat(traderDetails.Address.split("|")[1].split(",")[0]),
      longitude: parseFloat(traderDetails.Address.split("|")[1].split(",")[1]),
    },
  };

  useEffect(() => {
    console.log(traderDetails);
  }, []);

  isNewUser = useSelector((state) => state.ui.isNewUser);
  userInfo = useSelector((state) => state.user.userInfo);
  const isPreparing = useSelector((state) => state.ui.isPreparing);
  const { crops } = useSelector((state) => state.crop.crops);
  const { quality } = useSelector((state) => state.crop.quality);
  const deviceWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView className="bg-gray-50 flex-1 pb-16">
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View className="flex-row relative">
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}
              className="p-2 absolute top-10 left-5 bg-white rounded-full z-10 "
              style={styles.shadow}
            >
              <Icon name="arrow-back" size={30} color={COLORS.primary} />
            </TouchableOpacity>
            <Image
              source={
                traderDetails.ProfileImg
                  ? { uri: traderDetails.ProfileImg }
                  : Traderplaceholder
              }
              style={{ height: deviceWidth, width: deviceWidth }}
            />
          </View>
          <View className="flex-1 bg-zinc-50 rounded-t-3xl z-10 -top-4 px-10 py-8 space-y-2">
            <View className=" py-3">
              <Text className="font-bold text-3xl text-gray-800">
                {traderDetails.Fullname}
              </Text>
            </View>

            <View className="flex-row space-x-2 border-b-2 border-gray-200 pb-5">
              <View className="flex-row">
                <Icon
                  type="ionicon"
                  name="star-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Icon
                  type="ionicon"
                  name="star-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Icon
                  type="ionicon"
                  name="star-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Icon
                  type="ionicon"
                  name="star-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Icon
                  type="ionicon"
                  name="star-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text className="text-gray-400 font-medium">
                0 (0 Transactions)
              </Text>
            </View>

            <View className="space-y-3 border-b-2 border-gray-200 pb-5 mb-5">
              <Text className="text-gray-800 font-bold text-2xl mt-2">
                Hey, I'm Looking for
              </Text>

              <View style={{ maxHeight: deviceWidth * 0.7 }}>
                <ScrollView className="pr-4" nestedScrollEnabled={true}>
                  {traderDetails.purchasingDetails.map((traderCrop) => {
                    const associatedCrop = crops.find(
                      (crop) => crop.CropID === traderCrop.CropID
                    );

                    const qualityType = quality.find(
                      (quali) => quali.QualityTypeID == traderCrop.QualityTypeID
                    );
                    if (!associatedCrop) return null;
                    return (
                      <View
                        key={
                          associatedCrop.CropID +
                          "-" +
                          traderCrop.QualityTypeID +
                          "-" +
                          traderCrop.CropType +
                          "-" +
                          traderCrop.PricePerUnit
                        }
                        className="flex-row justify-between py-3"
                      >
                        <View className="flex-row space-x-2">
                          <Image
                            source={{ uri: associatedCrop.Uri }}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                            className="m-1"
                          />
                          <View>
                            <Text className="text-gray-800 font-bold text-lg">
                              {associatedCrop.CropName}
                            </Text>
                            <Text className="text-gray-500 font-medium">
                              {traderCrop.CropType} | {qualityType.QualityType}
                            </Text>
                          </View>
                        </View>
                        <View className="items-center">
                          <Text className="text-gray-500 font-medium text-xs">
                            Price per Sack
                          </Text>
                          <Text className="text-gray-800 font-semibold text-lg">
                            ₱ {traderCrop.PricePerUnit.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            <View className="space-y-3 border-b-2 border-gray-200 pb-5">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate("ConversationScreen", {
                    InfoDetails: traderDetails,
                  });
                }}
                className="py-2 rounded-md flex-row justify-center space-x-2 bg-orange-400"
              >
                <Icon
                  type="ionicon"
                  name="chatbubbles"
                  size={23}
                  color="#FFFFFF"
                />
                <Text className="text-lg self-center text-white font-bold">
                  Send Message
                </Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-3 border-b-2 border-gray-200 pb-5">
              <Text className="text-gray-800 font-bold text-2xl">Location</Text>
              <View className="mt-5 space-x-3 flex-row w-full rounded-xl ">
                <Icon
                  type="ionicon"
                  name="location"
                  size={30}
                  color={COLORS.primary}
                />
                <Text className="font-semibold text-lg text-gray-600">
                  {traderLocation.textAddress}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate("TraderRoute", {
                    Trader: {
                      Fullname: traderDetails.Fullname,
                      TraderType: traderDetails.TraderType,
                      ProfileImg: traderDetails.ProfileImg,
                    },
                    Address: traderLocation.textAddress,
                    Coordinates: traderLocation.coordinates,
                  });
                }}
                className="py-2 rounded-md flex-row justify-center space-x-2 bg-orange-400"
              >
                <Icon type="ionicon" name="locate" size={23} color="#FFFFFF" />
                <Text className="text-lg self-center text-white font-bold">
                  Locate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View className="p-4 absolute bottom-0 w-full " style={styles.shadow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (traderDetails.purchasingDetails.length === 0) {
                Toast.show({
                  type: "WarningNotif",
                  text1: "This Trader isn't looking for a crop",
                  visibilityTime: 3000,
                  swipeable: true,
                });
                return;
              }
              navigation.navigate("OfferTransaction", {
                InfoDetails: traderDetails,
              });
            }}
            className="py-4 rounded-md"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Text className="text-lg self-center text-white font-bold">
              Send Crop Offer
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    elevation: 25,
    backgroundColor: "white",
  },
});

export default TraderView;
