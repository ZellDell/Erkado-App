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
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../features/auth-actions";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

function TraderProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [newUserModal, setNewUserModal] = useState(false);
  const [mapRendering, setMapRendering] = useState(true);

  const camera = useRef(null);

  const { quality } = useSelector((state) => state.crop.quality);

  isNewUser = useSelector((state) => state.ui.isNewUser);
  UserInfo = useSelector((state) => state.user.userInfo);
  const isPreparing = useSelector((state) => state.ui.isPreparing);
  const { crops } = useSelector((state) => state.crop.crops);

  const [userInfo, setUserInfo] = useState(UserInfo);

  useEffect(() => {
    const requestuserinfo = async () => {
      const result = await dispatch(requestUserInfo());
      if (isNewUser) {
        setNewUserModal(true);
      }
      if (result?.success) {
        Toast.show({
          type: "SuccessNotif",
          props: { header: "Welcome Back!" },
          text1: result?.Username,
          visibilityTime: 5000,
          swipeable: true,
        });
      }
    };
    requestuserinfo();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(requestUserInfo());
      console.log("Requesting Again..");
      setUserInfo(UserInfo);
    }, [])
  );

  const handleNewUserModal = () => {
    setNewUserModal(!newUserModal);
  };

  const deviceWidth = Dimensions.get("window").width;
  return (
    <SafeAreaView className="bg-gray-50 flex-1 pb-20">
      {isPreparing ? (
        <PreparingScreen isPreparing={isPreparing} />
      ) : (
        isNewUser && (
          <NewUserGreetingsModal
            newUserModal={newUserModal}
            handleNewUserModal={handleNewUserModal}
          />
        )
      )}

      {userInfo.userId && (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row ">
              <Image
                source={Traderplaceholder}
                style={{ height: deviceWidth, width: deviceWidth }}
              />
            </View>
            <View className="flex-1 bg-white rounded-t-3xl z-10 -top-4 px-10 py-8 space-y-2">
              <View className=" py-3">
                <Text className="font-bold text-3xl text-gray-800">
                  {userInfo.fullname}
                </Text>
              </View>

              <View className="flex-row space-x-2 border-b-2 border-gray-200 pb-5">
                <View className="flex-row">
                  <Icon name="star-outline" size={20} color={COLORS.primary} />
                  <Icon name="star-outline" size={20} color={COLORS.primary} />
                  <Icon name="star-outline" size={20} color={COLORS.primary} />
                  <Icon name="star-outline" size={20} color={COLORS.primary} />
                  <Icon name="star-outline" size={20} color={COLORS.primary} />
                </View>
                <Text className="text-gray-400 font-medium">
                  0 (0 Transactions)
                </Text>
              </View>

              <View className="space-y-3 border-b-2 border-gray-200 pb-5 mb-5">
                <View className="flex-row justify-between my-2 items-center">
                  <Text className="text-gray-800 font-bold text-2xl">
                    Your Crops
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    className="bg-lime-500 rounded-lg py-2 px-3"
                    onPress={() => {
                      navigation.navigate("EditCropsInProfile", {
                        purchasingDetails: userInfo.purchasingDetails,
                      });
                    }}
                  >
                    <Text className="text-white font-bold text-lg ">Edit</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ maxHeight: 250 }}>
                  <ScrollView className="pr-4" nestedScrollEnabled={true}>
                    {userInfo.purchasingDetails &&
                      userInfo.purchasingDetails.map((purchasecrops) => {
                        const crop = crops.find(
                          (crop) => crop.CropID === purchasecrops.CropID
                        );

                        const qualityType = quality.find(
                          (quali) =>
                            quali.QualityTypeID == purchasecrops.QualityTypeID
                        );

                        return (
                          <View
                            key={purchasecrops.PurchasingDetailID}
                            className="flex-row justify-between py-3"
                          >
                            <View className="flex-row space-x-2">
                              <Image
                                source={{ uri: crop.Uri }}
                                style={{ width: 30, height: 30 }}
                                resizeMode="contain"
                                className="m-1"
                              />
                              <View>
                                <Text className="text-gray-800 font-semibold text-lg">
                                  {crop.CropName}
                                </Text>
                                <Text className="text-gray-500 font-medium">
                                  {purchasecrops.CropType} |{" "}
                                  {qualityType.QualityType}
                                </Text>
                              </View>
                            </View>
                            <View className="items-center">
                              <Text className="text-gray-500 font-medium">
                                Price
                              </Text>
                              <Text className="text-gray-800 font-semibold text-lg">
                                ₱ {purchasecrops.PricePerUnit}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                  </ScrollView>
                </View>
              </View>

              <View className="space-y-3 border-b-2 border-gray-200 pb-5 px-2">
                <Text className="text-gray-800 font-bold text-2xl">
                  Address
                </Text>
                <View className="flex-row space-x-2 ">
                  <Icon
                    type="ionicon"
                    name="location"
                    color={COLORS.primary}
                    size={40}
                  />
                  <Text className="text-justify text-gray-500 text-lg font-medium">
                    {userInfo.address}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.27,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default TraderProfile;
