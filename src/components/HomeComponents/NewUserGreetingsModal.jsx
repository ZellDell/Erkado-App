import { Icon } from "@rneui/base";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import COLORS from "../../constant/colors";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
const NewUserGreetingsModal = (props) => {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const totalNumberOfPages = 5;
  const handleNext = () => {
    setPage(page + 1);
  };
  const isFarmer = useSelector((state) => state.ui.isFarmer);
  const FarmerGreeting = () => {
    return (
      <View className="flex-1 justify-center items-center">
        <View className="bg-white rounded-md p-4 w-11/12 h-3/5 justify-between">
          {/* Page 1 */}
          {page === 1 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Welcome-User.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-4xl"
                style={{ color: COLORS.primary }}
              >
                Welcome to Erkado!
              </Text>
              <Text className="font-medium text-gray-500 px-3 text-md mt-3 text-justify">
                Before we start on your crop trading journey, there are some
                things you need to know about this app.
              </Text>
            </View>
          )}

          {/* Page 2 */}
          {page === 2 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Find-Traders-Online.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-3xl"
                style={{ color: COLORS.primary }}
              >
                Connect with Traders
              </Text>
              <Text className="font-medium text-gray-500 px-6 text-md mt-3 text-justify">
                Erkado is a platform that connects farmers with traders. You can
                find traders and search the best offers for your crops.
              </Text>
            </View>
          )}

          {/* Page 3 */}
          {page === 3 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Navigate-Traders-Online.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-3xl"
                style={{ color: COLORS.primary }}
              >
                Locate the Traders
              </Text>
              <Text className="font-medium text-gray-500 px-6 text-md mt-3 text-justify">
                We provide navigation features for your aid. In that way, you
                can easily find the trader you want to transact with.
              </Text>
            </View>
          )}

          {/* Page 4 */}
          {page === 4 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Chat-Traders-Online.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-3xl"
                style={{ color: COLORS.primary }}
              >
                Message the Trader
              </Text>
              <Text className="font-medium text-gray-500 px-6 text-md mt-3 text-justify">
                We provide a chat feature to help you communicate with any
                trader you want to conduct a crop trade.
              </Text>
            </View>
          )}

          {/* Page 5 */}
          {page === 5 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Setup-Profile.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-3xl"
                style={{ color: COLORS.primary }}
              >
                Setup Profile
              </Text>
              <Text className="font-medium text-gray-500 px-6 text-md mt-3 text-justify">
                Now let's setup your profile to start your crop trading journey.
              </Text>
            </View>
          )}

          <View className="flex-row space-x-4 mt-4">
            {page > 1 && page < 5 && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-md mt-5 bg-gray-400"
                onPress={handlePrev}
              >
                <Text className="font-bold text-white text-xl text-center">
                  Back
                </Text>
              </TouchableOpacity>
            )}
            {page < totalNumberOfPages && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-md mt-5"
                style={{ backgroundColor: COLORS.primary }}
                onPress={handleNext}
              >
                <Text className="font-bold text-white text-xl text-center">
                  Next
                </Text>
              </TouchableOpacity>
            )}
            {page === totalNumberOfPages && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-md mt-5"
                style={{ backgroundColor: COLORS.primary }}
                onPress={() => {
                  props.handleNewUserModal();
                  navigation.navigate("EditProfile");
                }}
              >
                <Text className="font-bold text-white text-xl text-center">
                  Setup Profile
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const TraderGreeting = () => {
    return (
      <View className="flex-1 justify-center items-center">
        <View className="bg-white rounded-md p-4 w-11/12 h-3/5 justify-between">
          {/* Page 1 */}
          {page === 1 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Welcome-User.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-4xl"
                style={{ color: COLORS.primary }}
              >
                Welcome to Erkado!
              </Text>
              <Text className="font-medium text-gray-500 px-3 text-md mt-3 text-justify">
                Before we start on your crop trading journey, there are some
                things you need to know about this app.
              </Text>
            </View>
          )}

          {/* Page 2 */}
          {page === 2 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Find-Traders-Online.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-3xl"
                style={{ color: COLORS.primary }}
              >
                Connect with Farmers
              </Text>
              <Text className="font-medium text-gray-500 px-6 text-md mt-3 text-justify">
                Erkado is a platform that connects farmers with traders. Farmers
                can search your profile and send you a message to start a crop
                trade.
              </Text>
            </View>
          )}

          {/* Page 3 */}
          {page === 3 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Navigate-Traders-Online.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-3xl"
                style={{ color: COLORS.primary }}
              >
                Locate the Farmers
              </Text>
              <Text className="font-medium text-gray-500 px-6 text-md mt-3 text-justify">
                We provide navigation features for your aid. In that way, if a
                farmer is wishing to do a crop trade with you, you can easily
                find them.
              </Text>
            </View>
          )}

          {/* Page 4 */}
          {page === 4 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Chat-Traders-Online.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-3xl"
                style={{ color: COLORS.primary }}
              >
                Message the Farmer
              </Text>
              <Text className="font-medium text-gray-500 px-6 text-md mt-3 text-justify">
                We provide a chat feature to help you communicate to any farmer
                you are currently doing a crop trade with.
              </Text>
            </View>
          )}

          {/* Page 5 */}
          {page === 5 && (
            <View className="items-center ">
              <Image
                source={require("../../../assets/illustration/Setup-Profile.png")}
                resizeMode="contain"
                style={{ width: 255, height: 255 }}
              />
              <Text
                className="font-bold text-3xl"
                style={{ color: COLORS.primary }}
              >
                Setup Profile
              </Text>
              <Text className="font-medium text-gray-500 px-6 text-md mt-3 text-justify">
                Now let's setup your profile to start your crop trading journey.
              </Text>
            </View>
          )}

          <View className="flex-row space-x-4 mt-4">
            {page > 1 && page < 5 && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-md mt-5 bg-gray-400"
                onPress={handlePrev}
              >
                <Text className="font-bold text-white text-xl text-center">
                  Back
                </Text>
              </TouchableOpacity>
            )}
            {page < totalNumberOfPages && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-md mt-5"
                style={{ backgroundColor: COLORS.primary }}
                onPress={handleNext}
              >
                <Text className="font-bold text-white text-xl text-center">
                  Next
                </Text>
              </TouchableOpacity>
            )}
            {page === totalNumberOfPages && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-md mt-5"
                style={{ backgroundColor: COLORS.primary }}
                onPress={() => {
                  props.handleNewUserModal();
                  navigation.navigate("EditProfile");
                }}
              >
                <Text className="font-bold text-white text-xl text-center">
                  Setup Profile
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const handlePrev = () => {
    setPage(page - 1);
  };
  return (
    <Modal
      isVisible={props.newUserModal}
      animationIn="fadeIn"
      animationInTiming={400}
      animationOut="fadeOut"
      animationOutTiming={400}
      style={{ margin: 0 }}
    >
      {isFarmer ? <FarmerGreeting /> : <TraderGreeting />}
    </Modal>
  );
};

export default NewUserGreetingsModal;
