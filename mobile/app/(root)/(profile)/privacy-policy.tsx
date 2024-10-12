import React from "react";
import { ScrollView, Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";

const PrivacyPolicy = () => {
  return (
    <SafeAreaView className="h-full bg-neutral-200">
      <BackButton />
      <ScrollView className="bg-neutral-200 p-4">
        <View className="mb-6 mt-20">
          <Text className="text-2xl text-txt-100 font-bold mb-4">
            Privacy Policy
          </Text>
          <Text className="text-base text-txt-200 mb-4">
            Last updated: [Insert Date]
          </Text>

          <Text className="text-lg text-txt-100 font-semibold mb-2">
            Introduction
          </Text>
          <Text className="text-base text-txt-200 mb-4">
            Welcome to [App Name]. We are committed to protecting your personal
            data and respecting your privacy.
          </Text>

          <Text className="text-lg text-txt-100 font-semibold mb-2">
            Data We Collect
          </Text>
          <Text className="text-base text-txt-200 mb-4">
            We collect the following types of data to provide and improve our
            service:
          </Text>
          <View className="ml-4 mb-4">
            <Text className="text-base text-txt-200">
              • Personal identification information (Name, email address, etc.)
            </Text>
            <Text className="text-base text-txt-200">
              • Usage data (App interactions, crash logs, etc.)
            </Text>
          </View>

          <Text className="text-lg text-txt-100 font-semibold mb-2">
            How We Use Your Data
          </Text>
          <Text className="text-base text-txt-200 mb-4">
            We use your personal data to improve the user experience, analyze
            performance, and provide customer support.
          </Text>

          <Text className="text-lg text-txt-100 font-semibold mb-2">
            Data Security
          </Text>
          <Text className="text-base text-txt-200 mb-4">
            We strive to protect your data with industry-standard security
            measures. However, no method of transmission over the internet is
            100% secure.
          </Text>

          <Text className="text-lg text-txt-100 font-semibold mb-2">
            Your Rights
          </Text>
          <Text className="text-base text-txt-200 mb-4">
            You have the right to access, correct, or delete your personal data.
            To exercise these rights, please contact us at [Contact
            Information].
          </Text>

          <Text className="text-lg text-txt-100 font-semibold mb-2">
            Changes to This Policy
          </Text>
          <Text className="text-base text-txt-200 mb-4">
            We may update this privacy policy from time to time. We will notify
            you of any changes by updating the "Last Updated" date at the top of
            this page.
          </Text>

          <Text className="text-lg text-txt-100 font-semibold mb-2">
            Contact Us
          </Text>
          <Text className="text-base text-txt-200 mb-4">
            If you have any questions about this privacy policy, please contact
            us at [Your Email Address].
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
