const Path    = require('path')
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')


// Find out which loader is causing decrecation warning
// process.traceDeprecation = true

module.exports = {
  entry: {
    index: Path.resolve(__dirname, '../src/index.js')
  },
  output: {
    filename: '[name].js',
    path: Path.resolve(__dirname, '../public/assets'),
    publicPath: '/assets/'
  },
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: 'file-loader?name=[name].[ext]&outputPath=font/&publicPath=font/'
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        use: 'file-loader?name=[name].[ext]&outputPath=img/&publicPath=img/'
      }
    ]
  },
  devServer: {
    contentBase: Path.resolve(__dirname, '../src/'),
    port: 3030,
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    compress: true,
    proxy: {
      "/api": {
        target: "http://localhost:3031",
        pathRewrite: {"^/api" : ""}
      }
    }
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('bundle.css')
  ],
}

