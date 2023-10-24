const {
    addDecoratorsLegacy,
    override,
    disableEsLint
} = require("customize-cra");

module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    disableEsLint()
  ),
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    },
  },
};
