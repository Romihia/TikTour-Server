import { uploadImage, deleteImage } from '../utils/firebaseAPI.js';

export const addPicture = async (req, res) => {
  try {
    const file = req.file;
    const response = await uploadImage(file.originalname, file.buffer);
    res.status(200).json({ message: 'Image uploaded successfully', fileId: response.metadata.fullPath });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

export const removePicture = async (req, res) => {
  try {
    const filename = req.params.fileId; // Capture the fileId parameter from the URL
    console.log('Removing: ' + filename);
    await deleteImage(filename); // Call the delete function
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
};