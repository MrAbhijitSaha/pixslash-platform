import { UserAvatarProps } from "@/lib/type";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcnui/avatar";

const UserAvatar = ({ name, image, size }: UserAvatarProps) => {
  const initials =
    name?.trim() ?
      name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CN";

  return (
    <Avatar size={size}>
      <AvatarImage
        src={`/user/profilepicture/${image}`}
        height={24}
        width={24}
        alt={name ? `${name} avatar` : "User avatar"}
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
