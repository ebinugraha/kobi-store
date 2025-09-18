"use client";

import { authClient } from "@/lib/auth-client";
import {
  productInsertSchema,
  productUpdateSchema,
} from "@/modules/products/schema";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, MoreVertical, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import z from "zod";
import { ProductDetailForm } from "../section/product-detail-form";
import { ProductPreviewSection } from "../section/product-preview-section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView = ({ productId }: ProductDetailViewProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <ProductDetailViewSuspense productId={productId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProductDetailViewSuspense = ({ productId }: ProductDetailViewProps) => {
  const trpc = useTRPC();

  const product = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  ).data;

  // 1. Inisialisasi useForm ada di level tertinggi (halaman ini).
  const form = useForm<z.infer<typeof productUpdateSchema>>({
    // Mode 'onChange' agar preview langsung update saat mengetik
    mode: "onChange",
    defaultValues: {
      id: product.id,
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      isAvailable: product.isAvailable ?? true,
      categoryId: product.categoryId ?? "",
      images:
        product.productImages?.map((img) => ({
          id: img.id,
          url: img.url,
          order: img.order ?? 0, // kalau null, jadikan 0
        })) ?? [],
    },
  });

  const { data } = authClient.useSession();

  return (
    <main className="flex flex-col pt-2.5">
      <div className="px-4 flex items-center gap-x-4 border-b pb-2.5 ">
        <Link href={"/dashboard/product"}>
          <ArrowLeft size={20} />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Detail product</h1>
          <p className="text-xs text-muted-foreground">
            Atur detail product anda
          </p>
        </div>
        <div className="ml-auto">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem asChild>
                <Link href={`/product/${productId}`}>
                  <Eye className="size-4 mr-2" />
                  Live produk
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <TrashIcon className="size-4 mr-2 text-destructive" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="">
          <ProductDetailForm
            name={data?.user.name}
            form={form}
            productId={productId}
          />
        </div>
        <div className="lg:col-span-2">
          <ProductPreviewSection form={form} name={data?.user.name} />
        </div>
      </div>
    </main>
  );
};
