export const colors = {
  // Kapruka brand
  primary: '#1995d3',
  primaryDark: '#243e99',
  primaryLight: '#29a0db',
  primaryBg: '#eef9ff',
  primaryBorder: '#cbe3ff',

  accent: '#FE980F',
  accentLight: '#fff3e0',

  success: '#73c367',
  successDark: '#2b9e1a',

  error: '#e33729',
  errorLight: '#ff6c6c',

  // Neutrals (from Kapruka CSS)
  textPrimary: '#222222',
  textSecondary: '#555555',
  textMuted: '#cccccc',

  bgPage: '#f4f4f8',
  bgCard: '#ffffff',
  bgSubtle: '#f5f5f5',

  border: '#e5e5e5',
  borderDark: '#dddddd',
};

export const gradients = {
  header: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 55%, ${colors.accent} 100%)`,
  userBubble: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`,
  avatar: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`,
  sendButton: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`,
};

export const shadows = {
  header: '0 4px 24px rgba(36,62,153,0.35)',
  card: '0 2px 8px rgba(0,0,0,0.07)',
  bubble: '0 2px 10px rgba(36,62,153,0.25)',
  avatar: '0 2px 6px rgba(36,62,153,0.3)',
  button: '0 2px 10px rgba(36,62,153,0.35)',
  inputBar: '0 -4px 20px rgba(0,0,0,0.06)',
};

export const fonts = {
  family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`,
  sizeSm: 11,
  sizeBase: 15,
  sizeMd: 17,
  sizeLg: 20,
  lineHeight: 1.55,
};

export const radius = {
  pill: 24,
  bubble: 20,
  card: 12,
  avatar: '50%',
};
