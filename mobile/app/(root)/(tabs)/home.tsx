import { Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";

import * as icons from "@/constants/icons";
import * as images from "@/constants/images";
import CustomSearch from "@/components/CustomSearch";
import EventCard from "@/components/EventCard";
import { getFirstTime } from "@/lib/secureStore";

const Home = () => {
  const [query, setQuery] = useState<string>("");
  const [introModal, setIntroModal] = useState<boolean>(false);

  useEffect(() => {
    // Fetch data
    const firstTIme = getFirstTime();

    if(firstTIme === null) {
      setIntroModal(true);
    }
  }, []);

  const onTextChange = (text: string) => {
    setQuery(text);
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="flex flex-row items-center justify-between w-full py-2 px-5">
          <View className="flex flex-row items-center mt-5">
            <Image source={images.logo} className="h-[41px] w-10" />
            <Text className="text-2xl font-bold text-txt-100 ml-2">
              RiConnect
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between w-full px-5 mt-10">
          <CustomSearch
            onChangeText={onTextChange}
            searchValue={query}
            placeholder="Search artists..."
          />
          <TouchableOpacity
            onPress={() => {
              router.push("/(root)/chat");
            }}
            className="bg-primary-0 p-4 w-[50px] h-[50px] rounded-full items-center justify-center shadow-sm shadow-neutral-50"
          >
            <Image source={icons.filter} className="h-4 w-[18px]" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-txt-100 px-5 mt-5">
          Upcoming Events
        </Text>
        <View className="flex flex-col items-center justify-center mt-5 pb-16">
          <EventCard />
          <EventCard />
          <EventCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
