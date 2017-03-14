const Path    = require('path')
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'bundle.css',
  disable: process.env.NODE_ENV === 'development'
})

// Find out which loader is causing decrecation warning
process.traceDeprecation = true

module.exports = {
  entry: {
    index:'./app/src/index.js'
  },
  output: {
    filename: '[name].js',
    path: Path.resolve(__dirname, 'app/public/assets'),
    publicPath: '/assets/'
  },
  devServer: {
    contentBase: Path.resolve(__dirname, 'app/'),
    port: 3030,
    hot: true,
    historyApiFallback: true,
    compress: true
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.DefinePlugin({
      'process.env': {'NODE_ENV': JSON.stringify('production')}
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    extractSass
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // Babel will soon have a update to remove the deprecation warning
        options: {
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties']
        }
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [{loader: 'css-loader'}, {loader: 'sass-loader'}]
        })
      },
      {
        test: /\.(jpg|png|woff|woff2|ttf|svg|eot)$/,
        use: 'file-loader'
      },
    ]
  }
}

