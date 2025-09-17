import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { DEFAULT_LIMIT } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock } from "lucide-react";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyIDR } from "@/lib/utils";

export const ProductSection = () => {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ErrorBoundary
        fallback={<p className="text-red-500">Error loading products</p>}
      >
        <ProductSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProductSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[400px]">Product Images</TableHead>
            <TableHead className="w-[250px]">Product</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right pr-6">Sold</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              {/* Product Images */}
              <TableCell className="pl-6">
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="w-[50px] h-[50px]" />
                  ))}
                </div>
              </TableCell>

              {/* Product Name */}
              <TableCell>
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[120px]" />
                </div>
              </TableCell>

              {/* Visibility */}
              <TableCell>
                <Skeleton className="h-5 w-[80px]" />
              </TableCell>

              {/* Date */}
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>

              {/* Views */}
              <TableCell className="text-right">
                <Skeleton className="h-4 w-[50px] ml-auto" />
              </TableCell>

              {/* Comments */}
              <TableCell className="text-right">
                <Skeleton className="h-4 w-[50px] ml-auto" />
              </TableCell>

              {/* Sold */}
              <TableCell className="text-right pr-6">
                <Skeleton className="h-4 w-[50px] ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ProductSectionSuspense = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const data = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  const products = data.data.pages.flatMap((page) => page.items);

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[400px]">Product Images</TableHead>
              <TableHead className="w-[100px]">Product</TableHead>
              <TableHead className="w-[200px]">Price</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No products available
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  {/* Product Images */}
                  <TableCell className="pl-6">
                    <div className="flex gap-2">
                      {product.productImages?.length > 0 ? (
                        product.productImages
                          .slice(0, 3)
                          .map((img) => (
                            <Image
                              key={img.id}
                              src={img.url}
                              alt={product.name}
                              width={100}
                              height={100}
                              className="rounded-md object-cover border"
                            />
                          ))
                      ) : (
                        <div className="w-[50px] h-[50px] bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Product Name */}
                  <TableCell>
                    <div className="flex justify-center flex-col gap-y-1">
                      <span className="text-sm line-clamp-1">
                        {product.name}
                      </span>
                      <span className="text-muted-foreground line-clamp-1 text-xs truncate w-sm">
                        {product.description}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold">
                      {formatCurrencyIDR(product.price)}
                    </span>
                  </TableCell>

                  {/* Visibility */}
                  <TableCell>
                    {product.isAvaible ? (
                      <Badge variant="default">
                        <Globe /> Visible
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Lock /> Hidden
                      </Badge>
                    )}
                  </TableCell>

                  {/* Date */}

                  <TableCell>
                    {format(new Date(product.createdAt), "d MMM yyyy")}
                  </TableCell>

                  {/* Views */}
                  <TableCell className="text-right">{0}</TableCell>

                  {/* Comments */}
                  <TableCell className="text-right">{0}</TableCell>

                  {/* Sold */}
                  <TableCell className="text-right pr-6">{0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual
        fetchNextPage={data.fetchNextPage}
        hasNextPage={data.hasNextPage}
        isFetchingNextPage={data.isFetchingNextPage}
      />
    </div>
  );
};
