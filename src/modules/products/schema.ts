import z from "zod";

export const productInsertSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  description: z.string().min(1, "Deskripsi produk harus diisi"),
  price: z
    .string()
    .min(1, "Harga produk harus diisi")
    .regex(/^\d+(\.\d{1,2})?$/, "Format harga tidak valid"),
  isAvailable: z.boolean().default(false),
  categoryId: z.string().min(1, "Kategori harus dipilih"),
  images: z
    .array(
      z.object({
        url: z.string(),
        order: z.number().default(0),
      })
    )
    .min(1),
});
