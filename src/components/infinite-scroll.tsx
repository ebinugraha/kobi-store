import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isManual || !loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isManual]);

  return (
    <div
      ref={!isManual ? loaderRef : undefined}
      className="py-4 text-center text-muted-foreground text-sm"
    >
      {isFetchingNextPage && <Loader2 className="animate-spin" />}
      {!isFetchingNextPage && hasNextPage && isManual && (
        <Button variant={"outline"} size={"sm"} onClick={fetchNextPage}>
          Load more
        </Button>
      )}
      {!isFetchingNextPage && !hasNextPage && <p>you have reach the limit</p>}
      {!isFetchingNextPage && hasNextPage && !isManual && (
        <p>Scroll to load more</p>
      )}
    </div>
  );
};
