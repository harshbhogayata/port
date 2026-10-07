import { Reveal } from "@/components/motion/Motion";

export default function SectionLabel({ num, title, right }: { num?: string; title: string; right?: React.ReactNode }) {
  return (
    <Reveal className="label-row" y={12}>
      <span>
        {num ? <span className="num">{num}</span> : null}
        <b>{title}</b>
      </span>
      {right ? <span>{right}</span> : null}
    </Reveal>
  );
}
