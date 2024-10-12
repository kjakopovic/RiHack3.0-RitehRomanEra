import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

import * as images from "@/constants/images"; // Assuming you have both the placeholder and gradient images in constants
import * as icons from "@/constants/icons"; // Assuming you have the calendar icon in constants

const EventCard = () => {
  return (
    <TouchableOpacity className="bg-neutral-100 w-[90%] h-[300px] rounded-xl shadow-sm shadow-neutral-80 mb-4">
      {/* Wrapper View to position the gradient over the base image */}
      <View className="relative w-full h-32 rounded-t-xl overflow-hidden">
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

      <View className="flex flex-col items-start justify-between h-[53%]">
        <View className="flex flex-col items-start justify-center px-2">
        <Text className="text-txt-100 text-2xl font-bold">Event Name</Text>
        <Text className="text-txt-200 text-base font-light">
          Event Description
        </Text>
        <View className="flex flex-row items-center gap-x-2 mt-2">
          <Image source={icons.calendar} className="h-4 w-4" />
          <Text className="text-txt-200 text-sm font-medium">03/07/2024</Text>
        </View>
        <View className="flex flex-row items-center gap-x-2">
          <Image source={icons.hourglass} className="h-4 w-4" />
          <Text className="text-txt-200 text-sm font-medium">19:30</Text>
        </View>
        </View>
        <View className="flex flex-row w-full items-center justify-end gap-x-2">
          <TouchableOpacity>
            <Image source={icons.share} className="h-6 w-6" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary-0 p-2 rounded-lg w-2/6 items-center justify-center">
            <Text className="text-sm font-bold text-white">Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
