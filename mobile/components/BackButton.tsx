import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router";

import * as icons from "@/constants/icons";

const BackButton = () => {
  return (
    <TouchableOpacity
      onPress={() => router.dismiss()}
      className="bg-primary-80 p-2 rounded-full items-center justify-center shadow-sm shadow-black absolute top-24 left-5 z-50"
    >
      <Image source={icons.arrowBack} className="h-5 w-5" tintColor="white" />
    </TouchableOpacity>
  );
};

export default BackButton;
