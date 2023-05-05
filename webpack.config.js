// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.ts",
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "DeepLinkBridge",
    libraryTarget: "umd",
    globalObject: "this",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      os: require.resolve("os-browserify/browser"),
      buffer: require.resolve("buffer/"),
      dgram: false,
    },
  },
};
