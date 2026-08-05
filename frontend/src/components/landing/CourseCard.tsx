import Image from "next/image";
import { DeadLink } from "./DeadLink";

type CourseCardProps = {
  image: string;
  chapters: string;
  title: string;
};

export function CourseCard({ image, chapters, title }: CourseCardProps) {
  return (
    <DeadLink className="group relative aspect-[37/32] cursor-pointer overflow-hidden rounded-xl bg-[#0a0612] transition hover:brightness-110">
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition duration-300 group-hover:scale-105"
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <span className="mb-3 inline-flex w-fit items-center rounded-full bg-purple-500 px-2.5 py-1 text-[11px] font-medium text-white">
          {chapters}
        </span>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <Image src="/right-arrow.svg" alt="" width={26} height={26} className="shrink-0 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </DeadLink>
  );
}
