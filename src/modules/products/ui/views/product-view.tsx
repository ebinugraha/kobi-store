"use client";

import { CommentSection } from "../section/comment-section";
import { ContentSection } from "../section/content-section";

interface ProductViewProps {
  productId: string;
}

export const ProductView = ({ productId }: ProductViewProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-4">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col border rounded-md px-8">
          <ContentSection productId={productId} />
        </div>
        <div className="flex flex-col border rounded-md px-8">
          <CommentSection productId={productId} />
        </div>
        <div className="flex flex-col py-2.5 bg-gray-50 rounded-md px-4">
          Suggestion section
        </div>
      </div>
    </div>
  );
};
