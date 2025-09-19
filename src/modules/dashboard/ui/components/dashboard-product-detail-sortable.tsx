import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import Image from "next/image";

interface ProductDetailSortableProps {
  image: { id: string; url: string; order: number };
  onRemove: () => void;
}
export const ProductDetailSortable = ({
  image,
  onRemove,
}: ProductDetailSortableProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group border rounded-md p-1 bg-white cursor-move"
    >
      <Image
        src={image.url}
        alt={`Product image`}
        width={125}
        height={125}
        className="rounded-md object-cover w-full h-32"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
        onClick={onRemove}
      >
        <X />
      </Button>
    </div>
  );
};
