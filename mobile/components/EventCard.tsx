import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from "react-native";
import React from "react";
import { useEventStore } from "@/store/event-store"; // Adjust the import path as needed
import * as images from "@/constants/images"; // Placeholder and gradient images
import * as icons from "@/constants/icons"; // Calendar, share icons, etc.

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    tags: string[];
  };
  onCameraPress?: () => void; // Add this line
}

const EventCard: React.FC<EventCardProps> = ({ event, onCameraPress }) => {
  const { id, name, description, date, time, location, tags } = event;

  // Access the global state from the zustand store
  const joinedEvents = useEventStore((state) => state.joinedEvents);
  const joinEvent = useEventStore((state) => state.joinEvent);
  const unjoinEvent = useEventStore((state) => state.unjoinEvent);

  // Check if the user is attending this event
  const isAttending = joinedEvents.includes(id);

  // Function to toggle attendance
  const toggleAttendance = () => {
    if (isAttending) {
      // Unjoin the event
      unjoinEvent(id);
      Alert.alert("Left Event", `You have left the event: ${name}`);
    } else {
      // Check if the user has already joined 3 events
      if (joinedEvents.length >= 3) {
        // Show an alert informing the user they cannot join more events
        Alert.alert(
          "Event Limit Reached",
          "You have already joined 3 events. Please unjoin an event before joining a new one."
        );
      } else {
        // Join the event
        joinEvent(id);
        Alert.alert("Joined Event", `You have joined the event: ${name}`);
      }
    }
  };

  // Function to share the event
  const shareEvent = async () => {
    try {
      const message = `Check out this event: ${name} happening on ${date} at ${time} at ${location}!`;

      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          // Shared successfully
          Alert.alert(
            "Event Shared",
            "You have successfully shared the event."
          );
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Share dialog dismissed");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableOpacity className="bg-neutral-100 w-[90%] rounded-xl shadow-sm shadow-neutral-80 mb-4">
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

      <View className="flex flex-col items-start justify-between px-2 py-4">
        {/* Event Name */}
        <Text className="text-txt-100 text-2xl font-bold">{name}</Text>

        {/* Tags as pill elements */}
        <View className="flex flex-row flex-wrap mt-2">
          {tags.map((tag, index) => (
            <View
              key={index}
              className="bg-primary-0 px-2 py-1 rounded-full mr-2 mb-2"
            >
              <Text className="text-white text-xs">{tag}</Text>
            </View>
          ))}
        </View>

        {/* Event Description */}
        <Text className="text-txt-200 text-base font-light mt-2">
          {description}
        </Text>

        {/* Event Details */}
        <View className="flex flex-row items-center gap-x-2 mt-2">
          <Image source={icons.map} className="h-4 w-4" />
          <Text className="text-txt-200 text-sm font-medium">{location}</Text>
        </View>
        <View className="flex flex-row items-center gap-x-2 mt-1">
          <Image source={icons.calendar} className="h-4 w-4" />
          <Text className="text-txt-200 text-sm font-medium">{date}</Text>
        </View>
        <View className="flex flex-row items-center gap-x-2 mt-1">
          <Image source={icons.hourglass} className="h-4 w-4" />
          <Text className="text-txt-200 text-sm font-medium">{time}</Text>
        </View>

        {/* Action Buttons */}
        <View className="flex flex-row w-full items-center justify-end gap-x-2 mt-4">
          {/* Share Button */}
          {onCameraPress && (
            <TouchableOpacity onPress={onCameraPress} className="mt-1">
              <Image source={icons.camera} className="h-7 w-7" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={shareEvent}>
            <Image source={icons.share} className="h-7 w-7" />
          </TouchableOpacity>
          {/* Join/Unjoin Button */}
          <TouchableOpacity
            className={`${
              isAttending ? "bg-danger" : "bg-primary-0"
            } p-2 rounded-lg w-2/6 items-center justify-center`}
            onPress={toggleAttendance}
          >
            <Text className="text-sm font-bold text-white">
              {isAttending ? "Unjoin" : "Join"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
