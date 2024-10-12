import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text } from "react-native";
import { liveEvents, pastEvents, upcomingEvents } from "@/constants/events";
import EventCard from "@/components/EventCard"; // Adjust the import path as needed

const Notifications = () => {
  return (
    <SafeAreaView className="bg-neutral-100 flex-1">
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
                <EventCard event={event} />
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
    </SafeAreaView>
  );
};

export default Notifications;
