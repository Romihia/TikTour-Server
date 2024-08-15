import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig.js";


export const uploadImage = async (filename, fileBuffer) => {
  let downloadURL=null;
  try {
    // Determine the content type based on the file extension or other criteria
    let contentType;
    if (filename.endsWith('.jpeg') || filename.endsWith('.jpg')) {
      contentType = 'image/jpeg';
    } else if (filename.endsWith('.png')) {
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
    console.log('Upload successful:', snapshot.metadata);
    
    // Get the download URL for the uploaded file
    downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);
    
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

    console.log('Deletion successful');
    return { message: "Image deleted successfully" };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Failed to delete image:", error);
    throw new Error("Failed to delete image");
  }
};
