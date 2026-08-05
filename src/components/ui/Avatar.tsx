export function getInitials(name: string) {
  return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function Avatar({
  name, size = 36, round,
}: {
  name: string;
  size?: number;
  round?: boolean;
}) {
  const initials = getInitials(name);
  const r = round || size <= 32 ? 999 : 10;
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: 'rgba(16,185,129,0.14)',
        border: '1px solid rgba(16,185,129,0.28)',
        display: 'grid',
        placeItems: 'center',
        fontSize: Math.max(11, Math.round(size * 0.34)),
        fontWeight: 700,
        color: '#6ee7b7',
        letterSpacing: '-0.02em',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}
