"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "./Container";
import { DeadLink } from "./DeadLink";

const NAV_LINKS = ["Learn", "Build", "Network", "Community"];

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black">
      <Container className="flex items-center justify-between py-4">
        <DeadLink className="flex cursor-pointer items-center transition hover:opacity-90">
          <Image src="/logo.png" alt="Solana" width={646} height={96} priority className="h-6 w-auto sm:h-7" />
        </DeadLink>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((label) => (
            <DeadLink
              key={label}
              className="flex cursor-pointer items-center gap-1 text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              {label}
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </DeadLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-zinc-700 text-white transition hover:border-white hover:bg-white hover:text-black md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-5 w-5"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <nav className="border-t border-zinc-800 bg-black px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <DeadLink
                  onClick={() => setOpen(false)}
                  className="flex cursor-pointer items-center gap-1 text-zinc-400 transition hover:text-white"
                >
                  {label}
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </DeadLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
