import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema } from "@/schemas/zod-schemas";
import { removeFirstTime } from "@/lib/secureStore";

const SignUp = () => {
  // Initialize useForm with zodResolver for validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  // Handle form submission
  const handleSignUp = async (data: any) => {
    console.log("Form data:", data);

    const { first_name, last_name, age, email, password } = data;

    console.log("First Name:", first_name);

    const API_URL = process.env.EXPO_PUBLIC_USER_API_URL;

    console.log("API URL:", API_URL);

    try {
      const response = await fetch(`${API_URL}/authentication/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          age,
          email,
          password,
        }),
      });

      const responseData = await response.json();

      console.log("Response data:", responseData);

      await removeFirstTime();

      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary border">
      <ScrollView className="w-full h-full py-2">
        <View className="w-full h-full flex items-center justify-center gap-y-5">
          <Text className="text-txt-100 text-start w-full pl-5 pt-5 text-2xl font-bold">
            Create you account
          </Text>

          {/* Form Fields */}
          <View className="w-full items-center justify-center gap-y-4 px-5">
            {/* First Name */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text>First Name</Text>
              <TextInput
                className="bg-primary border border-primary-80 p-2 rounded-lg w-full"
                placeholder="First Name"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setValue("first_name", text)}
                {...register("first_name")}
              />
              {errors.firstName && (
                <Text className="text-danger">
                  *{errors.firstName.message as string}
                </Text>
              )}
            </View>

            {/* Last Name */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text>Last Name</Text>
              <TextInput
                className="bg-primary border border-primary-80 p-2 rounded-lg w-full"
                placeholder="Last Name"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setValue("last_name", text)}
                {...register("last_name")}
              />
              {errors.lastName && (
                <Text className="text-danger">
                  *{errors.lastName.message as string}
                </Text>
              )}
            </View>

            {/* Age */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text>Age</Text>
              <TextInput
                className="bg-primary border border-primary-80 p-2 rounded-lg w-full"
                placeholder="Age"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setValue("age", parseInt(text))}
                keyboardType="numeric"
                {...register("age")}
              />
              {errors.age && (
                <Text className="text-danger">
                  *{errors.age.message as string}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text>Email</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-primary border border-primary-80 p-2 rounded-lg w-full"
                placeholder="Email"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setValue("email", text)}
                {...register("email")}
              />
              {errors.email && (
                <Text className="text-danger">
                  *{errors.email.message as string}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text>Password</Text>
              <TextInput
                className="bg-primary border border-primary-80 p-2 rounded-lg w-full"
                placeholder="Password"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setValue("password", text)}
                secureTextEntry={true}
                {...register("password")}
              />
              {errors.password && (
                <Text className="text-danger">
                  *{errors.password.message as string}
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View className="flex flex-col gap-y-2 w-full">
              <Text>Confirm Password</Text>
              <TextInput
                className="bg-primary border border-primary-80 p-2 rounded-lg w-full"
                placeholder="Confirm Password"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setValue("confirmPassword", text)}
                secureTextEntry={true}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <Text className="text-danger">
                  *{errors.confirmPassword.message as string}
                </Text>
              )}
            </View>
          </View>

          {/* Sign In Option */}
          <View className="flex flex-row items-center justify-start gap-x-2 w-full px-5">
            <Text className="text-base font-medium text-txt-200">
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/sign-in");
              }}
            >
              <Text className="text-base font-medium text-primary-95">
                Sign-in
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View className="w-full items-center justify-center px-5">
            <TouchableOpacity
              onPress={handleSubmit(handleSignUp)}
              className="bg-primary-0 p-2 rounded-lg w-full items-center justify-center mt-16"
            >
              <Text className="text-lg text-white font-semibold">Sign-up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
