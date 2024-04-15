import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TextInput,
  BackHandler,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@rneui/base";
import { Logout } from "../../features/auth-actions";
import PLACEHOLDER from "../../constant/profile";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import usePlacesAutoComplete from "../../utils/usePlacesAutoComplete";
import Modal from "react-native-modal";
import ImageModal from "../../components/ProfileComponents/ImageModal";
import { imgUpload, updateUserInfo } from "../../features/user-actions";

function AccountSetting() {
  const dispatch = useDispatch();
  const navigator = useNavigation();
  const userInfo = useSelector((state) => state.user.userInfo);
  const isFarmer = useSelector((state) => state.ui.isFarmer);

  const placesAutocomplete = usePlacesAutoComplete(
    "",
    "pk.eyJ1IjoiemVsbGRlbGwiLCJhIjoiY2x0d3hjdG91MDBheTJqczdqcHRjdWhpZSJ9.UyWdrUlPhJlQN-XE_JoP6Q",
    "PH"
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState(userInfo);
  const [reconfirmModal, setReconfirmModal] = useState(false);

  useEffect(() => {
    console.log("===userinfo", userInfo);
    const backAction = () => {
      if (hasUnsavedChanges()) {
        setReconfirmModal(true);
        return true;
      } else {
        navigator.navigate("Setting");
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the event listener when the component unmounts
  }, [editedUserInfo]);

  const hasUnsavedChanges = () => {
    console.log("===", userInfo);
    console.log("===", editedUserInfo);
    return JSON.stringify(userInfo) !== JSON.stringify(editedUserInfo);
  };

  const deviceHeight = Dimensions.get("window").height;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitChanges = async () => {
    if (!hasUnsavedChanges) {
      navigator.navigate("Setting");
      return;
    }

    if (editedUserInfo.fullname == "" || editedUserInfo.extraInfo == "") {
      Toast.show({
        type: "WarningNotif",

        text1: "Fields cannot be null",
        visibilityTime: 3000,
        swipeable: true,
      });
      return;
    }

    setIsLoading(true);
    if (image.uri != userInfo.profileImg) {
      let profileImg = null;
      if (image.uri != null) {
        formdata = new FormData();
        formdata.append("image", {
          uri: image.uri,
          type: image.type,
          name: new Date() + image.name,
        });
        profileImg = await dispatch(imgUpload(formdata));
        setEditedUserInfo({ ...editedUserInfo, profileImg: profileImg });
      }
    }

    const response = dispatch(updateUserInfo({ editedUserInfo }));
    console.log(response);
    navigator.navigate("Setting");
    setIsLoading(false);
  };

  const [imageModal, setImageModal] = useState(false);
  const [image, setImage] = useState({
    uri: userInfo.profileImg,
    type: null,
  });

  const uploadImage = async (mode) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();

        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage({
          img: result.assets[0].uri,
          type: result.assets[0].mimeType,
        });
      }
    } catch (err) {
      alert("Error" + err.message);
      setImageModal(!imageModal);
    }
  };

  const saveImage = async ({ img, type }) => {
    try {
      setImage({
        uri: img,
        type: type,
      });

      setEditedUserInfo({ ...editedUserInfo, profileImg: img });

      setImageModal(!imageModal);
    } catch (err) {
      throw err;
    }
  };

  const removeImage = async () => {
    try {
      setImage({
        uri: null,
        type: null,
      });
      setEditedUserInfo({ ...editedUserInfo, profileImg: userInfo.profileImg });
      setImage({ ...image, uri: userInfo.profileImg });
      setImageModal(!imageModal);
    } catch (err) {
      setImageModal(!imageModal);
      console.log(err?.message);
    }
  };
  return (
    <SafeAreaView className="bg-gray-50 px-8 py-10 flex-1 ">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          hasUnsavedChanges()
            ? setReconfirmModal(true)
            : navigator.navigate("Setting");
        }}
        className=" bg-gray-50  p-3 rounded-full absolute top-10 left-10 z-30"
        style={styles.shadow}
      >
        <Icon name="arrow-back" type="ionicon" size={20} color="#555555" />
      </TouchableOpacity>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ImageModal
          imageModal={imageModal}
          handleModal={() => setImageModal(!imageModal)}
          uploadImage={uploadImage}
          removeImage={removeImage}
        />
        <ReconfirmUnsaved
          reconfirmModal={reconfirmModal}
          setReconfirmModal={setReconfirmModal}
          navigator={navigator}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsEditMode(!isEditMode)}
          className="flex-row self-end bg-gray-500 ml-2 p-2 rounded-xl space-x-2"
        >
          <Icon
            name={isEditMode ? "checkmark" : "color-wand"}
            type="ionicon"
            size={20}
            color="#ffffff"
          />
          <Text className="text-white font-bold self-center text-base">
            {"Edit"}
          </Text>
        </TouchableOpacity>
        <View className="flex-1  py-3 items-center justify-center ">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              isEditMode ? setImageModal(true) : {};
            }}
            className="relative border-2 border-gray-300 p-2 rounded-full"
          >
            <Image
              source={
                image.uri
                  ? { uri: image.uri }
                  : isFarmer
                  ? { uri: PLACEHOLDER.farmer }
                  : { uri: PLACEHOLDER.trader }
              }
              style={{ width: 130, height: 130 }}
              resizeMode="cover"
              className=" rounded-full "
            />
            {isEditMode && (
              <View className="absolute bottom-0 -right-2 p-2 rounded-full bg-gray-700">
                <Icon name="camera" type="ionicon" size={30} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* FIELDS */}

        <View className="flex-1 py-3 space-y-2 h-full">
          <View className="flex-1  space-y-1 justify-center py-2">
            <Text className="font-bold text-sm">Fullname:</Text>
            <View className="flex-1  flex-row ">
              <View className="bg-green-500 p-2 rounded-l-lg">
                <Icon name="person" type="ionicon" size={20} color="#ffffff" />
              </View>
              <TextInput
                onChangeText={(text) =>
                  setEditedUserInfo({ ...editedUserInfo, fullname: text })
                }
                editable={isEditMode}
                value={editedUserInfo.fullname}
                className="font-semibold text-base flex-1 px-3 rounded-r-lg mr-2 bg-gray-200"
              />
            </View>
          </View>

          <View className="flex-1  space-y-1 justify-center py-2">
            <Text className="font-bold text-sm">
              {isFarmer ? "RSBSA:" : "Trader Type:"}
            </Text>
            <View className="flex-1  flex-row ">
              <View className="bg-green-500 p-2 rounded-l-lg">
                <Icon
                  name={isFarmer ? "finger-print" : "people"}
                  type="ionicon"
                  size={20}
                  color="#ffffff"
                />
              </View>
              <TextInput
                onChangeText={(text) =>
                  setEditedUserInfo({ ...editedUserInfo, extraInfo: text })
                }
                value={editedUserInfo.extraInfo}
                editable={isEditMode}
                className="font-semibold flex-1 px-3 rounded-r-lg mr-2 bg-gray-200"
              />
            </View>
          </View>

          {isEditMode && (
            <View className=" flex-1  space-y-1 justify-center py-2">
              <TouchableOpacity
                disabled={isLoading}
                activeOpacity={0.8}
                onPress={handleSubmitChanges}
                className="mt-10 bg-green-500 p-2 rounded-lg"
              >
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                    className="self-center"
                  />
                ) : (
                  <Text className="font-bold self-center text-base text-white">
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountSetting;

const ReconfirmUnsaved = ({ reconfirmModal, setReconfirmModal, navigator }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Modal
        isVisible={reconfirmModal}
        animationIn="fadeIn"
        animationInTiming={200}
      >
        <View className="flex  bg-zinc-50 rounded-md py-5 px-7 space-y-5 justify-center">
          <View className="flex-row items-center space-x-2 pb-5 border-b-2 border-b-gray-300">
            <Icon name="warning" type="ionicon" color="#e69730" size={40} />
            <View>
              <Text className="text-xl text-justify text-gray-800 font-bold">
                Unsave changes
              </Text>
              <Text className="text-base text-justify text-gray-600 font-semibold">
                Do you want to discard them?
              </Text>
            </View>
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="p-3 rounded-md flex-1 bg-red-500"
              onPress={() => navigator.navigate("Setting")}
            >
              <Text className="self-center font-bold text-md  text-white">
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3 rounded-md flex-1 bg-gray-600"
              onPress={() => setReconfirmModal(false)}
            >
              <Text className="self-center font-bold text-md  text-gray-200">
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    elevation: 25,
    backgroundColor: "white",
  },
});
