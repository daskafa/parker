import Image from "next/image";
import { DeadLink } from "./DeadLink";

type DigDeeperCardProps = {
  overline: string;
  title: string;
  description: string;
  highlighted?: boolean;
};

export function DigDeeperCard({ overline, title, description }: DigDeeperCardProps) {
  return (
    <div className="group relative">
      <DeadLink className="relative flex h-[282px] cursor-pointer flex-col rounded-xl bg-[#19161C] p-6 transition hover:bg-[#201d26]">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C3AED]">{overline}</span>
        <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-white">{description}</p>
        <span className="relative z-10 mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-white">
          LEARN MORE
          <Image src="/top-right-arrow.svg" alt="" width={11} height={11} />
        </span>

        <Image
          src="/bottom-shadow.svg"
          alt=""
          width={347}
          height={106}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[90%] max-w-[347px] -translate-x-1/2 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        />
      </DeadLink>
    </div>
  );
}
