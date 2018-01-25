'use strict'; // eslint-disable-line
/***** WARNING: ES5 code only here. Not transpiled! *****/
/* eslint-disable */
/* eslint-disable no-var */

const webpack = require('webpack');
const qs = require('qs');
const autoprefixer = require('autoprefixer');
const CleanPlugin = require('clean-webpack-plugin');

const CopyGlobsPlugin = require('./webpack.plugin.copyglobs');
const mergeWithConcat = require('./util/mergeWithConcat');
const config = require('./config');

const assetsFilenames = (config.env.production) ? '[name].min' : '[name]';

const jsRule = {
  test: /\.(js|jsx)$/,
  exclude: [/(node_modules|bower_components)(?![/|\\](bootstrap|foundation-sites))/],
  use: [{
    loader: 'babel-loader',
    options: require(config.babelFile)
  }]
};

if (config.enabled.watcher) {
  jsRule.use.unshift('monkey-hot?sourceType=module');
}

let webpackConfig = {
  bail: config.enabled.bail,
  context: config.paths.assets,
  entry: config.entry,
  devtool: (config.enabled.sourceMaps ? '#source-map' : false),
  output: {
    path: config.paths.dist,
    publicPath: config.publicPath,
    pathinfo: true,
    filename: `${assetsFilenames}.js`,
    chunkFilename: `chunks/${assetsFilenames}[chunkhash].js`,
    jsonpFunction: config.jsonpFunction
  },
  module: {
    rules: [
      jsRule,
      {
        test: /\.scss$/,
        loader: [
          {
            loader: "style-loader", // creates style nodes from JS strings
            options: {
              sourceMap: config.enabled.sourceMaps,
              singleton: true,
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: config.env.production ? '[hash:base64:5]' : '[local]_[hash:base64:5]',
              camelCase: true,
              sourceMap: config.enabled.sourceMaps
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
      },
      {
        test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: `vendor/[name].[ext]`,
          }
        }],
      },
    ],
  },
  stats: {
    colors: {
      green: '\u001b[32m',
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.es6'],
    modules: [
      config.paths.assets,
      'node_modules',
      'bower_components',
    ],
    enforceExtension: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(config.env.nodeEnv)
      }
    }),
    new webpack.IgnorePlugin(/^props$/),
    new CleanPlugin([config.paths.dist], {
      root: config.paths.root,
      verbose: false,
    }),
    /**
     * It would be nice to switch to copy-webpack-plugin, but
     * unfortunately it doesn't provide a reliable way of
     * tracking the before/after file names
     */
    new CopyGlobsPlugin({
      pattern: config.copy,
      output: `[path]${assetsFilenames}.[ext]`,
      manifest: config.manifest,
    }),
    new webpack.LoaderOptionsPlugin({
      // minimize: true,
      debug: config.enabled.watcher,
      stats: {colors: true},
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.s?css$/,
      options: {
        output: {path: config.paths.dist},
        context: config.paths.assets,
        postcss: [
          autoprefixer({browsers: config.browsers}),
        ],
      },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.(js|jsx)$/,
      options: {
        eslint: {
          configFile: './build/webpack/eslint.js',
          useEslintrc: false,
          failOnWarning: false,
          failOnError: true,
        },
      },
    }),
  ],
};

/* eslint-disable global-require */
/** Let's only load dependencies as needed */

if (config.enabled.optimize) {
  webpackConfig = mergeWithConcat(webpackConfig, require('./webpack.config.optimize'));
}

if (config.env.production) {
  webpackConfig.resolve.alias = {
    './config/aa_config.json': './config/aa_config_replaced.json',
    './config/aa_translation.json': './config/aa_translation_replaced.json',
    './config/aa_info.json': './config/aa_info_replaced.json'
  };
  webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
  webpackConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(
    /^console.log$/,
    "./bundle/debug-noop"
  ));
  // const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
  // webpackConfig.recordsPath = './.webpack-cache/client-records.json';
  // webpackConfig.plugins.unshift(new HardSourceWebpackPlugin({cacheDirectory: './.webpack-cache/client'}));
}

if (config.enabled.cacheBusting) {
  const WebpackAssetsManifest = require('webpack-assets-manifest');

  webpackConfig.plugins.push(
    new WebpackAssetsManifest({
      output: 'assets.json',
      space: 2,
      writeToDisk: false,
      assets: config.manifest,
      replacer: require('./util/assetManifestsFormatter'),
    })
  );
}

if (config.enabled.eslint) {
  webpackConfig.module.rules = webpackConfig.module.rules || [];
  webpackConfig.module.rules.push(
    {
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      enforce: "pre",
      options: {
        configFile: './build/webpack/eslint.js',
        useEslintrc: false
      }
    }
  );
}

if (config.enabled.watcher) {
  webpackConfig.entry = require('./util/addHotMiddleware')(webpackConfig.entry);
  webpackConfig = mergeWithConcat(webpackConfig, require('./webpack.config.watch'));
}

module.exports = webpackConfig;


/* eslint-enable no-var */
