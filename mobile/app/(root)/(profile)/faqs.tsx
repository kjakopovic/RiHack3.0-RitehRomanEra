import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";

import * as icons from "@/constants/icons";
import BackButton from "@/components/BackButton"; // Assuming BackButton is in components
import { SafeAreaView } from "react-native-safe-area-context";

interface FAQ {
  question: string;
  answer: string;
}

const FAQScreen: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "What is [App Name]?",
      answer:
        "[App Name] is a mobile app that helps users [insert app purpose].",
    },
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, go to the login screen, click 'Forgot Password,' and follow the instructions.",
    },
    {
      question: "How do I contact support?",
      answer: "You can contact our support team at [support email].",
    },
    // Add more FAQs as needed
  ];

  return (
    <SafeAreaView className="flex-1 bg-neutral-200">
      {/* Back Button */}
      <BackButton />

      <ScrollView className="p-5">
        <Text className="text-2xl text-txt-100 font-bold mb-4 mt-20">
          Frequently Asked Questions
        </Text>

        {faqs.map((faq, index) => (
          <View key={index} className="mb-4">
            <TouchableOpacity
              onPress={() => toggleQuestion(index)}
              className="bg-primary-0 p-3 rounded-md flex-row justify-between items-center"
            >
              <Text className="text-base text-white font-medium">
                {faq.question}
              </Text>
              {openQuestion === index ? (
                <Image
                  source={icons.arrowUp}
                  className="h-5 w-5"
                  tintColor="white"
                />
              ) : (
                <Image
                  source={icons.arrowDown}
                  className="h-5 w-5"
                  tintColor="white"
                />
              )}
            </TouchableOpacity>

            {openQuestion === index && (
              <View className="bg-neutral-100 p-3 mt-2 rounded-md">
                <Text className="text-base text-txt-200">{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;
