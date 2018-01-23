/***** WARNING: ES5 code only here. Not transpiled! *****/
/* eslint-disable */
/* eslint-disable no-var */

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const uniq = require('lodash/uniq');
const merge = require('webpack-merge');

const userConfig = require('../config');

const isProduction = !!((argv.env && argv.env.production) || argv.p || process.env.NODE_ENV === 'production');
const rootPath = (userConfig.paths && userConfig.paths.root)
    ? userConfig.paths.root
    : process.cwd();


const config = merge({
    copy: 'images/**/*',
    proxyUrl: 'http://localhost:3000',
    cacheBusting: '[name]',
    paths: {
        root: rootPath,
        assets: path.resolve(rootPath, 'src'),
        dist: path.resolve(rootPath, 'dist'),
    },
    enabled: {
        bail: isProduction,
        sourceMaps: !isProduction,
        optimize: isProduction,
        cacheBusting: isProduction,
        watcher: !!argv.watch,
        eslint: !isProduction,
    },
    watch: [],
    browsers: [],
}, userConfig);

config.watch.push(`${path.basename(config.paths.assets)}/${config.copy}`);
config.watch = uniq(config.watch);
config.babelFile = isProduction ? './babel.prod' : './babel.dev';

module.exports = merge(config, {
    env: Object.assign({production: isProduction, development: !isProduction, nodeEnv: process.env.NODE_ENV}, argv.env),
    publicPath: `${config.publicPath}/${path.basename(config.paths.dist)}/`,
    manifest: {},
});

/**
 * If your publicPath differs between environments, but you know it at compile time,
 * then set AM_DIST_PATH as an environment variable before compiling.
 * Example:
 *   AM_DIST_PATH=/public/appmanger/components yarn build:production
 */
if (process.env.AM_DIST_PATH) {
    module.exports.publicPath = process.env.AM_DIST_PATH;
}

/* eslint-enable no-var */
/* eslint-enable */
