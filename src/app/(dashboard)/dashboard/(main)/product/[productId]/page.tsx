import { ProductDetailView } from "@/modules/dashboard/ui/views/product-detail-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ productId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { productId } = await params;

  await prefetch(trpc.products.getOne.queryOptions({ id: productId }));

  return (
    <HydrateClient>
      <ProductDetailView productId={productId} />
    </HydrateClient>
  );
};

export default Page;
