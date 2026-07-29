export const SIDEBAR = {
  WIDTH: { base: 280, xl: 320, collapsed: 68 },
  BG: 'bg-white',
  BORDER: 'border-r border-neutral-200',
  SHADOW: 'shadow-[2px_0_12px_rgba(0,0,0,0.02)]',
} as const;

export const COLORS = {
  page: '#f8f9ff',
  surface: '#ffffff',
  navy: '#0b1c30',
  blue: '#0058be',
  blueHover: '#0047a0',
  navyHover: '#152a45',
  lime: '#d1f34d',
  lightBlue: '#eff4ff',
  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
} as const;

export const TYPOGRAPHY = {
  stepEyebrow: 'text-[10px] font-bold uppercase tracking-widest text-[#0058be]',
  stepTitle: 'text-3xl font-bold text-[#0b1c30] tracking-tight',
  stepDescription: 'text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl',
  sectionTitle: 'text-[10px] font-bold uppercase tracking-wider text-neutral-400',
  label: 'text-[9px] font-bold uppercase tracking-widest text-neutral-400',
  caption: 'text-[10px] font-bold text-neutral-400',
  body: 'text-sm text-neutral-500 leading-relaxed',
  badge: 'text-[10px] font-bold uppercase tracking-wider',
} as const;

export const RADIUS = {
  card: 'rounded-xl',
  cardLg: 'rounded-2xl',
  button: 'rounded-xl',
  pill: 'rounded-full',
  sm: 'rounded-lg',
} as const;

export const SHADOWS = {
  cardHover: 'shadow-sm',
  cardSelected: 'shadow-[0_8px_32px_rgba(0,88,190,0.14)]',
  buttonPrimary: 'shadow-sm',
  buttonPrimaryHover: 'shadow-[0_4px_16px_rgba(0,88,190,0.25)]',
  selectedRing: 'ring-1 ring-[#0058be]',
} as const;

export const SPACING = {
  contentPadding: 'px-5 sm:px-8 py-6 sm:py-10 lg:py-16',
  cardPadding: 'p-5',
  cardGap: 'gap-4',
  sectionGap: 'space-y-8',
  actionGap: 'gap-3',
} as const;

export const MOTION = {
  pageTransition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  cardHover: { y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' },
  cardTap: { scale: 0.97 },
  buttonTap: { scale: 0.98 },
  fastTransition: { duration: 0.2, ease: 'easeInOut' },
  fadeUp: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } },
} as const;
