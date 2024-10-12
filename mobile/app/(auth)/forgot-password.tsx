// ForgotPassword.tsx

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import BackButton from "@/components/BackButton";

const ForgotPassword: React.FC = () => {
  // State variables to manage steps and inputs
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [codeDigits, setCodeDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [newPassword, setNewPassword] = useState<string>("");

  // Refs for code input fields to control focus
  const codeInputRefs = useRef<Array<TextInput | null>>([]);

  // Handler for submitting the email
  const handleEmailSubmit = async () => {
    if (email) {
      // TODO: Implement email validation and API call to send code
      const API_URL = process.env.EXPO_PUBLIC_USER_API_URL;
      const response = await fetch(
        `${API_URL}/authentication/change-password/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      if (response.ok) {
        setStep(2);
      } else {
        Alert.alert("Failed to send code");
      }
    } else {
      Alert.alert("Please enter your email address");
    }
  };

  // Handler for code input change
  const handleCodeChange = (text: string, index: number): void => {
    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = text;
    setCodeDigits(newCodeDigits);

    // Move to next input field automatically
    if (text && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }

    // Move to previous input field if backspacing
    if (!text && index > 0 && !newCodeDigits[index]) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // Handler for submitting the code
  const handleCodeSubmit = async () => {
    const code = codeDigits.join("");
    if (code.length === 6) {
      // TODO: Verify the code with the backend

      const API_URL = process.env.EXPO_PUBLIC_USER_API_URL;

      const response = await fetch(
        `${API_URL}/authentication/change-password/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            six_digit_code: code,
          }),
        }
      );

      if (response.ok) {
        setStep(3);
      } else {
        Alert.alert("Failed to verify code");
      }
    } else {
      Alert.alert("Please enter the 6-digit code");
    }
  };

  // Handler for submitting the new password
  const handlePasswordSubmit = async () => {
    if (newPassword) {
      // TODO: Update the password via API call
      const API_URL = process.env.EXPO_PUBLIC_USER_API_URL;

      const response = await fetch(
        `${API_URL}/authentication/change-password/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            new_password: newPassword,
          }),
        }
      );

      if (response.ok) {
        Alert.alert(
          "Your password has been reset successfully",
          "You can now sign in with your new password",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate to the sign-in screen
                router.replace("/sign-in");
              },
            },
          ]
        );
      } else {
        Alert.alert("Failed to reset password");
      }
      // Reset all states
      setStep(1);
      setEmail("");
      setCodeDigits(["", "", "", "", "", ""]);
      setNewPassword("");
    } else {
      Alert.alert("Please enter a new password");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-200 p-4">
      <BackButton />
      <View className="mb-6 mt-20">
        {step === 1 && (
          <>
            <Text className="text-2xl font-bold mb-4">Forgot Password</Text>
            <Text className="text-base mb-4">
              Enter your email address below to reset your password.
            </Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"gray"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white p-4 rounded-md mb-4 border border-primary-0"
            />
            <TouchableOpacity
              onPress={handleEmailSubmit}
              className="bg-blue-500 p-4 rounded-md"
            >
              <Text className="text-white text-center font-bold">Submit</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-2xl font-bold mb-4">
              Enter Verification Code
            </Text>
            <Text className="text-base mb-4">
              We have sent a 6-digit verification code to your email.
            </Text>
            <View style={styles.codeInputContainer}>
              {codeDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref: TextInput | null) =>
                    (codeInputRefs.current[index] = ref)
                  }
                  value={digit}
                  onChangeText={(text: string) => handleCodeChange(text, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.codeInput}
                />
              ))}
            </View>
            <TouchableOpacity
              onPress={handleCodeSubmit}
              className="bg-blue-500 p-4 rounded-md mt-4"
            >
              <Text className="text-white text-center font-bold">
                Verify Code
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text className="text-2xl font-bold mb-4">Reset Password</Text>
            <Text className="text-base mb-4">
              Enter your new password below.
            </Text>
            <TextInput
              placeholder="New Password"
              placeholderTextColor={"gray"}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              className="bg-white p-4 rounded-md mb-4 border border-primary-0"
            />
            <TouchableOpacity
              onPress={handlePasswordSubmit}
              className="bg-blue-500 p-4 rounded-md"
            >
              <Text className="text-white text-center font-bold">
                Reset Password
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  codeInput: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
    width: 40,
    borderWidth: 1,
    borderColor: "#0A5EFE",
  },
});

export default ForgotPassword;
