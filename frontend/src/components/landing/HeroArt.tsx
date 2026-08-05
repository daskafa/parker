import Image from "next/image";

export function HeroArt() {
  return (
    <div
      className="relative -mt-6 aspect-square w-full translate-x-10 sm:-mt-10 sm:translate-x-16 lg:-mt-[100px] lg:translate-x-32"
      aria-hidden
    >
      <Image
        src="/main.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-contain object-top"
        priority
      />
    </div>
  );
}
