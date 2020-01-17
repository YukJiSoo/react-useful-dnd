const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	context: path.resolve(__dirname, "..", "example"),
	entry: { app: ["@babel/polyfill", "./src/index.js"] },
	output: {
		path: path.resolve(__dirname, "..", "example/build"),
		filename: "[name].bundle.[hash].js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ["babel-loader"]
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "..", "example/public/index.html"),
			filename: path.join(__dirname, "..", "example/build/index.html"),
			favicon: path.join(__dirname, "..", "example/public/favicon.ico"),
			inject: true
		})
	],
	resolve: {
		extensions: [".js", ".json"],
		modules: [path.join(__dirname, "..", "example/src"), "node_modules"]
	}
};
