/* jshint node: true */
module.exports = function(config) {
  config.set({
    basePath: '.',

    frameworks: ['jasmine'],
    browsers: ['Chrome'],

    files: [
      // shim to workaroud PhantomJS 1.x lack of `bind` support
      // see: https://github.com/ariya/phantomjs/issues/10522
      // 'node_modules/es5-shim/es5-shim.js',
      'spec/**/*.spec.*'
    ],

    preprocessors: {
       // add webpack as preprocessor
      'spec/**/*.js': ['webpack', 'sourcemap'],
    },

    webpack: {devtool: 'inline-source-map'},

    webpackServer: {
      noInfo: true
    },

    singleRun: true
  });
};