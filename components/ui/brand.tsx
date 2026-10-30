import Image from 'next/image';
import Link from 'next/link';

// The mark is rendered on its own — no tile, no ring. It is an illustration with
// fine detail (three cards, an arrow and a check), so it needs room to read at
// all; enclosing it in a fixed square only shrank it further.
const SIZES = {
  sm: { image: 62, wordmark: 'text-lg' },
  lg: { image: 86, wordmark: 'text-xl' },
} as const;

function BrandContent({ size }: { size: keyof typeof SIZES }) {
  const { image, wordmark } = SIZES[size];

  return (
    <>
      <Image
        src="/taskflow-mark.png"
        alt=""
        width={image}
        height={image}
        priority
        className="shrink-0 object-contain"
        style={{ width: image, height: image }}
      />
      <span className={`text-heading font-semibold tracking-tight ${wordmark}`}>
        TaskFlow
      </span>
    </>
  );
}

export function Brand({
  href,
  size = 'sm',
}: {
  href?: string;
  size?: keyof typeof SIZES;
}) {
  if (href === undefined) {
    return (
      <div className="flex items-center gap-2">
        <BrandContent size={size} />
      </div>
    );
  }

  return (
    <Link href={href} className="focus-ring flex items-center gap-2 rounded-md">
      <BrandContent size={size} />
    </Link>
  );
}
