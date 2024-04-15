import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

import COLORS from "../../constant/colors";

import Mapbox, { ShapeSource, LineLayer, Callout } from "@rnmapbox/maps";

import { Icon } from "@rneui/base";

import getRoute from "../../utils/getRoute";
import PLACEHOLDER from "../../constant/profile";

function TraderRoute() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [refresh, setRefresh] = useState(true);

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  const route = useRoute();

  const userInfo = useSelector((state) => state.user.userInfo);

  const [traderRouteDetails, setTraderRouteDetails] = useState({
    Trader: route.params?.Trader,
    Address: route.params?.Address,
    Coordinates: route.params?.Coordinates,
  });

  useFocusEffect(
    React.useCallback(() => {
      toggleRefresh();
    }, [])
  );

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
                    key={refresh ? "UserPoint1" : "UserPoint2"}
                    ref={(ref) => (this.markerRef = ref)}
                    coordinate={[
                      parseFloat(userInfo.coordinates.split(",")[1]),
                      parseFloat(userInfo.coordinates.split(",")[0]),
                    ]}
                  >
                    <View
                      className="rounded-full p-0.5 bg-white border-2 "
                      style={{
                        borderColor:
                          userInfo.userType == "Trader" ? "#fb923c" : "#a3e635",
                      }}
                    >
                      <Image
                        source={
                          userInfo.profileImg != null
                            ? {
                                uri: userInfo.profileImg,
                              }
                            : userInfo.userType == "Trader"
                            ? { uri: PLACEHOLDER.trader }
                            : { uri: PLACEHOLDER.farmer }
                        }
                        style={{ width: 20, height: 20 }}
                        resizeMode="cover"
                        className=" rounded-full"
                        onLoad={() => this.markerRef.refresh()}
                      />
                    </View>
                    <Callout title="You" />
                  </Mapbox.PointAnnotation>

                  {/* Target Marker */}
                  <Mapbox.PointAnnotation
                    id="TraderPoint"
                    key={refresh ? "TraderPoint1" : "TraderPoint2"}
                    ref={(ref) => (this.markerRef2 = ref)}
                    coordinate={[
                      parseFloat(traderRouteDetails.Coordinates.longitude),
                      parseFloat(traderRouteDetails.Coordinates.latitude),
                    ]}
                  >
                    <View
                      className="rounded-full p-0.5 bg-white border-2 "
                      style={{
                        borderColor:
                          userInfo.userType == "Trader" ? "#a3e635" : "#fb923c",
                      }}
                    >
                      <Image
                        source={
                          traderRouteDetails.Trader.profileImg
                            ? {
                                uri: traderRouteDetails.Trader.profileImg,
                              }
                            : userInfo?.userType == "Trader"
                            ? { uri: PLACEHOLDER.farmer }
                            : { uri: PLACEHOLDER.trader }
                        }
                        style={{ width: 20, height: 20 }}
                        resizeMode="cover"
                        className=" rounded-full"
                        onLoad={() => this.markerRef2.refresh()}
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
            <View className="flex-row pb-3 space-x-2 border-b-2 border-gray-300">
              <Image
                key={refresh ? "traderPlaceholder1" : "traderPlaceholder2"}
                source={
                  traderRouteDetails?.Trader.profileImg
                    ? { uri: traderRouteDetails.Trader.profileImg }
                    : userInfo.userType == "Trader"
                    ? { uri: PLACEHOLDER.farmer }
                    : { uri: PLACEHOLDER.trader }
                }
                style={{ width: 45, height: 45 }}
                resizeMode="cover"
                className=" rounded-full"
              />
              <View>
                <Text className="font-bold text-lg text-gray-800">
                  {traderRouteDetails.Trader.Fullname}
                </Text>
                <Text className="font-bold text-xs pl-1 text-gray-500">
                  {traderRouteDetails.Trader.TraderType}
                </Text>
              </View>
            </View>

            <View className="flex-row  space-x-2 pr-3">
              <Icon
                type="ionicon"
                name="location"
                size={30}
                color={COLORS.primary}
              />
              <Text className="font-semibold text-sm text-gray-500">
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
