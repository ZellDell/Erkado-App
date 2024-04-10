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
  TouchableHighlight,
} from "react-native";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import COLORS from "../../constant/colors";
import ProgressBar from "react-native-animated-progress";
import Traderplaceholder from "../../../assets/profile/Default Trader.png";
import { Icon } from "@rneui/base";

import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

function ProximitySearchResult({ result, bottomSheetRef }) {
  const snapPoints = useMemo(() => ["35%", "80"], []);
  const navigation = useNavigation();
  const [index, setIndex] = useState(-1);

  return (
    <BottomSheet
      index={-1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      style={{
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
      onChange={(index) => setIndex(index)}
    >
      <View className="flex-1 py-5 px-7 relative space-y-3 pb-28">
        <Icon
          name={index === 1 ? "chevron-down" : "chevron-up"}
          type="ionicon"
          color="#dedede"
          size={30}
        />
        <Text className="text-3xl font-bold" style={{ color: COLORS.primary }}>
          Results
        </Text>

        <BottomSheetScrollView
          contentContainerStyle={{ marginRight: 15 }}
          showsVerticalScrollIndicator={false}
        >
          {result ? (
            result.map((trader, index) => {
              const traderCoords = trader.Address.split("|")[1];

              return (
                <TouchableHighlight
                  key={index}
                  activeOpacity={1}
                  underlayColor="#ededed"
                  onPress={() => {
                    navigation.navigate("TraderView", {
                      TraderDetails: trader,
                    });
                  }}
                >
                  <View className="flex-row border-b-2 border-gray-200 py-4 items-center justify-between">
                    <View className="flex-row space-x-3">
                      <Image
                        source={
                          trader.profileImg
                            ? { uri: trader.profileImg }
                            : Traderplaceholder
                        }
                        style={{ width: 55, height: 55 }}
                        resizeMode="cover"
                        className=" rounded-full"
                      />
                      <View className="items-start">
                        <Text className="text-2xl font-bold text-gray-800">
                          {trader?.Fullname.length > 20
                            ? trader?.Fullname.slice(0, 20) + "..."
                            : trader?.Fullname}
                        </Text>
                        <Text className="pl-1 text-md font-medium text-gray-400">
                          {trader?.TraderType}
                        </Text>
                        <Text className="pl-1 text-md font-medium text-lime-500">
                          {trader?.distance} km away
                        </Text>
                      </View>
                    </View>

                    <Icon
                      name="caret-forward"
                      type="ionicon"
                      color="#000"
                      size={30}
                    />
                  </View>
                </TouchableHighlight>
              );
            })
          ) : (
            <Text className="text-gray-400 font-semibold mt-5 self-center">
              No traders found around the radius.
            </Text>
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
}

export default ProximitySearchResult;
