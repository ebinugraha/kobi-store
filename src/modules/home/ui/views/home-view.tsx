import { BannerSection } from "../sections/banner-section";
import { CategoriesSection } from "../sections/categories-section";

export const HomeView = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      <BannerSection />
      <CategoriesSection />
    </div>
  );
};
