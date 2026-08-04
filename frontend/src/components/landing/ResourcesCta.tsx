import Image from "next/image";

export function ResourcesCta() {
  return (
    <div className="rounded-xl bg-[#18151c] p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-white">Even more resources</h3>
      <p className="mt-2 text-sm text-zinc-400">
        More videos, more episodes. Discussions between industry leaders in both blockchain and technology, our
        team, and community developers.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href="#"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:border-white hover:bg-white hover:text-black"
        >
          YOUTUBE
          <Image src="/youtube.svg" alt="" width={20} height={15} />
        </a>
        <a
          href="#"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:border-white hover:bg-white hover:text-black"
        >
          PODCAST
          <Image src="/podcast.svg" alt="" width={16} height={16} />
        </a>
      </div>
    </div>
  );
}
