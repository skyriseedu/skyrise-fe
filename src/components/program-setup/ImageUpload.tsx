import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ImgUpload from '@/assets/img-upload.svg?react';
import RemoveIcon from '@/assets/close.svg?react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  image: File | string | undefined;
  title?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  image,
  title,
}) => {
  const [preview, setPreview] = useState<string | null>(
    typeof image === 'string' ? image : null
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onImageUpload(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div>
      {title && <h3 className="mb-2 text-lg font-medium">{title}</h3>}
      <div
        {...getRootProps()}
        className={`rounded-lg border-1 ${preview ? '' : 'p-8 text-center'} ${
          isDragActive ? 'border-blue-500' : ''
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="group relative h-43 w-full">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full rounded-lg object-cover"
            />
            <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity group-hover:opacity-50">
              <button
                onClick={handleRemoveImage}
                className="bg-opacity-50 rounded-full border-1 bg-black p-2 text-white hover:bg-red-500"
              >
                <RemoveIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-2">
              <ImgUpload className="h-12 w-12" />
            </div>
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Maximum size 5MB
              <br />
              Supported: JPG, PNG
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
