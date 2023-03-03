module.exports = {
  // purge: [], enable purge for production builds
  purge: true,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        siteblack: "#131519",
        siteDimBlack: "#191d23",
        siteViolet: "#7f46f0",
        siteWhite: "#9eacc7",
      },

      fontFamily: {
        rajdhani: ["Rajdhani", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
