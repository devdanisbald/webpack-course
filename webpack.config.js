const isProductionMode = process.env.NODE_ENV !== "production";
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	entry: {
		app: "./src/index.js",
		about: "./src/about.js"
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist")
	},
	mode: isProductionMode ? "production" : "development",
	devtool: "source-map",
	devServer: {
		static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8100
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					// Creates `style` nodes from JS strings
          isProductionMode ? MiniCssExtractPlugin.loader : "style-loader",
          // Translates CSS into CommonJS
					{ loader: "css-loader", options: { sourceMap: true } },
          { loader: "postcss-loader", options: { sourceMap: true } }
        ],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
          isProductionMode ? MiniCssExtractPlugin.loader : "style-loader",
					// Translates CSS into CommonJS
					{ loader: "css-loader", options: { sourceMap: true } },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } }
				],
			},
			{
				test: /\.(?:js|mjs|cjs)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env', {
									targets: "defaults"
								}
							]
						]
					}
				}
			}
		],
	},
  plugins: [
		new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isProductionMode ? "[name].[contenthash].css" : "[name].css",
    }),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "./src/views/index.html",
			chunks: ["app"]
			
		}),
		new HtmlWebpackPlugin({
			filename: "about.html",
			template: "./src/views/about.html",
			chunks: ["about"]
		}),
		new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'] }
    })
  ],
}
