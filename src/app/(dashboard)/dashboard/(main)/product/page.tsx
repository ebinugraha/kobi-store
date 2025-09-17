import { DEFAULT_LIMIT } from "@/constant";
import { ProductViews } from "@/modules/dashboard/ui/views/product-views";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
  await prefetch(
    trpc.products.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrateClient>
      <ProductViews />
    </HydrateClient>
  );
};

export default Page;
