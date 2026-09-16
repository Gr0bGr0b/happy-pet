type Scale = {
  DEFAULT: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

declare const colors: {
  primary: Scale;
  secondary: Scale;
  accent: Scale;
  warm: Scale;
  danger: Scale;
  light: { bg: string; card: string; border: string };
  dark: { bg: string; card: string; border: string };
  muted: { DEFAULT: string; light: string };
  white: string;
};

export default colors;
