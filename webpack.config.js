var path = require('path');
var fs = require('fs');

var externalModules = {};
fs.readdirSync('node_modules/@dra2020')
  .forEach((mod) => {
    mod = '@dra2020/' + mod;
    externalModules[mod] = 'commonjs ' + mod;
  });

var libConfig = {
    entry: {
      library: './src/index.ts'
    },
    target: 'node',
    mode: 'development',
    output: {
        library: 'compactness',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: 'compactness.bundle.js'
    },

    // Enable source maps
    devtool: "source-map",

    externals: externalModules,

    module: {
      rules: [
        { test: /\.tsx?$/, use: 'ts-loader', exclude: '/node_modules/' },
        { test: /\.js$/, enforce: "pre", loader: "source-map-loader" }
      ]
    },

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    }
};

var cliConfig = {
  entry: './cli/_cli.ts',
  target: 'node',
  mode: 'development',
  output: {
      path: __dirname + '/testdist',
      filename: 'cli.js'
  },

  // Enable source maps
  devtool: "source-map",

  externals: {
    "yargs": "commonjs yargs"
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: '/node_modules/' },
      { test: /\.js$/, enforce: "pre", loader: "source-map-loader" }
    ]
  },

  resolve: {
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  }
};

var testConfig = {
    target: 'node',
    mode: 'development',
    output: {
      path: __dirname + '/testdist'
    },

    externals: {
      "yargs": "commonjs yargs"
    },

    module: {
      rules: [
        { test: /\.tsx?$/, use: 'ts-loader', exclude: '/node_modules/' },
        { test: /\.js$/, enforce: "pre", loader: "source-map-loader" }
      ]
    },

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    }
};

module.exports = [ libConfig, cliConfig, testConfig ];
