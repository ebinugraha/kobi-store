import { BannerSection } from "@/modules/home/ui/sections/banner-section";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { prefetch, trpc } from "@/trpc/server";

const Page = async () => {
  return <HomeView />;
};

export default Page;
