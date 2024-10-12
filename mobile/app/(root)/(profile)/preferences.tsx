import React, { useState } from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import BackButton from "@/components/BackButton"; // Assuming BackButton is in components
import { SafeAreaView } from "react-native-safe-area-context"; // Safe area context

// Define types for preferences
interface Preference {
  label: string;
  value: boolean;
}

const PreferencesScreen: React.FC = () => {
  // Preferences state array
  const [preferences, setPreferences] = useState<Preference[]>([
    { label: "Enable Notifications", value: true },
    { label: "Dark Mode", value: false },
    { label: "Receive Newsletter", value: true },
  ]);

  // Toggle function for switches
  const togglePreference = (index: number) => {
    setPreferences((prev) => {
      const newPreferences = [...prev];
      newPreferences[index].value = !newPreferences[index].value;
      return newPreferences;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-0">
      {/* Back Button */}
      <BackButton />

      <ScrollView className="p-5 mt-20">
        <Text className="text-2xl text-txt-100 font-bold mb-4">
          Preferences
        </Text>

        {/* Render Preferences */}
        {preferences.map((pref, index) => (
          <View
            key={index}
            className="mb-4 flex-row justify-between items-center bg-secondary-50 p-4 rounded-md"
          >
            <Text className="text-base text-txt-100">{pref.label}</Text>
            <Switch
              value={pref.value}
              onValueChange={() => togglePreference(index)}
              trackColor={{ false: "#E0E0E0", true: "#096B72" }} // Use theme colors
              thumbColor={pref.value ? "#FFFFFF" : "#E0E0E0"}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PreferencesScreen;
