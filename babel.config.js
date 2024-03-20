module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "expo-router/babel",
      "react-native-reanimated/plugin",
      ["module-resolver", {
        "root": ["./"],
        "alias": {
          "@": "./",
          "@navigators": "./src/navigators",
          "@assets": "./assets",
          "@screens": "./src/screens",
          "@shared": "./src/shared",
          "@context" : "./src/context",
          "@redux" : "./src/redux",
        }
      }]
    ]
  };
};