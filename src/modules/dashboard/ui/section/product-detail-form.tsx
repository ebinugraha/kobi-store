"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
import {
  productInsertSchema,
  productUpdateSchema,
} from "@/modules/products/schema";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Globe, Loader2, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UploadDropzone } from "@/lib/uploadthing";
import z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuid } from "uuid";
import { DEFAULT_LIMIT } from "@/constant";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ProductDetailSortable } from "../components/dashboard-product-detail-sortable";

type ProductDetailFormProps = {
  form: UseFormReturn<z.infer<typeof productUpdateSchema>>;
  name?: string | null;
  productId: string;
};

export const ProductDetailForm = ({
  form,
  name,
  productId,
}: ProductDetailFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  // Perbaikan 1: Hapus `useState` untuk gambar. Kita akan serahkan ke react-hook-form.
  // const [images, setImages] = useState<{ url: string; order: number }[]>([]);

  // Ambil state gambar dari form untuk ditampilkan di UI
  const images = form.watch("images");

  const product = useMutation(
    trpc.products.update.mutationOptions({
      onSuccess: async () => {
        // TODO revalidate get many products get one
        Promise.all([
          queryClient.invalidateQueries(
            trpc.products.getMany.infiniteQueryOptions({
              limit: DEFAULT_LIMIT,
            })
          ),
          queryClient.invalidateQueries(
            trpc.products.getOne.queryOptions({
              id: productId,
            })
          ),
        ]);
        form.reset();
        router.push("/dashboard/product");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  // Perbaikan 3: Ubah `handleSubmit` untuk memanggil mutation
  const handleSubmit = async (values: z.infer<typeof productUpdateSchema>) => {
    if (form.getValues("images").length === 0) {
      toast.error("Produk harus memiliki minimal 1 gambar");
      return;
    }
    await product.mutateAsync(values);
  };

  const handleImageUpload = (res: any) => {
    const newImage = { id: "", url: res[0].url, order: images.length };
    // Perbaikan 4: Update state gambar menggunakan `form.setValue`
    form.setValue("images", [...images, newImage], { shouldValidate: true });
    toast.success("Gambar berhasil diupload");
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    form.setValue("images", updatedImages, { shouldValidate: true });
  };

  const handleDragEndImage = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id as string, 10);
    const newIndex = parseInt(over.id as string, 10);

    const reordered = arrayMove(images, oldIndex, newIndex).map((img, i) => ({
      ...img,
      order: i,
    }));

    form.setValue("images", reordered, { shouldValidate: true });
  };

  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );

  return (
    <div className="flex flex-col gap-y-4 w-full px-6 pb-6">
      <div className="flex gap-x-2 mt-5 items-center">
        <UserAvatar size={"lg"} />
        <div className="flex justify-center flex-col gap-y-1">
          <span className="text-sm font-bold">{name}</span>
          <div className="flex gap-x-1 items-center text-muted-foreground">
            <Globe className="size-3" />
            <span className="text-xs">Publik</span>
          </div>
        </div>
      </div>
      <Form {...form}>
        {/* Perbaikan 5: Hapus <div> yang tidak perlu, form bisa langsung jadi flex container */}
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-y-4"
        >
          <div>
            <h1 className="text-sm font-medium">Gambar Produk</h1>
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={handleImageUpload}
              onUploadError={(error: Error) => {
                toast.error("Gagal upload gambar: " + error.message);
              }}
              className="ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 py-6 border-2 border-dashed"
            />

            {images.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndImage}
              >
                <SortableContext
                  items={images.map((_, i) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <ProductDetailSortable
                        key={index}
                        image={image}
                        index={index}
                        onRemove={() => removeImage(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama produk</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukan nama produk" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                {/* Perbaikan 6: Label salah, seharusnya 'Deskripsi' */}
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Tambah deskripsi produk" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Produk tersedia</FormLabel>
                  <FormDescription>
                    Centang jika produk siap dijual
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          {/* Perbaikan 7: Tambahkan status loading/disabled pada tombol */}
          <Button type="submit">Ubah Produk</Button>
        </form>
      </Form>
    </div>
  );
};
