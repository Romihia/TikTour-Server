import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig.js";

export const uploadImage = async (filename, fileBuffer) => {
  try {
    const storageRef = ref(storage, `images/${filename}`);
    const snapshot = await uploadBytes(storageRef, fileBuffer);
    console.log('Upload successful:', snapshot.metadata);
    return snapshot;
  } catch (error) {
    console.error("Full error details:", error);
    throw new Error("Failed to upload image");
  }
};

export const deleteImage = async (filename) => {
  if (filename!='user.png'){
    try {
      // Construct the full path to the file within Firebase Storage
      const storageRef = ref(storage, `images/${filename}`);

      // Attempt to delete the object at the specified reference
      await deleteObject(storageRef);

      console.log('Deletion successful');
      return { message: "Image deleted successfully" };
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Failed to delete image:", error);
      throw new Error("Failed to delete image");
    }
  }
};
