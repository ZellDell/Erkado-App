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
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../features/auth-actions";
import { useNavigation } from "@react-navigation/native";
import { requestUserInfo } from "../../features/user-actions";
import COLORS from "../../constant/colors";
import Farmerplaceholder from "../../../assets/profile/Default Farmer.png";
import Traderplaceholder from "../../../assets/profile/Default Trader.png";
import ErkadoPlaceholder from "../../../assets/Erkado-logo.png";
import ErkadoTextPlaceholder from "../../../assets/Erkado Text Fill.png";

import PreparingScreen from "../PreparingScreen";

import Modal from "react-native-modal";
import NewUserGreetingsModal from "../../components/HomeComponents/NewUserGreetingsModal";
import { Icon } from "@rneui/base";
import Toast from "react-native-toast-message";

function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [newUserModal, setNewUserModal] = useState(false);

  const isNewUser = useSelector((state) => state.ui.isNewUser);
  const isFarmer = useSelector((state) => state.ui.isFarmer);
  const isPreparing = useSelector((state) => state.ui.isPreparing);

  const userInfo = useSelector((state) => state.user.userInfo);
  const { crops } = useSelector((state) => state.crop.crops);

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

  const handleNewUserModal = () => {
    setNewUserModal(!newUserModal);
  };

  return (
    <>
      <SafeAreaView className="bg-gray-50 pt-5 flex-1">
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
            <View className="flex-1  py-14 px-8 space-y-6">
              {/* Header & User Info */}
              {userInfo.userId ? (
                <View
                  className="flex p-4 bg-white rounded-lg space-y-5 "
                  style={styles.box}
                >
                  <View className="flex-row  items-center justify-between ">
                    <View className="flex-row space-x-2 items-center">
                      <Image
                        source={
                          userInfo.profileImg
                            ? { uri: userInfo.profileImg }
                            : isFarmer
                            ? Farmerplaceholder
                            : Traderplaceholder
                        }
                        style={{ width: 50, height: 50 }}
                        resizeMode="cover"
                        className="rounded-full "
                      />
                      <View>
                        <Text className="text-xl font-bold text-gray-800">
                          {userInfo.fullname}
                        </Text>
                        <Text className="text-md font-bold text-lime-600">
                          {userInfo.userType}
                        </Text>
                      </View>
                    </View>
                    {/* <TouchableOpacity>
      <Icon
        name="notifications"
        type="ionicon"
        color={COLORS.primary}
        size={30}
      />
    </TouchableOpacity> */}

                    {/* Data */}
                  </View>
                  <View className="flex-row justify-between">
                    <View
                      className="bg-gray-50 px-3 py-2 w-5/12 rounded-lg"
                      style={{ width: "45%" }}
                    >
                      <Text className="font-bold text-md">Crops</Text>
                      <Text
                        className="font-bold text-lg"
                        style={{ color: COLORS.primary }}
                      >
                        {crops.length}
                      </Text>
                    </View>
                    <View
                      className="bg-gray-50 px-3 py-2 rounded-lg"
                      style={{ width: "45%" }}
                    >
                      <Text className="font-bold text-md">Transactions</Text>
                      <Text
                        className="font-bold text-lg"
                        style={{ color: COLORS.primary }}
                      >
                        0
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="items-center space-y-2">
                  <Image
                    source={ErkadoPlaceholder}
                    style={{ width: 80, height: 80 }}
                    resizeMode="contain"
                  />
                  <Image
                    source={ErkadoTextPlaceholder}
                    style={{ width: 150, height: 60 }}
                    resizeMode="contain"
                  />
                </View>
              )}

              {/* Crop Categories */}
              <View className="space-y-3">
                <Text className="font-bold text-xl">Categories</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="space-x-3"
                >
                  {crops.map((crop) => (
                    <TouchableOpacity
                      key={crop.CropID}
                      className="flex bg-white items-center rounded-full py-2 px-4 border-2"
                      style={{ borderColor: COLORS.primary }}
                      onPress={() => {}}
                    >
                      <Image
                        source={{ uri: crop.Uri }}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                        className="m-1"
                      />
                      <Text className="font-medium text-xs">
                        {crop.CropName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Traders */}
              <View className="space-y-3">
                <Text className="font-bold text-xl">Recent</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="space-x-3"
                >
                  <View>
                    <Text>You have no transactions yet.</Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    </>
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

export default HomeScreen;
