"use client";

import { QuantitySelector } from "@/components/quantity-selector";
import { Button } from "@/components/ui/button";
import { formatCurrencyIDR } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Send, ThumbsDown, ThumbsUpIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ProductReaction } from "../components/product-reaction";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface ContentSectionProps {
  productId: string;
}

export const ContentSection = ({ productId }: ContentSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: product } = useSuspenseQuery(
    trpc.product.getOne.queryOptions({ id: productId })
  );

  const productView = useMutation(
    trpc.productView.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.product.getOne.queryOptions({
            id: productId,
          })
        );
      },
    })
  );

  useEffect(() => {
    productView.mutate({ productId });
  }, [productId]);

  const mainImage = selectedImage || product.image?.[0]?.url;

  const compactViews = useMemo(() => {
    return Intl.NumberFormat("id", {
      notation: "compact",
    }).format(product.viewCount);
  }, [product.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(product.createdAt, {
      addSuffix: true,
      locale: id,
    });
  }, [product.createdAt]);

  return (
    <div className="w-full max-w-6xl py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Bagian Gambar */}
        <div>
          <div className="relative w-full h-[400px] overflow-hidden">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          {/* Thumbnail */}
          <div className="flex gap-2 mt-4">
            {product.image.map((img) => (
              <div
                key={img.id}
                className={`w-20 h-20 border rounded-lg overflow-hidden cursor-pointer ${
                  selectedImage === img.url ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(img.url)}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
          <ProductReaction />
        </div>

        {/* Bagian Info */}
        <div className="flex flex-col w-full col-span-2">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="flex gap-x-2 text-xs">
              <p>123 menyukai product ini</p>|
              <p>
                <span className="underline text-blue-500 font-bold">
                  {compactViews}
                </span>{" "}
                orang mengklik product ini
              </p>
            </div>
            <p className="text-2xl text-blue-600 font-bold mt-2">
              {formatCurrencyIDR(product.price)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ditawarkan {compactDate}
            </p>
            <p className="mt-4 text-gray-700 ">{product.description}</p>
          </div>
          <div className="mt-4 flex items-center gap-x-2">
            <span className="text-gray-600 text-sm">Kuantitas</span>
            <QuantitySelector initial={10} />
          </div>
          {/* Tombol */}
          <div className="flex gap-4 mt-6">
            <Button size={"lg"}>Beli Sekarang</Button>
            <Button size={"lg"} variant={"outline"}>
              Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
