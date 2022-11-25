import path from 'path'
import webpack from "webpack";
import config from './compiler.option'
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import BrowserSyncPlugin from "browser-sync-webpack-plugin";
import autoprefixer from "autoprefixer";
import sass from "sass";
const { ProgressPlugin } = webpack;

const entries = {};
const entriesRaw = [...config.js, ...config.sass].map((entry) => {
  if (typeof entry === "string") {
    const name = path.parse(path.basename(entry)).name;
    return {
      name,
      src: entry,
    };
  }
  return entry;
});
entriesRaw.forEach((item) => {
  const cssExt = /\.(css|sass|scss)$/;
  const jsExt = /\.(js)$/;
  const isCss = cssExt.test(item.src);
  const isJs = jsExt.test(item.src);
  const prefix = isCss ? "css/" : isJs ? "js/" : false;
  if (prefix) entries[`${prefix}${item.name}`] = item.src;
});

module.exports = {
  mode: "development",
  entry: entries,
  // output : {
  //     path : path.join(__dirname, '/dist'),
  //     filename : 'index.bundle.js'
  // },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, "./assets/dist"),
    globalObject: "this",
    filename: (pathData) => {
      return pathData.chunk.name.indexOf("css/") !== -1
        ? "[name].__unused__.js"
        : "[name].min.js";
    },
  },
  devServer: {
    port: 3010,
    hot: true,
    open: true,
    historyApiFallback: { index: "/", disableDotRule: true }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, ".babelrc"),
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              implementation: sass,
              sassOptions: {
                outputStyle: "compressed",
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].min.css",
    }),
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ["css/dist/**", "js/dist/**"],
      cleanAfterEveryBuildPatterns: ["**/*.__unused__.*", "js/*.min.css", "js/*.min.css.map"],
    }),
    new BrowserSyncPlugin(config.browserSync),
    new ProgressPlugin(),
  ],
  devtool: "source-map"
} 