type SectionHeadingProps = {
  id?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <div id={id} className="mb-10 max-w-2xl scroll-mt-24">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm text-muted sm:text-base">{subtitle}</p>}
    </div>
  );
}
