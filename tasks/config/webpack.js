/**
 * Browserify front-end app
 *
 * ---------------------------------------------------------------
 *
 */
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common', null, false);
var maxChunks = new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 });
var minSize = new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 });
var occurrenceOrder = new webpack.optimize.OccurenceOrderPlugin(true);
var LiveReloadPlugin = require('webpack-livereload-plugin');
var extractor = require("extract-text-webpack-plugin");
var purify = require("purifycss-webpack-plugin");
var dedupe = new webpack.optimize.DedupePlugin();
var providePlugin = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
});

var loaders = [
{ 
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: {
        presets: ['es2015', 'react']
    }
},
{ 
    test: /\.css$/, 
    loader: extractor.loader("style","css") 
},
{
    test: /\.json$/,
    loader: 'json-loader'
}];

var extensions = ['', '.js', '.json'];

var ignoreModules = {
    fs: 'empty',
    tls: 'empty',
    dns: 'empty',
    net: 'empty',
    console: true
};

module.exports = function(grunt) {

    grunt.config.set('webpack', {
        prod: {
            failOnError: false,
            entry: {
                'frontend': './assets/frontend/app.js',
            },
            output: {
                path: '.tmp/public/js/dist/',
                publicPath: '/js/dist/',
                filename: '[hash].[name].js',
                chunkFilename: '[id].[hash].chunk.js'
            },
            module: {
                loaders: loaders
            },
            resolve: {
                extensions: extensions
            },
            node: ignoreModules,
            plugins: [
                dedupe,
                maxChunks,
                minSize,
                occurrenceOrder,
                providePlugin,
                new webpack.DefinePlugin({
                    'process.env': {
                        'NODE_ENV': '"production"'
                    }
                })
            ]
        },
        dev: {
            failOnError: false,
            entry: {
                'frontend': './assets/frontend/app.js',
            },
            output: {
                path: '.tmp/public/js/dist',
                publicPath: '/js/dist/',
                filename: '[name].js',
                chunkFilename: '[id].chunk.js'
            },
            module: {
                preLoaders: [{
                    test: /\.jsx?$/,
                    exclude: /(node_modules|dependencies)/,
                    loader: "eslint-loader"
                }],
                loaders: loaders
            },
            resolve: {
                extensions: extensions
            },
            node: ignoreModules,
            plugins: [
                dedupe,
                maxChunks,
                minSize,
                occurrenceOrder,
                providePlugin,
                new extractor("[name].css"),
                new purify({
                    basePath: __dirname,
                    paths: [
                        "app/views/*.html",
                        "app/layout/*.html",
                        "app/views/*.handlebars",
                        "app/layout/*.handlebars"
                    ]
                }),
                new LiveReloadPlugin({appendScriptTag: true})
            ],
            keepalive: true,
            watch: true,
            eslint: {
                configFile: '.eslintrc.js',
                formatter: require("eslint-friendly-formatter"),
                quiet: true,
                failOnError: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-webpack');
};