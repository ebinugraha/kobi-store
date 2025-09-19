import { Button } from "@/components/ui/button";
import { Send, ThumbsDown, ThumbsUpIcon } from "lucide-react";

export const ProductReaction = () => {
  return (
    <div className="w-full items-center flex mt-4">
      <Button
        variant={"ghost"}
        className="font-normal rounded-none"
        size={"sm"}
      >
        <Send />
        Share
      </Button>
      |
      <Button
        variant={"ghost"}
        className="font-normal rounded-none"
        size={"sm"}
      >
        <ThumbsUpIcon />
        {123}
      </Button>
      |
      <Button
        variant={"ghost"}
        className="font-normal rounded-none"
        size={"sm"}
      >
        <ThumbsDown />
        {4}
      </Button>
    </div>
  );
};
