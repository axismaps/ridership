const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  watch: false,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/html/index.html'),
      filename: path.join(__dirname, 'dist/index.html'),
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/data/*',
        to: 'data',
        flatten: true,
      },
      {
        from: 'data/output/*',
        to: 'data',
        flatten: true,
      },
      {
        from: 'data/output/tracts/*',
        to: 'data/tracts',
        flatten: true,
      },
      {
        from: 'node_modules/@fortawesome/fontawesome-pro/css/*',
        to: 'fontawesome-pro/css',
        flatten: true,
      },
      {
        from: 'node_modules/@fortawesome/fontawesome-pro/webfonts/*',
        to: 'fontawesome-pro/webfonts',
        flatten: true,
      },
      {
        from: 'node_modules/d3/dist/d3.min.js',
        to: 'js/d3.min.js',
      },
      {
        from: 'node_modules/d3-selection-multi/build/d3-selection-multi.min.js',
        to: 'js/d3-selection-multi.min.js',
      },
      {
        from: 'node_modules/d3-force-cluster/dist/d3-force-cluster.min.js',
        to: 'js/d3-force-cluster.min.js',
      },
    ]),
  ],
};
