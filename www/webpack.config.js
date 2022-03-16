const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    wasm: "./src/wasm/index.ts",
    native: "./src/native/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devServer: {
    port: 5500,
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/wasm/index.html",
      chunks: ["wasm"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/native/index.html",
      filename: "native.html",
      chunks: ["native"],
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  experiments: {
    syncWebAssembly: true,
  },
};
