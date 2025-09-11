import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
  prefetch(trpc.categories.getMany.queryOptions());

  return (
    <HydrateClient>
      <HomeView />
    </HydrateClient>
  );
};

export default Page;
