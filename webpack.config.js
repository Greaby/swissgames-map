const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "SwissGames Map",
            template: "src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    attributes: {
                        list: [
                            {
                                tag: "body",
                                attribute: "data-graph",
                                type: "src"
                            },
                            {
                                tag: "img",
                                attribute: "src",
                                type: "src"
                            }
                        ]
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|data)$/i,
                use: [
                    {
                        loader: "file-loader"
                    }
                ]
            }
        ]
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist")
    }
};
