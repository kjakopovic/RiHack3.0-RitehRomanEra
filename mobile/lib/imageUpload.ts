import { uploadDirect } from "@uploadcare/upload-client";

const publicKey = process.env.EXPO_PUBLIC_UPLOADCARE_PUBLIC_KEY;

export const uploadImage = async (file: File | Blob | Buffer) => {
  if (!publicKey) {
    throw new Error("No public key provided");
  }
  console.log("Uploading image...");
  const result = await uploadDirect(file, {
    publicKey,
    store: "auto",
  });
  return result;
};

// Function to toggle attendance
