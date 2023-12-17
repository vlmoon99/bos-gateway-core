const webpack = require("webpack");
const path = require("path");

const config = {
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      fs: false,
      path: require.resolve("path-browserify"),
      zlib: require.resolve("browserify-zlib"),
      url: require.resolve("url/"),
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      ENVIRONMENT: "browser",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: [require.resolve("buffer/"), "Buffer"],
    }),
  ],
  devServer: {
    static: {
      directory: "./dist",
    },
  },
};

module.exports = config;
