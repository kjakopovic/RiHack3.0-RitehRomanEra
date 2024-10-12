import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Share,
  Alert,
} from "react-native";
import React from "react";

import * as images from "@/constants/images"; // Placeholder and gradient images
import * as icons from "@/constants/icons"; // Calendar, share icons, etc.

const EventCard = () => {
  const eventDetails = {
    name: "Event Name",
    description: "Event Description",
    date: "03/07/2024",
    time: "19:30",
  };

  const shareEvent = async () => {
    try {
      const message = `Check out this event: ${eventDetails.name} happening on ${eventDetails.date} at ${eventDetails.time}.`;

      // Using React Native Share API
      const result = await Share.share({
        message: message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with an activity
          console.log("Shared with activity: ", result.activityType);
        } else {
          // Shared successfully
          console.log("Event shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed without sharing
        console.log("Share dismissed");
      }
    } catch (error: any) {
      Alert.alert("Error sharing event", error.message);
    }
  };

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
          source={images.gradient}
          resizeMode="stretch"
          className="absolute top-0 left-0 w-full h-full"
        />
      </View>

      <View className="flex flex-col items-start justify-between h-[53%]">
        <View className="flex flex-col items-start justify-center px-2">
          <Text className="text-txt-100 text-2xl font-bold">
            {eventDetails.name}
          </Text>
          <Text className="text-txt-200 text-base font-light">
            {eventDetails.description}
          </Text>
          <View className="flex flex-row items-center gap-x-2 mt-2">
            <Image source={icons.calendar} className="h-4 w-4" />
            <Text className="text-txt-200 text-sm font-medium">
              {eventDetails.date}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-x-2">
            <Image source={icons.hourglass} className="h-4 w-4" />
            <Text className="text-txt-200 text-sm font-medium">
              {eventDetails.time}
            </Text>
          </View>
        </View>

        <View className="flex flex-row w-full items-center justify-end gap-x-2">
          {/* Share Button */}
          <TouchableOpacity onPress={shareEvent}>
            <Image source={icons.share} className="h-6 w-6" />
          </TouchableOpacity>
          {/* Join Button */}
          <TouchableOpacity className="bg-primary-0 p-2 rounded-lg w-2/6 items-center justify-center">
            <Text className="text-sm font-bold text-white">Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
