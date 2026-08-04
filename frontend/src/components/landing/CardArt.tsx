const GRADIENTS = [
  "from-violet-600 via-fuchsia-500 to-cyan-400",
  "from-blue-600 via-purple-500 to-pink-500",
  "from-emerald-500 via-teal-400 to-blue-500",
  "from-pink-500 via-rose-400 to-orange-400",
  "from-indigo-600 via-blue-500 to-cyan-400",
  "from-purple-600 via-pink-500 to-amber-400",
];

type CardArtProps = {
  index?: number;
  className?: string;
};

export function CardArt({ index = 0, className = "" }: CardArtProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rotate-45 rounded-2xl border-4 border-white/20" />
      <div className="absolute -top-4 -left-4 h-16 w-16 rotate-12 rounded-xl border-4 border-white/15" />
    </div>
  );
}
