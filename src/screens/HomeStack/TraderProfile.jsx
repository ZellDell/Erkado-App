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
import { useNavigation } from "@react-navigation/native";
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

  const camera = useRef(null);

  isNewUser = useSelector((state) => state.ui.isNewUser);
  userInfo = useSelector((state) => state.user.userInfo);
  const isPreparing = useSelector((state) => state.ui.isPreparing);
  const { crops } = useSelector((state) => state.crop.crops);
  [latitude, longitude] = userInfo.coordinates
    ? userInfo?.coordinates.split(",")
    : [null, null];

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
  const [mapInteraction, setMapInteraction] = useState(false);
  const handleNewUserModal = () => {
    setNewUserModal(!newUserModal);
  };

  useEffect(() => {
    let timeout;

    if (!mapInteraction) {
      timeout = setTimeout(() => {
        camera.current?.setCamera({
          centerCoordinate: [longitude, latitude],
          animationMode: "flyTo",
          animationDuration: 3000,
        });
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [mapInteraction]);

  const handleMapInteraction = (status) => {
    setMapInteraction(status);
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={!mapInteraction}
            scrollEnabled={!mapInteraction}
          >
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
                  <TouchableOpacity>
                    <Text className="text-white font-bold text-lg bg-lime-500 rounded-lg py-2 px-3">
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ maxHeight: 250 }}>
                  <ScrollView className="pr-4" nestedScrollEnabled={true}>
                    {crops.map((crop) => (
                      <View
                        key={crop.CropID}
                        className="flex-row justify-between py-3"
                      >
                        <View className="flex-row">
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
                              {crop.Type} | {crop.Quality}
                            </Text>
                          </View>
                        </View>
                        <View className="items-center">
                          <Text className="text-gray-500 font-medium">
                            Price
                          </Text>
                          <Text className="text-gray-800 font-semibold text-lg">
                            $100
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View className="space-y-3 border-b-2 border-gray-200 pb-5">
                <Text className="text-gray-800 font-bold text-2xl">
                  Location
                </Text>
                <ScrollView nestedScrollEnabled={true} className="flex-1">
                  <View
                    className="mt-5 flex-row w-full rounded-xl overflow-hidden"
                    style={{ height: 200 }}
                  >
                    <Mapbox.MapView
                      zoomEnabled={false}
                      rotateEnabled={false}
                      scaleBarEnabled={false}
                      attributionEnabled={false}
                      style={{ flex: 1 }}
                      styleURL="mapbox://styles/mapbox/outdoors-v12"
                      logoEnabled={false}
                      onLongPress={() => handleMapInteraction(true)}
                      onMapIdle={() => {
                        handleMapInteraction(false);
                      }}
                    >
                      <Mapbox.Camera
                        ref={camera}
                        zoomLevel={15}
                        centerCoordinate={
                          userInfo.coordinates
                            ? [longitude, latitude]
                            : [125.809425, 7.448212]
                        }
                      />
                      {userInfo.coordinates && (
                        <Mapbox.PointAnnotation
                          id="marker"
                          coordinate={[longitude, latitude]}
                        >
                          <View
                            className="rounded-full p-0.5 border-2 border-white "
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
                </ScrollView>
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
