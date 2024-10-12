import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

import * as images from "@/constants/images"; // Assuming you have both the placeholder and gradient images in constants

const EventCard = () => {
  return (
    <TouchableOpacity className="bg-neutral-100 w-[90%] h-[200px] rounded-xl shadow-sm shadow-neutral-80 mb-4">
      {/* Wrapper View to position the gradient over the base image */}
      <View className="relative w-full h-24 rounded-t-xl overflow-hidden">
        {/* Base Event Image */}
        <Image
          source={images.placeholder}
          resizeMode="stretch"
          className="w-full h-full"
        />
        {/* Gradient Image Overlay */}
        <Image
          source={images.gradient} // Assuming gradient is in your images file
          resizeMode="stretch"
          className="absolute top-0 left-0 w-full h-full"
        />
      </View>

      <View className="flex flex-col items-start justify-between p-2">
        <Text className="text-txt-100 text-2xl font-bold">Event Name</Text>
        <Text className="text-txt-200 text-lg font-light">
          Event Description
        </Text>
        <View className="flex flex-row w-full items-center justify-between">
          <Text className="text-txt-200 text-lg">Event Date</Text>
          <Text className="text-txt-200 text-lg">Event Time</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
