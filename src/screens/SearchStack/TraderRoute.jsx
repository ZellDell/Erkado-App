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
import { useNavigation, useRoute } from "@react-navigation/native";
import { requestUserInfo } from "../../features/user-actions";
import COLORS from "../../constant/colors";

import Traderplaceholder from "../../../assets/profile/Default Trader.png";
import Farmerplaceholder from "../../../assets/profile/Default Farmer.png";

import ErkadoPlaceholder from "../../../assets/Erkado-logo.png";
import ErkadoTextPlaceholder from "../../../assets/Erkado Text Fill.png";

import Mapbox, { ShapeSource, LineLayer, Callout } from "@rnmapbox/maps";

import Modal from "react-native-modal";
import NewUserGreetingsModal from "../../components/HomeComponents/NewUserGreetingsModal";
import { Icon } from "@rneui/base";
import Toast from "react-native-toast-message";
import PreparingScreen from "../PreparingScreen";
import getRoute from "../../utils/getRoute";

function TraderRoute() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const route = useRoute();

  const userInfo = useSelector((state) => state.user.userInfo);
  const [traderRouteDetails, setTraderRouteDetails] = useState({
    Trader: route.params?.Trader,
    Address: route.params?.Address,
    Coordinates: route.params?.Coordinates,
  });

  isNewUser = useSelector((state) => state.ui.isNewUser);

  const camera = useRef(null);
  const deviceHeight = Dimensions.get("window").height;

  const [mapRendering, setMapRendering] = useState(true);

  const useGetRoute = getRoute({
    startingCoords: [
      parseFloat(userInfo.coordinates.split(",")[1]),
      parseFloat(userInfo.coordinates.split(",")[0]),
    ],
    endingCoords: [
      parseFloat(traderRouteDetails.Coordinates.longitude),
      parseFloat(traderRouteDetails.Coordinates.latitude),
    ],
  });

  const [isMapChanged, setIsMapChanged] = useState(false);

  const reOrientMap = () => {
    let timeout = setTimeout(
      () => {
        console.log("Map is Idled");

        camera.current?.setCamera({
          centerCoordinate: [
            useGetRoute.coordinates[1],
            useGetRoute.coordinates[0],
          ],
          zoomLevel: useGetRoute.zoomLvl ? useGetRoute.zoomLvl : 13,
          animationMode: "flyTo",
          animationDuration: 3000,
          heading: 0,
        });
      },

      4000
    );
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <>
        <View className="flex-1">
          <View
            className="flex-1 flex-row relative "
            style={{ height: deviceHeight * 0.75 }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}
              className="p-2 absolute top-10 left-5 bg-white rounded-full z-20 "
              style={styles.shadow}
            >
              <Icon name="arrow-back" size={30} color={COLORS.primary} />
            </TouchableOpacity>

            {mapRendering && (
              <View className="flex-1 absolute bg-gray-200 z-10 w-full h-full justify-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}
            <Mapbox.MapView
              scaleBarEnabled={false}
              attributionEnabled={false}
              style={{ flex: 1 }}
              styleURL="mapbox://styles/mapbox/outdoors-v12"
              logoEnabled={false}
              onTouchMove={() => {
                setIsMapChanged(true);
              }}
              onMapIdle={() => {
                if (isMapChanged) {
                  reOrientMap();
                  setIsMapChanged(false);
                }
              }}
              onDidFinishLoadingMap={() => {
                setMapRendering(false);
              }}
            >
              <Mapbox.Camera
                ref={camera}
                zoomLevel={useGetRoute.zoomLvl ? useGetRoute.zoomLvl : 13}
                centerCoordinate={
                  useGetRoute.coordinates
                    ? [useGetRoute.coordinates[1], useGetRoute.coordinates[0]]
                    : [125.80936, 7.44721]
                }
              />
              {useGetRoute.routeDirections && (
                <>
                  <ShapeSource id="line1" shape={useGetRoute.routeDirections}>
                    <LineLayer
                      id="routerLine1"
                      style={{
                        lineColor: COLORS.primary,
                        lineWidth: 6,
                        lineCap: "round",
                        lineJoin: "round",
                        lineGapWidth: 0,
                        lineBlur: 0,
                      }}
                    />
                  </ShapeSource>

                  {/* My Marker */}

                  <Mapbox.PointAnnotation
                    id="UserPoint"
                    key="UserPoint"
                    coordinate={[
                      parseFloat(userInfo.coordinates.split(",")[1]),
                      parseFloat(userInfo.coordinates.split(",")[0]),
                    ]}
                  >
                    <View className="rounded-full p-0.5 bg-white border-2 border-lime-400">
                      <Image
                        source={
                          userInfo.profileImg
                            ? { uri: userInfo.profileImg }
                            : Farmerplaceholder
                        }
                        style={{ width: 20, height: 20 }}
                        resizeMode="cover"
                        className=" rounded-full"
                      />
                    </View>
                    <Callout title="You" />
                  </Mapbox.PointAnnotation>

                  {/* Target Marker */}
                  <Mapbox.PointAnnotation
                    id="TraderPoint"
                    key="TraderPoint"
                    coordinate={[
                      parseFloat(traderRouteDetails.Coordinates.longitude),
                      parseFloat(traderRouteDetails.Coordinates.latitude),
                    ]}
                  >
                    <View className="rounded-full p-0.5 bg-white border-2 border-orange-400">
                      <Image
                        source={
                          traderRouteDetails.Trader.profileImg
                            ? { uri: traderRouteDetails.Trader.profileImg }
                            : Traderplaceholder
                        }
                        style={{ width: 20, height: 20 }}
                        resizeMode="cover"
                        className=" rounded-full"
                      />
                    </View>
                    <Callout title={traderRouteDetails.Trader.Fullname} />
                  </Mapbox.PointAnnotation>
                </>
              )}
            </Mapbox.MapView>

            {/* Map View 3/4 */}
          </View>
          <View
            className="flex-2 bg-white rounded-t-3xl z-10 -top-5 px-10 py-8 space-y-3"
            style={{ height: deviceHeight * 0.25 }}
          >
            <View className="flex-row py-3 space-x-2 border-b-2 border-gray-300">
              <Image
                source={
                  traderRouteDetails.Trader.profileImg
                    ? { uri: traderRouteDetails.Trader.profileImg }
                    : Traderplaceholder
                }
                style={{ width: 55, height: 55 }}
                resizeMode="cover"
                className=" rounded-full"
              />
              <View>
                <Text className="font-bold text-2xl text-gray-800">
                  {traderRouteDetails.Trader.Fullname}
                </Text>
                <Text className="font-bold text-lg pl-1 text-gray-500">
                  {traderRouteDetails.Trader.TraderType}
                </Text>
              </View>
            </View>

            <View className="flex-row py-3 space-x-2 pr-3">
              <Icon
                type="ionicon"
                name="location"
                size={30}
                color={COLORS.primary}
              />
              <Text className="font-semibold text-lg text-gray-500">
                {traderRouteDetails.Address}
              </Text>
            </View>
          </View>
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

export default TraderRoute;
