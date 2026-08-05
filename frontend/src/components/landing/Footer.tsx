import Image from "next/image";
import { Container } from "./Container";
import { DeadLink } from "./DeadLink";

const SOCIAL_ICONS = [
  { src: "/youtube-footer.svg", label: "YouTube" },
  { src: "/x.svg", label: "X" },
  { src: "/discord.svg", label: "Discord" },
  { src: "/reddit.svg", label: "Reddit" },
  { src: "/github.svg", label: "GitHub" },
  { src: "/telegram.svg", label: "Telegram" },
];

const SOLANA_LINKS = ["Grants", "Break Solana", "Media Kit", "Careers", "Disclaimer"];
const CONNECT_LINKS = ["Ecosystem", "Blog", "Newsletter"];

export function Footer() {
  return (
    <footer className="border !border-[#141414] bg-[#000508]">
      <Container className="py-12">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div>
            <Image src="/logo-small.svg" alt="Solana" width={31} height={27} className="h-6 w-auto" />
            <p className="mt-4 text-sm text-white">Managed by Solana Foundation</p>

            <div className="mt-4 flex items-center gap-2">
              {SOCIAL_ICONS.map((icon) => (
                <DeadLink
                  key={icon.label}
                  aria-label={icon.label}
                  className="cursor-pointer overflow-hidden rounded transition hover:opacity-70"
                >
                  <Image src={icon.src} alt="" width={26} height={16} />
                </DeadLink>
              ))}
            </div>

            <p className="mt-6 text-xs text-zinc-500">&copy; 2026 Solana Foundation. All rights reserved.</p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-wider text-white">SOLANA</p>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                {SOLANA_LINKS.map((item) => (
                  <li key={item}>
                    <DeadLink className="cursor-pointer transition hover:text-white">{item}</DeadLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold tracking-wider text-white">GET CONNECTED</p>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                {CONNECT_LINKS.map((item) => (
                  <li key={item}>
                    <DeadLink className="cursor-pointer transition hover:text-white">{item}</DeadLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden items-start gap-1.5 sm:flex">
              <Image src="/web.svg" alt="" width={19} height={20} className="mt-0.5" />
              <span className="text-sm text-zinc-400">EN</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
