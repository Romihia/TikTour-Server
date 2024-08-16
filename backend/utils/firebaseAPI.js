import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig.js";


export const uploadImage = async (filename, fileBuffer) => {
  let downloadURL = null;
  try {
    // Convert the filename to lowercase to handle different cases
    const lowerCaseFilename = filename.toLowerCase();

    // Determine the content type based on the file extension
    let contentType;
    if (lowerCaseFilename.endsWith('.jpeg') || lowerCaseFilename.endsWith('.jpg')) {
      contentType = 'image/jpeg';
    } else if (lowerCaseFilename.endsWith('.png')) {
      contentType = 'image/png';
    } else {
      throw new Error('Unsupported file type');
    }

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, `images/${filename}`);
    
    // Set the metadata, including the content type
    const metadata = {
      contentType: contentType,
    };

    // Upload the file to Firebase Storage with the specified metadata
    const snapshot = await uploadBytes(storageRef, fileBuffer, metadata);
    
    // Get the download URL for the uploaded file
    downloadURL = await getDownloadURL(storageRef);
    
    // Return the download URL
    return downloadURL;
  } catch (error) {
    console.error("Full error details:", error);
    throw new Error("Failed to upload image");
  }
};


export const deleteImage = async (filename) => {
  try {
    // Construct the full path to the file within Firebase Storage
    const storageRef = ref(storage, `images/${filename}`);

    // Attempt to delete the object at the specified reference
    await deleteObject(storageRef);
    return { message: "Image deleted successfully" };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Failed to delete image:", error);
    throw new Error("Failed to delete image");
  }
};

// Utility function to generate a unique file name by appending the ID to the original base name
export const generateUniqueFileName = (file, id) => {
  // Get the original file name
  const originalName = file.originalname;

  // Find the last index of a dot to separate the base name and the extension
  const lastDotIndex = originalName.lastIndexOf('.');

  // Get the base name (everything before the last dot) and the extension (everything after the last dot)
  const baseName = originalName.substring(0, lastDotIndex);
  const fileExtension = originalName.substring(lastDotIndex + 1);

  // Create the new picture name by appending the ID before the file extension
  const newPictureName = `${baseName}-${id}.${fileExtension}`;

  return newPictureName;
};