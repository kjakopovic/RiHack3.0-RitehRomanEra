import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as icons from "@/constants/icons";
import ChatInput from "@/components/ChatInput";

type Message = {
  message: string;
  sent_from: string; // Could be email or user ID
  chat_id: string; // Chat room ID
};

const UserMessage = ({ message }: { message: string }) => {
  return (
    <View className="flex flex-row-reverse items-center justify-start gap-x-2 m-2">
      <View className="flex flex-row items-center h-10 w-10 rounded-full bg-secondary-200" />
      <View className="flex flex-col bg-secondary-200 py-2 px-4 rounded-xl">
        <Text className="text-white font-regular text-base">{message}</Text>
      </View>
    </View>
  );
};

const OtherMessage = ({ message }: { message: string }) => {
  return (
    <View className="flex flex-row items-center justify-start gap-x-2 mx-0.5">
      <View className="flex flex-row items-center h-10 w-10 rounded-full bg-secondary-200" />
      <View className="flex flex-col bg-secondary-200 py-2 px-4 rounded-xl">
        <Text className="text-white font-regular text-base">{message}</Text>
      </View>
    </View>
  );
};

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const API_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

  // Correct type for WebSocket or null
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket(`${API_URL}/api-v1/on_connect`);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (ws.current) {
      const messageData = {
        action: "sendmessage",
        chat_id: "chatId", // Replace with actual chat ID
        message: messageInput,
        sent_from: "yourEmail", // Replace with sender email/ID
      };

      ws.current.send(JSON.stringify(messageData));
      setMessageInput("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-secondary-100">
        <View className="flex flex-row items-center justify-between p-4 bg-secondary-100 border-b border-secondary-200">
          <View className="flex flex-row items-center gap-x-2">
            <TouchableOpacity
              onPress={() => {
                router.dismiss();
              }}
            >
              <Image
                source={icons.arrowBack}
                className="h-7 w-7"
                tintColor={"#333333"}
              />
            </TouchableOpacity>
            <View className="flex flex-row items-center h-10 w-10 rounded-full bg-white" />
            <Text className="text-xl font-semibold text-txt-100">User</Text>
          </View>
          <Image
            source={icons.search}
            className="h-7 w-7"
            tintColor={"#333333"}
          />
        </View>

        <ScrollView className="flex-1 h-full bg-primary py-2 relative">
          <Text className="text-center text-txt-200 opacity-70 my-5">
            This is the beginning of the chat
          </Text>
          {messages.map((msg, index) =>
            msg.sent_from === "yourEmail" ? (
              <UserMessage key={index} message={msg.message} />
            ) : (
              <OtherMessage key={index} message={msg.message} />
            )
          )}
        </ScrollView>

        <ChatInput
          value={messageInput}
          onChangeText={setMessageInput}
          onSend={handleSendMessage}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ChatRoom;
