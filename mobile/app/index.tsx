import { Href, router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as images from "@/constants/images";

export default function Onboarding() {
  const handleSignIn = () => {
    // Navigate to sign-in screen
    router.push("/(auth)/sign-in" as Href);
  };

  const handleSignUp = () => {
    // Navigate to sign-up screen
    router.push("/(auth)/sign-up" as Href);
  };

  return (
    <SafeAreaView className="h-full flex flex-col justify-between items-center bg-primary">
      <View className="flex flex-col items-center justify-center h-1/2 mt-24">
        <Image source={images.logo} className="h-28 w-28" />
        <Text className="text-3xl font-medium text-primary-80 mt-5">
          Connect, Visit, Enjoy
        </Text>
      </View>
      <View className="w-full items-center justify-center gap-y-4 px-5">
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-primary-0 p-2 rounded-lg w-full items-center justify-center"
        >
          <Text className="text-lg font-semibold text-white">Sign-in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-white border border-primary-0 p-2 rounded-lg w-full items-center justify-center"
        >
          <Text className="text-lg font-semibold text-primary-0">Sign-up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
