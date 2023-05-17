const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],    
  },
  devServer: {
    watchFiles: ['src/**/*'],
    client: {
      reconnect: true,
      progress: true,
      overlay: {
        errors: true,
        warnings: true,
        runtimeErrors: true,        
      },
      logging: 'info',
    },
    server: 'http',
    port: 8080,
    compress: true,
    http2: false,
    hot: false,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
        hash: true,
        title: 'Dag 🚀',
        description: 'A tool for thought for dependency maps.',
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body'
    })
  ],
};