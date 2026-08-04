import Image from "next/image";

export function HeroArt() {
  return (
    <div className="relative aspect-square w-full" aria-hidden>
      <Image src="/main.png" alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-contain" priority />
    </div>
  );
}
