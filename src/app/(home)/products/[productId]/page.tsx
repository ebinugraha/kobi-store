import { DEFAULT_LIMIT } from "@/constant";
import { ProductView } from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { productId } = await params;

  Promise.all([
    prefetch(
      trpc.product.getOne.queryOptions({
        id: productId,
      })
    ),
    prefetch(
      trpc.comments.getMany.infiniteQueryOptions({
        limit: DEFAULT_LIMIT,
        productId: productId,
      })
    ),
  ]);

  return (
    <HydrateClient>
      <ProductView productId={productId} />
    </HydrateClient>
  );
};

export default Page;
