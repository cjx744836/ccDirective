const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        library: 'ccDirective',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: 'ccDirective.js'
    },
};