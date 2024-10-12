import { Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import Modal from "react-native-modal";

import * as icons from "@/constants/icons";
import * as images from "@/constants/images";
import CustomSearch from "@/components/CustomSearch";
import EventCard from "@/components/EventCard";
import { getFirstTime, saveFirstTime } from "@/lib/secureStore";

const Home = () => {
  const [query, setQuery] = useState<string>("");
  const [introModal, setIntroModal] = useState<boolean>(false);

  useEffect(() => {
    // Fetch data
    const fetchFirstTime = async () => {
      const firstTIme = await getFirstTime();

      console.log("First Time:", firstTIme);

      if (firstTIme === null) {
        setIntroModal(true);
      }
    };

    fetchFirstTime();
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
      <Modal isVisible={introModal}>
        <View className="bg-neutral-200 h-full w-full items-center justify-center rounded-3xl">
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 15 }}
          >
            <View className="flex items-center w-full justify-center mt-20">
              <Image
                source={images.welcome}
                className="h-64 w-64"
                resizeMode="stretch"
              />
              <Text className="text-3xl font-bold text-txt-100 mt-5 text-center">
                Welcome to RiConnect!
              </Text>
            </View>
            <View className="flex items-center w-full justify-center mt-5">
              <Text
                className="text-lg font-semibold text-txt-100 mt-5 leading-7 text-center"
                style={{ lineHeight: 24 }}
              >
                RiConnect makes enjoying events even more exciting. Here's how
                our point system works:
              </Text>
              <Text
                className="text-base font-medium text-txt-100 mt-4 leading-6"
                style={{ lineHeight: 22 }}
              >
                • <Text className="font-bold">Share Events:</Text> Spread the
                word! Earn points every time you share events with friends and
                your community.
              </Text>
              <Text
                className="text-base font-medium text-txt-100 mt-3 leading-6"
                style={{ lineHeight: 22 }}
              >
                • <Text className="font-bold">Attend Events:</Text> Get rewarded
                just for showing up! Earn points by attending events you're
                interested in.
              </Text>
              <Text
                className="text-base font-medium text-txt-100 mt-3 leading-6"
                style={{ lineHeight: 22 }}
              >
                • <Text className="font-bold">Capture Moments:</Text> Take
                photos while you're at the event, and earn extra points for
                capturing the experience.
              </Text>
              <Text
                className="text-base font-medium text-txt-100 mt-4 leading-7 text-center"
                style={{ lineHeight: 22 }}
              >
                Your points go towards a leaderboard where you can see how you
                rank against others. Plus, you can spend your points to get a
                leg up in giveaways and unlock exclusive perks. The more you
                engage, the more rewards you get!
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIntroModal(false);
                saveFirstTime();
              }}
              className="bg-primary-0 p-3 rounded-lg w-full items-center justify-center mt-12"
            >
              <Text className="text-lg text-white font-semibold">
                Get Started
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
