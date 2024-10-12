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
import { events } from "@/constants/events";

interface Club {
  club_id: string;
  club_name: string;
  default_working_hours: string;
  latitude: number;
  longitude: number;
  working_days: string;
  address?: string;
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

  // State to store clubs and selected club
  const [clubs, setClubs] = useState<Club[]>([]); // Stores the list of clubs
  const [selectedClub, setSelectedClub] = useState<Club | null>(null); // Stores the club selected by the user
  const [selectedClubAddress, setSelectedClubAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);

  // Modify getAllClubs to accept latitude and longitude
  const getAllClubs = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://agw3r0w73c.execute-api.eu-central-1.amazonaws.com/api-v1/club/get?longitude=${longitude}&latitude=${latitude}`
      );
      const data: GetClubsResponse = await response.json();
      setClubs(data.clubs); // Store the clubs in state
      console.log(data);
    } catch (error) {
      console.error(error);
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

      console.log("Region:", userRegion);

      // Set the user's location to state
      setLocation(userLocation.coords);

      // Fetch clubs using the actual latitude and longitude
      await getAllClubs(latitude, longitude);

      setLoading(false); // Stop loading after fetching location and clubs
    })();
  }, []);

  // Perform reverse geocoding when a club is selected
  useEffect(() => {
    if (selectedClub) {
      // Perform reverse geocoding
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
          console.error("Error in reverse geocoding:", error);
          setSelectedClubAddress(null);
        }
      })();
    } else {
      // Reset the address when no club is selected
      setSelectedClubAddress(null);
    }
  }, [selectedClub]);

  return (
    <>
      <View style={styles.container}>
        {loading ? (
          // Show loading indicator while fetching location
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading your location...</Text>
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
                  setSelectedClub(club);
                  setClubModalVisible(true);
                }}
                title={`${club.club_name} - click for details`}
              />
            ))}
          </MapView>
        )}
      </View>
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
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
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
