"use client";

import { Button } from "@/components/ui/button"; // BARU: Import Button
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
import {
  productInsertSchema,
  productUpdateSchema,
} from "@/modules/dashboard/schema";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

type ProductPreviewSectionProps = {
  form: UseFormReturn<z.infer<typeof productUpdateSchema>>;
  name?: string | null;
};

export const ProductPreviewSection = ({
  form,
  name,
}: ProductPreviewSectionProps) => {
  const values = form.watch();

  const formatPrice = (price: string | number) => {
    const num = Number(price);
    if (isNaN(num) || num === 0) {
      return "Harga";
    }
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  return (
    <div className="sticky top-22 mx-auto max-w-3xl">
      <Card className="shadow-none">
        <CardContent>
          {/* Perubahan Utama: Menggunakan Grid untuk layout 2 kolom */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* ================= Bagian Kiri: Gambar & Penjual ================= */}
            <div className="md:col-span-3 flex flex-col gap-3">
              {/* Gambar Utama */}
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {values.images && values.images.length > 0 ? (
                  <Image
                    src={values.images[0].url}
                    alt="Product Preview"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground text-center max-w-sm text-sm">
                    Pratinjau produk Anda Saat membuat produk, Anda bisa
                    mempratinjau tampilannya, untuk mengetahui bagaimana orang
                    lain melihat tawaran Anda di Marketplace.
                  </span>
                )}
              </div>

              {/* BARU: Galeri Thumbnail */}
              <div className="grid grid-cols-5 gap-2">
                {values.images && values.images.length > 1
                  ? values.images.slice(0, 5).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-muted rounded overflow-hidden"
                      >
                        <Image
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  : // Placeholder jika gambar kurang dari 2
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-muted rounded"
                      ></div>
                    ))}
              </div>

              {/* Informasi Penjual */}
              <div className="flex w-full items-center gap-x-3 pt-2">
                <UserAvatar />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {name ?? "Nama Penjual"}
                  </span>
                  <span className="text-xs text-muted-foreground">Penjual</span>
                </div>
              </div>
            </div>

            {/* ================= Bagian Kanan: Detail & Tombol ================= */}
            <div className="md:col-span-2 flex flex-col">
              {/* Detail Produk */}
              <div className="">
                <h3 className="text-xl font-bold break-words">
                  {values.name || "Judul Produk"}
                </h3>
                <p className="text-lg text-primary font-semibold mt-1">
                  {formatPrice(values.price || "")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ditawarkan beberapa detik yang lalu
                </p>
                <div className="md:h-90">
                  <p className="text-sm text-muted-foreground mt-4 break-words">
                    {values.description ||
                      "Deskripsi produk akan tampil di sini..."}
                  </p>
                </div>
              </div>
              <div className="flex w-full gap-2">
                <Button className="w-30 text-xs">Beli Sekarang</Button>
                <Button className="w-35 text-xs" variant={"secondary"}>
                  Tambah ke Keranjang
                </Button>
              </div>

              {/* BARU: Tombol Aksi (didorong ke bawah dengan mt-auto) */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
