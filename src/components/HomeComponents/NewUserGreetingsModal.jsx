import React, { useState } from "react";
import { Text, Image, View, TouchableOpacity, Dimensions } from "react-native";
import Modal from "react-native-modal";
import COLORS from "../../constant/colors";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import GreetingBox from "./GreetingBox";

const NewUserGreetingsModal = (props) => {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const totalNumberOfPages = 5;
  const handleNext = () => {
    setPage(page + 1);
  };
  const isFarmer = useSelector((state) => state.ui.isFarmer);
  const FarmerGreeting = () => {
    const deviceHeight = Dimensions.get("window").height;
    const deviceWidth = Dimensions.get("window").width;

    return (
      <View className="flex-1 justify-center items-center">
        <View
          className="bg-white rounded-md p-4 ustify-between"
          style={{ height: deviceHeight * 0.55, width: deviceWidth * 0.9 }}
        >
          {/* Page 1 */}
          {page === 1 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Welcome-User.png")}
              header={"Welcome to Erkado!"}
              content={
                "Before we start on your crop trading journey, there are some things you need to know about this app."
              }
            />
          )}

          {/* Page 2 */}
          {page === 2 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Find-Traders-Online.png")}
              header={"Connect with Traders"}
              content={
                "Erkado is a platform that connects farmers with traders. You can find traders and search the best offers for your crops."
              }
            />
          )}

          {/* Page 3 */}
          {page === 3 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Navigate-Traders-Online.png")}
              header={"Locate the Traders"}
              content={
                "We provide navigation features for your aid. In that way, you can easily find the trader you want to transact with."
              }
            />
          )}

          {/* Page 4 */}
          {page === 4 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Chat-Traders-Online.png")}
              header={"Message the Trader"}
              content={
                "We provide a chat feature to help you communicate with any trader you want to conduct a crop trade."
              }
            />
          )}

          {/* Page 5 */}
          {page === 5 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Setup-Profile.png")}
              header={"Setup Profile"}
              content={
                "Now let's setup your profile to start your crop trading experience."
              }
            />
          )}

          <View className="flex-row space-x-4 mt-4">
            {page > 1 && page < 5 && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-md mt-5 bg-gray-400"
                onPress={handlePrev}
              >
                <Text className="font-bold text-white text-base text-center">
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
                <Text className="font-bold text-white text-base text-center">
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
                <Text className="font-bold text-white text-base text-center">
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
    const deviceHeight = Dimensions.get("window").height;
    const deviceWidth = Dimensions.get("window").width;
    return (
      <View className="flex-1 justify-center items-center">
        <View
          className="bg-white rounded-md p-4 justify-between"
          style={{ height: deviceHeight * 0.6, width: deviceWidth * 0.9 }}
        >
          {/* Page 1 */}
          {page === 1 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Welcome-User.png")}
              header={"Welcome to Erkado!"}
              content={
                "Before we start on your crop trading journey, there are some things you need to know about this app."
              }
            />
          )}

          {/* Page 2 */}
          {page === 2 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Find-Traders-Online.png")}
              header={"Connect with Farmers"}
              content={
                "Erkado is a platform that connects farmers with traders. Farmers can search your profile and send you a message to start a crop trade."
              }
            />
          )}

          {/* Page 3 */}
          {page === 3 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Navigate-Traders-Online.png")}
              header={"Locate the Farmers"}
              content={
                "We provide navigation features for your aid. In that way, if a farmer is wishing to do a crop trade with you, you can easily find them."
              }
            />
          )}

          {/* Page 4 */}
          {page === 4 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Chat-Traders-Online.png")}
              header={"Message the Farmer"}
              content={
                "We provide a chat feature to help you communicate to any farmer you are currently doing a crop trade with."
              }
            />
          )}

          {/* Page 5 */}
          {page === 5 && (
            <GreetingBox
              illustration={require("../../../assets/illustration/Setup-Profile.png")}
              header={"Setup Profile"}
              content={
                "Now let's setup your profile to start your crop trading experience."
              }
            />
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
