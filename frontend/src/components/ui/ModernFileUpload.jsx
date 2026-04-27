import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

function ModernFileUpload({ onChange }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only images allowed");
      return;
    }

    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={inputRef}
        hidden
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-white/5 transition"
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              className="h-40 w-full object-cover rounded-xl"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onChange(null);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UploadCloud size={28} className="text-blue-600" />
            <p className="font-semibold">Upload Image</p>
            <span className="text-sm text-gray-500">
              Click or drag & drop
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModernFileUpload;