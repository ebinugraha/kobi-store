"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../../../lib/utils";

const userAvatarVariant = cva("flex rounded-full", {
  variants: {
    size: {
      default: "w-8 h-8",
      sm: "w-6 h-6",
      lg: "w-10 h-10",
      xl: "w-12 h-12",
      xxl: "w-16 h-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof userAvatarVariant> {}

export const UserAvatar = ({ size }: UserAvatarProps) => {
  const { data } = authClient.useSession();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Avatar className={cn(userAvatarVariant({ size }))}>
      <AvatarImage src={data?.user.image ?? "globe.svg"} />
      <AvatarFallback>
        {data?.user.name ? data.user.name.charAt(0).toUpperCase() : "U"}
      </AvatarFallback>
    </Avatar>
  );
};
