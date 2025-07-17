"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function ImageUploader({ onImageUpload }: { onImageUpload: (base64: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
  <div className="mb-4">
    <label className="text-sm font-medium text-[#232360] block mb-1">File Upload</label>

    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-[#5051F9] bg-[#f1f1fc] rounded-md p-3 text-center cursor-pointer hover:bg-[#e8e8fb] transition flex items-center justify-center min-h-[50px]"
    >
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="max-h-36 object-contain mx-auto"
        />
      ) : (
        <div>
          <UploadCloud className="mx-auto text-[#5051F9] mb-2" size={32} />
          <p className="font-medium text-[#232360]">Browse Files</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  </div>
);

}
