const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/, // Поддержка CSS-файлов
                use: ['style-loader', 'css-loader'], // Используем style-loader и css-loader
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        static: [
            {
                directory: path.resolve(__dirname, 'public'), // Добавляем public как источник статических файлов
            },
            {
                directory: path.resolve(__dirname, 'dist'),
            },
        ],
        hot: true,
        historyApiFallback: true,
    },
};
