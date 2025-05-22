// utils/uploadImage.js
import axiosInstance from './axiosInstance';

const uploadImage = async ({ imageFile }) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axiosInstance.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

export default uploadImage;
