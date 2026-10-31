/** Configuration Tailwind du site GUIBERO Consulting */
module.exports = {
  content: ['./index.html', './script.js'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0b1626', 800: '#12233b', 700: '#1b3254' },
        flame: { 500: '#e8431f', 600: '#c93314' },
        volt: { 400: '#f6b800' }
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  }
};
