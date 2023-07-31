"use client";

import { MountingProvider } from "@/providers/MountingProvider";
import { Button } from "@/components/ui/Button";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploaderProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}
export const ImageUploader = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploaderProps) => {
  const uploadHandler = (results: any) =>
    onChange(results.info.secure_url as string);
  const removeHandler = (url: string) => onRemove(url);

  return (
    <MountingProvider>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeHandler(url)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={uploadHandler} uploadPreset="mum0dgyg">
        {({ open }) => {
          const clickHandler = () => open();

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={clickHandler}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </MountingProvider>
  );
};
