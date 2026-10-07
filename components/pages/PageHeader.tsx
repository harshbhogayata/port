import { SplitReveal, Reveal } from "@/components/motion/Motion";

type Props = {
  code: string;
  eyebrow?: string;
  title: string;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
  dot?: boolean;
};

export default function PageHeader({ code, eyebrow, title, lede, aside, dot = true }: Props) {
  return (
    <header className="ph wrap">
      <Reveal className="ph__meta mono" y={10}>
        <span>
          <span className="blue">Sheet {code}</span>
          {eyebrow ? <span className="mute"> · {eyebrow}</span> : null}
        </span>
        {aside ? <span className="mute">{aside}</span> : null}
      </Reveal>
      <SplitReveal as="h1" className="ph__title" trigger="enter" dot={dot}>
        {title}
      </SplitReveal>
      {lede ? (
        <Reveal className="ph__lede lead" delay={0.3}>
          {lede}
        </Reveal>
      ) : null}
    </header>
  );
}
