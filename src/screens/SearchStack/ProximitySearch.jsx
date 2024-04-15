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

import { useNavigation, useRoute } from "@react-navigation/native";

import COLORS from "../../constant/colors";

import Mapbox, { CircleLayer, Callout, ShapeSource } from "@rnmapbox/maps";

import { Icon } from "@rneui/base";

import { useSharedValue } from "react-native-reanimated";
import { HapticModeEnum, Slider } from "react-native-awesome-slider";
import { queryTraderInRadius } from "../../features/trader-actions";

import ProximitySearchResult from "../../components/SearchComponents/ProximitySearchResult";
import PLACEHOLDER from "../../constant/profile";

function ProximitySearch() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(5);

  const route = useRoute();

  const userInfo = useSelector((state) => state.user.userInfo);

  const camera = useRef(null);
  const deviceHeight = Dimensions.get("window").height;

  const [hadSearch, setHadSearch] = useState(false);

  const [mapRendering, setMapRendering] = useState(true);

  const [isMapChanged, setIsMapChanged] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [radius, setRadius] = useState(12);
  const [KM, setKM] = useState(0);
  let zoomLvl = 12;
  let kiloMeters = 0;
  let circleRadius = 0;

  const bottomSheetRef = useRef(null);

  const handleBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleZoomLevel = (value) => {
    if (value < 0.5) {
      zoomLvl = 15;
    } else if (value < 1) {
      zoomLvl = 14;
    } else if (value < 2) {
      zoomLvl = 13;
    } else if (value < 4) {
      zoomLvl = 12;
    } else if (value < 6) {
      zoomLvl = 11.5;
    }

    setZoomLevel(zoomLvl);
  };

  const handleRadiusChange = (value) => {
    kiloMeters = value;
    setKM(kiloMeters.toFixed(2));
    try {
      calculateRadius(value);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateRadius = (value) => {
    // Calculate the radius based on the progress value
    const desiredRadius = value * 1000; // Convert from km to meters
    const tilePixelSize = 512;
    const worldCircumference = 40075016.686;
    const radiusInPixels =
      (desiredRadius * tilePixelSize * Math.pow(2, zoomLvl)) /
      worldCircumference;

    circleRadius = radiusInPixels;
    setRadius(circleRadius);
  };

  const reOrientMap = (restart) => {
    if (restart === "restart") {
      camera.current?.setCamera({
        centerCoordinate: [
          parseFloat(userInfo.coordinates.split(",")[1]),
          parseFloat(userInfo.coordinates.split(",")[0]),
        ],
        zoomLevel: zoomLevel,
        animationMode: "flyTo",
        animationDuration: 3000,
        heading: 0,
      });
      return;
    }

    let timeout = setTimeout(
      () => {
        console.log("Map is Idled");

        camera.current?.setCamera({
          centerCoordinate: [
            parseFloat(userInfo.coordinates.split(",")[1]),
            parseFloat(userInfo.coordinates.split(",")[0]),
          ],
          zoomLevel: zoomLevel,
          animationMode: "flyTo",
          animationDuration: 3000,
          heading: 0,
        });
        setIsMapChanged(false);
      },

      3000
    );
  };

  const [result, setResult] = useState([]);
  const [isload, setIsLoad] = useState(false);
  handleFind = async () => {
    setIsLoad(true);
    setHadSearch(true);
    userLat = parseFloat(userInfo.coordinates.split(",")[0]);
    userLong = parseFloat(userInfo.coordinates.split(",")[1]);
    try {
      const response = await dispatch(
        queryTraderInRadius(userLat, userLong, KM)
      );

      setResult(response?.data);
      bottomSheetRef.current?.snapToIndex(0);
    } catch (error) {
      console.log(
        "Error fetching data, ",
        error.message ? error?.message : error.response
      );
    } finally {
      setIsLoad(false);
    }
  };

  const circleShape = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(userInfo.coordinates.split(",")[1]),
            parseFloat(userInfo.coordinates.split(",")[0]),
          ],
        },
      },
    ],
  };

  const RestartRadiusSearch = () => {
    bottomSheetRef.current?.close();
    setZoomLevel(12);
    setRadius(12);
    setKM(0);
    setResult([]);
    reOrientMap("restart");
    progress.value = 0;
    setHadSearch(false);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <>
        <View className="flex-1">
          <View
            className="flex-1 flex-row relative "
            style={{ height: deviceHeight * 0.7 }}
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
              zoomEnabled={true}
              style={{ flex: 1 }}
              styleURL="mapbox://styles/mapbox/outdoors-v12"
              logoEnabled={false}
              onTouchMove={() => {
                setIsMapChanged(true);
              }}
              onMapIdle={() => {
                if (isMapChanged) {
                  reOrientMap();
                }
              }}
              onDidFinishLoadingMap={() => {
                setMapRendering(false);
              }}
            >
              <Mapbox.Camera
                ref={camera}
                zoomLevel={zoomLevel}
                centerCoordinate={
                  userInfo.coordinates
                    ? [
                        parseFloat(userInfo.coordinates.split(",")[1]),
                        parseFloat(userInfo.coordinates.split(",")[0]),
                      ]
                    : [125.80936, 7.44721]
                }
              />
              <ShapeSource id="radius1" shape={circleShape}>
                <CircleLayer
                  id="circleLayer"
                  style={{
                    circleColor: COLORS.primary,
                    circleOpacity: 0.5,
                    circleStrokeWidth: 2,
                    circleStrokeColor: COLORS.primary,
                    circleStrokeOpacity: 0.8,
                    circleRadius:
                      result && isMapChanged ? 0 : isMapChanged ? 0 : radius,
                  }}
                  circleRadiusTransition={[0, 0]}
                />
              </ShapeSource>

              <Mapbox.PointAnnotation
                id="UserPoint"
                key="UserPoint"
                ref={(ref) => (this.markerRef = ref)}
                coordinate={[
                  parseFloat(userInfo.coordinates.split(",")[1]),
                  parseFloat(userInfo.coordinates.split(",")[0]),
                ]}
              >
                <View className="rounded-full p-0.5 bg-white border-2 border-lime-400 relative">
                  <Image
                    source={
                      userInfo.profileImg
                        ? { uri: userInfo.profileImg }
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

              {result &&
                result.map((trader, index) => {
                  const traderCoords = trader.Address.split("|")[1];

                  return (
                    <Mapbox.PointAnnotation
                      id={"traderID" + index}
                      key={"traderKey" + index}
                      coordinate={[
                        parseFloat(traderCoords.split(",")[1]),
                        parseFloat(traderCoords.split(",")[0]),
                      ]}
                      selected={false}
                    >
                      <View className="rounded-full p-0.5 bg-white border-2 border-orange-400 relative">
                        <Image
                          source={
                            trader.profileImg
                              ? { uri: trader.profileImg }
                              : { uri: PLACEHOLDER.trader }
                          }
                          style={{ width: 20, height: 20 }}
                          resizeMode="cover"
                          className=" rounded-full"
                        />
                      </View>
                      <Callout title={trader.Fullname} />
                    </Mapbox.PointAnnotation>
                  );
                })}
            </Mapbox.MapView>

            {/* Radius Control & Results 1/4 */}
          </View>
          <ProximitySearchResult
            result={result}
            bottomSheetRef={bottomSheetRef}
          />
          {/* Radius Control 1/4 */}
          {result?.length < 1 && (
            <View
              className="flex-2 bg-white rounded-t-3xl z-10 -top-5 px-10 pt-8 space-y-3"
              style={{ height: deviceHeight * 0.3 }}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-800 text-xl font-bold">
                    Proximity Search
                  </Text>
                  <Text className="text-gray-600 text-xs font-semibold">
                    Set Radius
                  </Text>
                </View>
                <Text
                  className="text-lg font-bold"
                  style={{ color: COLORS.primary }}
                >
                  {KM} KM
                </Text>
              </View>
              <View className="flex-1  border-b-2 border-gray-300 mb-3">
                <Slider
                  progress={progress}
                  style={styles.slider}
                  minimumValue={min}
                  maximumValue={max}
                  hapticMode={HapticModeEnum.BOTH}
                  theme={{
                    maximumTrackTintColor: "#dedede",
                    minimumTrackTintColor: COLORS.primary,

                    bubbleBackgroundColor: COLORS.primary,
                  }}
                  thumbWidth={20}
                  bubble={(value) => value.toFixed(2) + " km"}
                  onValueChange={(value) => {
                    handleZoomLevel(value);
                  }}
                  onSlidingComplete={handleRadiusChange}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={!mapRendering ? handleFind : () => {}}
                style={{ backgroundColor: COLORS.primary }}
                className="flex-2 py-2 rounded-xl"
                disabled={isload}
              >
                {isload ? (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                    className="self-center"
                  />
                ) : (
                  <Text className="text-white text-base font-bold self-center">
                    Find
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {hadSearch && (
            <View
              className="absolute bottom-0 bg-white p-5 w-full border-t-2 border-lime-500"
              style={styles.shadow}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={!mapRendering ? RestartRadiusSearch : () => {}}
                style={{ backgroundColor: COLORS.primary }}
                className="flex-2 py-2 rounded-lg "
              >
                <Text className="text-white text-base font-semibold self-center">
                  Use Proximity Search Again
                </Text>
              </TouchableOpacity>
            </View>
          )}
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

export default ProximitySearch;
