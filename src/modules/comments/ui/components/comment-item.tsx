import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUpIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { CommentGetManyOutput } from "../../types";
import { useMemo, useState } from "react";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./comment-form";
import { CommentReplies } from "./comment-replies";

interface CommentItemProps {
  comment: CommentGetManyOutput[number];
  variant: "replies" | "comment";
}

export const CommentItem = ({ comment, variant }: CommentItemProps) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(comment.createdAt, {
      addSuffix: true,
      locale: id,
    });
  }, [comment.createdAt]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 min-w-0">
        <Link href={`/users/`} className="mt-2">
          <UserAvatar />
        </Link>
        <div className="flex w-full flex-col">
          <Link href={`/users/`}>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {compactDate}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
          <div className="flex mt-2 gap-3 items-center">
            <button className="cursor-pointer">
              <ThumbsUp size={18} />
            </button>
            <span className="text-xs text-muted-foreground">{20}</span>
            <button className="cursor-pointer">
              <ThumbsDown size={18} />
            </button>
            <span className="text-xs text-muted-foreground">{20}</span>
            {variant === "comment" && (
              <Button
                variant={"ghost"}
                size="sm"
                type="button"
                onClick={() => setIsReplyOpen(!isReplyOpen)}
              >
                <span className="text-xs text-muted-foreground">Balas</span>
              </Button>
            )}
          </div>
          <div className="w-full">
            {comment.replyCount > 0 && (
              <Button
                onClick={() => setIsRepliesOpen(!isRepliesOpen)}
                variant={"ghost"}
                size={"sm"}
                className="text-blue-500"
              >
                {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDown />}
                {comment.replyCount} Replies
              </Button>
            )}
            {isReplyOpen && variant === "comment" && (
              <div className="mt-2">
                <CommentForm
                  productId={comment.productId}
                  onSuccess={() => {
                    setIsReplyOpen(!isReplyOpen);
                  }}
                  parentId={comment.id}
                  variant={"replies"}
                  onCancel={() => setIsReplyOpen(!isReplyOpen)}
                />
              </div>
            )}
          </div>
          {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
            <CommentReplies
              parentId={comment.id}
              productId={comment.productId}
            />
          )}
        </div>
      </div>
    </div>
  );
};
