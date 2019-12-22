const path = require('path');

module.exports = {
    devtool: false,
    entry: {
        app: './src/app.ts',
        "drivers/zone-temperature-cur/driver": './src/drivers/zone-temperature-cur/driver.ts',
        "drivers/zone-temperature-cur/device": './src/drivers/zone-temperature-cur/device.ts',
        "drivers/zone-temperature-daily/driver": './src/drivers/zone-temperature-daily/driver.ts',
        "drivers/zone-temperature-daily/device": './src/drivers/zone-temperature-daily/device.ts',
    },
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
        filename: '[name].js',
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