import Image from "next/image";
import { Container } from "./Container";
import { CourseCard } from "./CourseCard";

const COURSES = [
  { image: "/get-started-2.png", chapters: "14 Chapters", title: "Buildspace" },
  { image: "/get-started-3.png", chapters: "12 Chapters", title: "Solana Bytes" },
  { image: "/get-started-4.png", chapters: "1 Chapter", title: "Scaffold Series" },
  { image: "/get-started-5.png", chapters: "3 Chapters", title: "Freecodecamp Solana Course" },
  { image: "/get-started-6.png", chapters: "167 Chapters", title: "Solana Development by Knox" },
  { image: "/get-started-7.png", chapters: "8 Chapters", title: "Solana Bootcamp" },
];

export function GetStarted() {
  return (
    <section className="bg-black">
      <Container className="py-16 sm:py-20">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Get started.</h2>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          Use these Solana Foundation and community courses to begin your journey into Solana development.
        </p>

        <a
          href="#"
          className="group relative mt-8 block cursor-pointer overflow-hidden rounded-2xl bg-[#0a0612] transition hover:brightness-110"
        >
          <Image src="/get-started-1.png" alt="" fill sizes="100vw" className="object-cover transition duration-300 group-hover:scale-105" aria-hidden />
          <div className="relative flex min-h-[280px] flex-col justify-center p-8 sm:p-10 lg:min-h-[300px] lg:p-12">
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-purple-500 px-2.5 py-1 text-[11px] font-medium text-white">
              17 Chapters
            </span>
            <h3 className="max-w-md text-2xl font-semibold text-white sm:text-3xl">Solana Development Course</h3>
            <p className="mt-3 max-w-sm text-sm text-zinc-300">
              Quickstart your Solana development starting from nothing to complex programs.
            </p>
            <Image src="/right-arrow.svg" alt="" width={26} height={26} className="mt-6 transition group-hover:translate-x-0.5" />
          </div>
        </a>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </div>
      </Container>
    </section>
  );
}
