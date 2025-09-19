"use client";

import { authClient } from "@/lib/auth-client";
import { CreateFormSection } from "../section/create-form-section";
import { PreviewSection } from "../section/create-preview-section";
import { productInsertSchema } from "@/modules/dashboard/schema";
import { useForm } from "react-hook-form";
import z from "zod";

export const CreateView = () => {
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
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="border">
          <CreateFormSection name={data?.user.name} form={form} />
        </div>
        <div className="lg:col-span-2">
          <PreviewSection name={data?.user.name} form={form} />
        </div>
      </div>
    </main>
  );
};
