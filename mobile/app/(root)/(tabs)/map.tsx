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
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import * as icons from "@/constants/icons";
import Modal from "react-native-modal";
import EventCard from "@/components/EventCard";
import { events } from "@/constants/events";

const Map = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // default lat (example)
    longitude: -122.4324, // default long (example)
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [clubModalVisible, setClubModalVisible] = useState(false);

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
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Set the user's location to state
      setLocation(userLocation.coords);
      setLoading(false); // Stop loading after fetching location
    })();
  }, []);

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
            <Marker
              coordinate={{
                latitude: location?.latitude || 0,
                longitude: location?.longitude || 0,
              }}
              image={icons.marker}
              onPress={() => setClubModalVisible(true)}
              title="Club Name - Click to view more"
            />
          </MapView>
        )}
      </View>
      <Modal
        isVisible={clubModalVisible}
        onBackdropPress={() => setClubModalVisible(false)}
      >
        <View className="h-1/2 w-full bg-neutral-200 rounded-3xl p-5">
          <ScrollView>
            <Text className="w-full font-bold text-2xl text-center">
              Club Name
            </Text>
            <View className="flex flex-col items-start justify-start mt-5">
              <View className="flex flex-row items-center justify-start mb-2">
                <Image source={icons.map} className="h-5 w-5 mr-2" />
                <Text>Club Address</Text>
              </View>
              <View className="flex flex-row items-center justify-start mb-2">
                <Image source={icons.calendar} className="h-5 w-5 mr-2" />
                <Text>Club Days</Text>
              </View>
              <View className="flex flex-row items-center justify-start">
                <Image source={icons.time} className="h-5 w-5 mr-2" />
                <Text>Club Hours</Text>
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
