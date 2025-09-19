import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { commentInsertSchema } from "../../../../db/schema/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { validate } from "uuid";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CommentFormProps {
  productId: string;
  onSuccess: () => void;
  parentId?: string | null;
  variant?: "comment" | "replies";
  onCancel?: () => void;
}

export const CommentForm = ({
  productId,
  onSuccess,
  parentId,
  variant = "comment",
  onCancel,
}: CommentFormProps) => {
  const { data } = authClient.useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema),
    defaultValues: {
      productId: productId,
      parentId,
      value: "",
    },
  });

  const create = useMutation(
    trpc.comments.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleSubmit = (value: z.infer<typeof commentInsertSchema>) => {
    create.mutateAsync({
      productId: value.productId,
      value: value.value,
      parentId: value.parentId,
    });
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form className="flex gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <UserAvatar size={"sm"} />
        <div className="w-full flex flex-1 flex-col">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "replies"
                        ? "Reply this comment"
                        : "Add a comment"
                    }
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            <Button variant={"ghost"} type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button disabled={create.isPending || !form.watch("value")}>
              {variant === "replies" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
