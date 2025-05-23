import { useRef, useState, useEffect } from 'react';
import { MdImage, MdOutlineDeleteForever } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const ImageSelector = ({ storyImg, setStoryImg, image }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const handleImageChange = e => {
    const file = e.target.files[0];

    if (file) {
      setStoryImg(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleDelete = async () => {
    try {
      if (image && !storyImg) {
        await axiosInstance.delete('/delete-image', {
          params: { imageUrl: image.imageUrl },
        });
        toast.success('Image deleted from server');
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }

    setStoryImg(null);
    setPreviewUrl(null);
    inputRef.current.value = null;
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displayImage = previewUrl || image?.imageUrl;

  return (
    <div className="relative">
      {!storyImg ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 border border-slate-300/50"
          onClick={onChooseFile}
          type="button"
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
            <MdImage className="text-xl text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Browse image to upload</p>
        </button>
      ) : (
        <div className="w-full h-[220px] overflow-hidden border border-slate-300 rounded relative">
          <img
            src={displayImage}
            alt="Selected"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
            type="button"
            aria-label="Delete image"
          >
            <MdOutlineDeleteForever className="text-red-500 text-lg cursor-pointer" />
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        hidden
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageSelector;
