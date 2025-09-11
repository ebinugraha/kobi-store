import { useEffect, useState } from "react";
import { CarouselApi, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FilterCarouselProps {
  data: {
    name: string;
    imageUrl: string | null;
    slug: string;
  }[];
}

export const FilterCarousel = ({ data }: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full mt-4">
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
          current === 1 && "hidden"
        )}
      />
      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="px-12"
      >
        <CarouselContent className="">
          {data.map((category) => (
            <CarouselItem className={cn("basis-auto")} key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                // Gaya untuk seluruh kartu
                className="group flex h-full w-30 flex-col items-center overflow-hidden rounded-lg p-2 text-center border"
              >
                {/* Wadah Gambar - Mengisi bagian atas kartu */}
                <div className="relative mb-3 h-18 w-18">
                  {" "}
                  {/* Sesuaikan tinggi (h-28) sesuai kebutuhan */}
                  <Image
                    src={category.imageUrl ?? "/coffee.png"}
                    alt={category.name}
                    fill // Mengisi wadah div secara absolut
                    className="object-contain" // object-contain agar gambar tidak terpotong atau terdistorsi
                  />
                </div>

                {/* Nama Kategori - Di bagian bawah kartu */}
                <span className="mt-auto text-sm transition-colors duration-100 group-hover:text-blue-500">
                  {category.name}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={cn("left-0 z-20", current === 1 && "hidden")}
        />
        <CarouselNext
          className={cn("right-0 z-20", current === count && "hidden")}
        />
      </Carousel>
      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
          current === count && "hidden"
        )}
      />
    </div>
  );
};
