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

  // Combine all tags into one array
  const allFilters = [...genres, ...eventTypes, ...eventThemes];

  // State to track selected tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // State to track selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to handle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove the tag if it's already selected
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      // Add the tag to the selected list
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Function to handle date selection
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  // Function to apply filters
  const applyFilters = () => {
    console.log("Selected Tags:", selectedTags);
    console.log("Selected Date:", selectedDate);
    // You can proceed to filter your events based on selectedTags and selectedDate
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
            {selectedDate ? selectedDate.toLocaleDateString() : "Choose a date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View className="mt-2 w-full items-center">
            <DateTimePicker
              value={selectedDate || new Date()}
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
              onPress={() => toggleTag(genre)}
              className={`${
                selectedTags.includes(genre) ? "bg-primary-0" : "bg-neutral-100"
              } px-4 py-2 rounded-full mr-2 mb-2`}
            >
              <Text
                className={`${
                  selectedTags.includes(genre) ? "text-white" : "text-txt-100"
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
              onPress={() => toggleTag(type)}
              className={`${
                selectedTags.includes(type) ? "bg-primary-0" : "bg-neutral-100"
              } px-4 py-2 rounded-full mr-2 mb-2`}
            >
              <Text
                className={`${
                  selectedTags.includes(type) ? "text-white" : "text-txt-100"
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
              onPress={() => toggleTag(theme)}
              className={`${
                selectedTags.includes(theme) ? "bg-primary-0" : "bg-neutral-100"
              } px-4 py-2 rounded-full mr-2 mb-2`}
            >
              <Text
                className={`${
                  selectedTags.includes(theme) ? "text-white" : "text-txt-100"
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Filters;
