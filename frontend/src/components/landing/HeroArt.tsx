import Image from "next/image";

export function HeroArt() {
  return (
    <div
      className="relative mx-auto -mt-6 aspect-square w-full max-w-md translate-x-0 sm:-mt-10 sm:max-w-none sm:translate-x-16 lg:-mt-[100px] lg:translate-x-32"
      aria-hidden
    >
      <Image
        src="/main.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-contain object-center sm:object-top"
        priority
      />
    </div>
  );
}
