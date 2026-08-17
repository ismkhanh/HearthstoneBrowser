export const theme = {
  colors: {
    background: '#12131a',
    surface: '#1c1e29',
    border: '#2c2f3d',
    text: '#f2f3f7',
    textMuted: '#9aa0b4',
    accent: '#f0b429',
    danger: '#ef5f5f',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
  },
  fontSize: {
    caption: 12,
    body: 14,
    title: 18,
    heading: 22,
  },
} as const;

export type Theme = typeof theme;
