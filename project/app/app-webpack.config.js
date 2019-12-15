const path = require('path');

module.exports = {
    devtool: false,
    entry: './src/app.ts',
    externals: [
        {
            'athom-api': "athom-api",
            homey: "homey",
        },
    ],
    target: 'node',
    plugins: [
    ],
    output: {
        filename: 'app.js',
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
    },
    optimization: {
        minimize: false
    }
};