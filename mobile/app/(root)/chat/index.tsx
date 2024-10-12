import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton"; // Adjust the path to your actual BackButton component
import { router } from "expo-router";

const Chat = () => {
  const chatRooms = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hey! Are you coming today?",
    },
    {
      id: "2",
      name: "Jane Smith",
      lastMessage: "Let's catch up tomorrow!",
    },
    {
      id: "3",
      name: "Mark Wilson",
      lastMessage: "Got it, thanks!",
    },
  ];

  // Handler for the New Chat button (add your own logic here)
  const handleNewChat = () => {
    console.log("Navigate to New Chat Screen");
    router.push("/chat/new");
    // You can use router.push("/new-chat") or any navigation logic
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <BackButton />
      <View className="flex-row items-center justify-between px-4 py-4 bg-primary mt-5">
        <Text className="text-txt-100 text-2xl font-bold ml-12">Chats</Text>
        <TouchableOpacity
          onPress={handleNewChat}
          className="bg-secondary-200 p-2 rounded-lg"
        >
          <Text className="text-white text-base font-semibold">New Chat</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4 py-4">
        {chatRooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            className="flex-row items-center gap-x-3 p-4 bg-secondary-0 rounded-lg mb-3 shadow"
          >
            <View className="w-12 h-12 bg-secondary-50 rounded-full" />
            <View className="flex-1">
              <Text className="text-txt-100 text-lg font-semibold">
                {room.name}
              </Text>
              <Text className="text-txt-200 text-base" numberOfLines={1}>
                {room.lastMessage}
              </Text>
            </View>
            <Text className="text-txt-200 text-xs">12:30 PM</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
