import Image from "next/image";
import { Container } from "./Container";

const SOCIAL_ICONS = [
  { src: "/discord.svg", label: "Discord" },
  { src: "/x.svg", label: "X" },
  { src: "/telegram.svg", label: "Telegram" },
  { src: "/reddit.svg", label: "Reddit" },
  { src: "/github.svg", label: "GitHub" },
  { src: "/youtube-footer.svg", label: "YouTube" },
];

const SOLANA_LINKS = ["Grants", "Break Solana", "Media Kit", "Careers", "Disclaimer"];
const CONNECT_LINKS = ["Ecosystem", "Blog", "Newsletter"];

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-[#050508]">
      <div className="bg-gradient-to-r from-[#00BCD4] to-[#0047FF] py-1.5" aria-hidden />
      <Container className="py-12">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div>
            <Image src="/logo-small.svg" alt="Solana" width={31} height={27} className="h-6 w-auto" />
            <p className="mt-4 text-sm text-zinc-400">Managed by Solana Foundation</p>

            <div className="mt-4 flex items-center gap-2">
              {SOCIAL_ICONS.map((icon) => (
                <a
                  key={icon.label}
                  href="#"
                  aria-label={icon.label}
                  className="cursor-pointer overflow-hidden rounded transition hover:opacity-70"
                >
                  <Image src={icon.src} alt="" width={26} height={16} />
                </a>
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
                    <a href="#" className="cursor-pointer transition hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold tracking-wider text-white">GET CONNECTED</p>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                {CONNECT_LINKS.map((item) => (
                  <li key={item}>
                    <a href="#" className="cursor-pointer transition hover:text-white">
                      {item}
                    </a>
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
