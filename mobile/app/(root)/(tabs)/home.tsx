// Home.tsx

import { Text, View, Image, RefreshControl, Modal } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";

import * as icons from "@/constants/icons";
import * as images from "@/constants/images";
import CustomSearch from "@/components/CustomSearch";
import EventCard from "@/components/EventCard";
import { getFirstTime, saveFirstTime } from "@/lib/secureStore";
import * as Location from "expo-location"; // Import expo-location
import { StatusBar } from "expo-status-bar";

import { useFilterStore } from "@/store/filter-store"; // Import the filter store
import useDebounce from "@/hooks/useDebounce"; // Import the custom debounce hook

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

const Home = () => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [introModal, setIntroModal] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Access filters from the store
  const selectedGenres = useFilterStore((state) => state.selectedGenres);
  const selectedTypes = useFilterStore((state) => state.selectedTypes);
  const selectedThemes = useFilterStore((state) => state.selectedThemes);
  const selectedDate = useFilterStore((state) => state.selectedDate);

  console.log("Home component rendered");
  console.log("Selected Genres:", selectedGenres);
  console.log("Selected Event Types:", selectedTypes);
  console.log("Selected Event Themes:", selectedThemes);
  console.log("Selected Date:", selectedDate);
  console.log("Query:", query);

  // Use the custom useDebounce hook
  const debouncedSearchQuery = useDebounce(query, 300);

  // Compute filtered events based on the debounced search query
  const filteredEvents = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return events;
    }
    return events.filter((event) =>
      event.title
        .toLowerCase()
        .includes(debouncedSearchQuery.trim().toLowerCase())
    );
  }, [events, debouncedSearchQuery]);

  useEffect(() => {
    const fetchFirstTime = async () => {
      try {
        const firstTime = await getFirstTime();
        console.log("First Time:", firstTime);
        if (firstTime === null) {
          setIntroModal(true);
          console.log("First time user detected", introModal);
        }
      } catch (error) {
        console.error("Error fetching first time:", error);
      }
    };

    fetchFirstTime();
  }, []);

  useEffect(() => {
    console.log("useEffect triggered: Fetching events");
    fetchEvents();
  }, [
    selectedGenres,
    selectedTypes,
    selectedThemes,
    selectedDate,
    // Remove debouncedQuery from dependencies since search is handled on frontend
  ]);

  const buildQueryParams = () => {
    const params: { [key: string]: string } = {};

    if (selectedGenres.length > 0) {
      params.genre = selectedGenres.join(",");
    }

    if (selectedTypes.length > 0) {
      params.type = selectedTypes.join(",");
    }

    if (selectedThemes.length > 0) {
      params.theme = selectedThemes.join(",");
    }

    if (selectedDate) {
      // Format the date as YYYY-MM-DD
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      params.date = formattedDate;
    }

    // Remove search query from backend fetch
    // if (debouncedSearchQuery) {
    //   params.query = debouncedSearchQuery;
    // }

    const queryString = new URLSearchParams(params).toString();
    console.log("Built Query Params:", queryString);
    return queryString;
  };

  const fetchEvents = async () => {
    console.log("fetchEvents called");
    try {
      // Using Constants to get the API_URL
      const API_URL = process.env.EXPO_PUBLIC_EVENT_API_URL;

      console.log("API_URL:", API_URL);

      if (!API_URL) {
        console.error("API_URL is not defined");
        return;
      }

      const queryParams = buildQueryParams();
      console.log("Built Query Params:", queryParams);

      const fetchURL = `${API_URL}/event/search?${queryParams}`;
      console.log("Fetch URL:", fetchURL);

      const response = await fetch(fetchURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        console.error("Error response from API:", response.status);
        return;
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      if (!data.events || !Array.isArray(data.events)) {
        console.error("Invalid API response structure:", data);
        return;
      }

      // For each event, perform reverse geocoding to get address
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
      console.log("Events with addresses:", eventsWithAddresses);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const onTextChange = (text: string) => {
    setQuery(text);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="flex flex-row items-center justify-between w-full py-2 px-5">
          <View className="flex flex-row items-center mt-5">
            <Image source={images.logo} className="h-[41px] w-10" />
            <Text className="text-2xl font-bold text-txt-100 ml-2">
              RiConnect
            </Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View className="flex flex-row items-center justify-between w-full px-5 mt-10">
          <CustomSearch
            onChangeText={onTextChange}
            searchValue={query}
            placeholder="Search events..."
          />
          <TouchableOpacity
            onPress={() => {
              router.push("/filters");
            }}
            className="bg-primary-0 p-4 w-[50px] h-[50px] rounded-full items-center justify-center shadow-sm shadow-neutral-50"
          >
            <Image source={icons.filter} className="h-4 w-[18px]" />
          </TouchableOpacity>
        </View>

        {/* Upcoming Events Title */}
        <Text className="text-2xl font-bold text-txt-100 px-5 mt-5">
          Upcoming Events
        </Text>

        {/* Events List */}
        <View className="flex flex-col items-center justify-center mt-5 pb-16">
          {/* Display a message if no events match the search query */}
          {filteredEvents.length === 0 && (
            <Text className="text-lg font-semibold text-txt-100 mt-5">
              No events found
            </Text>
          )}
          {/* Render the filtered events */}
          {filteredEvents.map((event) => (
            <EventCard key={event.event_id} event={event} hasPhoto={true} />
          ))}
        </View>
      </ScrollView>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Home;
