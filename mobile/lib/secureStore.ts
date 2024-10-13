import * as SecureStore from "expo-secure-store";

// Function to store JWT and refresh tokens
export const storeTokens = async (jwtToken: string, refreshToken: string) => {
  try {
    // Store JWT Token
    await SecureStore.setItemAsync(
      "jwtToken",
      JSON.stringify(jwtToken) as string
    );

    // Store Refresh Token
    await SecureStore.setItemAsync(
      "refreshToken",
      JSON.stringify(refreshToken) as string
    );

    console.log("Tokens stored successfully");
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

// Function to retrieve JWT and refresh tokens
export async function getTokens() {
  try {
    const jwtToken = await SecureStore.getItemAsync("jwtToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    // Check if the retrieved tokens are valid JSON strings
    const isJson = (str: string) => {
      try {
        JSON.parse(str);
        return true;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return false;
      }
    };

    console.log("Retrieved Tokens:", { jwtToken, refreshToken });

    return {
      jwtToken: jwtToken && isJson(jwtToken) ? JSON.parse(jwtToken) : jwtToken,
      refreshToken:
        refreshToken && isJson(refreshToken)
          ? JSON.parse(refreshToken)
          : refreshToken,
    };
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return { jwtToken: null, refreshToken: null };
  }
}

export const saveFirstTime = async () => {
  try {
    await SecureStore.setItemAsync("firstTime", "1");
  } catch (error) {
    console.error("Error saving first time:", error);
  }
};

export const removeFirstTime = async () => {
  try {
    await SecureStore.deleteItemAsync("firstTime", undefined);
  } catch (error) {
    console.error("Error removing first time:", error);
  }
};

export const getFirstTime = async () => {
  try {
    const firstTime = await SecureStore.getItemAsync("firstTime");
    if (firstTime) {
      return firstTime;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting first time:", error);
    return null;
  }
};
