/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(41, 87, 255, 1)',
        'primary-25': '#F7F9FF',
        'primary-50': '#EFF2FF',
        facebook: '#1877F2',
        main: 'rgba(41, 87, 255, 1)',
        'new-black': '#2C2C2C',
      },
      fontFamily: {
        primary: 'Space Grotesk',
        secondary: 'Poppins',
        outfit: 'Outfit',
        toxigenesis: 'Toxigenesis',
        'space-grotesk': 'Space Grotesk',
        poppins: 'Poppins',
      },

      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      backgroundImage: {
        'instagram-gradient':
          'radial-gradient(50% 50% at 50% 50%, rgba(140, 58, 170, 0.00) 64.4%, rgba(140, 58, 170, 0.20) 100%), radial-gradient(130.54% 130.55% at 13.29% 100.47%, #FA8F21 9%, #D82D7E 78%);',
      },
    },
  },
  plugins: [],
}
