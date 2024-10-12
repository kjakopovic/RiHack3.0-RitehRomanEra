import * as SecureStore from "expo-secure-store";

// Function to store JWT and refresh tokens
export const storeTokens = async (jwtToken: string, refreshToken: string) => {
  try {
    // Store JWT Token
    await SecureStore.setItemAsync("jwtToken", JSON.stringify(jwtToken) as string);

    // Store Refresh Token
    await SecureStore.setItemAsync("refreshToken", JSON.stringify(refreshToken) as string);

    console.log("Tokens stored successfully");
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

// Function to retrieve JWT and refresh tokens
export const getTokens = async () => {
  try {
    // Retrieve JWT Token
    const jwtToken = await SecureStore.getItemAsync("jwtToken");

    // Retrieve Refresh Token
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (jwtToken && refreshToken) {
      return { jwtToken, refreshToken };
    } else {
      console.log("Tokens not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return null;
  }
};


export const saveFirstTime = async () => {
  try {
    await SecureStore.setItemAsync("firstTime", "1");
  } catch (error) {
    console.error("Error saving first time:", error);
  }
}

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
}