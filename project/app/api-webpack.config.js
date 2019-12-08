const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
    devtool: false,
    entry: './src/api.ts',
    externals: [
        {
            homey: "homey",
        },
        nodeExternals(),
    ],
    target: 'node',
    plugins: [
    ],
    output: {
        filename: 'api.js',
        path: path.resolve(__dirname, '../..'),
        library: 'library',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts'],
    }
};