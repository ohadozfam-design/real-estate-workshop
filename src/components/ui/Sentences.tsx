/**
 * Render prose one sentence per line, breaking after each period, so dense
 * copy reads as short, scannable micro-paragraphs. Splits without a regex
 * lookbehind on purpose: iOS Safari < 16.4 can't parse one, and a parse error
 * there would take down the whole bundle, not just this text.
 */
export default function Sentences({ text }: { text: string }) {
  const parts = text.split(/\.\s+/);
  return (
    <>
      {parts.map((s, i) => (
        <span key={i} className={i ? "mt-1.5 block" : "block"}>
          {i < parts.length - 1 ? `${s}.` : s}
        </span>
      ))}
    </>
  );
}
