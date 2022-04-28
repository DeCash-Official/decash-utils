const path = require('path');

module.exports = {
  mode: 'development',
  entry: './www/src/index.js',
  context: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, 'www/build'),
    filename: 'index.js',
  },
};
