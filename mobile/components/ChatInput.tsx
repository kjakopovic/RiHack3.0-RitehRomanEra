import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import React from "react";

import * as icons from "@/constants/icons";

// Define the prop types for ChatInput
type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="w-full p-4 pt-1 bg-secondary-100 border-t border-secondary-200"
    >
      <View className="flex flex-row items-center justify-between w-full py-2">
        {/* Message Input Field */}
        <View className="flex flex-row items-center border border-secondary-200 rounded-full w-4/5">
          <TextInput
            placeholder="Type a message"
            placeholderTextColor="gray"
            selectionColor="black"
            className="p-3 w-full"
            value={value} // Use value prop
            onChangeText={onChangeText} // Handle text change
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity onPress={onSend}>
          {" "}
          {/* Trigger onSend when pressed */}
          <View className="rounded-full w-10 h-10 bg-secondary-200 relative shadow-sm shadow-zinc-400">
            <Image
              source={icons.send}
              className="h-6 w-6 absolute top-2 left-2.5"
              tintColor="white"
            />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput;
