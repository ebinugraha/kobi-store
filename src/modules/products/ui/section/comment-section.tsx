"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constant";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface CommentSectionProps {
  productId: string;
}

export const CommentSection = ({ productId }: CommentSectionProps) => {
  const trpc = useTRPC();

  const data = useSuspenseInfiniteQuery(
    trpc.comments.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        productId: productId,
      },
      {
        getNextPageParam: (lastItem) => lastItem.nextCursor,
      }
    )
  );

  return (
    <div className="flex flex-col py-4">
      <h1 className="font-bold">
        ({data.data.pages[0].totalData}) Komentar Produk{" "}
      </h1>
      <div className="flex flex-col gap-2 mt-4">
        <CommentForm
          productId={productId}
          onSuccess={() => toast.success("Berhasil")}
        />
        <div className="flex flex-col gap-6">
          {data.data.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem
                comment={comment}
                key={comment.id}
                variant="comment"
              />
            ))}
          <InfiniteScroll
            isManual
            fetchNextPage={() => data.fetchNextPage()}
            isFetchingNextPage={data.isFetchingNextPage}
            hasNextPage={data.hasNextPage}
          />
        </div>
      </div>
    </div>
  );
};
