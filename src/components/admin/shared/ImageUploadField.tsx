import React, { useState } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";
import { uploadImage } from "../../../lib/storage-utils";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  onPathChange?: (path: string) => void;
  path?: string;
  label?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  onPathChange,
  path = "blog_images",
  label = "Image URL or Upload",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const result = await uploadImage(file, path, (progress) => {
        setUploadProgress(progress);
      });
      onChange(result.url);
      if (onPathChange) onPathChange(result.fullPath);
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">
          {label}
        </label>
        {isUploading && (
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary animate-pulse flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Uploading{" "}
            {Math.round(uploadProgress)}%
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setError(null);
              onChange(e.target.value);
            }}
            placeholder="https://..."
            className={cn(
              "w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none transition-all pr-12",
              error
                ? "border-red-500/50 text-red-500"
                : "border-white/10 focus:border-brand-primary text-white"
            )}
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <label
          className={cn(
            "shrink-0 w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:bg-white/5 hover:border-brand-primary group",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          <Upload
            size={20}
            className="text-white/20 group-hover:text-brand-primary transition-colors"
          />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 ml-1">
          <AlertCircle size={12} /> {error}
        </div>
      )}
      {isUploading && (
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-primary"
            initial={{ width: 0 }}
            animate={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};
