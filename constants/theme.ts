/**
 * Agrisense design tokens — shared visual language across the app.
 * Prefer these over one-off hex values in new UI work.
 */
export const colors = {
  brand: '#0B4D26',
  brandMid: '#166534',
  brandSoft: '#E5F4EA',
  brandWash: '#F1F8F0',
  brandMuted: '#BCE8C9',

  bg: '#F6F8F1',
  cream: '#FBFCF7',
  forest: '#0B4D26',
  mint: '#D9F2E2',
  searchFill: '#F1F4EC',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F7EF',

  text: '#102418',
  textSecondary: '#66736B',
  textMuted: '#8A968B',
  textOnBrand: '#FFFFFF',

  border: '#E2E8D8',
  borderStrong: '#C8D3C3',

  danger: '#DC2626',
  dangerSoft: '#FEF2F2',

  unread: '#25D366', // WhatsApp-like green for badges
  overlay: 'rgba(15, 23, 42, 0.45)',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  full: 999,
} as const;

export const type = {
  title: { fontSize: 20, fontWeight: '800' as const, color: colors.text },
  section: { fontSize: 16, fontWeight: '800' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '500' as const, color: colors.text },
  caption: { fontSize: 13, fontWeight: '600' as const, color: colors.textSecondary },
  meta: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted },
  label: { fontSize: 11, fontWeight: '800' as const, color: colors.textMuted, letterSpacing: 0.6 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#12351E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  float: {
    shadowColor: '#12351E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
