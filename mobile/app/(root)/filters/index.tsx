import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFilterStore } from "@/store/filter-store";
import { router } from "expo-router";

const Filters = () => {
  // Define the filters
  const genres = [
    "Electronic Dance Music (EDM)",
    "House",
    "Hip Hop",
    "Techno",
    "Pop",
  ];

  const eventTypes = [
    "Live DJ Performances",
    "Theme Parties",
    "Guest Appearances",
  ];

  const eventThemes = [
    "Neon/Glow Party",
    "Retro Night (80s/90s)",
    "Masquerade Ball",
  ];

  // Access filter states and actions from the store
  const selectedGenres = useFilterStore((state) => state.selectedGenres);
  const selectedTypes = useFilterStore((state) => state.selectedTypes);
  const selectedThemes = useFilterStore((state) => state.selectedThemes);
  const selectedDate = useFilterStore((state) => state.selectedDate);
  const setSelectedGenres = useFilterStore((state) => state.setSelectedGenres);
  const setSelectedTypes = useFilterStore((state) => state.setSelectedTypes);
  const setSelectedThemes = useFilterStore((state) => state.setSelectedThemes);
  const setSelectedDate = useFilterStore((state) => state.setSelectedDate);
  const clearFilters = useFilterStore((state) => state.clearFilters);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to handle genre selection
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      // Remove the genre if it's already selected
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      // Add the genre to the selected list
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Function to handle event type selection
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      // Remove the type if it's already selected
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      // Add the type to the selected list
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Function to handle event theme selection
  const toggleTheme = (theme: string) => {
    if (selectedThemes.includes(theme)) {
      // Remove the theme if it's already selected
      setSelectedThemes(selectedThemes.filter((th) => th !== theme));
    } else {
      // Add the theme to the selected list
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  // Function to handle date selection
  const onChangeDate = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date.toISOString().split("T")[0]);
    }
  };

  // Function to apply filters
  const applyFilters = () => {
    console.log("Selected Genres:", selectedGenres);
    console.log("Selected Event Types:", selectedTypes);
    console.log("Selected Event Themes:", selectedThemes);
    console.log("Selected Date:", selectedDate);
    // Navigate back to the Home screen
    router.back();
  };

  // Function to clear all filters
  const resetFilters = () => {
    clearFilters();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-200 p-4">
      <BackButton />
      <ScrollView className="px-4">
        <View>
          <Text className="text-txt-100 text-2xl font-bold mb-4 mt-6 ml-10">
            Filters
          </Text>
        </View>

        {/* Date Selection */}
        <Text className="text-txt-100 text-xl font-semibold mt-4">
          Select Date
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-neutral-100 px-4 py-2 rounded-full mt-2"
        >
          <Text className="text-txt-100 text-sm">
            {selectedDate ? selectedDate : "Choose a date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View className="mt-2 w-full items-center">
            <DateTimePicker
              value={new Date(selectedDate as string) || new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          </View>
        )}

        {/* Genres */}
        <Text className="text-txt-100 text-xl font-semibold mt-6">Genres</Text>
        <View className="flex flex-row flex-wrap mt-2">
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre}
              onPress={() => toggleGenre(genre)}
              className={`${
                selectedGenres.includes(genre)
                  ? "bg-primary-0"
                  : "bg-neutral-100"
              } px-4 py-2 rounded-full mr-2 mb-2`}
            >
              <Text
                className={`${
                  selectedGenres.includes(genre) ? "text-white" : "text-txt-100"
                } text-sm`}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Event Types */}
        <Text className="text-txt-100 text-xl font-semibold mt-6">
          Event Types
        </Text>
        <View className="flex flex-row flex-wrap mt-2">
          {eventTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => toggleType(type)}
              className={`${
                selectedTypes.includes(type) ? "bg-primary-0" : "bg-neutral-100"
              } px-4 py-2 rounded-full mr-2 mb-2`}
            >
              <Text
                className={`${
                  selectedTypes.includes(type) ? "text-white" : "text-txt-100"
                } text-sm`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Event Themes */}
        <Text className="text-txt-100 text-xl font-semibold mt-6">
          Event Themes
        </Text>
        <View className="flex flex-row flex-wrap mt-2">
          {eventThemes.map((theme) => (
            <TouchableOpacity
              key={theme}
              onPress={() => toggleTheme(theme)}
              className={`${
                selectedThemes.includes(theme)
                  ? "bg-primary-0"
                  : "bg-neutral-100"
              } px-4 py-2 rounded-full mr-2 mb-2`}
            >
              <Text
                className={`${
                  selectedThemes.includes(theme) ? "text-white" : "text-txt-100"
                } text-sm`}
              >
                {theme}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Apply Filters Button */}
        <TouchableOpacity
          onPress={applyFilters}
          className="bg-primary-0 px-4 py-2 w-full items-center rounded-full mt-8 mb-4 self-center"
        >
          <Text className="text-white text-base font-bold">Apply Filters</Text>
        </TouchableOpacity>

        {/* Clear Filters Button */}
        <TouchableOpacity
          onPress={resetFilters}
          className="bg-neutral-100 px-4 py-2 w-full items-center rounded-full mb-4 self-center"
        >
          <Text className="text-txt-100 text-base font-bold">
            Clear Filters
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Filters;
