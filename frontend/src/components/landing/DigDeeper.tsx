import { Container } from "./Container";
import { DigDeeperCard } from "./DigDeeperCard";

const RESOURCES = [
  {
    overline: "Tool / Library",
    title: "Core Documentation",
    description: "The official Solana documentation on developing, validators, SPL tokens, wallets and more.",
  },
  {
    overline: "Tool / Library",
    title: "Solana Cookbook",
    description:
      "The Solana Cookbook is a developer resource that provides the essential concepts and references for building applications on Solana.",
  },
  {
    overline: "Tool / Library",
    title: "Solana Stack Exchange",
    description: "Solana Stack Exchange is a question and answer site for Solana software users and developers.",
  },
  {
    overline: "Tool / Library",
    title: "Solana Playground",
    description: "Easily build, deploy and test Solana programs and smart contracts from a browser IDE.",
  },
  {
    overline: "Tool / Library",
    title: "create-solana-dapp",
    description: "Get up and running fast with Solana dApps, generate a project template in seconds.",
    highlighted: true,
  },
  {
    overline: "Tool / Library",
    title: "Anchor Docs",
    description:
      "Anchor is a framework for Solana's Sealevel runtime providing several convenient developer tools for writing smart contracts.",
  },
  {
    overline: "Tool / Library",
    title: "Solana Program Library",
    description:
      "The Solana Program Library (SPL) is a collection of on-chain programs targeting the Sealevel parallel runtime.",
  },
  {
    overline: "Tool / Library",
    title: "Program Examples",
    description: "A list of curated examples for a wide range of use cases implemented using on-chain programs.",
  },
];

export function DigDeeper() {
  return (
    <section className="overflow-hidden bg-black">
      <Container className="py-16 sm:py-20">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Dig deeper.</h2>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          Learn from resources across the greater Solana ecosystem.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((resource) => (
            <DigDeeperCard key={resource.title} {...resource} />
          ))}
        </div>
      </Container>
    </section>
  );
}
