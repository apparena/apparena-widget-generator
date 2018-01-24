const webpack = require('webpack');
const path = require('path');
const config = require('./config');
const nodeModulesPath = path.resolve(config.paths.root, 'node_modules');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [
      'webpack-hot-middleware/client?name=app',
      path.resolve(config.paths.assets, 'index.jsx')
    ]
  },
  output: {
    path: config.paths.dist,
    filename: '[name].js',
    publicPath: '/'
    // library: 'apparena',
    // libraryTarget: 'umd'
  },
  devServer: {
    hot: true,
    contentBase: config.paths.dist,
    publicPath: config.paths.root
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(config.paths.assets),
      path.join(nodeModulesPath),
    ],
    extensions: ['.js', '.jsx'],
  },
  resolveLoader: {
    modules: [nodeModulesPath, path.join(nodeModulesPath)],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        options: {
          configFile: path.join(__dirname, 'eslint.js'),
          useEslintrc: false
        }
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css!less'
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[local]_[hash:base64:5]&camelCase&sourceMap',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [nodeModulesPath],
        use: [
          {
            loader: 'babel-loader',
            options: require('./babel.dev')
          }
        ],
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.CommonsChunkPlugin('vendors', 'shared/vendors.js'),
    // Note: only CSS is currently hot reloaded
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"development"'}),
    new webpack.NamedModulesPlugin(),
  ]
};
