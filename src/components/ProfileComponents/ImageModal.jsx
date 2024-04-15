import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { Icon } from "@rneui/base";

function ImageModal({ imageModal, handleModal, uploadImage, removeImage }) {
  return (
    <View>
      {imageModal && (
        <Modal
          isVisible={imageModal}
          animationIn="fadeIn"
          animationInTiming={200}
          onBackdropPress={handleModal}
          onBackButtonPress={handleModal}
          onSwipeComplete={handleModal}
          swipeDirection="up"
        >
          <View className="flex-row  bg-white rounded-md py-5 px-2 space-x-7 justify-center">
            {/* Open Camera */}
            <TouchableOpacity
              className=" bg-slate-200 p-3 rounded-xl"
              onPress={uploadImage}
            >
              <Icon
                name="camera-outline"
                type="ionicon"
                color="#60BB46"
                size={30}
              />
              <Text className=" font-bold text-xs ">Camera</Text>
            </TouchableOpacity>

            {/* Open Gallery */}
            <TouchableOpacity
              className=" bg-slate-200 p-3 rounded-xl"
              onPress={() => uploadImage("gallery")}
            >
              <Icon
                name="image-outline"
                type="ionicon"
                color="#60BB46"
                size={30}
              />
              <Text className=" font-bold text-xs ">Gallery</Text>
            </TouchableOpacity>

            {/* Remove Image */}
            <TouchableOpacity
              className=" bg-slate-200  p-3 rounded-xl "
              onPress={removeImage}
            >
              <Icon
                name="trash-outline"
                type="ionicon"
                color="#555555"
                size={30}
              />
              <Text className="  font-bold text-xs ">Remove</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default ImageModal;
