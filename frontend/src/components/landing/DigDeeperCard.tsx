import Image from "next/image";

type DigDeeperCardProps = {
  overline: string;
  title: string;
  description: string;
  highlighted?: boolean;
};

export function DigDeeperCard({ overline, title, description, highlighted = false }: DigDeeperCardProps) {
  return (
    <div className="relative">
      {highlighted && (
        <Image
          src="/bottom-shadow.svg"
          alt=""
          width={347}
          height={106}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 w-[90%] max-w-[347px] -translate-x-1/2 translate-y-1/3"
        />
      )}
      <a
        href="#"
        className="relative flex h-full cursor-pointer flex-col rounded-xl bg-[#18161c] p-6 transition hover:bg-[#201d26] hover:brightness-110"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C3AED]">{overline}</span>
        <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
          LEARN MORE
          <Image src="/top-right-arrow.svg" alt="" width={11} height={11} />
        </span>
      </a>
    </div>
  );
}
