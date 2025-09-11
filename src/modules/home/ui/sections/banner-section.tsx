import Image from "next/image";
import React from "react";

export const BannerSection = () => {
  return (
    // 1. Gunakan flexbox untuk menengahkan gambar di dalam section
    <section className="relative w-full h-[10vh] min-h-[270px] flex items-center justify-center overflow-hidden">
      {/* 2. Hapus 'fill' dan 'object-cover' */}
      {/* 3. Tentukan ukuran gambar yang konstan dengan width dan height */}
      <Image
        src="/banner.png" // Pastikan file banner.png ada di folder public
        alt="Banner Hero"
        width={1200} // Ganti dengan lebar gambar yang Anda inginkan (dalam pixel)
        height={250} // Ganti dengan tinggi gambar yang Anda inginkan (dalam pixel)
        priority
        className="object-contain" // Opsional: memastikan gambar tidak terpotong jika section lebih kecil
      />
    </section>
  );
};
