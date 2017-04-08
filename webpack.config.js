const Path    = require('path')
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'bundle.css',
  disable: process.env.NODE_ENV === 'development'
})

// Find out which loader is causing decrecation warning
// process.traceDeprecation = true

module.exports = {
  entry: {
    index:'./src/index.js'
  },
  output: {
    filename: '[name].js',
    path: Path.resolve(__dirname, 'public/assets'),
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
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader'}, 
            {loader: 'sass-loader'}
          ]
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
    contentBase: Path.resolve(__dirname, 'src/'),
    port: 3030,
    hot: true,
    historyApiFallback: true,
    compress: true
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    // new Webpack.DefinePlugin({
    //   'process.env': {'NODE_ENV': JSON.stringify('production')}
    // }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    extractSass
  ],
}

