"use client";

import { authClient } from "@/lib/auth-client";
import { productInsertSchema } from "@/modules/products/schema";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import z from "zod";

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
  );

  // 1. Inisialisasi useForm ada di level tertinggi (halaman ini).
  const form = useForm<z.infer<typeof productInsertSchema>>({
    // Mode 'onChange' agar preview langsung update saat mengetik
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      isAvailable: true,
      categoryId: "",
      images: [],
    },
  });

  const { data } = authClient.useSession();

  return (
    <main className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4 flex items-center gap-x-4">
        <Link href={"/dashboard/product"}>
          <ArrowLeft size={20} />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Detail product</h1>
          <p className="text-xs text-muted-foreground">
            Atur detail product anda
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="">{/* Product detail form */}test1</div>
        <div className="lg:col-span-2 relative">
          {/* Product Pratinjau */}test2
        </div>
      </div>
    </main>
  );
};
