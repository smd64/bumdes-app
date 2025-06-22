import type { MantineTheme } from '@mantine/core';

const colors = {
  brand: [
    '#e3f9f9',
    '#c1e8e8',
    '#9ad6d7',
    '#72c4c4',
    '#4fb3b3',
    '#399595',
    '#317a7a',
    '#2a6262',
    '#234a4a',
    '#1c3737',
  ],
  accent: [
    '#fff1f0',
    '#ffd6d4',
    '#ffb3b0',
    '#ff8f8a',
    '#ff6b64',
    '#ff493f',
    '#e73c37',
    '#bb302d',
    '#8f2423',
    '#651a19',
  ],
};

const theme: Partial<MantineTheme> = {
  colorScheme: 'light',
  colors,
  primaryColor: 'brand',
  fontFamily: "'Open Sans', sans-serif",
  headings: {
    fontFamily: "'Inter', sans-serif",
  },
  globalStyles: (mantineTheme) => ({
    body: {
      backgroundColor:
        mantineTheme.colorScheme === 'dark'
          ? mantineTheme.colors.dark[9]
          : mantineTheme.colors.gray[0],
      color:
        mantineTheme.colorScheme === 'dark'
          ? mantineTheme.colors.gray[2]
          : mantineTheme.colors.gray[8],
      transition: 'background-color 0.3s ease',
    },
  }),
};

export default theme;
