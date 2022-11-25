import path from 'path'
import config from './compiler.option'
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

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
    mode : "development",
    entry: entries,
    // output : {
    //     path : path.join(__dirname, '/dist'),
    //     filename : 'index.bundle.js'
    // },
    output: {
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, "./assets/dist"),
        globalObject: "this",
        filename: (pathData) => {
          return pathData.chunk.name.indexOf("css/") !== -1
            ? "[name].__unused__.js"
            : "[name].min.js";
        },
      },
    devServer: {
        port : 3010,
        hot: true,
        open: true
    },
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [new MiniCssExtractPlugin()],
    devtool : "source-map"
} 