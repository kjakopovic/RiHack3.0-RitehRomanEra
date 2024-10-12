import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton"; // Adjust to your path
import { Href, router } from "expo-router"; // For navigation
import { getTokens } from "@/lib/secureStore";

const participantsList = [
  { id: "1", name: "John Doe", email: "jon@doe.com" },
  { id: "2", name: "Marin Mikulec", email: "mikuec.marin52@gmail.com" },
  { id: "3", name: "Mark Wilson" },
  // Add more mock participants
];

const NewChat = () => {
  const [roomName, setRoomName] = useState(""); // Room name state
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  ); // Selected participants

  // Function to handle participant selection
  const toggleParticipantSelection = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(
        selectedParticipants.filter((participant) => participant !== id)
      );
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  // Handler for creating a new chat room
  const handleCreateRoom = async () => {
    if (!roomName || selectedParticipants.length === 0) {
      console.log("Please provide a room name and select participants");
      return;
    }

    const API_URL = process.env.EXPO_PUBLIC_CHAT_API_URL;

    const tokens = await getTokens();

    if (!tokens || !tokens.jwtToken) {
      console.error("Unable to retrieve tokens");
      return;
    }

    // Map selectedParticipants to their corresponding emails
    const selectedEmails = participantsList
      .filter((participant) => selectedParticipants.includes(participant.id))
      .map((participant) => participant.email); // Assuming `email` is the field for the participant's email.

    const newRoomData = {
      chat_room_users: selectedEmails, // Pass participant emails
    };

    try {
      const response = await fetch(`${API_URL}/chat/room/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.jwtToken}`, // Include user token for authentication
        },
        body: JSON.stringify(newRoomData),
      });

      const responseData = await response.json();
      console.log("Room created:", responseData.message);

      // Navigate back to the chat list or the new room
      router.push("/[roomId]" as Href);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <BackButton />
      <View className="flex-row items-center justify-between px-4 py-4 bg-primary mt-6">
        <Text className="text-txt-100 text-2xl font-bold ml-12">New Chat</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="px-4 py-4">
        <View className="mb-6">
          <Text className="text-txt-100 text-lg mb-2">Room Name</Text>
          <TextInput
            className="bg-secondary-0 border border-secondary-50 p-3 rounded-lg text-txt-100"
            placeholder="Enter Room Name"
            value={roomName}
            onChangeText={setRoomName}
          />
        </View>
        <Text className="text-txt-100 text-lg mb-2">Select Participants</Text>
        {participantsList.map((participant) => (
          <TouchableOpacity
            key={participant.id}
            className={`flex-row items-center justify-between p-3 mb-2 bg-secondary-0 rounded-lg border ${
              selectedParticipants.includes(participant.id)
                ? "border-secondary-200"
                : "border-secondary-50"
            }`}
            onPress={() => toggleParticipantSelection(participant.id)}
          >
            <Text className="text-txt-100 text-base">{participant.name}</Text>
            {selectedParticipants.includes(participant.id) ? (
              <Text className="text-success font-bold">Selected</Text>
            ) : (
              <Text className="text-danger font-bold">Select</Text>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          className="bg-secondary-200 p-3 mt-6 rounded-lg items-center justify-center"
          onPress={handleCreateRoom}
        >
          <Text className="text-white text-lg font-semibold">Create Room</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewChat;
