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
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getTokens } from "@/lib/secureStore";

interface EventCardProps {
  event: {
    event_id: string;
    title: string;
    description: string;
    startingAt: string;
    endingAt: string;
    genre: string;
    type: string;
    theme: string;
    longitude: string;
    latitude: string;
    address?: string;
  };
  onCameraPress?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onCameraPress }) => {
  const {
    event_id,
    title,
    description,
    startingAt,
    endingAt,
    latitude,
    longitude,
    genre,
    type,
    theme,
    address,
  } = event;
  const tags = [genre, type, theme];

  // Format the startingAt and endingAt dates
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
    };

    const formattedDate = date.toLocaleDateString(undefined, options);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    return `${formattedDate} at ${formattedTime}`;
  };

  const formattedStartingAt = formatDateTime(startingAt);
  const formattedEndingAt = formatDateTime(endingAt);

  // Access the global state from the zustand store
  const joinedEvents = useEventStore((state) => state.joinedEvents);
  const joinEvent = useEventStore((state) => state.joinEvent);
  const unjoinEvent = useEventStore((state) => state.unjoinEvent);

  // Check if the user is attending this event
  const isAttending = joinedEvents.includes(event_id);

  // Function to toggle attendance
  const toggleAttendance = async () => {
    const API_URL = process.env.EXPO_PUBLIC_EVENT_API_URL;
    const POINT_URL = process.env.EXPO_PUBLIC_USER_API_URL;
    const { jwtToken, refreshToken } = await getTokens();
    if (isAttending) {
      // Unjoin the event
      unjoinEvent(event_id);
      const response = await fetch(`${API_URL}/event/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          event_id,
        }),
      });
      if (response.ok) {
        console.log("Left event successfully");
        Alert.alert("Left Event", `You have left the event: ${title}`);
        const pointsResponse = await fetch(
          `${POINT_URL}/profile/info/private`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
              points: -1,
            }),
          }
        );
        if (pointsResponse.ok) {
          console.log("Points updated successfully");
        } else {
          console.error("Error updating points", pointsResponse.status);
        }
      } else {
        console.error("Error leaving event", response.status);
      }
    } else {
      // Check if the user has already joined 3 events
      if (joinedEvents.length >= 3) {
        // Show an alert informing the user they cannot join more events
        Alert.alert(
          "Event Limit Reached",
          "You have already joined 3 events. You won't get any more points for joining additional events."
        );
        joinEvent(event_id);
        const response = await fetch(`${API_URL}/event/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            event_id,
          }),
        });
        if (response.ok) {
          console.log("Joined event successfully");
        } else {
          console.error("Error joining event", response.status);
        }
      } else {
        // Join the event
        joinEvent(event_id);
        const response = await fetch(`${API_URL}/event/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            event_id,
          }),
        });
        if (response.ok) {
          console.log("Joined event successfully");
          Alert.alert("Joined Event", `You have joined the event: ${title}`);
          const pointsResponse = await fetch(
            `${POINT_URL}/profile/info/private`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
              body: JSON.stringify({
                points: 1,
              }),
            }
          );

          if (pointsResponse.ok) {
            console.log("Points updated successfully");
          } else {
            console.error("Error updating points", pointsResponse.status);
          }
        } else {
          console.error("Error joining event", response.status);
        }
      }
    }
  };

  // Function to share the event
  const shareEvent = async () => {
    try {
      const message = `Check out this event: ${title} happening on ${formattedStartingAt} at ${address}!`;

      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log(`Shared with activity type: ${result.activityType}`);
          const { jwtToken, refreshToken } = await getTokens();

          if (jwtToken && refreshToken) {
            console.log("Tokens retrieved successfully");
          } else {
            console.log("Error retrieving tokens");
          }

          const API_URL = process.env.EXPO_PUBLIC_USER_API_URL;

          const response = await fetch(`${API_URL}/profile/info/private`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
              points: 5,
            }),
          });

          if (response.ok) {
            console.log("Points updated successfully");
          } else {
            console.error("Error updating points", response.status);
          }
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
        <Text className="text-txt-100 text-2xl font-bold">{title}</Text>

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
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            className="text-txt-200 text-sm font-medium w-3/4"
          >
            {address}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-x-2 mt-1">
          <Image source={icons.calendar} className="h-4 w-4" />
          <Text className="text-txt-200 text-sm font-medium">
            {formattedStartingAt}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-x-2 mt-1">
          <Image source={icons.hourglass} className="h-4 w-4" />
          <Text className="text-txt-200 text-sm font-medium">
            Ends at {formattedEndingAt}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex flex-row w-full items-center justify-end gap-x-2 mt-4">
          {/* Camera Button */}
          {onCameraPress && (
            <TouchableOpacity onPress={onCameraPress} className="mt-1">
              <Image source={icons.camera} className="h-7 w-7" />
            </TouchableOpacity>
          )}
          {/* Share Button */}
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
