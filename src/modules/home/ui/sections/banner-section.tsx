import Image from "next/image";
import React from "react";

export const BannerSection = () => {
  return (
    <section className="relative w-full h-[10vh] min-h-[270px]">
      <Image
        src="/banner.png" // Pastikan file banner.png ada di folder public
        alt="Banner Hero"
        fill
        className="object-cover"
        priority
      />
    </section>
  );
};
