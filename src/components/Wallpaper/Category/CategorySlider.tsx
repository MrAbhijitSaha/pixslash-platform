"use client";

import { Category } from "@generated/prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CategoryCard from "./CategoryCard";

type CategorySliderProps = {
  categoryInfo: Category[];
  chechklogin: boolean;
};

const CategorySlider = ({ categoryInfo, chechklogin }: CategorySliderProps) => {
  if (!categoryInfo?.length) return null;

  const data = chechklogin;
  return (
    <div className="relative">
      {/* Previous */}
      <button
        type="button"
        title="prev"
        className="category-prev absolute top-1/2 left-0 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="px-12">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".category-prev",
            nextEl: ".category-next",
          }}
          slidesPerView={2}
          spaceBetween={10}
          breakpoints={{
            768: {
              slidesPerView: data ? 2 : 4,
            },
            1280: {
              slidesPerView: data ? 3 : 5,
            },
          }}>
          {categoryInfo.map((item) => (
            <SwiperSlide key={item.id}>
              <CategoryCard
                categoryImage={item.image ?? ""}
                slug={item.slug}
                title={item.categoryName}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Next */}
      <button
        type="button"
        title="next"
        className="category-next absolute top-1/2 right-0 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CategorySlider;
