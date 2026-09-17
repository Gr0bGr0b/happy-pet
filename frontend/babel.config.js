module.exports = function (api) {
  api.cache(true);
  return {
    // NativeWind v4 needs both: jsxImportSource routes JSX through its runtime so
    // className reaches react-native-css-interop, and the preset registers the
    // transform. Without them the CSS is still generated but no class ever lands on
    // an element, so every className is silently inert.
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
