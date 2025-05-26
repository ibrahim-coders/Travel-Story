// import axiosInstance from './axiosInstance';

// const uploadImage = async ({ imageFile }) => {
//   const formData = new FormData();
//   formData.append('image', imageFile);

//   try {
//     const response = await axiosInstance.post('/upload-image', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Image upload failed:', error);
//     throw error;
//   }
// };

// export default uploadImage;

import axios from 'axios';

const uploadImage = async imageData => {
  if (!imageData) {
    console.error('No image selected!');
    return null;
  }

  const formData = new FormData();
  formData.append('file', imageData);
  formData.append(
    'upload_preset',
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  ); // ✅ Use correct preset
  // No need to send cloud name in the preset

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error(
      'Error uploading image:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

export default uploadImage;
