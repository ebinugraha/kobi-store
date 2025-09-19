import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { toast } from "sonner";

interface CommentSectionProps {
  productId: string;
}

export const CommentSection = ({ productId }: CommentSectionProps) => {
  return (
    <div className="flex flex-col py-4">
      <h1 className="font-bold">({0}) Komentar Produk </h1>
      <div className="flex flex-col gap-6 mt-4">
        <CommentForm
          productId={productId}
          onSuccess={() => toast.success("Berhasil")}
        />
      </div>
    </div>
  );
};
