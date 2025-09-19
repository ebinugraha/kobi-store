import { DEFAULT_LIMIT } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";
import { CornerDownLeftIcon } from "lucide-react";

interface CommentRepliesProps {
  productId: string;
  parentId: string;
}

export const CommentReplies = ({
  productId,
  parentId,
}: CommentRepliesProps) => {
  const trpc = useTRPC();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.comments.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
          productId: productId,
          parentId: parentId,
        },
        {
          getNextPageParam: (lastItem) => lastItem.nextCursor,
        }
      )
    );

  return (
    <div className="pl-4">
      <div className="flex flex-col gap-4 mt-2">
        {data?.pages
          .flatMap((page) => page.items)
          .map((comment) => (
            <CommentItem key={comment.id} comment={comment} variant="replies" />
          ))}
      </div>
      {hasNextPage && (
        <Button
          variant={"ghost"}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto my-4"
        >
          <CornerDownLeftIcon />
          Show more replies {isFetchingNextPage && "Loading..."}
        </Button>
      )}
    </div>
  );
};
