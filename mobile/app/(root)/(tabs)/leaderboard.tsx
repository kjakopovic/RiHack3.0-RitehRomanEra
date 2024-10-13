// Leaderboard.tsx

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { getTokens } from "@/lib/secureStore";
import * as icons from "@/constants/icons";

interface User {
  email: string;
  first_name: string;
  last_name: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_USER_API_URL;
    const fetchLeaderboard = async () => {
      try {
        const { jwtToken } = await getTokens();
        const response = await fetch(`${API_URL}/user/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const data = await response.json();
        console.log("Leaderboard data:", data);
        // Assuming data.users is the array of users
        // Sort users by points in descending order
        const sortedUsers = data.users.sort(
          (a: User, b: User) => b.points - a.points
        );

        setUsers(sortedUsers);
        console.log("Sorted Users:", sortedUsers);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderItem = ({ item, index }: { item: User; index: number }) => {
    let icon;
    if (index === 0) {
      icon = icons.first;
    } else if (index === 1) {
      icon = icons.second;
    } else if (index === 2) {
      icon = icons.third;
    }

    return (
      <View
        key={item.email}
        className="flex-row items-center bg-white rounded-xl mb-2 p-4 shadow-sm shadow-neutral-50"
      >
        <View className="w-12 items-center">
          {icon ? (
            <Image source={icon} className="w-7 h-8" />
          ) : (
            <Text className="text-lg font-bold text-gray-700">{index + 1}</Text>
          )}
        </View>
        <View className="flex-1 pl-2">
          <Text className="text-lg text-gray-800">
            {item.first_name} {item.last_name}
          </Text>
        </View>
        <View className="w-20 items-end">
          <Text className="text-base font-bold text-gray-800">
            {item.points} pts
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-200 p-4">
      <Text className="text-3xl font-bold mb-4 text-center text-gray-800">
        Leaderboard
      </Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.email}
        renderItem={renderItem}
        className="px-1 pt-1"
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Leaderboard;
