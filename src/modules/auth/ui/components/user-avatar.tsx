"use client";

import Image from "next/image"; // 1. Import komponen Image
import { authClient } from "@/lib/auth-client";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../../../lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const userAvatarVariant = cva("flex rounded-full", {
  variants: {
    size: {
      default: "w-8 h-8",
      sm: "w-6 h-6",
      lg: "w-10 h-10",
      xl: "w-12 h-12",
      xxl: "w-[120px] h-[120px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof userAvatarVariant> {
  className?: string;
}

export const UserAvatar = ({ size, className }: UserAvatarProps) => {
  const { data } = authClient.useSession();

  // Tampilkan loading state jika data belum siap
  if (!data?.user) {
    return (
      <Skeleton className={cn("rounded-full", userAvatarVariant({ size }))} />
    );
  }

  return (
    // 2. Gunakan div sebagai container utama dengan styling dari cva
    // Diberi 'relative' agar Image dengan prop 'fill' bisa berfungsi
    <div
      className={cn(
        "relative overflow-hidden",
        className,
        userAvatarVariant({ size })
      )}
    >
      {data.user.image ? (
        // 3. Jika gambar ada, tampilkan komponen next/image
        <Image
          src={data.user.image}
          alt={data.user.name ?? "User avatar"}
          fill // 'fill' membuat gambar mengisi penuh container (div)
          className="object-cover" // 'object-cover' agar gambar tidak gepeng
        />
      ) : (
        // 4. Jika tidak ada gambar, tampilkan div sebagai fallback
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted"
          )}
        >
          {data.user.name ? data.user.name.charAt(0).toUpperCase() : "U"}
        </div>
      )}
    </div>
  );
};
