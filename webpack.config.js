const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

// Determine if development or not
const dev = process.env.NODE_ENV !== 'production' && process.argv.indexOf('-p') === -1

// HTML plugin
const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, '/src/index.html'),
  filename: 'index.html',
  inject: 'body'
})

// SASS => CSS
const ExtractSassPluginConfig = new ExtractTextWebpackPlugin({
  filename: '[name].[hash].css',
  disable: process.env.NODE_ENV !== 'production'
})

// Plugin config
const DefinePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
})

// Webpack config
module.exports = {
  // Development server
  devServer: {
    host: 'localhost',
    port: '8000',
    quiet: true, // Remove console spam
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*' // Allow CORS
    }
  },
  // Entry point
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, '/src/index.jsx')
  ],
  // Dummies for native Node modules not present in browser scope
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    crypto: 'empty'
  },
  // Loaders
  module: {
    rules: [
      { // JSX
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      { // SCSS
        test: /\.scss$/,
        use: ExtractSassPluginConfig.extract({
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ],
          fallback: 'style-loader'
        })
      },
      { // Images
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  // Extension config
  resolve: {
    extensions: ['.js', '.jsx']
  },
  // Production build
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/build')
  },
  mode: dev ? 'development' : 'production',
  plugins:
    dev ? [ // Development - use hot reload and named modules
      HTMLWebpackPluginConfig,
      ExtractSassPluginConfig,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ] : [ // Production - generate public build
      HTMLWebpackPluginConfig,
      ExtractSassPluginConfig,
      DefinePluginConfig
    ]
}
