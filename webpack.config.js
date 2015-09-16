/* jshint node: true */
var path = require('path');

var demoPath = path.join(__dirname, 'demo');

module.exports = {
  context: path.join(demoPath, 'src'),
  entry: {
    'filter-builder': './filter-builder.demo.js',
    'dynatable': './dynatable.demo.js', 
    'dynatable-shortload': './dynatable-shortload.demo.js',
    'audio-dash': './audio-dash.demo.js',
    'tool-tipsify': './tool-tipsify.demo.js',
    'sizeboxify': './sizeboxify.demo.js'
  },
  output: {
    path: path.join(demoPath, 'build'),
    filename: '[name]-bundle.js'
  },

  // externals: {
  //   'dc': 'dc'
  // },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      { 
        test: /\.css$/, 
        loader: "style-loader!css-loader" 
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, 
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, 
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, 
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      }
    ]
  }
};
