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
      backgroundImage: {
        astral: "url('./assets/background/astral.jpg')",
        saiman: "url('./assets/background/saiman.jpg')",
        eoaalien: "url('./assets/background/eoaalien.jpg')",
        panight: "url('./assets/background/panight.jpg')",
        heroImg: "url('./assets/background/hero-img.jpg')",
        landing: "url('./assets/background/landing.jpg')",
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
