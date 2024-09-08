const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/index.js', // This is your main entry file
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled file
    filename: 'bundle.js', // Output file
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
