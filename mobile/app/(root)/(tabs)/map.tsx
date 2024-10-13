// Map.tsx

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  Text,
  Image,
  ScrollView,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

import * as icons from "@/constants/icons";
import Modal from "react-native-modal";
import EventCard from "@/components/EventCard";
import { StatusBar } from "expo-status-bar";

interface Club {
  club_id: string;
  club_name: string;
  default_working_hours: string;
  latitude: number;
  longitude: number;
  working_days: string;
  address?: string;
}

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

interface GetClubsResponse {
  clubs: Club[];
  message: string;
}

const Map = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825, // default latitude
    longitude: -122.4324, // default longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [clubModalVisible, setClubModalVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>([]); // State to store events
  const [eventsLoading, setEventsLoading] = useState<boolean>(false); // Loading state for events

  // State to store clubs and selected club
  const [clubs, setClubs] = useState<Club[]>([]); // Stores the list of clubs
  const [selectedClub, setSelectedClub] = useState<Club | null>(null); // Stores the club selected by the user
  const [selectedClubAddress, setSelectedClubAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);

  // Modify getAllClubs to accept latitude and longitude
  const getAllClubs = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://zn44q04iq3.execute-api.eu-central-1.amazonaws.com/api-v1/club/get?longitude=${longitude}&latitude=${latitude}`
      );
      const data: GetClubsResponse = await response.json();
      setClubs(data.clubs); // Store the clubs in state
      console.log("Fetched Clubs:", data.clubs);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        setLoading(false); // Stop loading if permission is denied
        return;
      }

      // Get the user's current location
      let userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;

      // Update the region with the user's location
      const userRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(userRegion);

      console.log("User Region:", userRegion);

      // Set the user's location to state
      setLocation(userLocation.coords);

      // Fetch clubs using the actual latitude and longitude
      await getAllClubs(latitude, longitude);

      setLoading(false); // Stop loading after fetching location and clubs
    })();
  }, []);

  // Perform reverse geocoding and fetch events when a club is selected
  useEffect(() => {
    if (selectedClub) {
      // Fetch events for the selected club
      (async () => {
        try {
          setEventsLoading(true); // Start loading events

          const API_URL = process.env.EXPO_PUBLIC_EVENT_API_URL;
          console.log("API_URL for Events Fetch:", API_URL);

          if (!API_URL) {
            console.error("API_URL is not defined");
            setEventsLoading(false);
            return;
          }

          console.log("Selected Club:", selectedClub.club_id);

          const fetchURL = `${API_URL}/events/club?club_id=${selectedClub.club_id}`;
          console.log("Fetch URL for Events:", fetchURL);

          const response = await fetch(fetchURL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("Events Fetch Response Status:", response.status);

          if (!response.ok) {
            console.error("Error response from Events API:", response.status);
            setEventsLoading(false);
            return;
          }

          const data = await response.json();
          console.log("Events Data:", data);

          if (!data.events || !Array.isArray(data.events)) {
            console.error("Invalid Events API response structure:", data);
            setEventsLoading(false);
            return;
          }

          // Perform reverse geocoding for each event
          const eventsWithAddresses = await Promise.all(
            data.events.map(async (event: Event) => {
              try {
                const addresses = await Location.reverseGeocodeAsync({
                  latitude: parseFloat(event.latitude),
                  longitude: parseFloat(event.longitude),
                });

                let address = null;
                if (addresses.length > 0) {
                  const addr = addresses[0];
                  address = `${addr.street || ""}, ${addr.city || ""}, ${
                    addr.region || ""
                  }, ${addr.country || ""}`;
                }

                return {
                  ...event,
                  address,
                };
              } catch (error) {
                console.error(
                  "Error reverse geocoding event:",
                  event.event_id,
                  error
                );
                return {
                  ...event,
                  address: null,
                };
              }
            })
          );

          setEvents(eventsWithAddresses);
          console.log("Events with Addresses:", eventsWithAddresses);
          setEventsLoading(false); // End loading events
        } catch (error) {
          console.error("Error fetching events:", error);
          setEventsLoading(false); // End loading even if there's an error
        }
      })();

      // Perform reverse geocoding for the selected club
      (async () => {
        try {
          const addressArray = await Location.reverseGeocodeAsync({
            latitude: selectedClub.latitude,
            longitude: selectedClub.longitude,
          });
          if (addressArray.length > 0) {
            setSelectedClubAddress(addressArray[0]);
          } else {
            setSelectedClubAddress(null);
          }
        } catch (error) {
          console.error("Error in reverse geocoding club:", error);
          setSelectedClubAddress(null);
        }
      })();
    } else {
      // Reset the address when no club is selected
      setSelectedClubAddress(null);
      setEvents([]); // Clear events when no club is selected
    }
  }, [selectedClub]);

  return (
    <>
      <View style={styles.container}>
        {loading ? (
          // Show loading indicator while fetching location and clubs
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading your location and clubs...</Text>
          </View>
        ) : (
          // Render MapView only after loading is complete
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            userInterfaceStyle="dark"
            mapType="mutedStandard"
          >
            {/* Markers for Clubs */}
            {clubs.map((club) => (
              <Marker
                key={club.club_id}
                coordinate={{
                  latitude: club.latitude,
                  longitude: club.longitude,
                }}
                image={icons.marker}
                onPress={() => {
                  console.log("Marker pressed for club:", club.club_name);
                  setSelectedClub(club);
                  setClubModalVisible(true);
                }}
                title={`${club.club_name} - click for details`}
              />
            ))}
          </MapView>
        )}
      </View>
      <StatusBar style="auto" />
      {/* Club Details Modal */}
      {selectedClub && (
        <Modal
          isVisible={clubModalVisible}
          onBackdropPress={() => {
            setClubModalVisible(false);
            setSelectedClub(null);
          }}
        >
          <View className="h-1/2 w-full bg-neutral-200 rounded-3xl p-5">
            <ScrollView>
              <Text className="w-full font-bold text-2xl text-center">
                {selectedClub.club_name}
              </Text>
              <View className="flex flex-col items-start justify-start mt-5">
                <View className="flex flex-row items-center justify-start mb-2">
                  <Image source={icons.map} className="h-5 w-5 mr-2" />
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="w-3/4"
                  >
                    {selectedClubAddress
                      ? `Address: ${selectedClubAddress.street}, ${selectedClubAddress.city}`
                      : "Fetching address..."}
                  </Text>
                </View>
                <View className="flex flex-row items-center justify-start mb-2">
                  <Image source={icons.calendar} className="h-5 w-5 mr-2" />
                  <Text>
                    {`Working days: ${selectedClub.working_days}` ||
                      "Working Days"}
                  </Text>
                </View>
                <View className="flex flex-row items-center justify-start">
                  <Image source={icons.time} className="h-5 w-5 mr-2" />
                  <Text>
                    {`Working hours: ${selectedClub.default_working_hours}h` ||
                      "Working Hours"}
                  </Text>
                </View>
              </View>
              <Text className="w-full font-bold text-2xl text-center mt-5">
                Upcoming Events
              </Text>
              <View className="flex flex-col items-center justify-center mt-5 pb-5">
                {eventsLoading ? (
                  // Show loading indicator while events are being fetched
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="mt-4 text-base text-gray-700">
                      Loading events...
                    </Text>
                  </View>
                ) : events.length === 0 ? (
                  // Show message if no events are found
                  <Text className="text-lg font-semibold text-txt-100 mt-5">
                    No events found
                  </Text>
                ) : (
                  // Map over the events array and render EventCard for each event
                  events.map((event) => (
                    <EventCard
                      key={event.event_id}
                      event={event}
                      hasPhoto={false}
                    />
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
