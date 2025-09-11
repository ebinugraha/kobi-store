"use client";

import { FilterCarousel } from "@/components/filter-carousel";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const CategoriesSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CategoriesSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesSectionSuspense = () => {
  const trpc = useTRPC();

  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );

  return (
    <div className="flex items-center">
      <FilterCarousel data={categories} />
    </div>
  );
};
