// src/theme/theme.ts
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('#f9fafb', '#1a202c')(props),
        color: mode('gray.800', 'gray.100')(props),
      },
      '*::selection': {
        bg: mode('indigo.200', 'indigo.500')(props),
        color: mode('white', 'white')(props),
      },
    }),
  },
  colors: {
    brand: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'lg',
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: 'xl',
          bg: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          _dark: {
            bg: 'rgba(26, 32, 44, 0.7)',
          },
        },
      },
    },
  },
});

export default theme;
