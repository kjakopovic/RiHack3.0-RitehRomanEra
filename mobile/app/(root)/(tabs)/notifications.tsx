// Notifications.tsx

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import EventCard from "@/components/EventCard"; // Adjust the import path as needed
import CameraComponent from "@/components/CameraComponent"; // Import the CameraComponent
import { getTokens } from "@/lib/secureStore";
import { uploadImage } from "@/lib/imageUpload";
import * as Location from "expo-location";

interface Event {
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
  address?: string; // Add optional address field
}

const Notifications = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventPhotos, setEventPhotos] = useState<{ [key: string]: string }>({});
  const [imageUploading, setImageUploading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // New state variables for categorized events
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  // New state variable for loading events
  const [loadingEvents, setLoadingEvents] = useState(true);

  const fetchUserEvents = async () => {
    setLoadingEvents(true); // Start loading
    const { jwtToken } = await getTokens();

    if (jwtToken) {
      console.log("Token retrieved successfully");
    } else {
      console.error("Error retrieving token");
    }

    const API_URL = process.env.EXPO_PUBLIC_EVENT_API_URL;

    try {
      const response = await fetch(`${API_URL}/events/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User Events Data:", data);

        // Adjust according to the actual data structure
        const eventsArray = data.events || data; // Use data.events if data contains an 'events' property

        setEvents(eventsArray);

        // Categorize events after fetching
        categorizeEvents(eventsArray);
      } else {
        console.error("Error fetching events", response.status);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingEvents(false); // End loading
    }
  };
  useEffect(() => {
    fetchUserEvents();
  }, []);

  const categorizeEvents = (events: Event[]) => {
    const now = new Date();
    console.log("Current Time:", now);

    const live: Event[] = [];
    const upcoming: Event[] = [];
    const past: Event[] = [];

    events.forEach((event) => {
      console.log("Event:", event.title);
      console.log("startingAt:", event.startingAt);
      console.log("endingAt:", event.endingAt);

      const startTime = new Date(event.startingAt);
      const endTime = new Date(event.endingAt);

      console.log("Parsed startTime:", startTime);
      console.log("Parsed endTime:", endTime);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error(`Invalid date for event ${event.title}`);
        return;
      }

      if (now >= startTime && now <= endTime) {
        // Event is live
        live.push(event);
      } else if (startTime > now) {
        // Event is upcoming
        upcoming.push(event);
      } else if (endTime < now) {
        // Event is past
        past.push(event);
      }
    });

    console.log("Live Events:", live);
    console.log("Upcoming Events:", upcoming);
    console.log("Past Events:", past);

    setLiveEvents(live);
    setUpcomingEvents(upcoming);
    setPastEvents(past);
  };

  // Function to handle camera icon press
  const handleCameraPress = (event: Event) => {
    setCurrentEvent(event);
    setIsCameraOpen(true);
  };

  // Helper function to calculate distance using the Haversine formula
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters

    return distance;
  };

  // Function to save the picture
  const savePhoto = async (photo: any) => {
    if (photo && currentEvent) {
      setImageUploading(true);

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to verify your proximity to the event."
        );
        setImageUploading(false);
        return;
      }

      try {
        // Get user's current location
        const userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        // Get event location
        const eventLatitude = parseFloat(currentEvent.latitude);
        const eventLongitude = parseFloat(currentEvent.longitude);

        // Calculate distance
        const distance = getDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          eventLatitude,
          eventLongitude
        );

        const allowedRadius = 100; // Allowed radius in meters (e.g., 100 meters)

        if (distance > allowedRadius) {
          // User is too far from event location
          Alert.alert(
            "Too Far from Event",
            `You need to be within ${allowedRadius} meters of the event location to submit a photo.`
          );
          setImageUploading(false);
          return;
        }

        // Proceed with saving the photo
        setEventPhotos((prevPhotos) => ({
          ...prevPhotos,
          [currentEvent.event_id]: photo.base64,
        }));

        const { jwtToken } = await getTokens();

        const imageURI = await uploadImage(photo);

        if (imageURI) {
          console.log("Image uploaded successfully", imageURI);
        } else {
          console.error("Error uploading image");
        }

        const IMAGE_UPLOAD_URL = process.env.EXPO_PUBLIC_EVENT_API_URL;

        const imageResponse = await fetch(`${IMAGE_UPLOAD_URL}/event/image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            event_id: currentEvent.event_id,
            image_link: imageURI,
          }),
        });

        const imageResponseData = await imageResponse.json();

        console.log("Image Response Data:", imageResponseData);

        setImageUploading(false);

        if (jwtToken) {
          console.log("Token retrieved successfully");
        } else {
          console.log("Error retrieving token");
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
      } catch (error) {
        console.error("Error getting user location:", error);
        Alert.alert("Error", "Unable to get your current location.");
        setImageUploading(false);
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
      ) : imageUploading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-4 text-base text-gray-700">
            Uploading image...
          </Text>
        </View>
      ) : loadingEvents ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-4 text-base text-gray-700">
            Loading events...
          </Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loadingEvents}
              onRefresh={() => {
                fetchUserEvents();
              }}
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        >
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
                <View key={event.event_id} className="items-center mb-4">
                  <EventCard
                    event={event}
                    onCameraPress={() => handleCameraPress(event)}
                    hasPhoto={Boolean(eventPhotos[event.event_id])} // Pass if a photo exists for the event
                  />
                </View>
              ))}
            </View>
          )}

          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-txt-100 px-6 mb-4">
                Upcoming Events
              </Text>
              {upcomingEvents.map((event) => (
                <View key={event.event_id} className="items-center mb-4">
                  <EventCard event={event} hasPhoto={true} />
                </View>
              ))}
            </View>
          )}

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-txt-100 px-6 mb-4">
                Past Events
              </Text>
              {pastEvents.map((event) => (
                <View key={event.event_id} className="items-center mb-4">
                  <EventCard event={event} hasPhoto={true} />
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
                  No events available at the moment.
                </Text>
              </View>
            )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Notifications;
