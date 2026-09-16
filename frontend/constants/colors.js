// Single source of truth for the palette.
//
// Required in CommonJS because tailwind.config.js `require()`s it, while TS files
// `import` it. className cannot style component *props* — FontAwesome6 `color=`,
// ActivityIndicator `color=`, TextInput `placeholderTextColor=`, SVG fill/stroke —
// so those need real strings from here rather than a third copy of the hex values.
const colors = {
  primary: {
    DEFAULT: '#6C63FF',
    50: '#EDEDFF',
    100: '#D4D1FF',
    200: '#A9A3FF',
    300: '#7E75FF',
    400: '#6C63FF',
    500: '#5A50E6',
    600: '#4840CC',
    700: '#363099',
    800: '#242066',
    900: '#121033'
  },
  secondary: {
    DEFAULT: '#FF6B9D',
    50: '#FFF0F5',
    100: '#FFD6E5',
    200: '#FFADCB',
    300: '#FF84B1',
    400: '#FF6B9D',
    500: '#E65688',
    600: '#CC4173',
    700: '#993156',
    800: '#66203A',
    900: '#33101D'
  },
  accent: {
    DEFAULT: '#00D09C',
    50: '#E6FBF4',
    100: '#B3F4E1',
    200: '#66E9C3',
    300: '#1ADEA5',
    400: '#00D09C',
    500: '#00B889',
    600: '#009F76',
    700: '#007759',
    800: '#00503B',
    900: '#00281E'
  },
  warm: {
    DEFAULT: '#FFB84D',
    50: '#FFF8ED',
    100: '#FFECBF',
    200: '#FFD980',
    300: '#FFC640',
    400: '#FFB84D',
    500: '#E6A444',
    600: '#CC903B',
    700: '#996C2D',
    800: '#66481E',
    900: '#33240F'
  },
  danger: {
    DEFAULT: '#FF6B6B',
    50: '#FFF0F0',
    100: '#FFD1D1',
    200: '#FFA3A3',
    300: '#FF7575',
    400: '#FF6B6B',
    500: '#E66060',
    600: '#CC5555',
    700: '#994040',
    800: '#662B2B',
    900: '#331515'
  },
  light: { bg: '#F8F9FE', card: '#FFFFFF', border: '#E8E8F0' },
  dark: { bg: '#1E1E2E', card: '#2A2A3C', border: '#3A3A4C' },
  muted: { DEFAULT: '#8E8EA0', light: '#B8B8C8' },
  white: '#FFFFFF'
};

module.exports = colors;
