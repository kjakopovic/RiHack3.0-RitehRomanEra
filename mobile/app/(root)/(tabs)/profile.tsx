import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Href } from "expo-router";
import Modal from "react-native-modal";

import * as icons from "@/constants/icons";
import * as images from "@/constants/images";

const Profile = () => {
  const [infoModal, setInfoModal] = React.useState(false);

  return (
    <SafeAreaView className="bg-primary h-full px-5">
      <ScrollView>
        <View className="flex flex-row items-center justify-between bg-neutral-200 rounded-xl border border-primary-0 shadow-sm shadow-gray-400 p-4 mt-10">
          <View className="flex flex-row items-center justify-start">
            <View className="bg-secondary-200 rounded-full h-12 w-12">
              <Image
                source={images.profilePlace}
                className="h-12 w-12 rounded-full"
              />
            </View>
            <View className="flex flex-col ml-2">
              <Text className="text-txt-100 text-2xl font-bold">User</Text>
              <Text className="text-txt-200 text-lg font-light">
                email@gmail.com
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setInfoModal(true);
            }}
            className="bg-primary-0 p-2 rounded-lg items-center justify-center"
          >
            <Text className="text-sm font-semibold text-white">
              Points info
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col gap-y-2 items-center justify-start bg-neutral-200 rounded-xl border border-primary-0 shadow-sm shadow-gray-400 p-4 mt-12">
          <TouchableOpacity
            onPress={() => {
              router.push("/personal-info" as Href);
            }}
            className="flex flex-row items-center justify-between w-full pb-4 border-b border-secondary-200"
          >
            <View className="flex flex-row items-center justify-start">
              <View className="bg-neutral-100 items-center justify-center rounded-full h-8 w-8 mr-2">
                <Image source={icons.person} className="h-4 w-4" />
              </View>
              <Text className="text-txt-100 text-lg font-bold">Profile</Text>
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
              <View className="bg-neutral-100 items-center justify-center rounded-full h-8 w-8 mr-2">
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
              <View className="bg-neutral-100 items-center justify-center rounded-full h-8 w-8 mr-2">
                <Image source={icons.question} className="h-4 w-4" />
              </View>
              <Text className="text-txt-100 text-lg font-bold">FAQs</Text>
            </View>
            <Text className="text-txt-100 text-lg font-bold">{">"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal isVisible={infoModal}>
        <View className="bg-neutral-200 h-1/2 w-full items-start justify-center rounded-3xl p-5">
          <ScrollView className="w-full">
            <Text className="w-full font-bold text-2xl text-center">
              Points Information
            </Text>
            <View className="flex flex-col items-start justify-start mt-5">
              {/* Added explanation about earning points */}
              <Text className="mt-5 text-lg text-txt-200">
                You can earn points through the following actions:
              </Text>
              <Text className="mt-2 text-lg text-txt-100">
                - Sharing events: <Text className="font-bold">5 points</Text>
              </Text>
              <Text className="mt-2 text-lg text-txt-100">
                - Attending an event: <Text className="font-bold">1 point</Text>
              </Text>
              <Text className="mt-2 text-lg text-txt-100">
                - Each picture taken during an event:{" "}
                <Text className="font-bold">10 points</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={() => setInfoModal(false)}>
              <Text className="text-primary-0 text-lg font-bold mt-5 text-center">
                Close
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
