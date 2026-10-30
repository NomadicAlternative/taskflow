import Link from 'next/link';

// Text-only wordmark. "Flow" carries a gradient from the deep navy of the
// heading to the palette's light blue. WCAG exempts logotypes from contrast
// requirements; the light end measures 2.70:1, so the wordmark stays at 20px
// semibold to keep it legible.
function Wordmark() {
  return (
    <span className="text-xl font-semibold tracking-tight text-heading">
      Task
      <span className="bg-linear-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
        Flow
      </span>
    </span>
  );
}

export function Brand({ href }: { href?: string }) {
  if (href === undefined) {
    return <Wordmark />;
  }

  return (
    <Link href={href} className="focus-ring rounded-md">
      <Wordmark />
    </Link>
  );
}
