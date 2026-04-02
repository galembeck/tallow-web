import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/services/user";
import { getInitials } from "@/utils/get-initials";
import { Camera, Loader2 } from "lucide-react";
import { useRef } from "react";

interface AvatarUploadProps {
  user: User;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  size?: "sm" | "default" | "lg";
}

export function AvatarUpload({
  user,
  onUpload,
  isUploading,
  size = "lg",
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    e.target.value = "";
  };

  return (
    <div className="relative cursor-pointer group" onClick={handleClick}>
      <Avatar size={size}>
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
        <AvatarFallback className="text-lg font-semibold">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {isUploading ? (
          <Loader2 className="h-5 w-5 text-white animate-spin" />
        ) : (
          <Camera className="h-5 w-5 text-white" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
