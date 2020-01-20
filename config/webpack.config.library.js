const path = require("path");

module.exports = {
	mode: "production",
	entry: ["@babel/polyfill", "./lib/index.js"],
	output: {
		path: path.resolve(__dirname, "..", "build"),
		filename: "react-useful-dnd.js",
		library: "reactUsefulDnd",
		libraryTarget: "umd"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ["babel-loader"]
			}
		]
	},
	externals: {
		react: {
			commonjs: "react",
			commonjs2: "react",
			amd: "react",
			root: "react"
		}
	}
};
