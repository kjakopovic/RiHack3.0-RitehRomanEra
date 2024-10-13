// Notifications.tsx

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import { liveEvents, pastEvents, upcomingEvents } from "@/constants/events";
import EventCard from "@/components/EventCard"; // Adjust the import path as needed
import CameraComponent from "@/components/CameraComponent"; // Import the CameraComponent
import { getTokens } from "@/lib/secureStore";

const Notifications = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [eventPhotos, setEventPhotos] = useState<{ [key: string]: string }>({});

  // Function to handle camera icon press
  const handleCameraPress = (event: any) => {
    setCurrentEvent(event);
    setIsCameraOpen(true);
  };

  // Function to save the picture
  const savePhoto = async (photo: any) => {
    if (photo && currentEvent) {
      setEventPhotos((prevPhotos) => ({
        ...prevPhotos,
        [currentEvent.id]: photo.base64,
      }));
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
          points: 10,
        }),
      });

      if (response.ok) {
        console.log("Points updated successfully");
      } else {
        console.error("Error updating points", response.status);
      }
    }
  };

  // Function to close the camera view
  const closeCamera = () => {
    setIsCameraOpen(false);
    setCurrentEvent(null);
  };

  return (
    <SafeAreaView className="bg-neutral-100 flex-1">
      {isCameraOpen ? (
        <CameraComponent onSavePhoto={savePhoto} onCloseCamera={closeCamera} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header */}
          <View className="px-6 pt-6 pb-2">
            <Text className="text-3xl font-bold text-primary-0">My Events</Text>
          </View>

          {/* Live Events Section */}
          {liveEvents.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-txt-100 px-6 mb-4">
                Live Events
              </Text>
              {liveEvents.map((event) => (
                <View key={event.id} className="items-center mb-4">
                  <EventCard
                    event={event}
                    onCameraPress={() => handleCameraPress(event)}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Divider */}
          {liveEvents.length > 0 &&
            (upcomingEvents.length > 0 || pastEvents.length > 0) && (
              <View className="border-t border-neutral-300 mx-6 my-4" />
            )}

          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-txt-100 px-6 mb-4">
                Upcoming Events
              </Text>
              {upcomingEvents.map((event) => (
                <View key={event.id} className="items-center mb-4">
                  <EventCard event={event} />
                </View>
              ))}
            </View>
          )}

          {/* Divider */}
          {upcomingEvents.length > 0 && pastEvents.length > 0 && (
            <View className="border-t border-neutral-300 mx-6 my-4" />
          )}

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-txt-100 px-6 mb-4">
                Past Events
              </Text>
              {pastEvents.map((event) => (
                <View key={event.id} className="items-center mb-4">
                  <EventCard event={event} />
                </View>
              ))}
            </View>
          )}

          {/* No Events Message */}
          {liveEvents.length === 0 &&
            upcomingEvents.length === 0 &&
            pastEvents.length === 0 && (
              <View className="px-6 mt-10">
                <Text className="text-base text-txt-200">
                  No notifications available at the moment.
                </Text>
              </View>
            )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Notifications;
