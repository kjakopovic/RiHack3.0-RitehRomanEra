import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Href } from "expo-router";

import * as icons from "@/constants/icons";

const Profile = () => {
  return (
    <SafeAreaView className="bg-primary h-full px-5">
      <ScrollView>
        <View className="flex flex-row items-center justify-start bg-neutral-200 rounded-xl border border-primary-0 shadow-sm shadow-gray-400 p-4 mt-10">
          <View className="bg-secondary-200 rounded-full h-12 w-12" />
          <View className="flex flex-col ml-2">
            <Text className="text-txt-100 text-2xl font-bold">User</Text>
            <Text className="text-txt-200 text-lg font-light">
              email@gmail.com
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-y-2 items-center justify-start bg-neutral-200 rounded-xl border border-primary-0 shadow-sm shadow-gray-400 p-4 mt-12">
          <TouchableOpacity
            onPress={() => {
              router.push("/personal-info" as Href);
            }}
            className="flex flex-row items-center justify-between w-full pb-4 border-b border-secondary-200"
          >
            <View className="flex flex-row items-center justify-start">
              <View className="bg-neutral-100 items-center justify-center rounded-full h-8 w-8 mr-2" >
                <Image source={icons.person} className="h-4 w-4" />
              </View>
              <Text className="text-txt-100 text-lg font-bold">Profile</Text>
            </View>
            <Text className="text-txt-100 text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/preferences");
            }}
            className="flex flex-row items-center justify-between w-full py-4 border-b border-secondary-200"
          >
            <View className="flex flex-row items-center justify-start">
            <View className="bg-neutral-100 items-center justify-center rounded-full h-8 w-8 mr-2" >
                <Image source={icons.settings} className="h-4 w-4" />
              </View>
              <Text className="text-txt-100 text-lg font-bold">
                Preferences
              </Text>
            </View>
            <Text className="text-txt-100 text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/privacy-policy");
            }}
            className="flex flex-row items-center justify-between w-full py-4 border-b border-secondary-200"
          >
            <View className="flex flex-row items-center justify-start">
            <View className="bg-neutral-100 items-center justify-center rounded-full h-8 w-8 mr-2" >
                <Image source={icons.lock} className="h-4 w-4" />
              </View>
              <Text className="text-txt-100 text-lg font-bold">
                Privacy Policy
              </Text>
            </View>
            <Text className="text-txt-100 text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/faqs");
            }}
            className="flex flex-row items-center justify-between w-full pt-4"
          >
            <View className="flex flex-row items-center justify-start">
            <View className="bg-neutral-100 items-center justify-center rounded-full h-8 w-8 mr-2" >
                <Image source={icons.question} className="h-4 w-4" />
              </View>
              <Text className="text-txt-100 text-lg font-bold">FAQs</Text>
            </View>
            <Text className="text-txt-100 text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
